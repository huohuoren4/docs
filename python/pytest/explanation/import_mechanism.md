# pytest import mechanisms and `sys.path/PYTHONPATH`

## Import modes

pytest as a testing framework needs to import test modules and `conftest.py` files for execution.

Importing files in Python (at least until recently) is a non-trivial processes, often requiring changing [sys.path](https://docs.python.org/3/library/sys.html#sys.path). Some aspects of the import process can be controlled through the `--import-mode` command-line flag, which can assume these values:

- `prepend` (default): the directory path containing each module will be inserted into the beginning of `sys.path` if not already there, and then imported with the `importlib.import_module` function.

    This requires test module names to be unique when the test directory tree is not arranged in packages, because the modules will put in `sys.modules` after importing.

    This is the classic mechanism, dating back from the time Python 2 was still supported.

- `append`: the directory containing each module is appended to the end of `sys.path` if not already there, and imported with `importlib.import_module`.

    This better allows to run test modules against installed versions of a package even if the package under test has the same import root. For example:

    ```shell
    testing/__init__.py
    testing/test_pkg_under_test.py
    pkg_under_test/
    ```

    the tests will run against the installed version of `pkg_under_test` when `--import-mode=append` is used whereas with `prepend` they would pick up the local version. This kind of confusion is why we advocate for using src layouts.

    Same as `prepend`, requires test module names to be unique when the test directory tree is not arranged in packages, because the modules will put in `sys.modules` after importing.

- `importlib`: new in pytest-6.0, this mode uses more fine control mechanisms provided by `importlib` to import test modules. This gives full control over the import process, and doesn’t require changing `sys.path`.

    For this reason this doesn’t require test module names to be unique.

    One drawback however is that test modules are non-importable by each other. Also, utility modules in the tests directories are not automatically importable because the tests directory is no longer added to `sys.path`.

    Initially we intended to make `importlib` the default in future releases, however it is clear now that it has its own set of drawbacks so the default will remain `prepend` for the foreseeable future.

::: tip See also
The [pythonpath](https://docs.pytest.org/en/latest/reference/reference.html#confval-pythonpath) configuration variable.
:::

## prepend and append import modes scenarios

Here’s a list of scenarios when using `prepend` or `append` import modes where pytest needs to change `sys.path` in order to import test modules or `conftest.py` files, and the issues users might encounter because of that.

### Test modules / conftest.py files inside packages

Consider this file and directory layout:

```shell
root/
|- foo/
   |- __init__.py
   |- conftest.py
   |- bar/
      |- __init__.py
      |- tests/
         |- __init__.py
         |- test_foo.py
```

When executing:

```shell
pytest root/
```

pytest will find `foo/bar/tests/test_foo.py` and realize it is part of a package given that there’s an `__init__.py` file in the same folder. It will then search upwards until it can find the last folder which still contains an `__init__.py` file in order to find the package root (in this case foo/). To load the module, it will insert root/ to the front of `sys.path` (if not there already) in order to load test_foo.py as the module `foo.bar.tests.test_foo`.

The same logic applies to the `conftest.py` file: it will be imported as `foo.conftest` module.

Preserving the full package name is important when tests live in a package to avoid problems and allow test modules to have duplicated names. This is also discussed in details in [Conventions for Python test discovery](https://docs.pytest.org/en/latest/explanation/goodpractices.html#test-discovery).

### Standalone test modules / conftest.py files

Consider this file and directory layout:

```shell
root/
|- foo/
   |- conftest.py
   |- bar/
      |- tests/
         |- test_foo.py
```

When executing:

```shell
pytest root/
```

pytest will find `foo/bar/tests/test_foo.py` and realize it is NOT part of a package given that there’s no `__init__.py` file in the same folder. It will then add `root/foo/bar/tests` to `sys.path` in order to import `test_foo.py` as the module `test_foo`. The same is done with the `conftest.py` file by adding `root/foo` to `sys.path` to import it as `conftest`.

For this reason this layout cannot have test modules with the same name, as they all will be imported in the global import namespace.

This is also discussed in details in [Conventions for Python test discovery](https://docs.pytest.org/en/latest/explanation/goodpractices.html#test-discovery).

## Invoking pytest versus python -m pytest

Running pytest with `pytest [...]` instead of `python -m pytest [...]` yields nearly equivalent behaviour, except that the latter will add the current directory to `sys.path`, which is standard `python` behavior.

See also [Calling pytest through python -m pytest](https://docs.pytest.org/en/latest/how-to/usage.html#invoke-python).