# Deploy to Production {#deploy-to-production}

This part of the tutorial assumes you have a server that you want to deploy your application to. It gives an overview of how to create the distribution file and install it, but won’t go into specifics about what server or software to use. You can set up a new environment on your development computer to try out the instructions below, but probably shouldn’t use it for hosting a real public application. See [Deploying to Production](/python/flask/user_guide/deploy#deploying-to-production) for a list of many different ways to host your application.

## Build and Install {#build-and-install}

When you want to deploy your application elsewhere, you build a wheel (`.whl`) file. Install and use the `build` tool to do this.

```shell
$ pip install build
$ python -m build --wheel
```

You can find the file in `dist/flaskr-1.0.0-py3-none-any.whl`. The file name is in the format of {project name}-{version}-{python tag} -{abi tag}-{platform tag}.

Copy this file to another machine, set up a new virtualenv, then install the file with pip.

```shell
$ pip install flaskr-1.0.0-py3-none-any.whl
```

Pip will install your project along with its dependencies.

Since this is a different machine, you need to run `init-db` again to create the database in the instance folder.

```shell
$ flask --app flaskr init-db
```

When Flask detects that it’s installed (not in editable mode), it uses a different directory for the instance folder. You can find it at `.venv/var/flaskr-instance` instead.

## Configure the Secret Key {#configure-the-secret-key}

In the beginning of the tutorial that you gave a default value for `SECRET_KEY`. This should be changed to some random bytes in production. Otherwise, attackers could use the public `'dev'` key to modify the session cookie, or anything else that uses the secret key.

You can use the following command to output a random secret key:

```shell
$ python -c 'import secrets; print(secrets.token_hex())'

'192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
```

Create the `config.py` file in the instance folder, which the factory will read from if it exists. Copy the generated value into it.

```shell
# .venv/var/flaskr-instance/config.py
SECRET_KEY = '192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
```

You can also set any other necessary configuration here, although `SECRET_KEY` is the only one needed for Flaskr.

## Run with a Production Server {#run-with-a-production-server}

When running publicly rather than in development, you should not use the built-in development server (`flask run`). The development server is provided by Werkzeug for convenience, but is not designed to be particularly efficient, stable, or secure.

Instead, use a production WSGI server. For example, to use [Waitress](https://docs.pylonsproject.org/projects/waitress/en/stable/), first install it in the virtual environment:

```shell
$ pip install waitress
```

You need to tell Waitress about your application, but it doesn’t use `--app` like `flask run` does. You need to tell it to import and call the application factory to get an application object.

```shell
$ waitress-serve --call 'flaskr:create_app'

Serving on http://0.0.0.0:8080
```

See [Deploying to Production](/python/flask/user_guide/deploy#deploying-to-production) for a list of many different ways to host your application. Waitress is just an example, chosen for the tutorial because it supports both Windows and Linux. There are many more WSGI servers and deployment options that you may choose for your project.

Continue to [Keep Developing!](/python/flask/user_guide/tutorial/develop#keep-developing).