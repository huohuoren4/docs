# Global Variables

pytest treats some global variables in a special manner when defined in a test module or `conftest.py` files.

## collect_ignore

*Tutorial*: [Customizing test collection](https://docs.pytest.org/en/latest/example/pythoncollection.html#customizing-test-collection)
    
Can be declared in `conftest.py` files to exclude test directories or modules. Needs to be a list of paths (`str`, [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) or any [os.PathLike](https://docs.python.org/3/library/os.html#os.PathLike)).

```python
collect_ignore = ["setup.py"]
```

## collect_ignore_glob

*Tutorial*: [Customizing test collection](https://docs.pytest.org/en/latest/example/pythoncollection.html#customizing-test-collection)

Can be declared in conftest.py files to exclude test directories or modules with Unix shell-style wildcards. Needs to be `list[str]` where `str` can contain glob patterns.

```python
collect_ignore_glob = ["*_ignore.py"]
```

## pytest_plugins

*Tutorial*: [Requiring/Loading plugins in a test module or conftest file](https://docs.pytest.org/en/latest/how-to/plugins.html#available-installable-plugins)

Can be declared at the global level in test modules and `conftest.py` files to register additional - plugins. Can be either a `str` or `Sequence[str]`.

```python
pytest_plugins = "myapp.testsupport.myplugin"
```

```python
pytest_plugins = ("myapp.testsupport.tools", "myapp.testsupport.regression")
```

## pytestmark

*Tutorial*: [Marking whole classes or modules](https://docs.pytest.org/en/latest/example/markers.html#scoped-marking)

Can be declared at the global level in test modules to apply one or more [marks](https://docs.pytest.org/en/latest/reference/reference.html#marks-ref) to all test - functions and methods. Can be either a single mark or a list of marks (applied in left-to-right - order).

```python
import pytest

pytestmark = pytest.mark.webtest
```

```python
import pytest

pytestmark = [pytest.mark.integration, pytest.mark.slow]
```