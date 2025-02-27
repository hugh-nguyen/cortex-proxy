provider "aws" {
  region = "ap-southeast-2"
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.eks.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.eks.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.eks.token
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.eks.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.eks.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.eks.token
  }
}

data "aws_eks_cluster" "eks" {
  name = aws_eks_cluster.eks.name
}

data "aws_eks_cluster_auth" "eks" {
  name = aws_eks_cluster.eks.name
}

resource "aws_vpc" "eks_vpc" {
  cidr_block = "10.0.0.0/16"

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "eks-vpc"
  }
}

resource "aws_subnet" "eks" {
  count = 2

  vpc_id                  = aws_vpc.eks_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.eks_vpc.cidr_block, 8, count.index)
  map_public_ip_on_launch = false

  availability_zone = element(data.aws_availability_zones.available.names, count.index)

  tags = {
    Name = "eks-subnet-${count.index}"
  }
}

data "aws_availability_zones" "available" {}

resource "aws_eks_cluster" "eks" {
  name     = "envoy-eks"
  role_arn = aws_iam_role.eks.arn

  vpc_config {
    subnet_ids             = aws_subnet.eks[*].id
    endpoint_private_access = true  
    endpoint_public_access  = true
  }
}

resource "aws_iam_role" "eks" {
  name = "eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_eks_fargate_profile" "default" {
  cluster_name           = aws_eks_cluster.eks.name
  fargate_profile_name   = "default"
  pod_execution_role_arn = aws_iam_role.fargate.arn

  subnet_ids = aws_subnet.eks[*].id

  selector {
    namespace = "default"
  }
}

resource "aws_eks_fargate_profile" "kube_system" {
  cluster_name           = aws_eks_cluster.eks.name
  fargate_profile_name   = "kube-system"
  pod_execution_role_arn = aws_iam_role.fargate.arn
  subnet_ids = aws_subnet.eks[*].id

  selector {
    namespace = "kube-system"
  }
}

resource "aws_eks_fargate_profile" "envoy_gateway" {
  cluster_name           = aws_eks_cluster.eks.name
  fargate_profile_name   = "envoy-gateway"
  pod_execution_role_arn = aws_iam_role.fargate.arn
  subnet_ids = aws_subnet.eks[*].id

  selector {
    namespace = "envoy-gateway-system"
  }
}

resource "aws_iam_role" "fargate" {
  name = "eks-fargate-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks-fargate-pods.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "fargate_policy" {
  role       = aws_iam_role.fargate.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id            = aws_vpc.eks_vpc.id
  service_name      = "com.amazonaws.ap-southeast-2.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids        = aws_subnet.eks[*].id
  security_group_ids = [aws_security_group.eks_vpc_sg.id]
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id            = aws_vpc.eks_vpc.id
  service_name      = "com.amazonaws.ap-southeast-2.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids        = aws_subnet.eks[*].id
  security_group_ids = [aws_security_group.eks_vpc_sg.id]
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id        = aws_vpc.eks_vpc.id
  service_name  = "com.amazonaws.ap-southeast-2.s3"
  route_table_ids = [aws_route_table.private.id]
}

resource "aws_security_group" "eks_vpc_sg" {
  vpc_id = aws_vpc.eks_vpc.id
  name   = "eks-vpc-security-group"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}