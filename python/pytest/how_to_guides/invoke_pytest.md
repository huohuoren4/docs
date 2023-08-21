# How to invoke pytest {#how-to-invoke-pytest}

::: tip See also
[Complete pytest command-line flag reference](/python/pytest/reference_guides/api_reference/cmd_flags#command-line-flags)
:::

In general, pytest is invoked with the command `pytest` (see below for [other ways to invoke pytest](/python/pytest/how_to_guides/invoke_pytest#other-ways-of-calling-pytest)). This will execute all tests in all files whose names follow the form `test_*`.py or `\*_test.py` in the current directory and its subdirectories. More generally, pytest follows [standard test discovery rules](/python/pytest/explanation/integration_practice#conventions-for-python-test-discovery).

## Specifying which tests to run {#specifying-which-tests-to-run}

Pytest supports several ways to run and select tests from the command-line.

**Run tests in a module**

```shell
pytest test_mod.py
```

**Run tests in a directory**

```shell
pytest testing/
```

**Run tests by keyword expressions**

```shell
pytest -k 'MyClass and not method'
```

This will run tests which contain names that match the given string expression (case-insensitive), which can include Python operators that use filenames, class names and function names as variables. The example above will run T`estMyClass.test_something` but not `TestMyClass.test_method_simple`. Use `""` instead of `''` in expression when running this on Windows

**Run tests by node ids**

Each collected test is assigned a unique `nodeid` which consist of the module filename followed by specifiers like class names, function names and parameters from parametrization, separated by `::` characters.

To run a specific test within a module:

```shell
pytest test_mod.py::test_func
```

Another example specifying a test method in the command line:

```shell
pytest test_mod.py::TestClass::test_method
```

**Run tests by marker expressions**

```shell
pytest -m slow
```

Will run all tests which are decorated with the `@pytest.mark.slow` decorator.

For more information see [marks](/python/pytest/how_to_guides/mark#how-to-mark-test-functions-with-attributes).

**Run tests from packages**

```shell
pytest --pyargs pkg.testing
```

This will import `pkg.testing` and use its filesystem location to find and run tests from.

## Getting help on version, option names, environment variables {#getting-help-on-version-option-names-environment-variables}

```shell
pytest --version   # shows where pytest was imported from
pytest --fixtures  # show available builtin function arguments
pytest -h | --help # show help on command line and config file options
```

## Profiling test execution duration {#profiling-test-execution-duration}

*Changed in version 6.0.*

To get a list of the slowest 10 test durations over 1.0s long:

```shell
pytest --durations=10 --durations-min=1.0
```

By default, pytest will not show test durations that are too small (<0.005s) unless `-vv` is passed on the command-line.

## Managing loading of plugins {#managing-loading-of-plugins}

### Early loading plugins {#early-loading-plugins}

You can early-load plugins (internal and external) explicitly in the command-line with the `-p` option:

```shell
pytest -p mypluginmodule
```

The option receives a `name` parameter, which can be:

- A full module dotted name, for example `myproject.plugins`. This dotted name must be importable.
- The entry-point name of a plugin. This is the name passed to `setuptools` when the plugin is registered. For example to early-load the `pytest-cov` plugin you can use:

```shell
pytest -p pytest_cov
```

### Disabling plugins {#disabling-plugins}

To disable loading specific plugins at invocation time, use the `-p` option together with the prefix `no`:.

Example: to disable loading the plugin `doctest`, which is responsible for executing doctest tests from text files, invoke pytest like this:

```shell
pytest -p no:doctest
```

## Other ways of calling pytest {#other-ways-of-calling-pytest}

### Calling pytest through python -m pytest {#calling-pytest-through-python-m-pytest}

You can invoke testing through the Python interpreter from the command line:

```shell
python -m pytest [...]
```

This is almost equivalent to invoking the command line script `pytest [...]` directly, except that calling via `python` will also add the current directory to `sys.path`.

### Calling pytest from Python code {#calling-pytest-from-python-code}

You can invoke `pytest` from Python code directly:

```shell
retcode = pytest.main()
```

this acts as if you would call “pytest” from the command line. It will not raise `SystemExit` but return the `exit code` instead. You can pass in options and arguments:

```shell
retcode = pytest.main(["-x", "mytestdir"])
```

You can specify additional plugins to `pytest.main`:

```python
# content of myinvoke.py
import sys

import pytest


class MyPlugin:
    def pytest_sessionfinish(self):
        print("*** test run reporting finishing")


if __name__ == "__main__":
    sys.exit(pytest.main(["-qq"], plugins=[MyPlugin()]))
```

Running it will show that `MyPlugin` was added and its hook was invoked:

```shell
$ python myinvoke.py
*** test run reporting finishing
```

::: tip Note
Calling `pytest.main()` will result in importing your tests and any modules that they import. Due to the caching mechanism of python’s import system, making subsequent calls to `pytest.main()` from the same process will not reflect changes to those files between the calls. For this reason, making multiple calls to `pytest.main()` from the same process (in order to re-run tests, for example) is not recommended.
:::

