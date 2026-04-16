# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código y construir la aplicación
COPY . .
RUN npm run build --configuration=production

# Run Stage
FROM nginx:alpine

# Copiar configuración custom de Nginx para redirigir tráfico al index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos de Angular al folder estático de Nginx
# Asegurar la ruta correcta según angular.json (dist/squadup/browser)
COPY --from=build /app/dist/squadup/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
