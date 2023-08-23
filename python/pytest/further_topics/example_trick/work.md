# Working with non-python tests {#working-with-non-python-tests}

## A basic example for specifying tests in Yaml files {#a-basic-example-for-specifying-tests-in-yaml-files}

Here is an example `conftest.py` (extracted from Ali Afshar’s special purpose [pytest-yamlwsgi](https://pypi.org/project/pytest-yamlwsgi/) plugin). This `conftest.py` will collect `test*.yaml` files and will execute the yaml-formatted content as custom tests:

```python
# content of conftest.py
import pytest


def pytest_collect_file(parent, file_path):
    if file_path.suffix == ".yaml" and file_path.name.startswith("test"):
        return YamlFile.from_parent(parent, path=file_path)


class YamlFile(pytest.File):
    def collect(self):
        # We need a yaml parser, e.g. PyYAML.
        import yaml

        raw = yaml.safe_load(self.path.open(encoding="utf-8"))
        for name, spec in sorted(raw.items()):
            yield YamlItem.from_parent(self, name=name, spec=spec)


class YamlItem(pytest.Item):
    def __init__(self, *, spec, **kwargs):
        super().__init__(**kwargs)
        self.spec = spec

    def runtest(self):
        for name, value in sorted(self.spec.items()):
            # Some custom test execution (dumb example follows).
            if name != value:
                raise YamlException(self, name, value)

    def repr_failure(self, excinfo):
        """Called when self.runtest() raises an exception."""
        if isinstance(excinfo.value, YamlException):
            return "\n".join(
                [
                    "usecase execution failed",
                    "   spec failed: {1!r}: {2!r}".format(*excinfo.value.args),
                    "   no further details known at this point.",
                ]
            )
        return super().repr_failure(excinfo)

    def reportinfo(self):
        return self.path, 0, f"usecase: {self.name}"


class YamlException(Exception):
    """Custom exception for error reporting."""
```

You can create a simple example file:

```yaml
# test_simple.yaml
ok:
    sub1: sub1

hello:
    world: world
    some: other
```

and if you installed [PyYAML](https://pypi.org/project/PyYAML/) or a compatible YAML-parser you can now execute the test specification:

```shell
nonpython $ pytest test_simple.yaml
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project/nonpython
collected 2 items

test_simple.yaml F.                                                  [100%]

================================= FAILURES =================================
______________________________ usecase: hello ______________________________
usecase execution failed
   spec failed: 'some': 'other'
   no further details known at this point.
========================= short test summary info ==========================
FAILED test_simple.yaml::hello
======================= 1 failed, 1 passed in 0.12s ========================
```

You get one dot for the passing `sub1: sub1` check and one failure. Obviously in the above `conftest.py` you’ll want to implement a more interesting interpretation of the yaml-values. You can easily write your own domain specific testing language this way.

::: tip Note:
`repr_failure(excinfo)` is called for representing test failures. If you create custom collection nodes you can return an error representation string of your choice. It will be reported as a (red) string.
:::

`reportinfo()` is used for representing the test location and is also consulted when reporting in `verbose` mode:

```shell
nonpython $ pytest -v
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project/nonpython
collecting ... collected 2 items

test_simple.yaml::hello FAILED                                       [ 50%]
test_simple.yaml::ok PASSED                                          [100%]

================================= FAILURES =================================
______________________________ usecase: hello ______________________________
usecase execution failed
   spec failed: 'some': 'other'
   no further details known at this point.
========================= short test summary info ==========================
FAILED test_simple.yaml::hello
======================= 1 failed, 1 passed in 0.12s ========================
```

While developing your custom test collection and execution it’s also interesting to just look at the collection tree:

```shell
nonpython $ pytest --collect-only
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project/nonpython
collected 2 items

<Package nonpython>
  <YamlFile test_simple.yaml>
    <YamlItem hello>
    <YamlItem ok>

======================== 2 tests collected in 0.12s ========================
```
