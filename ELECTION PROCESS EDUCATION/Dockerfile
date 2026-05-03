# Use lightweight nginx to serve the static site
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy all project files
COPY . /usr/share/nginx/html/

# Nginx config — serve on port 8080 for Cloud Run
RUN printf 'server {\n\
    listen 8080;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript image/svg+xml;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
