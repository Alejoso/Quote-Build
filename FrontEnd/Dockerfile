# Dockerfile simple para React Frontend con Vite dev server
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY quoteAndBuild/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY quoteAndBuild/ ./

# Exponer puerto
EXPOSE 5173

# Comando para ejecutar Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]