# How to run tests written for nose {#how-to-run-tests-written-for-nose}

`pytest` has basic support for running tests written for [nose](https://nose.readthedocs.io/en/latest/).

::: warning Warning
This functionality has been deprecated and is likely to be removed in `pytest 8.x`.
:::

## Usage {#usage}
After [Install pytest](/python/pytest/get_started#install-pytest) type:

```shell
python setup.py develop  # make sure tests can import our package
pytest  # instead of 'nosetests'
```

and you should be able to run your nose style tests and make use of pytest’s capabilities.

## Supported nose Idioms {#supported-nose-idioms}

- `setup()` and `teardown()` at module/class/method level: any function or method called `setup` will be called during the setup phase for each test, same for `teardown`.

- `SkipTest` exceptions and markers

- setup/teardown decorators

- `__test__` attribute on modules/classes/functions

- general usage of nose utilities

## Unsupported idioms / known issues {#unsupported-idioms-known-issues}

- unittest-style `setUp, tearDown, setUpClass, tearDownClass` are recognized only on `unittest.TestCase` classes but not on plain classes. `nose` supports these methods also on plain classes but pytest deliberately does not. As `nose` and pytest already both support `setup_class, teardown_class, setup_method, teardown_method` it doesn’t seem useful to duplicate the unittest-API like nose does. If you however rather think pytest should support the unittest-spelling on plain classes please post to [issue #377](https://github.com/pytest-dev/pytest/issues/377).

- nose imports test modules with the same import path (e.g. `tests.test_mode`) but different file system paths (e.g. `tests/test_mode.py` and `other/tests/test_mode.py`) by extending sys.path/import semantics. pytest does not do that. Note that [nose2 choose to avoid this sys.path/import hackery](https://nose2.readthedocs.io/en/latest/differences.html#test-discovery-and-loading).

    If you place a conftest.py file in the root directory of your project (as determined by pytest) pytest will run tests “nose style” against the code below that directory by adding it to your `sys.path` instead of running against your installed code.

    You may find yourself wanting to do this if you ran `python setup.py install` to set up your project, as opposed to `python setup.py develop` or any of the package manager equivalents. Installing with develop in a virtual environment like tox is recommended over this pattern.

- nose-style doctests are not collected and executed correctly, also doctest fixtures don’t work.

- no nose-configuration is recognized.

- `yield`-based methods are fundamentally incompatible with pytest because they don’t support fixtures properly since collection and test execution are separated.

Here is a table comparing the default supported naming conventions for both nose and pytest.

| what   | default naming convention | pytest | nose |
| :----- | :------------------------ | :----- | :--- |
| module | `test*.py`                  |        | ✅    |
| module | `test_*.py`                | ✅      | ✅    |
| module | `*_test.py`                | ✅      |      |
| module | `*_tests.py`                |        |      |
| class  | `*(unittest.TestCase)`      | ✅      | ✅    |
| method | `test_*.py`                 | ✅      | ✅    |
| class  | `Test*.py`                  | ✅      |      |
| method | `test_*.py`                 | ✅      |      |
| method | `test_*.py`                 | ✅      |      |


## Migrating from nose to pytest {#migrating-from-nose-to-pytest}

[nose2pytest](https://github.com/pytest-dev/nose2pytest) is a Python script and pytest plugin to help convert Nose-based tests into pytest-based tests. Specifically, the script transforms `nose.tools.assert_*` function calls into raw assert statements, while preserving format of original arguments as much as possible.