# Configuration {#configuration}

## Command line options and configuration file settings {#command-line-options-and-configuration-file-settings}

You can get help on command line options and values in INI-style configurations files by using the general help option:

```shell
pytest -h   # prints options _and_ config file settings
```

This will display command line and configuration file settings which were registered by installed plugins.

## Configuration file formats {#configuration-file-formats}

Many [pytest settings](/python/pytest/reference_guides/api_reference/config_options#configuration-options) can be set in a configuration file, which by convention resides in the root directory of your repository.

A quick example of the configuration files supported by pytest:

### pytest.ini {#pytest-ini}

`pytest.ini` files take precedence over other files, even when empty.

Alternatively, the hidden version `.pytest.ini` can be used.

```ini
# pytest.ini or .pytest.ini
[pytest]
minversion = 6.0
addopts = -ra -q
testpaths =
    tests
    integration
```

### pyproject.toml {#pyproject-toml}

*New in version 6.0.*

`pyproject.toml` are considered for configuration when they contain a `tool.pytest.ini_options` table.

```toml
# pyproject.toml
[tool.pytest.ini_options]
minversion = "6.0"
addopts = "-ra -q"
testpaths = [
    "tests",
    "integration",
]
```

::: tip Note
One might wonder why `[tool.pytest.ini_options]` instead of `[tool.pytest]` as is the case with other tools.

The reason is that the pytest team intends to fully utilize the rich TOML data format for configuration in the future, reserving the `[tool.pytest]` table for that. The `ini_options` table is being used, for now, as a bridge between the existing `.ini` configuration system and the future configuration format.
:::

### tox.ini {#tox-ini}

`tox.ini` files are the configuration files of the [tox](https://tox.readthedocs.io/) project, and can also be used to hold pytest configuration if they have a `[pytest]` section.

```ini
# tox.ini
[pytest]
minversion = 6.0
addopts = -ra -q
testpaths =
    tests
    integration
```

### setup.cfg {#setup-cfg}

`setup.cfg` files are general purpose configuration files, used originally by distutils, and can also be used to hold pytest configuration if they have a `[tool:pytest]` section.

```ini
# setup.cfg
[tool:pytest]
minversion = 6.0
addopts = -ra -q
testpaths =
    tests
    integration
```

::: warning Warning
Usage of `setup.cfg` is not recommended unless for very simple use cases. `.cfg` files use a different parser than `pytest.ini` and `tox.ini` which might cause hard to track down problems. When possible, it is recommended to use the latter files, or `pyproject.toml`, to hold your pytest configuration.
:::

## Initialization: determining rootdir and configfile {#initialization-determining-rootdir-and-configfile}

pytest determines a `rootdir` for each test run which depends on the command line arguments (specified test files, paths) and on the existence of configuration files. The determined `rootdir` and `configfile` are printed as part of the pytest header during startup.

Here’s a summary what `pytest` uses `rootdir` for:

- Construct nodeids during collection; each test is assigned a unique nodeid which is rooted at the `rootdir` and takes into account the full path, class name, function name and parametrization (if any).

- Is used by plugins as a stable location to store project/test run specific information; for example, the internal cache plugin creates a` .pytest_cache` subdirectory in `rootdir` to store its cross-test run state.

`rootdir` is NOT used to modify `sys.path/PYTHONPATH` or influence how modules are imported. See [pytest import mechanisms and sys.path/PYTHONPATH](/python/pytest/explanation/import_mechanism#pytest-import-mechanisms-and-sys-path-pythonpath) for more details.

The `--rootdir=path` command-line option can be used to force a specific directory. Note that contrary to other command-line options, `--rootdir` cannot be used with `addopts` inside `pytest.ini` because the `rootdir` is used to find `pytest.ini` already.

### Finding the rootdir {#finding-the-rootdir}

Here is the algorithm which finds the rootdir from `args`:

- If `-c` is passed in the command-line, use that as configuration file, and its directory as `rootdir`.

- Determine the common ancestor directory for the specified `args` that are recognised as paths that exist in the file system. If no such paths are found, the common ancestor directory is set to the current working directory.

- Look for `pytest.ini`, `pyproject.toml`, `tox.ini`, and `setup.cfg` files in the ancestor directory and upwards. If one is matched, it becomes the `configfile` and its directory becomes the `rootdir`.

- If no configuration file was found, look for `setup.py` upwards from the common ancestor directory to determine the `rootdir`.

- If no `setup.py` was found, look for `pytest.ini`, `pyproject.toml`, `tox.ini`, and `setup.cfg` in each of the specified `args` and upwards. If one is matched, it becomes the `configfile` and its directory becomes the `rootdir`.

- If no `configfile` was found and no configuration argument is passed, use the already determined common ancestor as root directory. This allows the use of pytest in structures that are not part of a package and don’t have any particular configuration file.

If no `args` are given, pytest collects test below the current working directory and also starts determining the `rootdir` from there.

Files will only be matched for configuration if:

- `pytest.ini`: will always match and take precedence, even if empty.

- `pyproject.toml`: contains a `[tool.pytest.ini_options]` table.

- `tox.ini`: contains a `[pytest]` section.

- `setup.cfg`: contains a `[tool:pytest]` section.

The files are considered in the order above. Options from multiple `configfiles` candidates are never merged - the first match wins.

The `Config` object (accessible via hooks or through the `pytestconfig` fixture) will subsequently carry these attributes:

- `config.rootpath`: the determined root directory, guaranteed to exist.

- `config.inipath`: the determined `configfile`, may be `None` (it is named `inipath` for historical reasons).

*New in version 6.1*: The `config.rootpath` and `config.inipath` properties. They are `pathlib.Path` versions of the older `config.rootdir` and `config.inifile`, which have type `py.path.local`, and still exist for backward compatibility.

The `rootdir` is used as a reference directory for constructing test addresses (“nodeids”) and can be used also by plugins for storing per-testrun information.

Example:

```shell
pytest path/to/testdir path/other/
```

will determine the common ancestor as `path` and then check for configuration files as follows:

```shell
# first look for pytest.ini files
path/pytest.ini
path/pyproject.toml  # must contain a [tool.pytest.ini_options] table to match
path/tox.ini         # must contain [pytest] section to match
path/setup.cfg       # must contain [tool:pytest] section to match
pytest.ini
... # all the way up to the root

# now look for setup.py
path/setup.py
setup.py
... # all the way up to the root
```

::: warning Warning
Custom pytest plugin commandline arguments may include a path, as in `pytest --log-output ../../test.log args`. Then `args` is mandatory, otherwise pytest uses the folder of test.log for rootdir determination (see also [issue #1435](https://github.com/pytest-dev/pytest/issues/1435)). A dot `.` for referencing to the current working directory is also possible.
:::

## Builtin configuration file options {#builtin-configuration-file-options}

For the full list of options consult the [reference documentation](/python/pytest/reference_guides/api_reference/config_options#configuration-options).

## Syntax highlighting theme customization {#syntax-highlighting-theme-customization}

The syntax highlighting themes used by pytest can be customized using two environment variables:

- `PYTEST_THEME` sets a [pygment style](https://pygments.org/docs/styles/) to use.

- `PYTEST_THEME_MODE` sets this style to light or dark.

