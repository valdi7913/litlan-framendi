# Stage 1: Build the React App
FROM node:22 AS build

WORKDIR /app

# Copy package.json and package-lock.json first (improves caching)
COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Run the build command
RUN npm run build

# Debugging: Ensure the build folder exists
RUN ls -la /app/dist

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Debugging: Check if /app/dist exists before copying
RUN mkdir -p /app/dist

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
