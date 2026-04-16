# Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Solo copiar el POM primero para optimizar la caché de dependencias de maven
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el codigo fuente
COPY src ./src
# Compilar y empaquetar saltándose los tests
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
# Copiar el jar desde la imagen de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto del API
EXPOSE 8080

# Ejecutar el backend
ENTRYPOINT ["java", "-jar", "app.jar"]
