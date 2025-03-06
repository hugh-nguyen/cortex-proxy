FROM node:18
WORKDIR /app

# Copy "service-a" files
COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src

COPY ca.crt /usr/local/share/ca-certificates/ca.crt
RUN update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/ca.crt
RUN npm install -g typescript

# First install dependencies (including local "cortex-node" -> "file:../cortex-node")
RUN npm install

# Build TypeScript
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
