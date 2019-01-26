# Deploying Webhook Server

Since this is the server that enables us to deploy other applications, we do not
have automated deployment set up.

## deployment

On your server, pull and deploy the version of your choice:

```sh
docker pull samhinshaw/webhookserver:latest # or another tag
```

```sh
docker run                                     \
  -d                                           \
  --restart=always                             \
  -p 8025:8025                                 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /home/sam/deploy:/deploy                  \
  samhinshaw/webhook-server:1.0.15
```

Here we:

1. Run the container detached
2. Set the restart policy to always restart the container if it crashes
3. Expose port 8025, where my Express server is listening, and where nginx will proxy requests to `/hooks/` to.
4. Mount the docker socket
5. Mount my deploy folder
6. Run the webhook-server image

## nginx

The nginx config on the host server will need to be updated to proxy connections
to /hooks to our webhook server.

**Note:** The trailing slash on location and proxy_pass are very important to
make the base url take!

```conf
location /hooks/ {
        proxy_pass http://localhost:8025/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
}
```
