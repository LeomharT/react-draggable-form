FROM nginx:latest
COPY . /app
WORKDIR /app
EXPOSE 3000

CMD [ "nginx","-c","/app/nginx/nginx.conf" ]
