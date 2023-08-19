# Get Started

## Install pytest

pytest requires: `Python 3.7+` or `PyPy3`.

1. Run the following command in your command line:

```shell
pip install -U pytest
```
2. Check that you installed the correct version:

```shell
$ pytest --version
pytest 7.4.0
```

## Create your first test

Create a new file called `test_sample.py`, containing a function, and a test:

```python
# content of test_sample.py
def func(x):
    return x + 1


def test_answer():
    assert func(3) == 5
```

The test

```shell
$ pytest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 1 item

test_sample.py F                                                     [100%]

================================= FAILURES =================================
_______________________________ test_answer ________________________________

    def test_answer():
>       assert func(3) == 5
E       assert 4 == 5
E        +  where 4 = func(3)

test_sample.py:6: AssertionError
========================= short test summary info ==========================
FAILED test_sample.py::test_answer - assert 4 == 5
============================ 1 failed in 0.12s =============================
```

The [`100%`] refers to the overall progress of running all test cases. After it finishes, pytest then shows a failure report because `func(3)` does not return `5`.

::: tip Note
You can use the `assert` statement to verify test expectations. pytest's [Advanced assertion introspection](https://docs.python.org/3/reference/simple_stmts.html#assert) will intelligently report intermediate values of the assert expression so you can avoid the many names of [JUnit legacy methods](https://docs.python.org/3/library/unittest.html#testcase-objects).
:::

## Run multiple tests

pytest will run all files of the form `test_*.py` or `*_test.py` in the current directory and its subdirectories. More generally, it follows [standard test discovery rules](/python/pytest/explanation/integration_practice#conventions-for-python-test-discovery).

## Assert that a certain exception is raised

Use the `raises` helper to assert that some code raises an exception:

```python
# content of test_sysexit.py
import pytest


def f():
    raise SystemExit(1)


def test_mytest():
    with pytest.raises(SystemExit):
        f()
```

Execute the test function with “quiet” reporting mode:

```shell
$ pytest -q test_sysexit.py
.                                                                    [100%]
1 passed in 0.12s
```

::: tip Note
The `-q/--quiet` flag keeps the output brief in this and following examples.
:::

## Group multiple tests in a class

Once you develop multiple tests, you may want to group them into a class. pytest makes it easy to create a class containing more than one test:

```python
# content of test_class.py
class TestClass:
    def test_one(self):
        x = "this"
        assert "h" in x

    def test_two(self):
        x = "hello"
        assert hasattr(x, "check")
```

pytest discovers all tests following its [Conventions for Python test discovery](/python/pytest/explanation/integration_practice#conventions-for-python-test-discovery), so it finds both `test_` prefixed functions. There is no need to subclass anything, but make sure to prefix your class with `Test` otherwise the class will be skipped. We can simply run the module by passing its filename:

```shell
$ pytest -q test_class.py
.F                                                                   [100%]
================================= FAILURES =================================
____________________________ TestClass.test_two ____________________________

self = <test_class.TestClass object at 0xdeadbeef0001>

    def test_two(self):
        x = "hello"
>       assert hasattr(x, "check")
E       AssertionError: assert False
E        +  where False = hasattr('hello', 'check')

test_class.py:8: AssertionError
========================= short test summary info ==========================
FAILED test_class.py::TestClass::test_two - AssertionError: assert False
1 failed, 1 passed in 0.12s
```

The first test passed and the second failed. You can easily see the intermediate values in the assertion to help you understand the reason for the failure.

Grouping tests in classes can be beneficial for the following reasons:

- Test organization
- Sharing fixtures for tests only in that particular class
- Applying marks at the class level and having them implicitly apply to all tests

Something to be aware of when grouping tests inside classes is that each test has a unique instance of the class. Having each test share the same class instance would be very detrimental to test isolation and would promote poor test practices. This is outlined below:

```python
# content of test_class_demo.py
class TestClassDemoInstance:
    value = 0

    def test_one(self):
        self.value = 1
        assert self.value == 1

    def test_two(self):
        assert self.value == 1
```

```shell
$ pytest -k TestClassDemoInstance -q
.F                                                                   [100%]
================================= FAILURES =================================
______________________ TestClassDemoInstance.test_two ______________________

self = <test_class_demo.TestClassDemoInstance object at 0xdeadbeef0002>

    def test_two(self):
>       assert self.value == 1
E       assert 0 == 1
E        +  where 0 = <test_class_demo.TestClassDemoInstance object at 0xdeadbeef0002>.value

test_class_demo.py:9: AssertionError
========================= short test summary info ==========================
FAILED test_class_demo.py::TestClassDemoInstance::test_two - assert 0 == 1
1 failed, 1 passed in 0.12s
```

Note that attributes added at class level are class attributes, so they will be shared between tests.

## Request a unique temporary directory for functional tests

pytest provides [Builtin fixtures/function arguments](/python/pytest/other/builtin) to request arbitrary resources, like a unique temporary directory:

```python
# content of test_tmp_path.py
def test_needsfiles(tmp_path):
    print(tmp_path)
    assert 0
```

List the name `tmp_path` in the test function signature and `pytest` will lookup and call a fixture factory to create the resource before performing the test function call. Before the test runs, `pytest` creates a unique-per-test-invocation temporary directory:

```shell
$ pytest -q test_tmp_path.py
F                                                                    [100%]
================================= FAILURES =================================
_____________________________ test_needsfiles ______________________________

tmp_path = PosixPath('PYTEST_TMPDIR/test_needsfiles0')

    def test_needsfiles(tmp_path):
        print(tmp_path)
>       assert 0
E       assert 0

test_tmp_path.py:3: AssertionError
--------------------------- Captured stdout call ---------------------------
PYTEST_TMPDIR/test_needsfiles0
========================= short test summary info ==========================
FAILED test_tmp_path.py::test_needsfiles - assert 0
1 failed in 0.12s
```

More info on temporary directory handling is available at [Temporary directories and files](/python/pytest/how_to_guides/temp#how-to-use-temporary-directories-and-files-in-tests).

Find out what kind of builtin [pytest fixtures](/python/pytest/reference_guides/fixture_reference#fixtures-reference) exist with the command:

```shell
pytest --fixtures   # shows builtin and custom fixtures
```

Note that this command omits fixtures with leading `_` unless the `-v` option is added.

## Continue reading

Check out additional pytest resources to help you customize tests for your unique workflow:

- “[How to invoke pytest](/python/pytest/how_to_guides/invoke_pytest#how-to-invoke-pytest)” for command line invocation examples
- “[How to use pytest with an existing test suite](/python/pytest/how_to_guides/test_suite#how-to-use-pytest-with-an-existing-test-suite)” for working with pre-existing tests
- “[How to mark test functions with attributes](/python/pytest/how_to_guides/mark#how-to-mark-test-functions-with-attributes)” for information on the `pytest.mark` mechanism
- “[Fixtures reference](/python/pytest/reference_guides/fixture_reference#fixtures-reference)” for providing a functional baseline to your tests
- “[Writing plugins](/python/pytest/how_to_guides/write_plugin#writing-plugins)” for managing and writing plugins
- “[Good Integration Practices](/python/pytest/explanation/integration_practice#good-integration-practices)” for virtualenv and test layouts