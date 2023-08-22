# How to install and use plugins {#how-to-install-and-use-plugins}

This section talks about installing and using third party plugins. For writing your own plugins, please refer to [Writing plugins](/python/pytest/how_to_guides/write_plugin#writing-plugins).

Installing a third party plugin can be easily done with `pip`:

```shell
pip install pytest-NAME
pip uninstall pytest-NAME
```

If a plugin is installed, `pytest` automatically finds and integrates it, there is no need to activate it.

Here is a little annotated list for some popular plugins:

- [pytest-django](https://pypi.org/project/pytest-django/): write tests for [django](https://docs.djangoproject.com/) apps, using pytest integration.

- [pytest-twisted](https://pypi.org/project/pytest-twisted/): write tests for [twisted](https://twistedmatrix.com/) apps, starting a reactor and processing deferreds from test functions.

- [pytest-cov](https://pypi.org/project/pytest-cov/): coverage reporting, compatible with distributed testing

- [pytest-xdist](https://pypi.org/project/pytest-xdist/): to distribute tests to CPUs and remote hosts, to run in boxed mode which allows to survive segmentation faults, to run in looponfailing mode, automatically re-running failing tests on file changes.

- [pytest-instafail](https://pypi.org/project/pytest-instafail/): to report failures while the test run is happening.

- [pytest-bdd](https://pypi.org/project/pytest-bdd/): to write tests using behaviour-driven testing.

- [pytest-timeout](https://pypi.org/project/pytest-timeout/): to timeout tests based on function marks or global definitions.

- [pytest-pep8](https://pypi.org/project/pytest-pep8/): a `--pep8` option to enable PEP8 compliance checking.

- [pytest-flakes](https://pypi.org/project/pytest-flakes/): check source code with pyflakes.

- [allure-pytest](https://pypi.org/project/allure-pytest/): report test results via [allure-framework](https://github.com/allure-framework/).

To see a complete list of all plugins with their latest testing status against different pytest and Python versions, please visit [Plugin List](/python/pytest/reference_guides/plugin_list#plugin-list).

You may also discover more plugins through a [pytest- pypi.org search](https://pypi.org/search/?q=pytest-).

## Requiring/Loading plugins in a test module or conftest file {#requiring-loading-plugins-in-a-test-module-or-conftest-file}

You can require plugins in a test module or a conftest file using `pytest_plugins`:

```python
pytest_plugins = ("myapp.testsupport.myplugin",)
```

When the test module or conftest plugin is loaded the specified plugins will be loaded as well.

::: tip Note
Requiring plugins using a `pytest_plugins` variable in non-root `conftest.py` files is deprecated. See [full explanation](/python/pytest/how_to_guides/write_plugin#requiring-loading-plugins-in-a-test-module-or-conftest-file) in the Writing plugins section.
:::

::: tip Note
The name `pytest_plugins` is reserved and should not be used as a name for a custom plugin module.
:::

## Finding out which plugins are active {#finding-out-which-plugins-are-active}

If you want to find out which plugins are active in your environment you can type:

```shell
pytest --trace-config
```

and will get an extended test header which shows activated plugins and their names. It will also print local plugins aka `conftest.py` files when they are loaded.

## Deactivating / unregistering a plugin by name {#deactivating-unregistering-a-plugin-by-name}

You can prevent plugins from loading or unregister them:

```shell
pytest -p no:NAME
```

This means that any subsequent try to activate/load the named plugin will not work.

If you want to unconditionally disable a plugin for a project, you can add this option to your `pytest.ini` file:

```ini
[pytest]
addopts = -p no:NAME
```

Alternatively to disable it only in certain environments (for example in a CI server), you can set `PYTEST_ADDOPTS` environment variable to `-p no:name`.

See [Finding out which plugins are active](/python/pytest/how_to_guides/use_plugin#finding-out-which-plugins-are-active) for how to obtain the name of a plugin.