
# Step1 build stage
FROM node:18-alpine AS build
WORKDIR /app

# copy pacakage files in docker for dependancies installation
COPY package*.json ./

RUN npm install

# copy rest of your Application code
COPY . .

# install production dependencies
RUN npm run build


# production stage
FROM nginx:alpine
WORKDIR /app

# copy only necessary files from the builder stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx" , "-g" , "daemon off;"]