# Global Variables {#global-variables}

pytest treats some global variables in a special manner when defined in a test module or `conftest.py` files.

## collect_ignore {#collect-ignore}

*Tutorial*: [Customizing test collection](/python/pytest/further_topics/example_trick/test_discovery#customizing-test-collection)
    
Can be declared in `conftest.py` files to exclude test directories or modules. Needs to be a list of paths (`str`, `pathlib.Path` or any `os.PathLike`).

```python
collect_ignore = ["setup.py"]
```

## collect_ignore_glob {#collect-ignore-glob}

*Tutorial*: [Customizing test collection](/python/pytest/further_topics/example_trick/test_discovery#customizing-test-collection)

Can be declared in conftest.py files to exclude test directories or modules with Unix shell-style wildcards. Needs to be `list[str]` where `str` can contain glob patterns.

```python
collect_ignore_glob = ["*_ignore.py"]
```

## pytest_plugins {#pytest-plugins}

*Tutorial*: [Requiring/Loading plugins in a test module or conftest file](/python/pytest/how_to_guides/use_plugin#requiring-loading-plugins-in-a-test-module-or-conftest-file)

Can be declared at the global level in test modules and `conftest.py` files to register additional - plugins. Can be either a `str` or `Sequence[str]`.

```python
pytest_plugins = "myapp.testsupport.myplugin"
```

```python
pytest_plugins = ("myapp.testsupport.tools", "myapp.testsupport.regression")
```

## pytestmark {#pytestmark}

*Tutorial*: [Marking whole classes or modules](/python/pytest/further_topics/example_trick/custom_mark#marking-whole-classes-or-modules)

Can be declared at the global level in test modules to apply one or more marks to all test - functions and methods. Can be either a single mark or a list of marks (applied in left-to-right - order).

```python
import pytest

pytestmark = pytest.mark.webtest
```

```python
import pytest

pytestmark = [pytest.mark.integration, pytest.mark.slow]
```