# Frontend
# Step 1: Build the Angular app using the production configuration
FROM node:latest as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Run a clean install of the dependencies
RUN npm ci

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.2.0

# Copy all files
COPY . .

# Build the Angular app with the production configuration
RUN ng build --configuration=production

# Step 2: Use the nginx image to serve the application
FROM nginx:latest

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/front-metrics/browser /usr/share/nginx/html

# Copy SSL certificate and key
COPY cert.crt /etc/nginx/cert.crt
COPY server.key /etc/nginx/server.key

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

