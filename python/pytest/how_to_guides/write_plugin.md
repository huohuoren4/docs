# Writing plugins {#writing-plugins}

It is easy to implement [local conftest plugins](/python/pytest/how_to_guides/write_plugin#conftest-py-local-per-directory-plugins) for your own project or [pip-installable plugins](/python/pytest/how_to_guides/write_plugin#making-your-plugin-installable-by-others) that can be used throughout many projects, including third party projects. Please refer to [How to install and use plugins](/python/pytest/how_to_guides/use_plugin#how-to-install-and-use-plugins) if you only want to use but not write plugins.

A plugin contains one or multiple hook functions. [Writing hooks](/python/pytest/how_to_guides/hook_func#writing-hook-functions) explains the basics and details of how you can write a hook function yourself. `pytest` implements all aspects of configuration, collection, running and reporting by calling well specified hooks of the following plugins:

- builtin plugins: loaded from pytest’s internal `_pytest` directory.

- [external plugins](/python/pytest/how_to_guides/use_plugin#how-to-install-and-use-plugins): modules discovered through [setuptools entry points](/python/pytest/how_to_guides/write_plugin#making-your-plugin-installable-by-others)

- [conftest.py plugins](/python/pytest/how_to_guides/write_plugin#conftest-py-local-per-directory-plugins): modules auto-discovered in test directories

In principle, each hook call is a `1:N` Python function call where N is the number of registered implementation functions for a given specification. All specifications and implementations follow the `pytest_` prefix naming convention, making them easy to distinguish and find.

## Plugin discovery order at tool startup {#plugin-discovery-order-at-tool-startup}

`pytest` loads plugin modules at tool startup in the following way:

1. by scanning the command line for the `-p no:name` option and blocking that plugin from being loaded (even builtin plugins can be blocked this way). This happens before normal command-line parsing.

2. by loading all builtin plugins.

3. by scanning the command line for the `-p name` option and loading the specified plugin. This happens before normal command-line parsing.

4. by loading all plugins registered through [setuptools entry points](/python/pytest/how_to_guides/write_plugin#making-your-plugin-installable-by-others).

5. by loading all plugins specified through the `PYTEST_PLUGINS` environment variable.

6. by loading all `conftest.py` files as inferred by the command line invocation:

   - if no test paths are specified, use the current dir as a test path

   - if exists, load `conftest.py` and `test*/conftest.py` relative to the directory part of the first test path. After the `conftest.py` file is loaded, load all plugins specified in its `pytest_plugins` variable if present.

    Note that pytest does not find `conftest.py` files in deeper nested sub directories at tool startup. It is usually a good idea to keep your `conftest.py` file in the top level test or project root directory.

7. by recursively loading all plugins specified by the `pytest_plugins` variable in `conftest.py` files.

## conftest.py: local per-directory plugins {#conftest-py-local-per-directory-plugins}

Local `conftest.py` plugins contain directory-specific hook implementations. Hook Session and test running activities will invoke all hooks defined in `conftest.py` files closer to the root of the filesystem. Example of implementing the `pytest_runtest_setup` hook so that is called for tests in the a sub directory but not for other directories:

```shell
a/conftest.py:
    def pytest_runtest_setup(item):
        # called for running each test in 'a' directory
        print("setting up", item)

a/test_sub.py:
    def test_sub():
        pass

test_flat.py:
    def test_flat():
        pass
```

Here is how you might run it:

```shell
pytest test_flat.py --capture=no  # will not show "setting up"
pytest a/test_sub.py --capture=no  # will show "setting up"
```

::: tip Note
If you have `conftest.py` files which do not reside in a python package directory (i.e. one containing an `__init__.py`) then “import conftest” can be ambiguous because there might be other `conftest.py` files as well on your `PYTHONPATH` or `sys.path`. It is thus good practice for projects to either put `conftest.py` under a package scope or to never import anything from a `conftest.py` file.

See also: [pytest import mechanisms and sys.path/PYTHONPATH](/python/pytest/explanation/import_mechanism#pytest-import-mechanisms-and-sys-path-pythonpath).
:::

::: tip Note
Some hooks should be implemented only in plugins or `conftest.py` files situated at the tests root directory due to how pytest discovers plugins during startup, see the documentation of each hook for details.
:::

## Writing your own plugin {#writing-your-own-plugin}

If you want to write a plugin, there are many real-life examples you can copy from:

- a custom collection example plugin: [A basic example for specifying tests in Yaml files](/python/pytest/further_topics/example_trick/work#a-basic-example-for-specifying-tests-in-yaml-files)

- builtin plugins which provide pytest’s own functionality

- many [external plugins](/python/pytest/reference_guides/plugin_list#plugin-list) providing additional features

All of these plugins implement hooks and/or [fixtures](/python/pytest/reference_guides/fixture_reference#fixtures-reference) to extend and add functionality.

::: tip Note
Make sure to check out the excellent [cookiecutter-pytest-plugin](https://github.com/pytest-dev/cookiecutter-pytest-plugin) project, which is a [cookiecutter template](https://github.com/audreyr/cookiecutter) for authoring plugins.

The template provides an excellent starting point with a working plugin, tests running with tox, a comprehensive README file as well as a pre-configured entry-point.
:::

Also consider [contributing your plugin to pytest-dev](/python/pytest/further_topics/contribution#submitting-plugins-to-pytest-dev) once it has some happy users other than yourself.

## Making your plugin installable by others {#making-your-plugin-installable-by-others}

If you want to make your plugin externally available, you may define a so-called entry point for your distribution so that `pytest` finds your plugin module. Entry points are a feature that is provided by [setuptools](https://setuptools.pypa.io/en/stable/index.html).

pytest looks up the `pytest11` entrypoint to discover its plugins, thus you can make your plugin available by defining it in your `pyproject.toml` file.

```ini
# sample ./pyproject.toml file
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "myproject"
classifiers = [
    "Framework :: Pytest",
]

[project.entry-points.pytest11]
myproject = "myproject.pluginmodule"
```

If a package is installed this way, `pytest` will load `myproject.pluginmodule` as a plugin which can define hooks. Confirm registration with `pytest --trace-config`

::: tip Note
Make sure to include `Framework :: Pytest` in your list of [PyPI classifiers](https://pypi.org/classifiers/) to make it easy for users to find your plugin.
:::

## Assertion Rewriting {#assertion-rewriting}

One of the main features of `pytest` is the use of plain assert statements and the detailed introspection of expressions upon assertion failures. This is provided by “assertion rewriting” which modifies the parsed AST before it gets compiled to bytecode. This is done via a [PEP 302](https://peps.python.org/pep-0302/) import hook which gets installed early on when `pytest` starts up and will perform this rewriting when modules get imported. However, since we do not want to test different bytecode from what you will run in production, this hook only rewrites test modules themselves (as defined by the `python_files` configuration option), and any modules which are part of plugins. Any other imported module will not be rewritten and normal assertion behaviour will happen.

If you have assertion helpers in other modules where you would need assertion rewriting to be enabled you need to ask `pytest` explicitly to rewrite this module before it gets imported.

- **register_assert_rewrite**(`*names`)  

    Register one or more module names to be rewritten on import.

    This function will make sure that this module or all modules inside the package will get their assert statements rewritten. Thus you should make sure to call this before the module is actually imported, usually in your `__init__.py` if you are a plugin using a package.

    *Parameters*: 

    - `names (str)` – The module names to register.

This is especially important when you write a pytest plugin which is created using a package. The import hook only treats `conftest.py` files and any modules which are listed in the `pytest11` entrypoint as plugins. As an example consider the following package:

```python
pytest_foo/__init__.py
pytest_foo/plugin.py
pytest_foo/helper.py
```

With the following typical `setup.py` extract:

```shell
setup(..., entry_points={"pytest11": ["foo = pytest_foo.plugin"]}, ...)
```

In this case only `pytest_foo/plugin.py` will be rewritten. If the helper module also contains assert statements which need to be rewritten it needs to be marked as such, before it gets imported. This is easiest by marking it for rewriting inside the `__init__.py` module, which will always be imported first when a module inside a package is imported. This way `plugin.py` can still import `helper.py` normally. The contents of `pytest_foo/__init__.py` will then need to look like this:

```python
import pytest

pytest.register_assert_rewrite("pytest_foo.helper")
```

## Requiring/Loading plugins in a test module or conftest file {#requiring-loading-plugins-in-a-test-module-or-conftest-file}

You can require plugins in a test module or a `conftest.py` file using `pytest_plugins`:

```python
pytest_plugins = ["name1", "name2"]
```

When the test module or conftest plugin is loaded the specified plugins will be loaded as well. Any module can be blessed as a plugin, including internal application modules:

```python
pytest_plugins = "myapp.testsupport.myplugin"
```

`pytest_plugins` are processed recursively, so note that in the example above if `myapp.testsupport.myplugin` also declares `pytest_plugins`, the contents of the variable will also be loaded as plugins, and so on.

::: tip Note
Requiring plugins using `pytest_plugins` variable in non-root `conftest.py` files is deprecated.

This is important because `conftest.py` files implement per-directory hook implementations, but once a plugin is imported, it will affect the entire directory tree. In order to avoid confusion, defining `pytest_plugins` in any `conftest.py` file which is not located in the tests root directory is deprecated, and will raise a warning.
:::

This mechanism makes it easy to share fixtures within applications or even external applications without the need to create external plugins using the `setuptools`’s entry point technique.

Plugins imported by `pytest_plugins` will also automatically be marked for assertion rewriting (see `pytest.register_assert_rewrite()`). However for this to have any effect the module must not be imported already; if it was already imported at the time the `pytest_plugins` statement is processed, a warning will result and assertions inside the plugin will not be rewritten. To fix this you can either call `pytest.register_assert_rewrite()` yourself before the module is imported, or you can arrange the code to delay the importing until after the plugin is registered.

## Accessing another plugin by name {#accessing-another-plugin-by-name}

If a plugin wants to collaborate with code from another plugin it can obtain a reference through the plugin manager like this:

```python
plugin = config.pluginmanager.get_plugin("name_of_plugin")
```

If you want to look at the names of existing plugins, use the `--trace-config` option.

## Registering custom markers {#registering-custom-markers}

If your plugin uses any markers, you should register them so that they appear in pytest’s help text and do not cause spurious warnings. For example, the following plugin would register `cool_marker` and `mark_with` for all users:

```python
def pytest_configure(config):
    config.addinivalue_line("markers", "cool_marker: this one is for cool tests.")
    config.addinivalue_line(
        "markers", "mark_with(arg, arg2): this marker takes arguments."
    )
```

## Testing plugins {#testing-plugins}

pytest comes with a plugin named `pytester` that helps you write tests for your plugin code. The plugin is disabled by default, so you will have to enable it before you can use it.

You can do so by adding the following line to a `conftest.py` file in your testing directory:

```python
# content of conftest.py

pytest_plugins = ["pytester"]
```

Alternatively you can invoke pytest with the `-p pytester` command line option.

This will allow you to use the `pytester` fixture for testing your plugin code.

Let’s demonstrate what you can do with the plugin with an example. Imagine we developed a plugin that provides a fixture `hello` which yields a function and we can invoke this function with one optional parameter. It will return a string value of `Hello World!` if we do not supply a value or `Hello {value}!` if we do supply a string value.

```python
import pytest


def pytest_addoption(parser):
    group = parser.getgroup("helloworld")
    group.addoption(
        "--name",
        action="store",
        dest="name",
        default="World",
        help='Default "name" for hello().',
    )


@pytest.fixture
def hello(request):
    name = request.config.getoption("name")

    def _hello(name=None):
        if not name:
            name = request.config.getoption("name")
        return f"Hello {name}!"

    return _hello
```

Now the `pytester` fixture provides a convenient API for creating temporary `conftest.py` files and test files. It also allows us to run the tests and return a result object, with which we can assert the tests’ outcomes.

```python
def test_hello(pytester):
    """Make sure that our plugin works."""

    # create a temporary conftest.py file
    pytester.makeconftest(
        """
        import pytest

        @pytest.fixture(params=[
            "Brianna",
            "Andreas",
            "Floris",
        ])
        def name(request):
            return request.param
    """
    )

    # create a temporary pytest test file
    pytester.makepyfile(
        """
        def test_hello_default(hello):
            assert hello() == "Hello World!"

        def test_hello_name(hello, name):
            assert hello(name) == "Hello {0}!".format(name)
    """
    )

    # run all tests with pytest
    result = pytester.runpytest()

    # check that all 4 tests passed
    result.assert_outcomes(passed=4)
```

Additionally it is possible to copy examples to the `pytester’s` isolated environment before running pytest on it. This way we can abstract the tested logic to separate files, which is especially useful for longer tests and/or longer `conftest.py` files.

Note that for `pytester.copy_example` to work we need to set `pytester_example_dir` in our `pytest.ini` to tell pytest where to look for example files.

```ini
# content of pytest.ini
[pytest]
pytester_example_dir = .
```

```shell
# content of test_example.py


def test_plugin(pytester):
    pytester.copy_example("test_example.py")
    pytester.runpytest("-k", "test_example")


def test_example():
    pass
```

```shell
$ pytest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
configfile: pytest.ini
collected 2 items

test_example.py ..                                                   [100%]

============================ 2 passed in 0.12s =============================
```

For more information about the result object that `runpytest()` returns, and the methods that it provides please check out the `RunResult` documentation.

