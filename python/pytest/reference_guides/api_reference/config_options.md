# Configuration Options

Here is a list of builtin configuration options that may be written in a `pytest.ini` (or `.pytest.ini`), `pyproject.toml`, `tox.ini`, or `setup.cfg` file, usually located at the root of your repository.

To see each file format in details, see [Configuration file formats](/python/pytest/reference_guides/configuration#configuration-file-formats).

::: tip Warning
Usage of `setup.cfg` is not recommended except for very simple use cases. `.cfg` files use a different parser than `pytest.ini` and `tox.ini` which might cause hard to track down problems. When possible, it is recommended to use the latter files, or `pyproject.toml`, to hold your pytest configuration.
:::

Configuration options may be overwritten in the command-line by using `-o/--override-ini`, which can also be passed multiple times. The expected format is `name=value`. For example:

```python
pytest -o console_output_style=classic -o cache_dir=/tmp/mycache
```

## addopts

Add the specified `OPTS` to the set of command line arguments as if they had been specified by the user. Example: if you have this ini file content:

```ini
# content of pytest.ini
[pytest]
addopts = --maxfail=2 -rf  # exit after 2 failures, report fail info
```

issuing `pytest test_hello.py` actually means:

```shell
pytest --maxfail=2 -rf test_hello.py
```

Default is to add no options.

## cache_dir

Sets a directory where stores content of cache plugin. Default directory is `.pytest_cache` which is created in `rootdir`. Directory may be relative or absolute path. If setting relative path, then directory is created relative to rootdir. Additionally path may contain environment variables, that will be expanded. For more information about cache plugin please refer to [How to re-run failed tests and maintain state between test runs](/python/pytest/how_to_guides/re_run#how-to-re-run-failed-tests-and-maintain-state-between-test-runs).

## console_output_style

Sets the console output style while running tests:

- `classic`: classic pytest output.

- `progress`: like classic pytest output, but with a progress indicator.

- `progress-even-when-capture-no`: allows the use of the progress indicator even when `capture=no`.

- `count`: like progress, but shows progress as the number of tests completed instead of a percent.

The default is `progress`, but you can fallback to `classic` if you prefer or the new mode is causing unexpected problems:

```ini
# content of pytest.ini
[pytest]
console_output_style = classic
```

## doctest_encoding

Default encoding to use to decode text files with docstrings. See [how pytest handles doctests](/python/pytest/how_to_guides/doctest#how-to-run-doctests).

## doctest_optionflags

One or more doctest flag names from the standard `doctest` module. See [how pytest handles doctests](/python/pytest/how_to_guides/doctest#how-to-run-doctests).

## empty_parameter_set_mark

Allows to pick the action for empty parametersets in parameterization

- `skip` skips tests with an empty parameterset (default)

- `xfail` marks tests with an empty parameterset as xfail(run=False)

- `fail_at_collect` raises an exception if parametrize collects an empty parameter set

```ini
# content of pytest.ini
[pytest]
empty_parameter_set_mark = xfail
```

::: tip Note
The default value of this option is planned to change to `xfail` in future releases as this is considered less error prone, see [issue #3155](https://github.com/pytest-dev/pytest/issues/3155) for more details.
:::

## faulthandler_timeout

Dumps the tracebacks of all threads if a test takes longer than X seconds to run (including fixture setup and teardown). Implemented using the `faulthandler.dump_traceback_later()` function, so all caveats there apply.

```ini
# content of pytest.ini
[pytest]
faulthandler_timeout=5
```

For more information please refer to [Fault Handler](https://docs.pytest.org/en/latest/how-to/failures.html#faulthandler).

## filterwarnings

Sets a list of filters and actions that should be taken for matched warnings. By default all warnings emitted during the test session will be displayed in a summary at the end of the test session.

```ini
# content of pytest.ini
[pytest]
filterwarnings =
    error
    ignore::DeprecationWarning
```

This tells pytest to ignore deprecation warnings and turn all other warnings into errors. For more information please refer to [How to capture warnings](/python/pytest/how_to_guides/warning#how-to-capture-warnings).

## junit_duration_report

*New in version 4.1.*

Configures how durations are recorded into the JUnit XML report:

- `total` (the default): duration times reported include setup, call, and teardown times.

- `call`: duration times reported include only call times, excluding setup and teardown.

```ini
[pytest]
junit_duration_report = call
```

## junit_family

*New in version 4.2.*

*Changed in version 6.1*: Default changed to `xunit2`.

Configures the format of the generated JUnit XML file. The possible options are:

- `xunit1` (or `legacy`): produces old style output, compatible with the xunit 1.0 format.

- `xunit2`: produces [xunit 2.0 style output](https://github.com/jenkinsci/xunit-plugin/blob/xunit-2.3.2/src/main/resources/org/jenkinsci/plugins/xunit/types/model/xsd/junit-10.xsd), which should be more compatible with latest Jenkins versions. This is the default.

```ini
[pytest]
junit_family = xunit2
```

## junit_logging

*New in version 3.5.*

*Changed in version 5.4*: `log`, `all`, `out-err` options added.

Configures if captured output should be written to the JUnit XML file. Valid values are:

- `log`: write only `logging` captured output.

- `system-out`: write captured `stdout` contents.

- `system-err`: write captured `stderr` contents.

- `out-err`: write both captured `stdout` and `stderr` contents.

- `all`: write captured logging, `stdout` and `stderr` contents.

- `no` (the default): no captured output is written.

```ini
[pytest]
junit_logging = system-out
```

## junit_log_passing_tests

*New in version 4.6.*

If `junit_logging != "no"`, configures if the captured output should be written to the JUnit XML file for passing tests. Default is `True`.

```ini
[pytest]`
junit_log_passing_tests = False
```

## junit_suite_name

To set the name of the root test suite xml item, you can configure the `junit_suite_name` option in your config file:

```ini
[pytest]
junit_suite_name = my_suite
```

## log_auto_indent

Allow selective auto-indentation of multiline log messages.

Supports command line option `--log-auto-indent [value]` and config option `log_auto_indent = [value]` to set the auto-indentation behavior for all logging.

`[value]` can be:

- `True` or `“On”` - Dynamically auto-indent multiline log messages

- `False` or `“Off”` or 0 - Do not auto-indent multiline log messages (the default behavior)

- `[positive integer]` - auto-indent multiline log messages by `[value]` spaces

```ini
[pytest]
log_auto_indent = False
```

Supports passing kwarg `extra={"auto_indent": [value]}` to calls to `logging.log()` to specify auto-indentation behavior for a specific entry in the log. `extra` kwarg overrides the value specified on the command line or in the config.

## log_cli

Enable log display during test run (also known as [“live logging”](/python/pytest/how_to_guides/logging#live-logs)). The default is `False`.

```ini
[pytest]
log_cli = True
```

## log_cli_date_format

Sets a `time.strftime()`-compatible string that will be used when formatting dates for live logging.

```ini
[pytest]
log_cli_date_format = %Y-%m-%d %H:%M:%S
```

For more information, see [Live Logs](/python/pytest/how_to_guides/logging#live-logs).

## log_cli_format

Sets a `logging`-compatible string used to format live logging messages.

```ini
[pytest]
log_cli_format = %(asctime)s %(levelname)s %(message)s
```

For more information, see [Live Logs](/python/pytest/how_to_guides/logging#live-logs).

## log_cli_level

Sets the minimum log message level that should be captured for live logging. The integer value or the names of the levels can be used.

```ini
[pytest]
log_cli_level = INFO
```

For more information, see [Live Logs](/python/pytest/how_to_guides/logging#live-logs).

## log_date_format

Sets a `time.strftime()`-compatible string that will be used when formatting dates for logging capture.

```ini
[pytest]
log_date_format = %Y-%m-%d %H:%M:%S
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_file

Sets a file name relative to the current working directory where log messages should be written to, in addition to the other logging facilities that are active.

```ini
[pytest]
log_file = logs/pytest-logs.txt
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_file_date_format

Sets a `time.strftime()`-compatible string that will be used when formatting dates for the logging file.

```ini
[pytest]
log_file_date_format = %Y-%m-%d %H:%M:%S
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_file_format

Sets a `logging`-compatible string used to format logging messages redirected to the logging file.

```ini
[pytest]
log_file_format = %(asctime)s %(levelname)s %(message)s
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_file_level

Sets the minimum log message level that should be captured for the logging file. The integer value or the names of the levels can be used.

```ini
[pytest]
log_file_level = INFO
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_format

Sets a `logging`-compatible string used to format captured logging messages.

```ini
[pytest]
log_format = %(asctime)s %(levelname)s %(message)s
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## log_level

Sets the minimum log message level that should be captured for logging capture. The integer value or the names of the levels can be used.

```ini
[pytest]
log_level = INFO
```

For more information, see [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging).

## markers

When the `--strict-markers` or `--strict` command-line arguments are used, only known markers - defined in code by core pytest or some plugin - are allowed.

You can list additional markers in this setting to add them to the whitelist, in which case you probably want to add `--strict-markers` to `addopts` to avoid future regressions:

```ini
[pytest]
addopts = --strict-markers
markers =
    slow
    serial
```

::: tip Note
The use of `--strict-markers` is highly preferred. `--strict` was kept for backward compatibility only and may be confusing for others as it only applies to markers and not to other options.
:::

## minversion

Specifies a minimal pytest version required for running tests.

```ini
# content of pytest.ini
[pytest]
minversion = 3.0  # will fail if we run with pytest-2.8
```

## norecursedirs

Set the directory basename patterns to avoid when recursing for test discovery. The individual (fnmatch-style) patterns are applied to the basename of a directory to decide if to recurse into it. Pattern matching characters:

```shell
*       matches everything
?       matches any single character
[seq]   matches any character in seq
[!seq]  matches any char not in seq
```

Default patterns are `'*.egg'`, `'.*'`, `'_darcs'`, `'build'`, `'CVS'`, `'dist'`, `'node_modules'`, `'venv'`, `'{arch}'`. Setting a `norecursedirs` replaces the default. Here is an example of how to avoid certain directories:

```ini
[pytest]
norecursedirs = .svn _build tmp*
```

This would tell `pytest` to not look into typical subversion or sphinx-build directories or into any `tmp` prefixed directory.

Additionally, `pytest` will attempt to intelligently identify and ignore a virtualenv by the presence of an activation script. Any directory deemed to be the root of a virtual environment will not be considered during test collection unless `‑‑collect‑in‑virtualenv` is given. Note also that `norecursedirs` takes precedence over `‑‑collect‑in‑virtualenv`; e.g. if you intend to run tests in a virtualenv with a base directory that matches `'.*'` you must override `norecursedirs` in addition to using the `‑‑collect‑in‑virtualenv` flag.

## python_classes

One or more name prefixes or glob-style patterns determining which classes are considered for test collection. Search for multiple glob patterns by adding a space between patterns. By default, pytest will consider any class prefixed with `Test` as a test collection. Here is an example of how to collect tests from classes that end in `Suite`:

```ini
[pytest]
python_classes = *Suite
```

Note that `unittest.TestCase` derived classes are always collected regardless of this option, as `unittest`’s own collection framework is used to collect those tests.

## python_files

One or more Glob-style file patterns determining which python files are considered as test modules. Search for multiple glob patterns by adding a space between patterns:

```ini
[pytest]
python_files = test_*.py check_*.py example_*.py
```

Or one per line:

```ini
[pytest]
python_files =
    test_*.py
    check_*.py
    example_*.py
```

By default, files matching `test_*.py` and `*_test.py` will be considered test modules.

## python_functions

One or more name prefixes or glob-patterns determining which test functions and methods are considered tests. Search for multiple glob patterns by adding a space between patterns. By default, pytest will consider any function prefixed with `test` as a test. Here is an example of how to collect test functions and methods that end in `_test`:

```ini
[pytest]
python_functions = *_test
```

Note that this has no effect on methods that live on a `unittest.TestCase` derived class, as `unittest`’s own collection framework is used to collect those tests.

See [Changing naming conventions](/python/pytest/further_topics/example_trick/test_discovery#changing-naming-conventions) for more detailed examples.

## pythonpath

Sets list of directories that should be added to the python search path. Directories will be added to the head of `sys.path`. Similar to the `PYTHONPATH` environment variable, the directories will be included in where Python will look for imported modules. Paths are relative to the `rootdir` directory. Directories remain in path for the duration of the test session.

```ini
[pytest]
pythonpath = src1 src2
```

::: tip Note
`pythonpath` does not affect some imports that happen very early, most notably plugins loaded using the `-p` command line option.
:::

## required_plugins

A space separated list of plugins that must be present for pytest to run. Plugins can be listed with or without version specifiers directly following their name. Whitespace between different version specifiers is not allowed. If any one of the plugins is not found, emit an error.

```ini
[pytest]
required_plugins = pytest-django>=3.0.0,<4.0.0 pytest-html pytest-xdist>=1.0.0
```

## testpaths

Sets list of directories that should be searched for tests when no specific directories, files or test ids are given in the command line when executing pytest from the rootdir directory. File system paths may use shell-style wildcards, including the recursive `**` pattern.

Useful when all project tests are in a known location to speed up test collection and to avoid picking up undesired tests by accident.

```ini
[pytest]
testpaths = testing doc
```

This configuration means that executing:

```shell
pytest
```

has the same practical effects as executing:

```shell
pytest testing doc
```

## tmp_path_retention_count

How many sessions should we keep the `tmp_path` directories, according to `tmp_path_retention_policy`.

```ini
[pytest]
tmp_path_retention_count = 3
```

*Default*: `3`

## tmp_path_retention_policy

Controls which directories created by the `tmp_path` fixture are kept around, based on test outcome.

- `all`: retains directories for all tests, regardless of the outcome.

- `failed`: retains directories only for tests with outcome `error` or `failed`.

- `none`: directories are always removed after each test ends, regardless of the outcome.

```ini
[pytest]
tmp_path_retention_policy = "all"
```

*Default*: `all`

## usefixtures

List of fixtures that will be applied to all test functions; this is semantically the same to apply the `@pytest.mark.usefixtures` marker to all test functions.

```ini
[pytest]
usefixtures =
    clean_db
```

## xfail_strict

If set to `True`, tests marked with `@pytest.mark.xfail` that actually succeed will by default fail the test suite. For more information, see [strict parameter](/python/pytest/how_to_guides/skip_xfail#strict-parameter).

```ini
[pytest]
xfail_strict = True
```