# Deploying to Production {#deploying-to-production}

After developing your application, you’ll want to make it available publicly to other users. When you’re developing locally, you’re probably using the built-in development server, debugger, and reloader. These should not be used in production. Instead, you should use a dedicated WSGI server or hosting platform, some of which will be described here.

“Production” means “not development”, which applies whether you’re serving your application publicly to millions of users or privately / locally to a single user. Do not use the development server when deploying to production. It is intended for use only during local development. It is not designed to be particularly secure, stable, or efficient.

## Self-Hosted Options {#self-hosted-options}

Flask is a WSGI application. A WSGI server is used to run the application, converting incoming HTTP requests to the standard WSGI environ, and converting outgoing WSGI responses to HTTP responses.

The primary goal of these docs is to familiarize you with the concepts involved in running a WSGI application using a production WSGI server and HTTP server. There are many WSGI servers and HTTP servers, with many configuration possibilities. The pages below discuss the most common servers, and show the basics of running each one. The next section discusses platforms that can manage this for you.

- [Gunicorn](https://flask.palletsprojects.com/en/2.3.x/deploying/gunicorn/)
- [Waitress](https://flask.palletsprojects.com/en/2.3.x/deploying/waitress/)
- [mod_wsgi](https://flask.palletsprojects.com/en/2.3.x/deploying/mod_wsgi/)
- [uWSGI](https://flask.palletsprojects.com/en/2.3.x/deploying/uwsgi/)
- [gevent](https://flask.palletsprojects.com/en/2.3.x/deploying/gevent/)
- [eventlet](https://flask.palletsprojects.com/en/2.3.x/deploying/eventlet/)
- [ASGI](https://flask.palletsprojects.com/en/2.3.x/deploying/asgi/)

WSGI servers have HTTP servers built-in. However, a dedicated HTTP server may be safer, more efficient, or more capable. Putting an HTTP server in front of the WSGI server is called a “reverse proxy.”

- [Tell Flask it is Behind a Proxy](https://flask.palletsprojects.com/en/2.3.x/deploying/proxy_fix/)
- [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/)
- [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/)
This list is not exhaustive, and you should evaluate these and other servers based on your application’s needs. Different servers will have different capabilities, configuration, and support.

## Hosting Platforms {#hosting-platforms}

There are many services available for hosting web applications without needing to maintain your own server, networking, domain, etc. Some services may have a free tier up to a certain time or bandwidth. Many of these services use one of the WSGI servers described above, or a similar interface. The links below are for some of the most common platforms, which have instructions for Flask, WSGI, or Python.

- [PythonAnywhere](https://help.pythonanywhere.com/pages/Flask/)

- [Google App Engine](https://cloud.google.com/appengine/docs/standard/python3/building-app)

- [Google Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service)

- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-flask.html)

- [Microsoft Azure](https://docs.microsoft.com/en-us/azure/app-service/quickstart-python)

This list is not exhaustive, and you should evaluate these and other services based on your application’s needs. Different services will have different capabilities, configuration, pricing, and support.

You’ll probably need to [Tell Flask it is Behind a Proxy](https://flask.palletsprojects.com/en/2.3.x/deploying/proxy_fix/) when using most hosting platforms.

## Gunicorn {#gunicorn}

[Gunicorn](https://gunicorn.org/) is a pure Python WSGI server with simple configuration and multiple worker implementations for performance tuning.

- It tends to integrate easily with hosting platforms.

- It does not support Windows (but does run on WSL).

- It is easy to install as it does not require additional dependencies or compilation.

- It has built-in async worker support using gevent or eventlet.

This page outlines the basics of running Gunicorn. Be sure to read its [documentation](https://docs.gunicorn.org/) and use `gunicorn --help` to understand what features are available.

### Installing {#installing}

Gunicorn is easy to install, as it does not require external dependencies or compilation. It runs on Windows only under WSL.

Create a virtualenv, install your application, then install `gunicorn`.

```python
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install gunicorn
```

### Running {#running}

The only required argument to Gunicorn tells it how to load your Flask application. The syntax is `{module_import}:{app_variable}`. module_import is the dotted import name to the module with your application. `app_variable` is the variable with the application. It can also be a function call (with any arguments) if you’re using the app factory pattern.

```shell
# equivalent to 'from hello import app'
$ gunicorn -w 4 'hello:app'

# equivalent to 'from hello import create_app; create_app()'
$ gunicorn -w 4 'hello:create_app()'

Starting gunicorn 20.1.0
Listening at: http://127.0.0.1:8000 (x)
Using worker: sync
Booting worker with pid: x
Booting worker with pid: x
Booting worker with pid: x
Booting worker with pid: x
```

The `-w` option specifies the number of processes to run; a starting value could be CPU * 2. The default is only 1 worker, which is probably not what you want for the default worker type.

Logs for each request aren’t shown by default, only worker info and errors are shown. To show access logs on stdout, use the `--access-logfile=-` option.

### Binding Externally {#binding-externally}

Gunicorn should not be run as root because it would cause your application code to run as root, which is not secure. However, this means it will not be possible to bind to port 80 or 443. Instead, a reverse proxy such as [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/) or [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/) should be used in front of Gunicorn.

You can bind to all external IPs on a non-privileged port using the `-b 0.0.0.0` option. Don’t do this when using a reverse proxy setup, otherwise it will be possible to bypass the proxy.

```shell
$ gunicorn -w 4 -b 0.0.0.0 'hello:create_app()'
Listening at: http://0.0.0.0:8000 (x)
```

`0.0.0.0` is not a valid address to navigate to, you’d use a specific IP address in your browser.

### Async with gevent or eventlet {#async-with-gevent-or-eventlet}

The default sync worker is appropriate for many use cases. If you need asynchronous support, Gunicorn provides workers using either [gevent](https://www.gevent.org/) or [eventlet](https://eventlet.net/). This is not the same as Python’s `async/await`, or the ASGI server spec. You must actually use `gevent/eventlet` in your own code to see any benefit to using the workers.

When using either gevent or `eventlet`, `greenlet`>=1.0 is required, otherwise context locals such as `request` will not work as expected. When using `PyPy`, `PyPy`>=7.3.7 is required.

To use `gevent`:

```shell
$ gunicorn -k gevent 'hello:create_app()'
Starting gunicorn 20.1.0
Listening at: http://127.0.0.1:8000 (x)
Using worker: gevent
Booting worker with pid: x
```

To use `eventlet`:

```shell
$ gunicorn -k eventlet 'hello:create_app()'
Starting gunicorn 20.1.0
Listening at: http://127.0.0.1:8000 (x)
Using worker: eventlet
Booting worker with pid: x
```

## Waitress {#waitress}

[Waitress](https://docs.pylonsproject.org/projects/waitress/) is a pure Python WSGI server.

- It is easy to configure.

- It supports Windows directly.

- It is easy to install as it does not require additional dependencies or compilation.

- It does not support streaming requests, full request data is always buffered.

- It uses a single process with multiple thread workers.

This page outlines the basics of running Waitress. Be sure to read its documentation and `waitress-serve --help` to understand what features are available.

### Installing {#installing-1}

Create a virtualenv, install your application, then install `waitress`.

```shell
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install waitress
```

### Running {#running-2}

The only required argument to `waitress-serve` tells it how to load your Flask application. The syntax is `{module}:{app}`. module is the dotted import name to the module with your application. `app` is the variable with the application. If you’re using the app factory pattern, use `--call {module}:{factory}` instead.

```shell
# equivalent to 'from hello import app'
$ waitress-serve --host 127.0.0.1 hello:app

# equivalent to 'from hello import create_app; create_app()'
$ waitress-serve --host 127.0.0.1 --call hello:create_app

Serving on http://127.0.0.1:8080
```

The `--host` option binds the server to local `127.0.0.1` only.

Logs for each request aren’t shown, only errors are shown. Logging can be configured through the Python interface instead of the command line.

### Binding Externally {#binding-externally-1}

Waitress should not be run as root because it would cause your application code to run as root, which is not secure. However, this means it will not be possible to bind to port 80 or 443. Instead, a reverse proxy such as [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/) or [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/) should be used in front of Waitress.

You can bind to all external IPs on a non-privileged port by not specifying the `--host` option. Don’t do this when using a revers proxy setup, otherwise it will be possible to bypass the proxy.

`0.0.0.0` is not a valid address to navigate to, you’d use a specific IP address in your browser.

## mod_wsgi {#mod-wsgi}

[mod_wsgi](https://modwsgi.readthedocs.io/) is a WSGI server integrated with the [Apache httpd](https://httpd.apache.org/) server. The modern [mod_wsgi-express](https://pypi.org/project/mod-wsgi/) command makes it easy to configure and start the server without needing to write Apache httpd configuration.

- Tightly integrated with Apache httpd.

- Supports Windows directly.

- Requires a compiler and the Apache development headers to install.

- Does not require a reverse proxy setup.

This page outlines the basics of running mod_wsgi-express, not the more complex installation and configuration with httpd. Be sure to read the [mod_wsgi-express](https://pypi.org/project/mod-wsgi/), [mod_wsgi](https://modwsgi.readthedocs.io/), and [Apache httpd](https://httpd.apache.org/) documentation to understand what features are available.

### Installing {#installing-2}

Installing mod_wsgi requires a compiler and the Apache server and development headers installed. You will get an error if they are not. How to install them depends on the OS and package manager that you use.

Create a virtualenv, install your application, then install `mod_wsgi`.

```shell
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install mod_wsgi
```

### Running {#running-1}

The only argument to `mod_wsgi-express` specifies a script containing your Flask application, which must be called `application`. You can write a small script to import your app with this name, or to create it if using the app factory pattern.

```python
# wsgi.py
from hello import app

application = app
```

```shell
# wsgi.py
from hello import create_app

application = create_app()
```

Now run the `mod_wsgi-express start-server` command.

```shell
$ mod_wsgi-express start-server wsgi.py --processes 4
```

The `--processes` option specifies the number of worker processes to run; a starting value could be `CPU * 2`.

Logs for each request aren’t show in the terminal. If an error occurs, its information is written to the error log file shown when starting the server.

### Binding Externally {#binding-externally-3}

Unlike the other WSGI servers in these docs, mod_wsgi can be run as root to bind to privileged ports like 80 and 443. However, it must be configured to drop permissions to a different user and group for the worker processes.

For example, if you created a `hello` user and group, you should install your virtualenv and application as that user, then tell mod_wsgi to drop to that user after starting.

```shell
$ sudo /home/hello/.venv/bin/mod_wsgi-express start-server \
    /home/hello/wsgi.py \
    --user hello --group hello --port 80 --processes 4
```

## uWSGI {#uwsgi}

[uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) is a fast, compiled server suite with extensive configuration and capabilities beyond a basic server.

- It can be very performant due to being a compiled program.

- It is complex to configure beyond the basic application, and has so many options that it can be difficult for beginners to understand.

- It does not support Windows (but does run on WSL).

- It requires a compiler to install in some cases.

This page outlines the basics of running uWSGI. Be sure to read its documentation to understand what features are available.

### Installing {#installing-3}

uWSGI has multiple ways to install it. The most straightforward is to install the `pyuwsgi` package, which provides precompiled wheels for common platforms. However, it does not provide SSL support, which can be provided with a reverse proxy instead.

Create a virtualenv, install your application, then install `pyuwsgi`.

```shell
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install pyuwsgi
```

If you have a compiler available, you can install the `uwsgi` package instead. Or install the `pyuwsgi` package from sdist instead of wheel. Either method will include SSL support.

```shell
$ pip install uwsgi

# or
$ pip install --no-binary pyuwsgi pyuwsgi
```

### Running {#running-4}

The most basic way to run uWSGI is to tell it to start an HTTP server and import your application.

```shell
$ uwsgi --http 127.0.0.1:8000 --master -p 4 -w hello:app

*** Starting uWSGI 2.0.20 (64bit) on [x] ***
*** Operational MODE: preforking ***
mounting hello:app on /
spawned uWSGI master process (pid: x)
spawned uWSGI worker 1 (pid: x, cores: 1)
spawned uWSGI worker 2 (pid: x, cores: 1)
spawned uWSGI worker 3 (pid: x, cores: 1)
spawned uWSGI worker 4 (pid: x, cores: 1)
spawned uWSGI http 1 (pid: x)
```

If you’re using the app factory pattern, you’ll need to create a small Python file to create the app, then point uWSGI at that.

```python
# wsgi.py
from hello import create_app

app = create_app()
```

```shell
$ uwsgi --http 127.0.0.1:8000 --master -p 4 -w wsgi:app
```

The `--http` option starts an HTTP server at 127.0.0.1 port 8000. The `--master` option specifies the standard worker manager. The `-p` option starts 4 worker processes; a starting value could be `CPU * 2`. The `-w` option tells uWSGI how to import your application

### Binding Externally {#binding-externally-2}

uWSGI should not be run as root with the configuration shown in this doc because it would cause your application code to run as root, which is not secure. However, this means it will not be possible to bind to port 80 or 443. Instead, a reverse proxy such as [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/) or [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/) should be used in front of uWSGI. It is possible to run uWSGI as root securely, but that is beyond the scope of this doc.

uWSGI has optimized integration with [Nginx uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/Nginx.html) and [Apache mod_proxy_uwsgi](https://uwsgi-docs.readthedocs.io/en/latest/Apache.html#mod-proxy-uwsgi), and possibly other servers, instead of using a standard HTTP proxy. That configuration is beyond the scope of this doc, see the links for more information.

You can bind to all external IPs on a non-privileged port using the `--http 0.0.0.0:8000` option. Don’t do this when using a reverse proxy setup, otherwise it will be possible to bypass the proxy.

```shell
$ uwsgi --http 0.0.0.0:8000 --master -p 4 -w wsgi:app
```

`0.0.0.0` is not a valid address to navigate to, you’d use a specific IP address in your browser.

### Async with gevent {#async-with-gevent}

The default sync worker is appropriate for many use cases. If you need asynchronous support, uWSGI provides a gevent worker. This is not the same as Python’s `async/await`, or the ASGI server spec. You must actually use gevent in your own code to see any benefit to using the worker.

When using gevent, greenlet>=1.0 is required, otherwise context locals such as `request` will not work as expected. When using PyPy, PyPy>=7.3.7 is required.

```shell
$ uwsgi --http 127.0.0.1:8000 --master --gevent 100 -w wsgi:app

*** Starting uWSGI 2.0.20 (64bit) on [x] ***
*** Operational MODE: async ***
mounting hello:app on /
spawned uWSGI master process (pid: x)
spawned uWSGI worker 1 (pid: x, cores: 100)
spawned uWSGI http 1 (pid: x)
*** running gevent loop engine [addr:x] ***
```

## gevent {#gevent}

Prefer using [Gunicorn](https://flask.palletsprojects.com/en/2.3.x/deploying/gunicorn/) or [uWSGI](https://flask.palletsprojects.com/en/2.3.x/deploying/uwsgi/) with gevent workers rather than using [gevent](https://www.gevent.org/) directly. Gunicorn and uWSGI provide much more configurable and production-tested servers.

[gevent](https://www.gevent.org/) allows writing asynchronous, coroutine-based code that looks like standard synchronous Python. It uses [greenlet](https://greenlet.readthedocs.io/en/latest/) to enable task switching without writing `async/await` or using `asyncio`.

[eventlet](https://flask.palletsprojects.com/en/2.3.x/deploying/eventlet/) is another library that does the same thing. Certain dependencies you have, or other considerations, may affect which of the two you choose to use.

gevent provides a WSGI server that can handle many connections at once instead of one per worker process. You must actually use gevent in your own code to see any benefit to using the server.

### Installing {#installing-4}

When using gevent, greenlet>=1.0 is required, otherwise context locals such as `request` will not work as expected. When using PyPy, PyPy>=7.3.7 is required.

Create a virtualenv, install your application, then install `gevent`.

```shell
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install gevent
```

### Running {#running-3}

To use `gevent` to serve your application, write a script that imports its `WSGIServer`, as well as your app or app factory.

```python
# wsgi.py
from gevent.pywsgi import WSGIServer
from hello import create_app

app = create_app()
http_server = WSGIServer(("127.0.0.1", 8000), app)
http_server.serve_forever()
```

```shell
$ python wsgi.py
```

No output is shown when the server starts.

### Binding Externally {#binding-externally-4}

gevent should not be run as root because it would cause your application code to run as root, which is not secure. However, this means it will not be possible to bind to port 80 or 443. Instead, a reverse proxy such as [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/) or [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/) should be used in front of gevent.

You can bind to all external IPs on a non-privileged port by using `0.0.0.0` in the server arguments shown in the previous section. Don’t do this when using a reverse proxy setup, otherwise it will be possible to bypass the proxy.

`0.0.0.0` is not a valid address to navigate to, you’d use a specific IP address in your browser.

## eventlet {#eventlet}

Prefer using [Gunicorn](https://flask.palletsprojects.com/en/2.3.x/deploying/gunicorn/) with eventlet workers rather than using [eventlet](https://eventlet.net/) directly. Gunicorn provides a much more configurable and production-tested server.

[eventlet](https://eventlet.net/) allows writing asynchronous, coroutine-based code that looks like standard synchronous Python. It uses [greenlet](https://greenlet.readthedocs.io/en/latest/) to enable task switching without writing `async/await` or using `asyncio`.

[gevent](https://flask.palletsprojects.com/en/2.3.x/deploying/gevent/) is another library that does the same thing. Certain dependencies you have, or other considerations, may affect which of the two you choose to use.

eventlet provides a WSGI server that can handle many connections at once instead of one per worker process. You must actually use eventlet in your own code to see any benefit to using the server.

### Installing {#installing-5}

When using `eventlet`, `greenlet`>=1.0 is required, otherwise context locals such as `request` will not work as expected. When using PyPy, PyPy>=7.3.7 is required.

Create a virtualenv, install your application, then install `eventlet`.

```shell
$ cd hello-app
$ python -m venv .venv
$ . .venv/bin/activate
$ pip install .  # install your application
$ pip install eventlet
```

### Running {#running-5}

To use eventlet to serve your application, write a script that imports its `wsgi.server`, as well as your app or app factory.

```python
# wsgi.py
import eventlet
from eventlet import wsgi
from hello import create_app

app = create_app()
wsgi.server(eventlet.listen(("127.0.0.1", 8000)), app)
```

```shell
$ python wsgi.py
(x) wsgi starting up on http://127.0.0.1:8000
```

### Binding Externally {#binding-externally-5}

eventlet should not be run as root because it would cause your application code to run as root, which is not secure. However, this means it will not be possible to bind to port 80 or 443. Instead, a reverse proxy such as [nginx](https://flask.palletsprojects.com/en/2.3.x/deploying/nginx/) or [Apache httpd](https://flask.palletsprojects.com/en/2.3.x/deploying/apache-httpd/) should be used in front of eventlet.

You can bind to all external IPs on a non-privileged port by using `0.0.0.0` in the server arguments shown in the previous section. Don’t do this when using a reverse proxy setup, otherwise it will be possible to bypass the proxy.

`0.0.0.0` is not a valid address to navigate to, you’d use a specific IP address in your browser.

## ASGI {#asgi}

If you’d like to use an ASGI server you will need to utilise WSGI to ASGI middleware. The asgiref [WsgiToAsgi](https://github.com/django/asgiref#wsgi-to-asgi-adapter) adapter is recommended as it integrates with the event loop used for Flask’s [Using async and await](https://flask.palletsprojects.com/en/2.3.x/async-await/#async-await) support. You can use the adapter by wrapping the Flask app,

```python
from asgiref.wsgi import WsgiToAsgi
from flask import Flask

app = Flask(__name__)

...

asgi_app = WsgiToAsgi(app)
```

and then serving the `asgi_app` with the ASGI server, e.g. using [Hypercorn](https://gitlab.com/pgjones/hypercorn),

```shell
$ hypercorn module:asgi_app
```

## Tell Flask it is Behind a Proxy {#tell-flask-it-is-behind-a-proxy}

When using a reverse proxy, or many Python hosting platforms, the proxy will intercept and forward all external requests to the local WSGI server.

From the WSGI server and Flask application’s perspectives, requests are now coming from the HTTP server to the local address, rather than from the remote address to the external server address.

HTTP servers should set `X-Forwarded-` headers to pass on the real values to the application. The application can then be told to trust and use those values by wrapping it with the [X-Forwarded-For Proxy Fix](https://werkzeug.palletsprojects.com/en/2.3.x/middleware/proxy_fix/) middleware provided by Werkzeug.

This middleware should only be used if the application is actually behind a proxy, and should be configured with the number of proxies that are chained in front of it. Not all proxies set all the headers. Since incoming headers can be faked, you must set how many proxies are setting each header so the middleware knows what to trust.

```python
from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)
```

Remember, only apply this middleware if you are behind a proxy, and set the correct number of proxies that set each header. It can be a security issue if you get this configuration wrong.

## nginx {#nginx}

[nginx](https://nginx.org/) is a fast, production level HTTP server. When serving your application with one of the WSGI servers listed in [Deploying to Production](https://flask.palletsprojects.com/en/2.3.x/deploying/), it is often good or necessary to put a dedicated HTTP server in front of it. This “reverse proxy” can handle incoming requests, TLS, and other security and performance concerns better than the WSGI server.

Nginx can be installed using your system package manager, or a pre-built executable for Windows. Installing and running Nginx itself is outside the scope of this doc. This page outlines the basics of configuring Nginx to proxy your application. Be sure to read its documentation to understand what features are available.

### Domain Name {#domain-name}

Acquiring and configuring a domain name is outside the scope of this doc. In general, you will buy a domain name from a registrar, pay for server space with a hosting provider, and then point your registrar at the hosting provider’s name servers.

To simulate this, you can also edit your `hosts` file, located at `/etc/hosts` on Linux. Add a line that associates a name with the local IP.

Modern Linux systems may be configured to treat any domain name that ends with `.localhost` like this without adding it to the hosts file.

```shell
# /etc/hosts
127.0.0.1 hello.localhost
```

Configuration
The nginx configuration is located at `/etc/nginx/nginx.conf` on Linux. It may be different depending on your operating system. Check the docs and look for `nginx.conf`.

Remove or comment out any existing `server` section. Add a `server` section and use the `proxy_pass` directive to point to the address the WSGI server is listening on. We’ll assume the WSGI server is listening locally at `http://127.0.0.1:8000`.

```shell
# /etc/nginx.conf
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Prefix /;
    }
}
```

Then [Tell Flask it is Behind a Proxy](https://flask.palletsprojects.com/en/2.3.x/deploying/proxy_fix/) so that your application uses these headers.

## Apache httpd {#apache-httpd}

[Apache httpd](https://httpd.apache.org/) is a fast, production level HTTP server. When serving your application with one of the WSGI servers listed in [Deploying to Production](https://flask.palletsprojects.com/en/2.3.x/deploying/), it is often good or necessary to put a dedicated HTTP server in front of it. This “reverse proxy” can handle incoming requests, TLS, and other security and performance concerns better than the WSGI server.

httpd can be installed using your system package manager, or a pre-built executable for Windows. Installing and running httpd itself is outside the scope of this doc. This page outlines the basics of configuring httpd to proxy your application. Be sure to read its documentation to understand what features are available.

### Domain Name {#domain-name-1}

Acquiring and configuring a domain name is outside the scope of this doc. In general, you will buy a domain name from a registrar, pay for server space with a hosting provider, and then point your registrar at the hosting provider’s name servers.

To simulate this, you can also edit your `hosts` file, located at `/etc/hosts` on Linux. Add a line that associates a name with the local IP.

Modern Linux systems may be configured to treat any domain name that ends with `.localhost` like this without adding it to the hosts file.

```shell
# /etc/hosts
127.0.0.1 hello.localhost
```

### Configuration {#configuration}

The httpd configuration is located at `/etc/httpd/conf/httpd.conf` on Linux. It may be different depending on your operating system. Check the docs and look for `httpd.conf`.

Remove or comment out any existing `DocumentRoot` directive. Add the config lines below. We’ll assume the WSGI server is listening locally at `http://127.0.0.1:8000`.

```shell
/etc/httpd/conf/httpd.conf
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
ProxyPass / http://127.0.0.1:8000/
RequestHeader set X-Forwarded-Proto http
RequestHeader set X-Forwarded-Prefix /
```

The `LoadModule` lines might already exist. If so, make sure they are uncommented instead of adding them manually.

Then [Tell Flask it is Behind a Proxy](https://flask.palletsprojects.com/en/2.3.x/deploying/proxy_fix/) so that your application uses the `X-Forwarded` headers. `X-Forwarded-For` and `X-Forwarded-Host` are automatically set by `ProxyPass`.