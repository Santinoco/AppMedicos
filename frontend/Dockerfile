# Usamos Node 18 en versión ligera
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código al contenedor
COPY . .

# Construir la app (opcional, para producción)
# RUN npm run build

# Exponer el puerto 3001
EXPOSE 3001

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev"]
