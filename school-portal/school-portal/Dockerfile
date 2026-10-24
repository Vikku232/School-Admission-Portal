# =========================================================================
# Stage 1: Build the Spring Boot application using Maven Wrapper
# =========================================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven Wrapper files
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert CRLF line endings to LF and set executable permissions for Linux
RUN sed -i 's/\r$//' mvnw && chmod +x ./mvnw

# Pre-fetch dependencies to leverage Docker layer caching
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# =========================================================================
# Stage 2: Minimal Production Runtime Image
# =========================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root system user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable jar from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Ensure appropriate ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose default Spring Boot application port
EXPOSE 8080

# Configure container-aware JVM memory settings
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Launch Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
