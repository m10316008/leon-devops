cd /root/docker_dns/
docker build -t leon/dnsmasq .
docker-compose up -d



<!-- # The setup

Consider the following `docker-compose.yml`:

```yml
version: '3.1'

services:

  a:
    image: nginx:1.15.2-alpine
    ports:
      - 80:80
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./resolv.conf:/etc/resolv.conf

  b:
    image: nginx:1.15.2-alpine
    volumes:
      - ./b.html:/usr/share/nginx/html/index.html:ro
```

And also this `default.conf` for nginx service "a":

```
server {

  listen 80 default_server;
  server_name _;

  location /b {
    proxy_pass              http://b/;
    proxy_set_header        Host $host;
  }  

}

```

The above configuration stands for nginx service "a" which proxy_pass
requests to `/b` to nginx service "b". Both "a" and "b" are valid hostnames
within this docker network created by docker-compose.

# The problem

In short, if you try yo start services "a" and "b" is not running, 
nginx will exit with this message:

```
[emerg] 1#1: host not found in upstream
```

This can be painful in some scenarios. For instance, "a" could be proxy_pass to
several services "b", "c", "d", ... and sometimes want to test just "b"
without starting the rest of services.

# Answers around the web

If you search for that nginx error message, most answers point to using
nginx variables in proxy_pass directive instead of hostname directly.

```
  location /b {
    set $server_b           b;
    proxy_pass              http://$server_b/;
    proxy_set_header        Host $host;
  } 
```

However, it does not work. It just responds 502. 

Another answer I found is to use `upstream` and `resolver` directives.
I could not test those, as they are only available to paying customers.

http://nginx.org/en/docs/http/ngx_http_upstream_module.html

# This solution

So, nginx complains and exits if hostname "b" is unknown.
The solution is to make it known and resolve to some fake IP.
It's ok as long as hostname is resolved.

I'm using dnsmasq to do it, with this single config line:

```
address=/#/1.2.3.4
```

The above line means "return 1.2.3.4 for unknown hostnames".

That's it!

# Try it

Check out the files in this repository. They're quite minimal.

Then spin it up with this single liner:

```
docker-compose up -d dnsmasq a
```

Take good notice service "b" is not running.

Now open http://localhost. Nginx service "a" should greeat you.

`curl http://localhost`
```html
<!DOCTYPE html>
<html>
<head>
    <title>Server A</title>
</head>
<body>
    <h1>Welcome to Server A</h1>
</body>
</html>
```

Open http://localhost/b. It timeouts.

`curl -m 1 http://localhost/b`
```
curl: (28) Operation timed out after 1001 milliseconds with 0 bytes received
```

Now spin up nginx service "b".
```
docker-compose up -d b
```

You must also restart nginx service "a", because nginx will cache 1.2.3.4 until restarted.

`docker-compose restart a`

Now go open http://localhost/b. Nginx service "b" should say Hi.

`curl -m 1 http://localhost/b`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Server B</title>
</head>
<body>
    <h1>Welcome to Server B</h1>
</body>
</html>
```

# Caveats

I could not get around this tiny pesky little thing: 
I need to hardcode dnsmasq container IP in `docker-compose.yml`

```yml
services:

  a:
    image: nginx:1.15.2-alpine
    ports:
      - 80:80
    volumes:
      - ./a.html:/etc/nginx/html/index.html:ro
      - ./nginx/conf.d:/etc/nginx/conf.d
    command: [nginx-debug, '-g', 'daemon off;']
    dns: 172.29.0.2 # Ouch, ¿how to pass dnsmasq container IP?
```

Which means starting it up beforehand, finding out its IP and typing it there.
Looking around the web I found:
- Mapping dnsmasq port 53 to host port 53 and using 127.0.0.1, but I kind of dislike mapping to host ports.
https://stackoverflow.com/questions/47187879/docker-compose-use-other-container-as-dns
- Assign static IP to dnsmasq. Not really appealing.
https://stackoverflow.com/questions/39493490/provide-static-ip-to-docker-containers-via-docker-compose

Do you know better?


# Feeback?

I'm sure I'm missing something. Some other, more clever way to go around this.
Care to share? Sprach! -->
