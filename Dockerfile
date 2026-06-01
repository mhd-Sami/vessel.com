FROM caddy:2-alpine

WORKDIR /srv

COPY . /srv

ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "port=${PORT:-8080}; printf ':%s {\n  root * /srv\n  encode gzip\n  file_server\n}\n' \"$port\" > /tmp/Caddyfile && exec caddy run --config /tmp/Caddyfile --adapter caddyfile"]