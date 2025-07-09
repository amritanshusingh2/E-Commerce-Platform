# Troubleshooting Guide

## Common Issues and Solutions

### 1. 403 Forbidden Error on Login

**Problem**: You see a 403 Forbidden error when trying to login.

**Solution**: 
1. Make sure all backend services are running:
   - Eureka Discovery Service (port 8761)
   - API Gateway (port 8020)
   - User Service (port 8081)
   - Product Service (port 8082)
   - Cart Service (port 8083)
   - Order Service (port 8084)
   - Payment Service (port 8085)
   - Notification Service (port 8086)
   - Analytics Service (port 8087)

2. Check if the backend status indicator shows "Backend Online" in the top-right corner of the frontend.

3. If backend is offline, start the services in this order:
   ```bash
   # 1. Start Eureka Discovery Service first
   cd eureka-discovery-service
   mvn spring-boot:run
   
   # 2. Start API Gateway
   cd ../api-gatway
   mvn spring-boot:run
   
   # 3. Start other services (in any order)
   cd ../user-service
   mvn spring-boot:run
   
   cd ../product-service
   mvn spring-boot:run
   
   # ... continue with other services
   ```

### 2. Styled-components Prop Warnings

**Problem**: You see warnings about unknown props like `isOpen` or `liked` being sent to DOM elements.

**Solution**: 
- ✅ **FIXED**: These warnings have been resolved by using transient props (prefixed with `$`).
- The warnings should no longer appear in the console.

### 3. TypeScript Compilation Errors

**Problem**: TypeScript errors related to React Icons or other components.

**Solution**:
- ✅ **FIXED**: TypeScript configuration has been updated with proper target and iteration settings.
- Type declaration files have been added for React Icons.

### 4. CORS Issues

**Problem**: Cross-origin request errors.

**Solution**:
- ✅ **CONFIGURED**: CORS is properly configured in the API Gateway to allow requests from `http://localhost:3000`.
- Make sure you're running the frontend on port 3000.

### 5. Frontend Not Starting

**Problem**: `npm start` fails to start the frontend.

**Solution**:
1. Make sure you're in the correct directory:
   ```bash
   cd frontend
   npm start
   ```

2. If you get dependency errors:
   ```bash
   npm install
   npm start
   ```

3. If you get port conflicts:
   ```bash
   # Kill any process using port 3000
   npx kill-port 3000
   npm start
   ```

### 6. Backend Services Not Starting

**Problem**: Backend services fail to start or show errors.

**Solution**:
1. Check if Java 8+ is installed:
   ```bash
   java -version
   ```

2. Check if Maven is installed:
   ```bash
   mvn -version
   ```

3. Make sure ports are not in use:
   ```bash
   # Check if ports are available
   netstat -an | findstr :8020
   netstat -an | findstr :8761
   ```

4. Start services one by one to identify which one is causing issues.

### 7. Database Connection Issues

**Problem**: Services fail to connect to the database.

**Solution**:
1. Make sure MySQL/PostgreSQL is running
2. Check database credentials in `application.properties` files
3. Ensure database exists and is accessible

## Getting Help

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Check the backend service logs for error details
3. Verify all services are running on the correct ports
4. Ensure the frontend is running on `http://localhost:3000`

## Quick Start Checklist

- [ ] Java 8+ installed
- [ ] Maven installed
- [ ] Database running
- [ ] Eureka Discovery Service running (port 8761)
- [ ] API Gateway running (port 8020)
- [ ] All microservices running
- [ ] Frontend running (port 3000)
- [ ] Backend status shows "Online" in frontend 