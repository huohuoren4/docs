# Command Line Interface {#command-line-interface}

## `class` flask.cli.FlaskGroup(`add_default_commands=True, create_app=None, add_version_option=True, load_dotenv=True, set_debug_flag=True, **extra`)

Special subclass of the `AppGroup` group that supports loading more commands from the configured `Flask` app. Normally a developer does not have to interface with this class but there are some very advanced use cases for which it makes sense to create an instance of this. see [Custom Scripts](/python/flask/user_guide/cmd_interface#custom-scripts).

- *Parameters*:

    - `add_default_commands (bool)` – if this is `True` then the default run and shell commands will be added.

    - `add_version_option (bool)` – adds the `--version` option.

    - `create_app (t.Callable[..., Flask] | None)` – an optional callback that is passed the script info and returns the loaded app.

    - `load_dotenv (bool)` – Load the nearest `.env` and `.flaskenv` files to set environment variables. Will also change the working directory to the directory containing the first file found.

    - `set_debug_flag (bool)` – Set the app’s debug flag.

    - `extra (t.Any)` –

::: details Changelog
*Changed in version 2.2*: Added the `-A/--app`, `--debug/--no-debug`, `-e/--env-file` options.

*Changed in version 2.2*: An app context is pushed when running `app.cli` commands, so `@with_appcontext` is no longer required for those commands.

*Changed in version 1.0*: If installed, python-dotenv will be used to load environment variables from `.env` and `.flaskenv` files.
:::

- ### get_command(`ctx, name`)

    Given a context and a command name, this returns a `Command` object if it exists or returns `None`.

- ### list_commands(`ctx`)

    Returns a list of subcommand names in the order they should appear.

- ### make_context(`info_name, args, parent=None, **extra`)

    This function when given an info name and arguments will kick off the parsing and create a new `Context`. It does not invoke the actual command callback though.

    To quickly customize the context class used without overriding this method, set the `context_class` attribute.

    *Parameters*:

    - `info_name (str | None)` – the info name for this invocation. Generally this is the most descriptive name for the script or command. For the toplevel script it’s usually the name of the script, for commands below it’s the name of the command.

    - `args (list[str])` – the arguments to parse as list of strings.

    - `parent (Context | None)` – the parent context if available.

    - `extra (Any)` – extra keyword arguments forwarded to the context constructor.

    *Return type*: `Context`

    *Changed in version 8.0*: Added the `context_class` attribute.

- ### parse_args(`ctx, args`)

    Given a context and a list of arguments this creates the parser and parses the arguments, then modifies the context as necessary. This is automatically invoked by `make_context()`.

    *Parameters*:

    - `ctx (Context)` –

    - `args (list[str])` –

    *Return type*: `list[str]`

## `class` flask.cli.AppGroup(`name=None, commands=None, **attrs`)

This works similar to a regular click `Group` but it changes the behavior of the `command()` decorator so that it automatically wraps the functions in `with_appcontext()`.

Not to be confused with `FlaskGroup`.

- *Parameters*:

    - `name (str | None)` –

    - `commands (MutableMapping[str, Command] | Sequence[Command] | None)` –

    - `attrs (Any)` –

- ### command(`*args, **kwargs`)

    This works exactly like the method of the same name on a regular `click.Group` but it wraps callbacks in `with_appcontext()` unless it’s disabled by passing `with_appcontext=False`.

- ### group(`*args, **kwargs`)

    This works exactly like the method of the same name on a regular `click.Group` but it defaults the group class to `AppGroup`.

## `class` flask.cli.ScriptInfo(`app_import_path=None, create_app=None, set_debug_flag=True`)

Helper object to deal with Flask applications. This is usually not necessary to interface with as it’s used internally in the dispatching to click. In future versions of Flask this object will most likely play a bigger role. Typically it’s created automatically by the `FlaskGroup` but you can also manually create it and pass it onwards as click object.

- *Parameters*:

    - `app_import_path (str | None)` –

    - `create_app (t.Callable[..., Flask] | None)` –

    - `set_debug_flag (bool)` –

- ### app_import_path

    Optionally the import path for the `Flask` application.

- ### create_app

    Optionally a function that is passed the script info to create the instance of the application.

- ### data: `dict[t.Any, t.Any]`

    A dictionary with arbitrary data that can be associated with this script info.

- ### load_app()

    Loads the `Flask` app (if not yet loaded) and returns it. Calling this multiple times will just result in the already loaded app to be returned.

    *Return type*: `Flask`

## flask.cli.load_dotenv(`path=None`)

Load `“dotenv”` files in order of precedence to set environment variables.

If an env var is already set it is not overwritten, so earlier files in the list are preferred over later files.

This is a no-op if `python-dotenv` is not installed.

*Parameters*:

- `path (str | PathLike | None)` – Load the file at this location instead of searching.

*Returns*: `True` if a file was loaded.

*Return type*: `bool`

::: details Changelog
*Changed in version 2.0*: The current directory is not changed to the location of the loaded file.

Changed in version 2.0: When loading the env files, set the default encoding to `UTF-8`.

Changed in version 1.1.0: Returns `False` when `python-dotenv` is not installed, or when the given path isn’t a file.

*New in version 1.0.*
:::

## flask.cli.with_appcontext(`f`)

Wraps a callback so that it’s guaranteed to be executed with the script’s application context.

Custom commands (and their options) registered under `app.cli` or `blueprint.cli` will always have an app context available, this decorator is not required in that case.

::: details Changelog
*Changed in version 2.2*: The app context is active for subcommands as well as the decorated callback. The app context is always available to `app.cli` command and parameter callbacks.
:::

## flask.cli.pass_script_info(`f`)

Marks a function so that an instance of `ScriptInfo` is passed as first argument to the click callback.

*Parameters*:

- `f (t.Callable[te.Concatenate[T, P], R])` –

*Return type*: `t.Callable[P, R]`

## flask.cli.run_command = `<Command run>`

Run a local development server.

This server is for development purposes only. It does not provide the stability, security, or performance of production WSGI servers.

The reloader and debugger are enabled by default with the `‘–debug’` option.

*Parameters*:

- `args (Any)` –

- `kwargs (Any)` –

*Return type*: `Any`

## flask.cli.shell_command = `<Command shell>`

Run an interactive Python shell in the context of a given Flask application. The application will populate the default namespace of this shell according to its configuration.

This is useful for executing small snippets of management code without having to manually configure the application.

*Parameters*:

- `args (Any)` –

- `kwargs (Any)` –

*Return type*: `Any`