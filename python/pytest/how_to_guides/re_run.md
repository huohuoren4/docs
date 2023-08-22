# How to re-run failed tests and maintain state between test runs {#how-to-re-run-failed-tests-and-maintain-state-between-test-runs}

## Usage {#usage}

The plugin provides two command line options to rerun failures from the last `pytest` invocation:

- `--lf`, `--last-failed` - to only re-run the failures.

- `--ff`, `--failed-first` - to run the failures first and then the rest of the tests.

For cleanup (usually not needed), a `--cache-clear` option allows to remove all cross-session cache contents ahead of a test run.

Other plugins may access the config.cache object to set/get json encodable values between `pytest` invocations.

::: tip Note
This plugin is enabled by default, but can be disabled if needed: see [Deactivating / unregistering a plugin by name](/python/pytest/how_to_guides/use_plugin#deactivating-unregistering-a-plugin-by-name) (the internal name for this plugin is `cacheprovider`).
::: 

## Rerunning only failures or failures first {#rerunning-only-failures-or-failures-first}

First, let’s create 50 test invocation of which only 2 fail:

```python
# content of test_50.py
import pytest


@pytest.mark.parametrize("i", range(50))
def test_num(i):
    if i in (17, 25):
        pytest.fail("bad luck")
```

If you run this for the first time you will see two failures:

```shell
$ pytest -q
.................F.......F........................                   [100%]
================================= FAILURES =================================
_______________________________ test_num[17] _______________________________

i = 17

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
_______________________________ test_num[25] _______________________________

i = 25

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
========================= short test summary info ==========================
FAILED test_50.py::test_num[17] - Failed: bad luck
FAILED test_50.py::test_num[25] - Failed: bad luck
2 failed, 48 passed in 0.12s
```

If you then run it with `--lf`:

```shell
$ pytest --lf
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 2 items
run-last-failure: rerun previous 2 failures

test_50.py FF                                                        [100%]

================================= FAILURES =================================
_______________________________ test_num[17] _______________________________

i = 17

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
_______________________________ test_num[25] _______________________________

i = 25

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
========================= short test summary info ==========================
FAILED test_50.py::test_num[17] - Failed: bad luck
FAILED test_50.py::test_num[25] - Failed: bad luck
============================ 2 failed in 0.12s =============================
```

You have run only the two failing tests from the last run, while the 48 passing tests have not been run (“deselected”).

Now, if you run with the `--ff` option, all tests will be run but the first previous failures will be executed first (as can be seen from the series of `FF` and dots):

```shell
$ pytest --ff
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 50 items
run-last-failure: rerun previous 2 failures first

test_50.py FF................................................        [100%]

================================= FAILURES =================================
_______________________________ test_num[17] _______________________________

i = 17

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
_______________________________ test_num[25] _______________________________

i = 25

    @pytest.mark.parametrize("i", range(50))
    def test_num(i):
        if i in (17, 25):
>           pytest.fail("bad luck")
E           Failed: bad luck

test_50.py:7: Failed
========================= short test summary info ==========================
FAILED test_50.py::test_num[17] - Failed: bad luck
FAILED test_50.py::test_num[25] - Failed: bad luck
======================= 2 failed, 48 passed in 0.12s =======================
```

New `--nf`, `--new-first` options: run new tests first followed by the rest of the tests, in both cases tests are also sorted by the file modified time, with more recent files coming first.

## Behavior when no tests failed in the last run {#behavior-when-no-tests-failed-in-the-last-run}

When no tests failed in the last run, or when no cached `lastfailed` data was found, pytest can be configured either to run all of the tests or no tests, using the `--last-failed-no-failures` option, which takes one of the following values:

```shell
pytest --last-failed --last-failed-no-failures all    # run all tests (default behavior)
pytest --last-failed --last-failed-no-failures none   # run no tests and exit
```

## The new config.cache object {#the-new-config-cache-object}

Plugins or `conftest.py` support code can get a cached value using the pytest `config` object. Here is a basic example plugin which implements a fixture which re-uses previously created state across pytest invocations:

```python
# content of test_caching.py
import pytest


def expensive_computation():
    print("running expensive computation...")


@pytest.fixture
def mydata(request):
    val = request.config.cache.get("example/value", None)
    if val is None:
        expensive_computation()
        val = 42
        request.config.cache.set("example/value", val)
    return val


def test_function(mydata):
    assert mydata == 23
```

If you run this command for the first time, you can see the print statement:

```shell
$ pytest -q
F                                                                    [100%]
================================= FAILURES =================================
______________________________ test_function _______________________________

mydata = 42

    def test_function(mydata):
>       assert mydata == 23
E       assert 42 == 23

test_caching.py:19: AssertionError
-------------------------- Captured stdout setup ---------------------------
running expensive computation...
========================= short test summary info ==========================
FAILED test_caching.py::test_function - assert 42 == 23
1 failed in 0.12s
```

If you run it a second time, the value will be retrieved from the cache and nothing will be printed:

```shell
$ pytest -q
F                                                                    [100%]
================================= FAILURES =================================
______________________________ test_function _______________________________

mydata = 42

    def test_function(mydata):
>       assert mydata == 23
E       assert 42 == 23

test_caching.py:19: AssertionError
========================= short test summary info ==========================
FAILED test_caching.py::test_function - assert 42 == 23
1 failed in 0.12s
```

See the `config.cache` fixture for more details.

## Inspecting Cache content {#inspecting-cache-content}

You can always peek at the content of the cache using the `--cache-show` command line option:

```shell
$ pytest --cache-show
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
cachedir: /home/sweet/project/.pytest_cache
--------------------------- cache values for '*' ---------------------------
cache/lastfailed contains:
  {'test_caching.py::test_function': True}
cache/nodeids contains:
  ['test_caching.py::test_function']
cache/stepwise contains:
  []
example/value contains:
  42

========================== no tests ran in 0.12s ===========================
```

`--cache-show` takes an optional argument to specify a glob pattern for filtering:

```shell
$ pytest --cache-show example/*
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
cachedir: /home/sweet/project/.pytest_cache
----------------------- cache values for 'example/*' -----------------------
example/value contains:
  42

========================== no tests ran in 0.12s ===========================
```

## Clearing Cache content {#clearing-cache-content}

You can instruct pytest to clear all cache files and values by adding the `--cache-clear` option like this:

```shell
pytest --cache-clear
```

This is recommended for invocations from Continuous Integration servers where isolation and correctness is more important than speed.

## Stepwise {#stepwise}

As an alternative to `--lf -x`, especially for cases where you expect a large part of the test suite will fail, `--sw`, `--stepwise` allows you to fix them one at a time. The test suite will run until the first failure and then stop. At the next invocation, tests will continue from the last failing test and then run until the next failing test. You may use the `--stepwise-skip` option to ignore one failing test and stop the test execution on the second failing test instead. This is useful if you get stuck on a failing test and just want to ignore it until later. Providing `--stepwise-skip` will also enable `--stepwise` implicitly.