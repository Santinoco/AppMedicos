# Usa Node.js base image
FROM node:18

# Crea directorio de trabajo
WORKDIR /app

# Copia los archivos y instala dependencias
COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto y corre la app
EXPOSE 3001
CMD ["npm", "run", "start"]
