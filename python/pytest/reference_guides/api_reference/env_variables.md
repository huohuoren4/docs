# Environment Variables

Environment variables that can be used to change pytest’s behavior.

## CI

When set (regardless of value), pytest acknowledges that is running in a CI process. Alternative to `BUILD_NUMBER` variable.

## BUILD_NUMBER

When set (regardless of value), pytest acknowledges that is running in a CI process. Alternative to CI variable.

## PYTEST_ADDOPTS

This contains a command-line (parsed by the py:mod:`shlex` module) that will be prepended to the command line given by the user, see [Builtin configuration file options](https://docs.pytest.org/en/latest/reference/customize.html#adding-default-options) for more information.

## PYTEST_CURRENT_TEST

This is not meant to be set by users, but is set by pytest internally with the name of the current test so other processes can inspect it, see [PYTEST_CURRENT_TEST environment variable](https://docs.pytest.org/en/latest/example/simple.html#pytest-current-test-env) for more information.

## PYTEST_DEBUG

When set, pytest will print tracing and debug information.

## PYTEST_DISABLE_PLUGIN_AUTOLOAD

When set, disables plugin auto-loading through setuptools entrypoints. Only explicitly specified plugins will be loaded.

## PYTEST_PLUGINS

Contains comma-separated list of modules that should be loaded as plugins:

```shell
export PYTEST_PLUGINS=mymodule.plugin,xdist
```

## PYTEST_THEME

Sets a [pygment style](https://pygments.org/docs/styles/) to use for the code output.

## PYTEST_THEME_MODE

Sets the [PYTEST_THEME](https://docs.pytest.org/en/latest/reference/reference.html#envvar-PYTEST_THEME) to be either dark or light.

## PY_COLORS

When set to `1`, pytest will use color in terminal output. When set to 0, pytest will not use color. `PY_COLORS` takes precedence over `NO_COLOR` and `FORCE_COLOR`.

## NO_COLOR

When set (regardless of value), pytest will not use color in terminal output. `PY_COLORS` takes precedence over `NO_COLOR`, which takes precedence over `FORCE_COLOR`. See no-color.org for other libraries supporting this community standard.

## FORCE_COLOR

When set (regardless of value), pytest will use color in terminal output. `PY_COLORS` and `NO_COLOR` take precedence over `FORCE_COLOR`.