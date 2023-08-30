# Test CLI Runner {#test-cli-runner}

## `class` flask.testing.FlaskCliRunner(`app, **kwargs`)

A `CliRunner` for testing a Flask app’s `CLI` commands. Typically created using `test_cli_runner()`. See [Running Commands with the CLI Runner](/python/flask/user_guide/application#running-commands-with-the-cli-runner).

- *Parameters*:

    - `app (Flask)` –

    - `kwargs (t.Any)` –

- ### invoke(`cli=None, args=None, **kwargs`)

    Invokes a CLI command in an isolated environment. See `CliRunner.invoke` for full method documentation. See [Running Commands with the CLI Runner](/python/flask/user_guide/application#running-commands-with-the-cli-runner) for examples.

    If the `obj` argument is not given, passes an instance of `ScriptInfo` that knows how to load the `Flask` app being tested.

    *Parameters*:

    - `cli (Any | None)` – Command object to invoke. Default is the app’s cli group.

    - `args (Any | None)` – List of strings to invoke the command with.

    - `kwargs (Any)` –

    *Returns*: a `Result` object.

    *Return type*: `Any`