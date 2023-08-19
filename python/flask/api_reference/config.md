# Configuration

## `class` flask.Config(`root_path, defaults=None`)

Works exactly like a dict but provides ways to fill it from files or special dictionaries. There are two common patterns to populate the config.

Either you can fill the config from a config file:

```python
app.config.from_pyfile('yourconfig.cfg')
```

Or alternatively you can define the configuration options in the module that calls `from_object()` or provide an import path to a module that should be loaded. It is also possible to tell it to use the same module and with that provide the configuration values just before the call:

```python
DEBUG = True
SECRET_KEY = 'development key'
app.config.from_object(__name__)
```

In both cases (loading from any Python file or loading from modules), only uppercase keys are added to the config. This makes it possible to use lowercase values in the config file for temporary values that are not added to the config or to define the config keys in the same file that implements the application.

Probably the most interesting way to load configurations is from an environment variable pointing to a file:

```python
app.config.from_envvar('YOURAPPLICATION_SETTINGS')
```

In this case before launching the application you have to set this environment variable to the file you want to use. On Linux and OS X use the export statement:

```python
export YOURAPPLICATION_SETTINGS='/path/to/config/file'
```

On windows use set instead.

- *Parameters*:

    - `root_path (str | os.PathLike)` – path to which files are read relative from. When the config object is created by the application, this is the application’s `root_path`.

    - `defaults (dict | None)` – an optional dictionary of default values

- ### from_envvar(`variable_name, silent=False`)

    Loads a configuration from an environment variable pointing to a configuration file. This is basically just a shortcut with nicer error messages for this line of code:

    ```python
    app.config.from_pyfile(os.environ['YOURAPPLICATION_SETTINGS'])
    ```

    *Parameters*:

    - `variable_name (str)` – name of the environment variable

    - `silent (bool)` – set to `True` if you want silent failure for missing files.

    *Returns*: `True` if the file was loaded successfully.

    *Return type*: `bool`

- ### from_file(`filename, load, silent=False, text=True`)

    Update the values in the config from a file that is loaded using the load parameter. The loaded data is passed to the `from_mapping()` method.

    ```python
    import json
    app.config.from_file("config.json", load=json.load)

    import tomllib
    app.config.from_file("config.toml", load=tomllib.load, text=False)
    ```

    *Parameters*:

    - `filename (str | PathLike)` – The path to the data file. This can be an absolute path or relative to the config root path.

    - `load` (`Callable[[Reader], Mapping]` where `Reader` implements a `read` method.) – A callable that takes a file handle and returns a mapping of loaded data from the file.

    - `silent (bool)` – Ignore the file if it doesn’t exist.

    - `text (bool)` – Open the file in text or binary mode.

    *Returns*: `True` if the file was loaded successfully.

    *Return type*: `bool`

    *Changed in version 2.3*: The text parameter was added.

    ::: details Changelog
    *New in version 2.0.*
    :::

- ### from_mapping(`mapping=None, **kwargs`)

    Updates the config like update() ignoring items with non-upper keys.

    *Returns*: Always returns `True`.

    *Parameters*:

    mapping (Mapping[str, Any] | None) –

    kwargs (Any) –

    *Return type*: `bool`

    ::: details Changelog
    *New in version 0.11.*
    :::

- ### from_object(`obj`)

    Updates the values from the given object. An object can be of one of the following two types:

    - a string: in this case the object with that name will be imported

    - an actual object reference: that object is used directly

    Objects are usually either modules or classes. `from_object()` loads only the uppercase attributes of the module/class. A `dict` object will not work with `from_object()` because the keys of a `dict` are not attributes of the di`ct class.

    Example of module-based configuration:

    ```python
    app.config.from_object('yourapplication.default_config')
    from yourapplication import default_config
    app.config.from_object(default_config)
    ```

    Nothing is done to the object before loading. If the object is a class and has `@property` attributes, it needs to be instantiated before being passed to this method.

    You should not use this function to load the actual configuration but rather configuration defaults. The actual config should be loaded with `from_pyfile()` and ideally from a location not within the package because the package might be installed system wide.

    See [Development / Production](https://flask.palletsprojects.com/en/2.3.x/config/#config-dev-prod) for an example of class-based configuration using `from_object()`.

    *Parameters*:

    - `obj (object | str)` – an import name or object

    *Return type*: `None`

- ### from_prefixed_env(`prefix='FLASK', *, loads=<function loads>`)

    Load any environment variables that start with `FLASK_`, dropping the prefix from the env key for the config key. Values are passed through a loading function to attempt to convert them to more specific types than strings.

    Keys are loaded in `sorted()` order.

    The default loading function attempts to parse values as any valid `JSON` type, including dicts and lists.

    Specific items in nested dicts can be set by separating the keys with double underscores `(__)`. If an intermediate key doesn’t exist, it will be initialized to an empty dict.

    *Parameters*:

    `prefix (str)` – Load env vars that start with this prefix, separated with an underscore `(_)`.

    `loads (Callable[[str], Any])` – Pass each string value to this function and use the returned value as the config value. If any error is raised it is ignored and the value remains a string. The default is `json.loads()`.

    *Return type*: `bool`

    ::: details Changelog
    *New in version 2.1.*
    :::

- ### from_pyfile(`filename, silent=False)`

    Updates the values in the config from a Python file. This function behaves as if the file was imported as module with the `from_object()` function.

    *Parameters*:

    - `filename (str | PathLike)` – the filename of the config. This can either be an absolute filename or a filename relative to the root path.

    - `silent (bool)` – set to `True` if you want silent failure for missing files.

    *Returns*: `True` if the file was loaded successfully.

    *Return type*: `bool`

    ::: details Changelog
    *New in version 0.7*: silent parameter.
    :::

- ### get_namespace(`namespace, lowercase=True, trim_namespace=True`)

    Returns a dictionary containing a subset of configuration options that match the specified namespace/prefix. Example usage:

    ```python
    app.config['IMAGE_STORE_TYPE'] = 'fs'
    app.config['IMAGE_STORE_PATH'] = '/var/app/images'
    app.config['IMAGE_STORE_BASE_URL'] = 'http://img.website.com'
    image_store_config = app.config.get_namespace('IMAGE_STORE_')
    ```

    The resulting dictionary `image_store_config` would look like:

    ```json
    {
        'type': 'fs',
        'path': '/var/app/images',
        'base_url': 'http://img.website.com'
    }
    ```

    This is often useful when configuration options map directly to keyword arguments in functions or class constructors.

    *Parameters*:

    - `namespace (str)` – a configuration namespace

    - `lowercase (bool)` – a flag indicating if the keys of the resulting dictionary should be lowercase

    - `trim_namespace (bool)` – a flag indicating if the keys of the resulting dictionary should not include the namespace

    *Return type*: `dict[str, Any]`

    ::: details Changelog
    *New in version 0.11.*
    :::