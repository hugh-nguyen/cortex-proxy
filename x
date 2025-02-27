resource "kubectl_manifest" "envoy_deployment" {
  manifest = <<YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: envoy
  namespace: envoy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: envoy
  template:
    metadata:
      labels:
        app: envoy
    spec:
      containers:
        - name: envoy
          image: envoyproxy/envoy:v1.25.1
          ports:
            - containerPort: 10000
          volumeMounts:
            - name: envoy-config
              mountPath: /etc/envoy
      volumes:
        - name: envoy-config
          configMap:
            name: envoy-config
YAML
}

resource "kubectl_manifest" "envoy_service" {
  yaml_body = <<YAML
apiVersion: v1
kind: Service
metadata:
  name: envoy-service
  namespace: envoy
spec:
  type: LoadBalancer
  selector:
    app: envoy
  ports:
    - protocol: TCP
      port: 80
      targetPort: 10000
YAML
}
