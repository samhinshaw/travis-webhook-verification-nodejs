# Deploying Webhook Server

Since this is the server that enables us to deploy other applications, we do not
have automated deployment set up.

## deployment

On your server, pull and deploy the version of your choice:

```sh
docker pull samhinshaw/webhookserver:latest # or another tag
```

```sh
docker run -d --restart=always -p 8025:8025 samhinshaw/webhook-server:1.0.1
```

## nginx

The nginx config on the host server will need to be updated to proxy connections
to /hooks to our webhook server.

```conf
location /hooks {
        proxy_pass http://localhost:8025;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
}
```
