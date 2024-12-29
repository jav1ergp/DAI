FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia los archivos de la app
COPY . .

ENV IN=production
ENV USER_DB=root
ENV PASS=example
ENV SECRET_KEY="EsTa MisMa:i8775tyjk,"
# En windows, MAC
ENV DB_HOST=mongo
# En Linux
#ENV DB_HOST=172.17.0.1

EXPOSE 8000

CMD ["node", "tienda.js"]
