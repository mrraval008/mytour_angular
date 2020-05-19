# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node:11.15.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --output-path=./dist/out 
# RUN npm run build --prod --output-path=./dist/out 
#to run in prod mode 

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.16.0-alpine as prod-stage
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist/out /usr/share/nginx/html
#EXPOSE 8080
#CMD ["nginx", "-g" , "daemon off;"]
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'