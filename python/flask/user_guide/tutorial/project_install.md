# Make the Project Installable {#make-the-project-installable}

Making your project installable means that you can build a wheel file and install that in another environment, just like you installed Flask in your project’s environment. This makes deploying your project the same as installing any other library, so you’re using all the standard Python tools to manage everything.

Installing also comes with other benefits that might not be obvious from the tutorial or as a new Python user, including:

- Currently, Python and Flask understand how to use the `flaskr` package only because you’re running from your project’s directory. Installing means you can import it no matter where you run from.

- You can manage your project’s dependencies just like other packages do, so `pip install yourproject.whl` installs them.

- Test tools can isolate your test environment from your development environment.

::: tip Note
This is being introduced late in the tutorial, but in your future projects you should always start with this.
:::

## Describe the Project {#describe-the-project}

The `pyproject.toml` file describes your project and how to build it.

```toml
<!-- pyproject.toml -->
[project]
name = "flaskr"
version = "1.0.0"
description = "The basic blog app built in the Flask tutorial."
dependencies = [
    "flask",
]

[build-system]
requires = ["flit_core<4"]
build-backend = "flit_core.buildapi"
```

See the official [Packaging tutorial](https://packaging.python.org/tutorials/packaging-projects/) for more explanation of the files and options used.

## Install the Project {#install-the-project}

Use `pip` to install your project in the virtual environment.

```shell
$ pip install -e .
```

This tells pip to find `pyproject.toml` in the current directory and install the project in editable or development mode. Editable mode means that as you make changes to your local code, you’ll only need to re-install if you change the metadata about the project, such as its dependencies.

You can observe that the project is now installed with `pip list`.

```shell
$ pip list

Package        Version   Location
-------------- --------- ----------------------------------
click          6.7
Flask          1.0
flaskr         1.0.0     /home/user/Projects/flask-tutorial
itsdangerous   0.24
Jinja2         2.10
MarkupSafe     1.0
pip            9.0.3
Werkzeug       0.14.1
```

Nothing changes from how you’ve been running your project so far. `--app` is still set to `flaskr` and `flask run` still runs the application, but you can call it from anywhere, not just the `flask-tutorial` directory.

Continue to [Test Coverage](https://flask.palletsprojects.com/en/2.3.x/tutorial/tests/).
