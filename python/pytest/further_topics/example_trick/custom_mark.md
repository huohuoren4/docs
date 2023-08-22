# Working with custom markers

Here are some examples using the [How to mark test functions with attributes](https://docs.pytest.org/en/latest/how-to/mark.html#mark) mechanism.

## Marking test functions and selecting them for a run

You can “mark” a test function with custom metadata like this:

```python
# content of test_server.py

import pytest


@pytest.mark.webtest
def test_send_http():
    pass  # perform some webtest test for your app


def test_something_quick():
    pass


def test_another():
    pass


class TestClass:
    def test_method(self):
        pass
```

You can then restrict a test run to only run tests marked with `webtest`:

```shell
$ pytest -v -m webtest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 4 items / 3 deselected / 1 selected

test_server.py::test_send_http PASSED                                [100%]

===================== 1 passed, 3 deselected in 0.12s ======================
```

Or the inverse, running all tests except the webtest ones:

```shell
$ pytest -v -m "not webtest"
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 4 items / 1 deselected / 3 selected

test_server.py::test_something_quick PASSED                          [ 33%]
test_server.py::test_another PASSED                                  [ 66%]
test_server.py::TestClass::test_method PASSED                        [100%]

===================== 3 passed, 1 deselected in 0.12s ======================
```

## Selecting tests based on their node ID

You can provide one or more node IDs as positional arguments to select only specified tests. This makes it easy to select tests based on their module, class, method, or function name:

```shell
$ pytest -v test_server.py::TestClass::test_method
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 1 item

test_server.py::TestClass::test_method PASSED                        [100%]

============================ 1 passed in 0.12s =============================
```

You can also select on the class:

```shell
$ pytest -v test_server.py::TestClass
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 1 item

test_server.py::TestClass::test_method PASSED                        [100%]

============================ 1 passed in 0.12s =============================
```

Or select multiple nodes:

```shell
$ pytest -v test_server.py::TestClass test_server.py::test_send_http
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 2 items

test_server.py::TestClass::test_method PASSED                        [ 50%]
test_server.py::test_send_http PASSED                                [100%]

============================ 2 passed in 0.12s =============================
```

::: tip Note:
Node IDs are of the form `module.py::class::method` or `module.py::function`. Node IDs control which tests are collected, so `module.py::class` will select all test methods on the class. Nodes are also created for each parameter of a parametrized fixture or test, so selecting a parametrized test must include the parameter value, e.g. `module.py::function[param]`.

Node IDs for failing tests are displayed in the test summary info when running pytest with the -rf option. You can also construct Node IDs from the output of `pytest --collectonly`.
:::

## Using `-k expr` to select tests based on their name

*New in version 2.0/2.3.4.*

You can use the `-k` command line option to specify an expression which implements a substring match on the test names instead of the exact match on markers that `-m` provides. This makes it easy to select tests based on their names:

*Changed in version 5.4.*

The expression matching is now case-insensitive.

```shell
$ pytest -v -k http  # running with the above defined example module
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 4 items / 3 deselected / 1 selected

test_server.py::test_send_http PASSED                                [100%]

===================== 1 passed, 3 deselected in 0.12s ======================
```

And you can also run all tests except the ones that match the keyword:

```shell
$ pytest -k "not send_http" -v
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 4 items / 1 deselected / 3 selected

test_server.py::test_something_quick PASSED                          [ 33%]
test_server.py::test_another PASSED                                  [ 66%]
test_server.py::TestClass::test_method PASSED                        [100%]

===================== 3 passed, 1 deselected in 0.12s ======================
```

Or to select “http” and “quick” tests:

```shell
$ pytest -k "http or quick" -v
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y -- $PYTHON_PREFIX/bin/python
cachedir: .pytest_cache
rootdir: /home/sweet/project
collecting ... collected 4 items / 2 deselected / 2 selected

test_server.py::test_send_http PASSED                                [ 50%]
test_server.py::test_something_quick PASSED                          [100%]

===================== 2 passed, 2 deselected in 0.12s ======================
```

You can use `and`, `or`, `not` and parentheses.

In addition to the test’s name, `-k` also matches the names of the test’s parents (usually, the name of the file and class it’s in), attributes set on the test function, markers applied to it or its parents and any extra keywords explicitly added to it or its parents.

## Registering markers

Registering markers for your test suite is simple:

```ini
# content of pytest.ini
[pytest]
markers =
    webtest: mark a test as a webtest.
    slow: mark test as slow.
```

Multiple custom markers can be registered, by defining each one in its own line, as shown in above example.

You can ask which markers exist for your test suite - the list includes our just defined `webtest` and `slow` markers:

```shell
$ pytest --markers
@pytest.mark.webtest: mark a test as a webtest.

@pytest.mark.slow: mark test as slow.

@pytest.mark.filterwarnings(warning): add a warning filter to the given test. see https://docs.pytest.org/en/stable/how-to/capture-warnings.html#pytest-mark-filterwarnings

@pytest.mark.skip(reason=None): skip the given test function with an optional reason. Example: skip(reason="no way of currently testing this") skips the test.

@pytest.mark.skipif(condition, ..., *, reason=...): skip the given test function if any of the conditions evaluate to True. Example: skipif(sys.platform == 'win32') skips the test if we are on the win32 platform. See https://docs.pytest.org/en/stable/reference/reference.html#pytest-mark-skipif

@pytest.mark.xfail(condition, ..., *, reason=..., run=True, raises=None, strict=xfail_strict): mark the test function as an expected failure if any of the conditions evaluate to True. Optionally specify a reason for better reporting and run=False if you don't even want to execute the test function. If only specific exception(s) are expected, you can list them in raises, and if the test fails in other ways, it will be reported as a true failure. See https://docs.pytest.org/en/stable/reference/reference.html#pytest-mark-xfail

@pytest.mark.parametrize(argnames, argvalues): call a test function multiple times passing in different arguments in turn. argvalues generally needs to be a list of values if argnames specifies only one name or a list of tuples of values if argnames specifies multiple names. Example: @parametrize('arg1', [1,2]) would lead to two calls of the decorated test function, one with arg1=1 and another with arg1=2.see https://docs.pytest.org/en/stable/how-to/parametrize.html for more info and examples.

@pytest.mark.usefixtures(fixturename1, fixturename2, ...): mark tests as needing all of the specified fixtures. see https://docs.pytest.org/en/stable/explanation/fixtures.html#usefixtures

@pytest.mark.tryfirst: mark a hook implementation function such that the plugin machinery will try to call it first/as early as possible. DEPRECATED, use @pytest.hookimpl(tryfirst=True) instead.

@pytest.mark.trylast: mark a hook implementation function such that the plugin machinery will try to call it last/as late as possible. DEPRECATED, use @pytest.hookimpl(trylast=True) instead.
```

For an example on how to add and work with markers from a plugin, see [Custom marker and command line option to control test runs](https://docs.pytest.org/en/latest/example/markers.html#adding-a-custom-marker-from-a-plugin).

::: tip Note:
It is recommended to explicitly register markers so that:

- There is one place in your test suite defining your markers

- Asking for existing markers via `pytest --markers` gives good output

- Typos in function markers are treated as an error if you use the `--strict-markers` option.
:::

## Marking whole classes or modules

You may use `pytest.mark` decorators with classes to apply markers to all of its test methods:

```python
# content of test_mark_classlevel.py
import pytest


@pytest.mark.webtest
class TestClass:
    def test_startup(self):
        pass

    def test_startup_and_more(self):
        pass
```

This is equivalent to directly applying the decorator to the two test functions.

To apply marks at the module level, use the `pytestmark` global variable:

```python
import pytest
pytestmark = pytest.mark.webtest
```

or multiple markers:

```python
pytestmark = [pytest.mark.webtest, pytest.mark.slowtest]
```

Due to legacy reasons, before class decorators were introduced, it is possible to set the `pytestmark` attribute on a test class like this:

```python
import pytest


class TestClass:
    pytestmark = pytest.mark.webtest
```

## Marking individual tests when using parametrize

When using parametrize, applying a mark will make it apply to each individual test. However it is also possible to apply a marker to an individual test instance:

```python
import pytest


@pytest.mark.foo
@pytest.mark.parametrize(
    ("n", "expected"), [(1, 2), pytest.param(1, 3, marks=pytest.mark.bar), (2, 3)]
)
def test_increment(n, expected):
    assert n + 1 == expected
```

In this example the mark “foo” will apply to each of the three tests, whereas the “bar” mark is only applied to the second test. Skip and xfail marks can also be applied in this way, see [Skip/xfail with parametrize](https://docs.pytest.org/en/latest/how-to/skipping.html#skip-xfail-with-parametrize).

## Custom marker and command line option to control test runs

Plugins can provide custom markers and implement specific behaviour based on it. This is a self-contained example which adds a command line option and a parametrized test function marker to run tests specified via named environments:

```python
# content of conftest.py

import pytest


def pytest_addoption(parser):
    parser.addoption(
        "-E",
        action="store",
        metavar="NAME",
        help="only run tests matching the environment NAME.",
    )


def pytest_configure(config):
    # register an additional marker
    config.addinivalue_line(
        "markers", "env(name): mark test to run only on named environment"
    )


def pytest_runtest_setup(item):
    envnames = [mark.args[0] for mark in item.iter_markers(name="env")]
    if envnames:
        if item.config.getoption("-E") not in envnames:
            pytest.skip(f"test requires env in {envnames!r}")
```

A test file using this local plugin:

```python
# content of test_someenv.py

import pytest


@pytest.mark.env("stage1")
def test_basic_db_operation():
    pass
```

and an example invocations specifying a different environment than what the test needs:

```python
$ pytest -E stage2
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 1 item

test_someenv.py s                                                    [100%]

============================ 1 skipped in 0.12s ============================
```

and here is one that specifies exactly the environment needed:

```shell
$ pytest -E stage1
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 1 item

test_someenv.py .                                                    [100%]

============================ 1 passed in 0.12s =============================
```

The `--markers` option always gives you a list of available markers:

```shell
$ pytest --markers
@pytest.mark.env(name): mark test to run only on named environment

@pytest.mark.filterwarnings(warning): add a warning filter to the given test. see https://docs.pytest.org/en/stable/how-to/capture-warnings.html#pytest-mark-filterwarnings

@pytest.mark.skip(reason=None): skip the given test function with an optional reason. Example: skip(reason="no way of currently testing this") skips the test.

@pytest.mark.skipif(condition, ..., *, reason=...): skip the given test function if any of the conditions evaluate to True. Example: skipif(sys.platform == 'win32') skips the test if we are on the win32 platform. See https://docs.pytest.org/en/stable/reference/reference.html#pytest-mark-skipif

@pytest.mark.xfail(condition, ..., *, reason=..., run=True, raises=None, strict=xfail_strict): mark the test function as an expected failure if any of the conditions evaluate to True. Optionally specify a reason for better reporting and run=False if you don't even want to execute the test function. If only specific exception(s) are expected, you can list them in raises, and if the test fails in other ways, it will be reported as a true failure. See https://docs.pytest.org/en/stable/reference/reference.html#pytest-mark-xfail

@pytest.mark.parametrize(argnames, argvalues): call a test function multiple times passing in different arguments in turn. argvalues generally needs to be a list of values if argnames specifies only one name or a list of tuples of values if argnames specifies multiple names. Example: @parametrize('arg1', [1,2]) would lead to two calls of the decorated test function, one with arg1=1 and another with arg1=2.see https://docs.pytest.org/en/stable/how-to/parametrize.html for more info and examples.

@pytest.mark.usefixtures(fixturename1, fixturename2, ...): mark tests as needing all of the specified fixtures. see https://docs.pytest.org/en/stable/explanation/fixtures.html#usefixtures

@pytest.mark.tryfirst: mark a hook implementation function such that the plugin machinery will try to call it first/as early as possible. DEPRECATED, use @pytest.hookimpl(tryfirst=True) instead.

@pytest.mark.trylast: mark a hook implementation function such that the plugin machinery will try to call it last/as late as possible. DEPRECATED, use @pytest.hookimpl(trylast=True) instead.
```

## Passing a callable to custom markers

Below is the config file that will be used in the next examples:

```python
# content of conftest.py
import sys


def pytest_runtest_setup(item):
    for marker in item.iter_markers(name="my_marker"):
        print(marker)
        sys.stdout.flush()
```

A custom marker can have its argument set, i.e. `args` and `kwargs` properties, defined by either invoking it as a callable or using `pytest.mark.MARKER_NAME.with_args`. These two methods achieve the same effect most of the time.

However, if there is a callable as the single positional argument with no keyword arguments, using the `pytest.mark.MARKER_NAME(c)` will not pass `c` as a positional argument but decorate `c` with the custom marker (see [MarkDecorator](https://docs.pytest.org/en/latest/how-to/mark.html#mark)). Fortunately, `pytest.mark.MARKER_NAME.with_args` comes to the rescue:

```python
# content of test_custom_marker.py
import pytest


def hello_world(*args, **kwargs):
    return "Hello World"


@pytest.mark.my_marker.with_args(hello_world)
def test_with_args():
    pass
```

The output is as follows:

```shell
$ pytest -q -s
Mark(name='my_marker', args=(<function hello_world at 0xdeadbeef0001>,), kwargs={})
.
1 passed in 0.12s
```

We can see that the custom marker has its argument set extended with the function `hello_world`. This is the key difference between creating a custom marker as a callable, which invokes `__call__` behind the scenes, and using `with_args`.

## Reading markers which were set from multiple places

If you are heavily using markers in your test suite you may encounter the case where a marker is applied several times to a test function. From plugin code you can read over all such settings. Example:

```python
# content of test_mark_three_times.py
import pytest

pytestmark = pytest.mark.glob("module", x=1)


@pytest.mark.glob("class", x=2)
class TestClass:
    @pytest.mark.glob("function", x=3)
    def test_something(self):
        pass
```

Here we have the marker “glob” applied three times to the same test function. From a conftest file we can read it like this:

```python
# content of conftest.py
import sys


def pytest_runtest_setup(item):
    for mark in item.iter_markers(name="glob"):
        print(f"glob args={mark.args} kwargs={mark.kwargs}")
        sys.stdout.flush()
```

Let’s run this without capturing output and see what we get:

```shell
$ pytest -q -s
glob args=('function',) kwargs={'x': 3}
glob args=('class',) kwargs={'x': 2}
glob args=('module',) kwargs={'x': 1}
.
1 passed in 0.12s
```

## Marking platform specific tests with pytest

Consider you have a test suite which marks tests for particular platforms, namely `pytest.mark.darwin`, `pytest.mark.win32` etc. and you also have tests that run on all platforms and have no specific marker. If you now want to have a way to only run the tests for your particular platform, you could use the following plugin:

```python
# content of conftest.py
#
import sys

import pytest

ALL = set("darwin linux win32".split())


def pytest_runtest_setup(item):
    supported_platforms = ALL.intersection(mark.name for mark in item.iter_markers())
    plat = sys.platform
    if supported_platforms and plat not in supported_platforms:
        pytest.skip(f"cannot run on platform {plat}")
```

then tests will be skipped if they were specified for a different platform. Let’s do a little test file to show how this looks like:

```python
# content of test_plat.py

import pytest


@pytest.mark.darwin
def test_if_apple_is_evil():
    pass


@pytest.mark.linux
def test_if_linux_works():
    pass


@pytest.mark.win32
def test_if_win32_crashes():
    pass


def test_runs_everywhere():
    pass
```

then you will see two tests skipped and two executed tests as expected:

```shell
$ pytest -rs # this option reports skip reasons
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 4 items

test_plat.py s.s.                                                    [100%]

========================= short test summary info ==========================
SKIPPED [2] conftest.py:13: cannot run on platform linux
======================= 2 passed, 2 skipped in 0.12s =======================
```

Note that if you specify a platform via the marker-command line option like this:

```shell
$ pytest -m linux
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 4 items / 3 deselected / 1 selected

test_plat.py .                                                       [100%]

===================== 1 passed, 3 deselected in 0.12s ======================
```

then the unmarked-tests will not be run. It is thus a way to restrict the run to the specific tests.

## Automatically adding markers based on test names

If you have a test suite where test function names indicate a certain type of test, you can implement a hook that automatically defines markers so that you can use the `-m` option with it. Let’s look at this test module:

```python
# content of test_module.py


def test_interface_simple():
    assert 0


def test_interface_complex():
    assert 0


def test_event_simple():
    assert 0


def test_something_else():
    assert 0
```

We want to dynamically define two markers and can do it in a `conftest.py` plugin:

```python
# content of conftest.py

import pytest


def pytest_collection_modifyitems(items):
    for item in items:
        if "interface" in item.nodeid:
            item.add_marker(pytest.mark.interface)
        elif "event" in item.nodeid:
            item.add_marker(pytest.mark.event)
```

We can now use the `-m option` to select one set:

```shell
$ pytest -m interface --tb=short
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 4 items / 2 deselected / 2 selected

test_module.py FF                                                    [100%]

================================= FAILURES =================================
__________________________ test_interface_simple ___________________________
test_module.py:4: in test_interface_simple
    assert 0
E   assert 0
__________________________ test_interface_complex __________________________
test_module.py:8: in test_interface_complex
    assert 0
E   assert 0
========================= short test summary info ==========================
FAILED test_module.py::test_interface_simple - assert 0
FAILED test_module.py::test_interface_complex - assert 0
===================== 2 failed, 2 deselected in 0.12s ======================
```

or to select both “event” and “interface” tests:

```shell
$ pytest -m "interface or event" --tb=short
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 4 items / 1 deselected / 3 selected

test_module.py FFF                                                   [100%]

================================= FAILURES =================================
__________________________ test_interface_simple ___________________________
test_module.py:4: in test_interface_simple
    assert 0
E   assert 0
__________________________ test_interface_complex __________________________
test_module.py:8: in test_interface_complex
    assert 0
E   assert 0
____________________________ test_event_simple _____________________________
test_module.py:12: in test_event_simple
    assert 0
E   assert 0
========================= short test summary info ==========================
FAILED test_module.py::test_interface_simple - assert 0
FAILED test_module.py::test_interface_complex - assert 0
FAILED test_module.py::test_event_simple - assert 0
===================== 3 failed, 1 deselected in 0.12s ======================
```