FROM node:18
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src

COPY ca.crt /usr/local/share/ca-certificates/ca.crt
RUN update-ca-certificates
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/ca.crt
RUN npm install -g typescript

RUN npm install
RUN npm run build

EXPOSE 5001
CMD ["npm", "start"]
