# How to run doctests

By default, all files matching the `test*.txt` pattern will be run through the python standard doctest module. You can change the pattern by issuing:

```shell
pytest --doctest-glob="*.rst"
```

on the command line. `--doctest-glob` can be given multiple times in the command-line.

If you then have a text file like this:

```shell
# content of test_example.txt

hello this is a doctest
>>> x = 3
>>> x
3
```

then you can just invoke `pytest` directly:

```shell
$ pytest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 1 item

test_example.txt .                                                   [100%]

============================ 1 passed in 0.12s =============================
```

By default, pytest will collect `test*.txt` files looking for doctest directives, but you can pass additional globs using the `--doctest-glob` option (multi-allowed).

In addition to text files, you can also execute doctests directly from docstrings of your classes and functions, including from test modules:

```python
# content of mymodule.py
def something():
    """a doctest in a docstring
    >>> something()
    42
    """
    return 42
```

```shell
$ pytest --doctest-modules
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 2 items

mymodule.py .                                                        [ 50%]
test_example.txt .                                                   [100%]

============================ 2 passed in 0.12s =============================
```

You can make these changes permanent in your project by putting them into a pytest.ini file like this:

```ini
# content of pytest.ini
[pytest]
addopts = --doctest-modules
```

## Encoding

The default encoding is **UTF-8**, but you can specify the encoding that will be used for those doctest files using the `doctest_encoding` ini option:

```ini
# content of pytest.ini
[pytest]
doctest_encoding = latin1
```

## Using 'doctest' options

Python’s standard doctest module provides some options to configure the strictness of doctest tests. In pytest, you can enable those flags using the configuration file.

For example, to make pytest ignore trailing whitespaces and ignore lengthy exception stack traces you can just write:

```ini
[pytest]
doctest_optionflags = NORMALIZE_WHITESPACE IGNORE_EXCEPTION_DETAIL
```

Alternatively, options can be enabled by an inline comment in the doc test itself:

```shell
>>> something_that_raises()  # doctest: +IGNORE_EXCEPTION_DETAIL
Traceback (most recent call last):
ValueError: ...
```

pytest also introduces new options:

- `ALLOW_UNICODE`: when enabled, the u prefix is stripped from unicode strings in expected doctest output. This allows doctests to run in Python 2 and Python 3 unchanged.

- `ALLOW_BYTES`: similarly, the b prefix is stripped from byte strings in expected doctest output.

- `NUMBER`: when enabled, floating-point numbers only need to match as far as the precision you have written in the expected doctest output. The numbers are compared using pytest.approx() with relative tolerance equal to the precision. For example, the following output would only need to match to 2 decimal places when comparing `3.14` to `pytest.approx(math.pi, rel=10**-2)`:

```shell
math.pi
3.14
```

If you wrote `3.1416` then the actual output would need to match to approximately 4 decimal places; and so on.

This avoids false positives caused by limited floating-point precision, like this:

```shell
Expected:
    0.233
Got:
    0.23300000000000001
```

`NUMBER` also supports lists of floating-point numbers – in fact, it matches floating-point numbers appearing anywhere in the output, even inside a string! This means that it may not be appropriate to enable globally in `doctest_optionflags` in your configuration file.

*New in version 5.1.*

## Continue on failure

By default, pytest would report only the first failure for a given doctest. If you want to continue the test even when you have failures, do:

```shell
pytest --doctest-modules --doctest-continue-on-failure
```

## Output format

You can change the diff output format on failure for your doctests by using one of standard doctest modules format in options (see doctest.REPORT_UDIFF, doctest.REPORT_CDIFF, doctest.REPORT_NDIFF, doctest.REPORT_ONLY_FIRST_FAILURE):

```shell
pytest --doctest-modules --doctest-report none
pytest --doctest-modules --doctest-report udiff
pytest --doctest-modules --doctest-report cdiff
pytest --doctest-modules --doctest-report ndiff
pytest --doctest-modules --doctest-report only_first_failure
```

## pytest-specific features

Some features are provided to make writing doctests easier or with better integration with your existing test suite. Keep in mind however that by using those features you will make your doctests incompatible with the standard `doctests` module.

### Using fixtures

It is possible to use fixtures using the `getfixture` helper:

```shell
# content of example.rst
>>> tmp = getfixture('tmp_path')
>>> ...
>>>
```

Note that the fixture needs to be defined in a place visible by pytest, for example, a `conftest.py` file or plugin; normal python files containing docstrings are not normally scanned for fixtures unless explicitly configured by python_files.

Also, the usefixtures mark and fixtures marked as autouse are supported when executing text doctest files.

### 'doctest_namespace' fixture

The `doctest_namespace` fixture can be used to inject items into the namespace in which your doctests run. It is intended to be used within your own fixtures to provide the tests that use them with context.

`doctest_namespace` is a standard `dict` object into which you place the objects you want to appear in the doctest namespace:

```python
# content of conftest.py
import numpy


@pytest.fixture(autouse=True)
def add_np(doctest_namespace):
    doctest_namespace["np"] = numpy
which can then be used in your doctests directly:

# content of numpy.py
def arange():
    """
    >>> a = np.arange(10)
    >>> len(a)
    10
    """
```

Note that like the normal `conftest.py`, the fixtures are discovered in the directory tree conftest is in. Meaning that if you put your doctest with your source code, the relevant conftest.py needs to be in the same directory tree. Fixtures will not be discovered in a sibling directory tree!

### Skipping tests

For the same reasons one might want to skip normal tests, it is also possible to skip tests inside doctests.

To skip a single check inside a doctest you can use the standard doctest.SKIP directive:

```python
def test_random(y):
    """
    >>> random.random()  # doctest: +SKIP
    0.156231223

    >>> 1 + 1
    2
    """
```

This will skip the first check, but not the second.

pytest also allows using the standard pytest functions pytest.skip() and pytest.xfail() inside doctests, which might be useful because you can then skip/xfail tests based on external conditions:

```shell
>>> import sys, pytest
>>> if sys.platform.startswith('win'):
...     pytest.skip('this doctest does not work on Windows')
...
>>> import fcntl
>>> ...
```

However using those functions is discouraged because it reduces the readability of the docstring.

::: tip Note
pytest.skip() and pytest.xfail() behave differently depending if the doctests are in a Python file (in docstrings) or a text file containing doctests intermingled with text:

- Python modules (docstrings): the functions only act in that specific docstring, letting the other docstrings in the same module execute as normal.

- Text files: the functions will skip/xfail the checks for the rest of the entire file.
:::

## Alternatives

While the built-in pytest support provides a good set of functionalities for using doctests, if you use them extensively you might be interested in those external packages which add many more features, and include pytest integration:

- pytest-doctestplus: provides advanced doctest support and enables the testing of reStructuredText (“.rst”) files.

- Sybil: provides a way to test examples in your documentation by parsing them from the documentation source and evaluating the parsed examples as part of your normal test run.