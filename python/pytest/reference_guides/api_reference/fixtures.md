# Fixtures {#fixtures}

*Tutorial*: [Fixtures reference](/python/pytest/reference_guides/fixture_reference#fixtures-reference)

Fixtures are requested by test functions or other fixtures by declaring them as argument names.

Example of a test requiring a fixture:

```python
def test_output(capsys):
    print("hello")
    out, err = capsys.readouterr()
    assert out == "hello\n"
```

Example of a fixture requiring another fixture:

```python
@pytest.fixture
def db_session(tmp_path):
    fn = tmp_path / "db.file"
    return connect(fn)
```

For more details, consult the full [fixtures docs](/python/pytest/reference_guides/fixture_reference#fixtures-reference).

## @pytest.fixture {#pytest-fixture}

- ### @fixture(`fixture_function: FixtureFunction, *, scope: Union[Literal['session', 'package', 'module', 'class', 'function'], Callable[[str, Config], Literal['session', 'package', 'module', 'class', 'function']]] = 'function', params: Optional[Iterable[object]] = None, autouse: bool = False, ids: Optional[Union[Sequence[Optional[object]], Callable[[Any], Optional[object]]]] = None, name: Optional[str] = None`) → `FixtureFunction`  

- ### @fixture(`fixture_function: None = None, *, scope: Union[Literal['session', 'package', 'module', 'class', 'function'], Callable[[str, Config], Literal['session', 'package', 'module', 'class', 'function']]] = 'function', params: Optional[Iterable[object]] = None, autouse: bool = False, ids: Optional[Union[Sequence[Optional[object]], Callable[[Any], Optional[object]]]] = None, name: Optional[str] = None`) → `FixtureFunctionMarker`

    Decorator to mark a fixture factory function.

    This decorator can be used, with or without parameters, to define a fixture function.

    The name of the fixture function can later be referenced to cause its invocation ahead of running tests: test modules or classes can use the `pytest.mark.usefixtures(fixturename)` marker.

    Test functions can directly use fixture names as input arguments in which case the fixture instance returned from the fixture function will be injected.

    Fixtures can provide their values to test functions using `return` or `yield` statements. When using `yield` the code block after the `yield` statement is executed as teardown code regardless of the test outcome, and must yield exactly once.

    *Parameters*:

    - `scope` – The scope for which this fixture is shared; one of `"function"` (default), `"class"`, `"module"`, `"package"` or `"session"`. This parameter may also be a callable which receives `(fixture_name, config)` as parameters, and must return a str with one of the values mentioned above. See [Dynamic scope](/python/pytest/how_to_guides/fixture#dynamic-scope) in the docs for more information.

    - `params` – An optional list of parameters which will cause multiple invocations of the fixture function and all of the tests using it. The current parameter is available in `request.param`.

    - `autouse` – If `True`, the fixture func is activated for all tests that can see it. If `False` (the default), an explicit reference is needed to activate the fixture.

    - `ids` – Sequence of ids each corresponding to the params so that they are part of the test id. If no ids are provided they will be generated automatically from the params.

    - `name` – The name of the fixture. This defaults to the name of the decorated function. If a fixture is used in the same module in which it is defined, the function name of the fixture will be shadowed by the function arg that requests the fixture; one way to resolve this is to name the decorated function `fixture_<fixturename>` and then use `@pytest.fixture(name='<fixturename>')`.

## capfd {#capfd}

*Tutorial*: [How to capture stdout/stderr output](/python/pytest/how_to_guides/output#how-to-capture-stdout-stderr-output)

- ### capfd()   

    Enable text capturing of writes to file descriptors `1` and `2`.

    The captured output is made available via `capfd.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `text` objects.

    Returns an instance of `CaptureFixture[str]`.

    *Example*:

    ```python
    def test_system_echo(capfd):
        os.system('echo "hello"')
        captured = capfd.readouterr()
        assert captured.out == "hello\n"
    ```

## capfdbinary {#capfdbinary}

*Tutorial*: [How to capture stdout/stderr output](/python/pytest/how_to_guides/output#how-to-capture-stdout-stderr-output)

- ### capfdbinary()     

    Enable bytes capturing of writes to file descriptors `1` and `2`.

    The captured output is made available via `capfd.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `byte` objects.

    Returns an instance of `CaptureFixture[bytes]`.

    *Example*:

    ```python
    def test_system_echo(capfdbinary):
        os.system('echo "hello"')
        captured = capfdbinary.readouterr()
        assert captured.out == b"hello\n"
    ```

## caplog {#caplog}

*Tutorial*: [How to manage logging](/python/pytest/how_to_guides/logging#how-to-manage-logging)

- ### caplog()      

    Access and control log capturing.

    Captured logs are available through the following properties/methods:

    ```shell
    * caplog.messages        -> list of format-interpolated log messages
    * caplog.text            -> string containing formatted log output
    * caplog.records         -> list of logging.LogRecord instances
    * caplog.record_tuples   -> list of (logger_name, level, message) tuples
    * caplog.clear()         -> clear captured records and formatted log output string
    ```

    Returns a `pytest.LogCaptureFixture` instance.

- ### `final class` LogCaptureFixture   

    Provides access and control of log capturing.

    - `property` **handler**: `LogCaptureHandler`

        Get the logging handler used by the fixture.

    - **get_records**(`when`)   

        Get the logging records for one of the possible test phases.

        *Parameters*:

        - `when (Literal['setup', 'call', 'teardown'])` – Which test phase to obtain the records from. Valid values are: “setup”, “call” and “teardown”.

        *Returns*:  The list of captured records at the given stage.

        *Return type*: `List[LogRecord]`

        *New in version 3.4.*

    - `property` **text**: `str`

        The formatted log text.

    - `property` **records**: `List[LogRecord]`

        The list of log records.

    - `property` **record_tuples**: `List[Tuple[str, int, str]]`

        A list of a stripped down version of log records intended for use in assertion comparison.

        The format of the tuple is: `(logger_name, log_level, message)`

    - `property` **messages**: `List[str]`

        A list of format-interpolated log messages.

        Unlike ‘records’, which contains the format string and parameters for interpolation, log messages in this list are all interpolated.

        Unlike ‘text’, which contains the output from the handler, log messages in this list are unadorned with levels, timestamps, etc, making exact comparisons more reliable.

        Note that traceback or stack info (from `logging.exception()` or the `exc_info` or `stack_info` arguments to the logging functions) is not included, as this is added by the formatter in the handler.

        *New in version 3.7.*

    - **clear**()   

        Reset the list of log records and the captured log text.

    - **set_level**(`level, logger=None`)      

        Set the threshold level of a logger for the duration of a test.

        Logging messages which are less severe than this level will not be captured.

        *Changed in version 3.4*: The levels of the loggers changed by this function will be restored to their initial values at the end of the test.

        Will enable the requested logging level if it was disabled via `logging.disable()`.

        *Parameters*:

        - `level (Union[int, str])` – The level.

        - `logger (Optional[str])` – The logger to update. If not given, the root logger.

    - `with` **at_level**(`level, logger=None`)   

        Context manager that sets the level for capturing of logs. After the end of the ‘with’ statement the level is restored to its original value.

        Will enable the requested logging level if it was disabled via `logging.disable()`.

        *Parameters*:

        - `level (Union[int, str])` – The level.

        - `logger (Optional[str])` – The logger to update. If not given, the root logger.

## capsys {#capsys}

*Tutorial*: [How to capture stdout/stderr output](/python/pytest/how_to_guides/output#how-to-capture-stdout-stderr-output)

- ### capsys()      

    Enable text capturing of writes to `sys.stdout` and `sys.stderr`.

    The captured output is made available via `capsys.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `text` objects.

    Returns an instance of `CaptureFixture[str]`.

    *Example*:

    ```python
    def test_output(capsys):
        print("hello")
        captured = capsys.readouterr()
        assert captured.out == "hello\n"
    ```

- ### `class` CaptureFixture    

    Object returned by the `capsys`, `capsysbinary`, `capfd` and `capfdbinary` fixtures.

    - **readouterr**()  

        Read and return the captured output so far, resetting the internal buffer.

        *Returns*: The captured content as a namedtuple with `out` and `err` string attributes.

        *Return type*: `CaptureResult`

    - `with` **disabled**()   

        Temporarily disable capturing while inside the `with` block.

## capsysbinary {#capsysbinary}

*Tutorial*: [How to capture stdout/stderr output](/python/pytest/how_to_guides/output#how-to-capture-stdout-stderr-output)

- ### capsysbinary()  

    Enable bytes capturing of writes to `sys.stdout` and `sys.stderr`.

    The captured output is made available via `capsysbinary.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `bytes` objects.

    *Returns* an instance of `CaptureFixture[bytes]`.

    *Example*:

    ```python
    def test_output(capsysbinary):
        print("hello")
        captured = capsysbinary.readouterr()
        assert captured.out == b"hello\n"
    ```

## config.cache {#config-cache}

*Tutorial*: [How to re-run failed tests and maintain state between test runs](/python/pytest/how_to_guides/re_run#how-to-re-run-failed-tests-and-maintain-state-between-test-runs)

The `config.cache` object allows other plugins and fixtures to store and retrieve values across test runs. To access it from fixtures request `pytestconfig` into your fixture and get it with `pytestconfig.cache`.

Under the hood, the cache plugin uses the simple `dumps/loads` API of the json stdlib module.

`config.cache` is an instance of `pytest.Cache`:

- ### `final class` Cache   

    Instance of the `cache` fixture.

    - **mkdir**(`name`)     

        Return a directory path object with the given name.

        If the directory does not yet exist, it will be created. You can use it to manage files to e.g. store/retrieve database dumps across test sessions.

        *New in version 7.0.*

        *Parameters*:

        - `name (str)` – Must be a string not containing a `/` separator. Make sure the name contains your plugin or application identifiers to prevent clashes with other cache users.

    - **get**(`key, default`)   

        Return the cached value for the given key.

        If no value was yet cached or the value cannot be read, the specified default is returned.

        *Parameters*:

        - `key (str)` – Must be a `/` separated value. Usually the first name is the name of your plugin or your application.

        - `default` – The value to return in case of a cache-miss or invalid cache value.

    - **set**(`key, value`)    

        Save value for the given key.

        *Parameters*:

        - `key (str)` – Must be a / separated value. Usually the first name is the name of your plugin or your application.

        - `value (object)` – Must be of any combination of basic python types, including nested types like lists of dictionaries.

## doctest_namespace {#doctest-namespace}

*Tutorial*: [How to run doctests](/python/pytest/how_to_guides/doctest#how-to-run-doctests)

- ### doctest_namespace()     

    Fixture that returns a `dict` that will be injected into the namespace of doctests.

    Usually this fixture is used in conjunction with another `autouse` fixture:

    ```python
    @pytest.fixture(autouse=True)
    def add_np(doctest_namespace):
        doctest_namespace["np"] = numpy
    ```

    For more details: [‘doctest_namespace’ fixture](/python/pytest/how_to_guides/doctest#doctest-namespace-fixture).

## monkeypatch {#monkeypatch}

*Tutorial*: [How to monkeypatch/mock modules and environments](/python/pytest/how_to_guides/mock#how-to-monkeypatch-mock-modules-and-environments)

- ### monkeypatch()     

    A convenient fixture for monkey-patching.

    The fixture provides these methods to modify objects, dictionaries, or `os.environ`:

    - `monkeypatch.setattr(obj, name, value, raising=True)`

    - `monkeypatch.delattr(obj, name, raising=True)`

    - `monkeypatch.setitem(mapping, name, value)`

    - `monkeypatch.delitem(obj, name, raising=True)`

    - `monkeypatch.setenv(name, value, prepend=None)`

    - `monkeypatch.delenv(name, raising=True)`

    - `monkeypatch.syspath_prepend(path)`

    - `monkeypatch.chdir(path)`

    - `monkeypatch.context()`

    All modifications will be undone after the requesting test function or fixture has finished. The `raising` parameter determines if a `KeyError` or `AttributeError` will be raised if the set/deletion operation does not have the specified target.

    To undo modifications done by the fixture in a contained scope, use `context()`.

    Returns a `MonkeyPatch` instance.

- ### `final class` MonkeyPatch       

    Helper to conveniently monkeypatch attributes/items/environment variables/syspath.

    Returned by the `monkeypatch` fixture.

    *Changed in version 6.2*: Can now also be used directly as `pytest.MonkeyPatch()`, for when the fixture is not available. In this case, use `with MonkeyPatch.context() as mp`: or remember to call `undo()` explicitly.

    - `classmethod with` **context**()        

        Context manager that returns a new `MonkeyPatch` object which undoes any patching done inside the `with` block upon exit.

        *Example*:

        ```python
        import functools


        def test_partial(monkeypatch):
            with monkeypatch.context() as m:
                m.setattr(functools, "partial", 3)
        ```

        Useful in situations where it is desired to undo some patches before the test ends, such as mocking `stdlib` functions that might break pytest itself if mocked (for examples of this see [issue #3290](https://github.com/pytest-dev/pytest/issues/3290)).

    - **setattr**(`target: str, name: object, value: ~_pytest.monkeypatch.Notset = <notset>, raising: bool = True`) → `None`    

    - **setattr**(`target: object, name: str, value: object, raising: bool = True`) → `None`

        Set attribute value on target, memorizing the old value.

        *For example*:

        ```python
        import os

        monkeypatch.setattr(os, "getcwd", lambda: "/")
        ```

        The code above replaces the `os.getcwd()` function by a `lambda` which always returns `"/"`.

        For convenience, you can specify a string as `target` which will be interpreted as a dotted import path, with the last part being the attribute name:

        ```python
        monkeypatch.setattr("os.getcwd", lambda: "/")
        ```

        Raises `AttributeError` if the attribute does not exist, unless `raising` is set to False.

        *Where to patch*

        `monkeypatch.setattr` works by (temporarily) changing the object that a name points to with another one. There can be many names pointing to any individual object, so for patching to work you must ensure that you patch the name used by the system under test.

        See the section [Where to patch](https://docs.python.org/3/library/unittest.mock.html#where-to-patch) in the `unittest.mock` docs for a complete explanation, which is meant for `unittest.mock.patch()` but applies to `monkeypatch.setattr` as well.

    - **delattr**(`target, name=<notset>, raising=True`)      

        Delete attribute `name` from `target`.

        If no `name` is specified and `target` is a string it will be interpreted as a dotted import path with the last part being the attribute name.

        Raises AttributeError it the attribute does not exist, unless `raising` is set to False.

    - **setitem**(`dic, name, value`)   

        Set dictionary entry `name` to value.

    - **delitem**(`dic, name, raising=True`)    

        Delete `name` from dict.

        Raises `KeyError` if it doesn’t exist, unless `raising` is set to False.

    - **setenv**(`name, value, prepend=None`)     

        Set environment variable `name` to `value`.

        If `prepend` is a character, read the current environment variable value and prepend the `value` adjoined with the `prepend` character.

    - **delenv**(`name, raising=True`)    

        Delete `name` from the environment.

        Raises `KeyError` if it does not exist, unless `raising` is set to False.

    - **syspath_prepend**(`path`)     

        Prepend `path` to `sys.path` list of import locations.

    - **chdir**(`path`)     

        Change the current working directory to the specified path.

        *Parameters*:

        - `path (Union[str, PathLike[str]])` – The path to change into.

    - **undo**()      

        Undo previous changes.

        This call consumes the undo stack. Calling it a second time has no effect unless you do more monkeypatching after the undo call.

        There is generally no need to call `undo()`, since it is called automatically during tear-down.

        ::: tip Note
        The same `monkeypatch` fixture is used across a single test function invocation. If `monkeypatch` is used both by the test function itself and one of the test fixtures, calling `undo()` will undo all of the changes made in both functions.

        Prefer to use `context()` instead.
        :::

## pytestconfig {#pytestconfig}

- ### pytestconfig()        

    Session-scoped fixture that returns the session’s `pytest.Config` object.

    *Example*:

    ```python
    def test_foo(pytestconfig):
        if pytestconfig.getoption("verbose") > 0:
            ...
    ```

## pytester {#pytester}

*New in version 6.2.*

Provides a `Pytester` instance that can be used to run and test pytest itself.

It provides an empty directory where pytest can be executed in isolation, and contains facilities to write tests, configuration files, and match against expected output.

To use it, include in your topmost `conftest.py` file:

```python
pytest_plugins = "pytester"
```

- ### `final class` Pytester      

    Facilities to write tests/configuration files, execute pytest in isolation, and match against expected output, perfect for black-box testing of pytest plugins.

    It attempts to isolate the test run from external factors as much as possible, modifying the current working directory to `path` and environment variables during initialization.

    - `exception` **TimeoutExpired**        

    - **plugins**: `List[Union[str, object]]`

        A list of plugins to use with `parseconfig()` and `runpytest()`. Initially this is an empty list but plugins can be added to the list. The type of items to add to the list depends on the method using them so refer to them for details.

    - `property` **path**: `Path`

        Temporary directory path used to create files/run tests from, etc.

    - **make_hook_recorder**(`pluginmanager`)     

        Create a new `HookRecorder` for a `PytestPluginManager`.

    - **chdir**()       

        Cd into the temporary directory.

        This is done automatically upon instantiation.

    - **makefile**(`ext, *args, **kwargs`)      

        Create new text file(s) in the test directory.

        *Parameters*:

        - `ext (str)` – The extension the file(s) should use, including the dot, e.g. `.py`.

        - `args (str)` – All args are treated as strings and joined using newlines. The result is written as contents to the file. The name of the file is based on the test function requesting this fixture.

        - `kwargs (str)` – Each keyword is the name of a file, while the value of it will be written as contents of the file.

        *Returns*: The first created file.

        *Return type*: `Path`

        *Examples*:

        ```python
        pytester.makefile(".txt", "line1", "line2")

        pytester.makefile(".ini", pytest="[pytest]\naddopts=-rs\n")
        ```

        To create binary files, use `pathlib.Path.write_bytes()` directly:

        ```python
        filename = pytester.path.joinpath("foo.bin")
        filename.write_bytes(b"...")
        ```

    - **makeconftest**(`source`)      

        Write a contest.py file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The `conftest.py` file.

        *Return type*: `Path`

    - **makeini**(`source`)     

        Write a `tox.ini` file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The `tox.ini` file.

        *Return type*: `Path`

    - **getinicfg**(`source`)       

        Return the pytest section from the `tox.ini` config file.

    - **makepyprojecttoml**(`source`)       

        Write a `pyproject.toml` file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The `pyproject.ini` file.

        *Return type*: `Path`

        *New in version 6.0.*

    - **makepyfile**(`*args, **kwargs`)     

        Shortcut for `.makefile()` with a .py extension.

        Defaults to the test name with a ‘.py’ extension, e.g `test_foobar.py`, overwriting existing files.

        *Examples*:

        ```python
        def test_something(pytester):
            # Initial file is created test_something.py.
            pytester.makepyfile("foobar")
            # To create multiple files, pass kwargs accordingly.
            pytester.makepyfile(custom="foobar")
            # At this point, both 'test_something.py' & 'custom.py' exist in the test directory.
        ```

    - **maketxtfile**(`*args, **kwargs`)      

        Shortcut for `.makefile()` with a .txt extension.

        Defaults to the test name with a ‘.txt’ extension, e.g `test_foobar.txt`, overwriting existing files.

        *Examples*:

        ```python
        def test_something(pytester):
            # Initial file is created test_something.txt.
            pytester.maketxtfile("foobar")
            # To create multiple files, pass kwargs accordingly.
            pytester.maketxtfile(custom="foobar")
            # At this point, both 'test_something.txt' & 'custom.txt' exist in the test directory.
        ```

    - **syspathinsert**(`path=None`)        

        Prepend a directory to sys.path, defaults to `path`.

        This is undone automatically when this object dies at the end of each test.

        *Parameters*:

        - `path (Optional[Union[str, PathLike[str]]])` – The path.

    - **mkdir**(`name`)        

        Create a new (sub)directory.

        *Parameters*:

        - `name (Union[str, PathLike[str]])` – The name of the directory, relative to the pytester path.

        *Returns*: The created directory.

        *Return type*: `Path`

    - **mkpydir**(`name`)     

        Create a new python package.

        This creates a (sub)directory with an empty `__init__.py` file so it gets recognised as a Python package.

    - **copy_example**(`name=None`)     

        Copy file from project’s directory into the `testdir`.

        *Parameters*:

        - `name (Optional[str])` – The name of the file to copy.

        *Returns*: Path to the copied directory (inside `self.path`).

        *Return type*: `Path`

    - **getnode**(`config, arg`)      

        Get the collection node of a file.

        *Parameters*:

        - `config (Config)` – A pytest config. See `parseconfig()` for creating it.

        - `arg (Union[str, PathLike[str]])` – Path to the file.

        *Returns*: The node.

        *Return type*: `Union[Collector, Item]`

    - **getpathnode**(`path`)       

        Return the collection node of a file.

        This is like `getnode()` but uses `parseconfigure()` to create the (configured) pytest Config instance.

        *Parameters*:

        - `path (Union[str, PathLike[str]])` – Path to the file.

        *Returns*: The node.

        *Return type*: `Union[Collector, Item]`

    - **genitems**(`colitems`)        

        Generate all test items from a collection node.

        This recurses into the collection node and returns a list of all the test items contained within.

        *Parameters*:

        - `colitems (Sequence[Union[Item, Collector]])` – The collection nodes.

        *Returns*: The collected items.

        *Return type*: `List[Item]`

    - **runitem**(`source`)       

        Run the “test_func” Item.

        The calling test instance (class containing the test method) must provide a `.getrunner()` method which should return a runner which can run the test protocol for a single item, e.g. `_pytest.runner.runtestprotocol()`.

    - **inline_runsource**(`source, *cmdlineargs`)        

        Run a test module in process using `pytest.main()`.

        This run writes “source” into a temporary file and runs `pytest.main()` on it, returning a `HookRecorder` instance for the result.

        *Parameters*:

        - `source (str)` – The source code of the test module.

        - `cmdlineargs` – Any extra command line arguments to use.

    - **inline_genitems**(`*args`)        

        Run `pytest.main(['--collectonly'])` in-process.

        Runs the `pytest.main()` function to run all of pytest inside the test process itself `like inline_run()`, but returns a tuple of the collected items and a `HookRecorder` instance.

    - **inline_run**(`*args, plugins=(), no_reraise_ctrlc=False`)     

        Run `pytest.main()` in-process, returning a HookRecorder.

        Runs the `pytest.main()` function to run all of pytest inside the test process itself. This means it can return a `HookRecorder` instance which gives more detailed results from that run than can be done by matching stdout/stderr from `runpytest()`.

        *Parameters*:

        - `args (Union[str, PathLike[str]])` – Command line arguments to pass to `pytest.main()`.

        - `plugins` – Extra plugin instances the `pytest.main()` instance should use.

        - `no_reraise_ctrlc (bool)` – Typically we reraise keyboard interrupts from the child run. If True, the `KeyboardInterrupt` exception is captured.

    - **runpytest_inprocess**(`*args, **kwargs`)      

        Return result of running pytest in-process, providing a similar interface to what `self.runpytest()` provides.

    - **runpytest**(`*args, **kwargs`)        

        Run pytest inline or in a subprocess, depending on the command line option “–runpytest” and return a `RunResult`.

    - **parseconfig**(`*args`)      

        Return a new pytest `pytest.Config` instance from given commandline args.

        This invokes the pytest bootstrapping code in _pytest.config to create a new `pytest.PytestPluginManager` and call the `pytest_cmdline_parse` hook to create a new pytest.Config instance.

        If `plugins` has been populated they should be plugin modules to be registered with the plugin manager.

    - **parseconfigure**(`*args`)       

        Return a new pytest configured `Config` instance.

        Returns a new `pytest.Config` instance like `parseconfig()`, but also calls the `pytest_configure` hook.

    - **getitem**(`source, funcname='test_func'`)       

        Return the test item for a test function.

        Writes the source to a python file and runs pytest’s collection on the resulting module, returning the test item for the requested function name.

        *Parameters*:

        - `source(Union[str, PathLike[str]])` – The module source.

        - `funcname(str)` – The name of the test function for which to return a test item.

        *Returns*: The test item.

        *Return type*: `Item`

    - **getitems**(`source`)        

        Return all test items collected from the module.

        Writes the source to a Python file and runs pytest’s collection on the resulting module, returning all test items contained within.

    - **getmodulecol**(`source, configargs=(), *, withinit=False`)        

        Return the module collection node for `source`.

        Writes `source` to a file using `makepyfile()` and then runs the pytest collection on it, returning the collection node for the test module.

        *Parameters*:

        - `source (Union[str, PathLike[str]])` – The source code of the module to collect.

        - `configargs` – Any extra arguments to pass to `parseconfigure()`.

        - `withinit (bool)` – Whether to also write an `__init__.py` file to the same directory to ensure it is a package.

    - **collect_by_name**(`modcol, name`)     

        Return the collection node for name from the module collection.

        Searches a module collection node for a collection node matching the given name.

        *Parameters*:

        - `modcol (Collector)` – A module collection node; see getmodulecol().

        - `name (str)` – The name of the node to return.

    - **popen**(`cmdargs, stdout=-1, stderr=-1, stdin=NotSetType.token, **kw`)        

        Invoke `subprocess.Popen`.

        Calls `subprocess.Popen` making sure the current working directory is in `PYTHONPATH`.

        You probably want to use `run()` instead.

    - **run**(`*cmdargs, timeout=None, stdin=NotSetType.token`)       

        Run a command with arguments.

        Run a process using `subprocess.Popen` saving the `stdout` and `stderr`.

        *Parameters*:

        - `cmdargs (Union[str, PathLike[str]])` – The sequence of arguments to pass to `subprocess.Popen`, with path-like objects being converted to str automatically.

        - `timeout (Optional[float])` – The period in seconds after which to timeout and raise `Pytester.TimeoutExpired`.

        - `stdin (Union[NotSetType, bytes, IO[Any], int])` – Optional standard input.

            - If it is `CLOSE_STDIN` (Default), then this method calls `subprocess.Popen` with `stdin=subprocess.PIPE`, and the standard input is closed immediately after the new command is started.

            - If it is of type `bytes`, these bytes are sent to the standard input of the command.

            - Otherwise, it is passed through to `subprocess.Popen`. For further information in this case, consult the document of the · parameter in `subprocess.Popen`.

        *Returns*: The result.

        *Return type*: `RunResult`

    - **runpython**(`script`)       

        Run a python script using `sys.executable` as interpreter.

    - **runpython_c**(`command`)        

        Run `python -c "command"`.

    - **runpytest_subprocess**(`*args, timeout=None`)       

        Run pytest as a subprocess with given arguments.

        Any plugins added to the `plugins` list will be added using the `-p` command line option. Additionally `--basetemp` is used to put any temporary files and directories in a numbered directory prefixed with “runpytest-” to not conflict with the normal numbered pytest location for temporary files and directories.

        *Parameters*:

        - `args (Union[str, PathLike[str]])` – The sequence of arguments to pass to the pytest subprocess.

        - `timeout (Optional[float])` – The period in seconds after which to timeout and raise `Pytester.TimeoutExpired`.

        *Returns*: The result.

        *Return type*: `RunResult`

    - **spawn_pytest**(`string, expect_timeout=10.0`)     

        Run pytest using pexpect.

        This makes sure to use the right pytest and sets up the temporary directory locations.

        The pexpect child is returned.

    - **spawn**(`cmd, expect_timeout=10.0`)       

        Run a command using pexpect.

        The pexpect child is returned.

- ### `final class` RunResult      

    The result of running a command from `Pytester`.

    - **ret**: `Union[int, ExitCode]`

        The return value.

    - **outlines**

        List of lines captured from `stdout`.

    - **errlines**

        List of lines captured from `stderr`.

    - **stdout**

        `LineMatcher` of `stdout`.

        Use e.g. `str(stdout)` to reconstruct stdout, or the commonly used `stdout.fnmatch_lines()` method.

    - **stderr**

        - `LineMatcher` of `stderr`.

    - **duration**

        - Duration in seconds.

    - **parseoutcomes**()     

        Return a dictionary of outcome noun -> count from parsing the terminal output that the test process produced.

        The returned nouns will always be in plural form:

        ```shell
        ======= 1 failed, 1 passed, 1 warning, 1 error in 0.13s ====
        ```

        Will return `{"failed": 1, "passed": 1, "warnings": 1, "errors": 1}`.

    - `classmethod` **parse_summary_nouns**(`lines`)        

        Extract the nouns from a pytest terminal summary line.

        It always returns the plural noun for consistency:

        ```shell
        ======= 1 failed, 1 passed, 1 warning, 1 error in 0.13s ====
        ```

        Will return {"failed": 1, "passed": 1, "warnings": 1, "errors": 1}.

    - **assert_outcomes**(`passed=0, skipped=0, failed=0, errors=0, xpassed=0, xfailed=0, warnings=None, deselected=None`)      

        Assert that the specified outcomes appear with the respective numbers (0 means it didn’t occur) in the text output from a test run.

        `warnings` and `deselected` are only checked if not None.

- ### `class` LineMatcher       

    Flexible matching of text.

    This is a convenience class to test large texts like the output of commands.

    The constructor takes a list of lines without their trailing newlines, i.e. `text.splitlines()`.

    - **__str__**()       

        Return the entire original text.

        *New in version 6.2*: You can use `str()` in older versions.

    - **fnmatch_lines_random**(`lines2`)        

        Check lines exist in the output in any order (using `fnmatch.fnmatch()`).

    - **re_match_lines_random**(`lines2`)     

        Check lines exist in the output in any order (using `re.match()`).

    - **get_lines_after**(`fnline`)       

        Return all lines following the given line in the text.

        The given line can contain glob wildcards.

    - **fnmatch_lines**(`lines2, *, consecutive=False`)       

        Check lines exist in the output (using `fnmatch.fnmatch()`).

        The argument is a list of lines which have to match and can use glob wildcards. If they do not match a `pytest.fail()` is called. The matches and non-matches are also shown as part of the error message.

        *Parameters*:

        - `lines2 (Sequence[str])` – String patterns to match.

        - `consecutive (bool)` – Match lines consecutively?

    - **re_match_lines**(`lines2, *, consecutive=False`)        

        Check lines exist in the output (using `re.match()`).

        The argument is a list of lines which have to match using `re.match`. If they do not match a `pytest.fail()` is called.

        The matches and non-matches are also shown as part of the error message.

        *Parameters*:

        - `lines2 (Sequence[str])` – string patterns to match.

        - `consecutive (bool)` – match lines consecutively?

    - **no_fnmatch_line**(`pat`)        

        Ensure captured lines do not match the given pattern, using `fnmatch.fnmatch`.

        *Parameters*:

        - `pat (str)` – The pattern to match lines.

    - **no_re_match_line**(`pat`)     

        Ensure captured lines do not match the given pattern, using `re.match`.

        *Parameters*:

        - `pat (str)` – The regular expression to match lines.

    - **str**()       

        Return the entire original text.

- ### `final class` HookRecorder        

    Record all hooks called in a plugin manager.

    Hook recorders are created by `Pytester`.

    This wraps all the hook calls in the plugin manager, recording each call before propagating the normal calls.

    - **getcalls**(`names`)       

        Get all recorded calls to hooks with the given names (or name).

    - **matchreport**(`inamepart='', names=('pytest_runtest_logreport', 'pytest_collectreport'), when=None`)      

        Return a testreport whose dotted import path matches.

- ### `final class` RecordedHookCall        

    A recorded call to a hook.

    The arguments to the hook call are set as attributes. For example:

    ```python
    calls = hook_recorder.getcalls("pytest_runtest_setup")
    # Suppose pytest_runtest_setup was called once with `item=an_item`.
    assert calls[0].item is an_item
    ```

## record_property {#record-property}

*Tutorial*: [record_property](https://docs.pytest.org/en/latest/how-to/output.html#record-property-example)

- ### record_property()       

    Add extra properties to the calling test.

    User properties become part of the test report and are available to the configured reporters, like JUnit XML.

    The fixture is callable with `name, value`. The value is automatically XML-encoded.

    *Example*:

    ```python
    def test_function(record_property):
        record_property("example_key", 1)
    ```

## record_testsuite_property {#record-testsuite-property}

*Tutorial*: [record_testsuite_property](https://docs.pytest.org/en/latest/how-to/output.html#record-testsuite-property-example)

- ### record_testsuite_property()     

    Record a new `<property>` tag as child of the root `<testsuite>`.

    This is suitable to writing global information regarding the entire test suite, and is compatible with `xunit2` JUnit family.

    This is a `session-scoped` fixture which is called with `(name, value)`. 
    
    *Example*:

    ```python
    def test_foo(record_testsuite_property):
        record_testsuite_property("ARCH", "PPC")
        record_testsuite_property("STORAGE_TYPE", "CEPH")
    ```

    *Parameters*:

    - `name` – The property name.

    - `value` – The property value. Will be converted to a string.

    ::: warning Warning
    Currently this fixture does not work with the [pytest-xdist](https://github.com/pytest-dev/pytest-xdist) plugin. See [issue #7767](https://github.com/pytest-dev/pytest/issues/7767) for details.
    :::

## recwarn {#recwarn}

*Tutorial*: [Asserting warnings with the warns function](/python/pytest/how_to_guides/warning#asserting-warnings-with-the-warns-function)

- ### recwarn()     

    Return a `WarningsRecorder` instance that records all warnings emitted by test functions.

    See [How to capture warnings](/python/pytest/how_to_guides/warning#how-to-capture-warnings) for information on warning categories.

- ### `class` WarningsRecorder      

    A context manager to record raised warnings.

    Each recorded warning is an instance of `warnings.WarningMessage`.

    Adapted from `warnings.catch_warnings`.

    ::: tip Note
    `DeprecationWarning` and `PendingDeprecationWarning` are treated differently; see [Ensuring code triggers a deprecation warning](/python/pytest/how_to_guides/warning#ensuring-code-triggers-a-deprecation-warning).
    :::

    - `property` **list**: `List[WarningMessage]`

        The list of recorded warnings.

    - **pop**(`cls=<class 'Warning'>`)        

        Pop the first recorded warning which is an instance of `cls`, but not an instance of a child class of any other match. Raises `AssertionError` if there is no match.

    - **clear**()     

        Clear the list of recorded warnings.

## request {#request}

*Example*: [Pass different values to a test function, depending on command line options](/python/pytest/further_topics/example_trick/basic_pattern#pass-different-values-to-a-test-function-depending-on-command-line-options)

The `request` fixture is a special fixture providing information of the requesting test function.

- ### `class` FixtureRequest        

    A request for a fixture from a test or fixture function.

    A request object gives access to the requesting test context and has an optional `param` attribute in case the fixture is parametrized indirectly.

    - **fixturename**:` Optional[str]`

        Fixture for which this request is being performed.

    - `property` **scope**: `Literal['session', 'package', 'module', 'class', 'function']`

        Scope string, one of “function”, “class”, “module”, “package”, “session”.

    - `property` **fixturenames**: `List[str]`

        Names of all active fixtures in this request.

    - `property` **node**

        Underlying collection node (depends on current request scope).

    - `property` **config**: `Config`

        The pytest config object associated with this request.

    - `property` **function**

        Test function object if the request has a per-function scope.

    - `property` **cls**

        Class (can be None) where the test function was collected.

    - `property` **instance**

        Instance (can be None) on which test function was collected.

    - `property` **module**

        Python module object where the test function was collected.

    - `property` **path**: `Path`

        Path where the test function was collected.

    - `property` **keywords**: `MutableMapping[str, Any]`

        Keywords/markers dictionary for the underlying node.

    - `property` **session**: `Session`

        Pytest session object.

    - **addfinalizer**(`finalizer`)     

        Add finalizer/teardown function to be called without arguments after the last test within the requesting test context finished execution.

    - **applymarker**(`marker`)     

        Apply a marker to a single test function invocation.

        This method is useful if you don’t want to have a keyword/marker on all function invocations.

        *Parameters*:

        - `marker(Union[str, MarkDecorator])` – An object created by a call to `pytest.mark.NAME(...)`.

    - **raiseerror**(`msg`)       

        Raise a FixtureLookupError exception.

        *Parameters*:

        - `msg (Optional[str])` – An optional custom error message.

    - **getfixturevalue**(`argname`)      

        Dynamically run a named fixture function.

        Declaring fixtures via function argument is recommended where possible. But if you can only decide whether to use another fixture at test setup time, you may use this function to retrieve it inside a fixture or test function body.

        This method can be used during the test setup phase or the test run phase, but during the test teardown phase a fixture’s value may not be available.

        *Parameters*:

        - `argname (str)` – The fixture name.

        *Raises*:

        - `pytest.FixtureLookupError` – If the given fixture could not be found.

## testdir {#testdir}

Identical to `pytester`, but provides an instance whose methods return legacy `py.path.local` objects instead when applicable.

New code should avoid using `testdir` in favor of `pytester`.

- ### `final class` Testdir     

    Similar to `Pytester`, but this class works with legacy `legacy_path` objects instead.

    All methods just forward to an internal `Pytester` instance, converting results to `legacy_path` objects as necessary.

    - `exception` **TimeoutExpired**

    - `property` **tmpdir**: `LocalPath`

        Temporary directory where tests are executed.

    - **make_hook_recorder**(`pluginmanager`)     

        See `Pytester.make_hook_recorder()`.

    - **chdir**()       

        See `Pytester.chdir()`.

    - **finalize**()        

        See `Pytester._finalize()`.

    - **makefile**(`ext, *args, **kwargs`)        

        See `Pytester.makefile()`.

    - **makeconftest**(`source`)      

        See `Pytester.makeconftest()`.

    - **makeini**(`source`)       

        See `Pytester.makeini()`.

    - **getinicfg**(`source`)     

        See `Pytester.getinicfg()`.

    - **makepyprojecttoml**(`source`)     

        See `Pytester.makepyprojecttoml()`.

    - **makepyfile**(`*args, **kwargs`)       

        See `Pytester.makepyfile()`.

    - **maketxtfile**(`*args, **kwargs`)      

        See `Pytester.maketxtfile()`.

    - **syspathinsert**(`path=None`)      

        See `Pytester.syspathinsert()`.

    - **mkdir**(`name`)       

        See `Pytester.mkdir()`.

    - **mkpydir**(`name`)     

        See `Pytester.mkpydir()`.

    - **copy_example**(`name=None`)       

        See `Pytester.copy_example()`.

    - **getnode**(`config, arg`)      

        See `Pytester.getnode()`.

    - **getpathnode**(`path`)     

        See `Pytester.getpathnode()`.

    - **genitems**(`colitems`)        

        See `Pytester.genitems()`.

    - **runitem**(`source`)       

        See `Pytester.runitem()`.

    - **inline_runsource**(`source, *cmdlineargs`)        

        See `Pytester.inline_runsource()`.

    - **inline_genitems**(`*args`)        

        See `Pytester.inline_genitems()`.

    - **inline_run**(`*args, plugins=(), no_reraise_ctrlc=False`)     

        See `Pytester.inline_run()`].

    - **runpytest_inprocess**(`*args, **kwargs`)      

        See `Pytester.runpytest_inprocess()`.

    - **runpytest**(`*args, **kwargs`)        

        See `Pytester.runpytest()`.

    - **parseconfig**(`*args`)        

        See `Pytester.parseconfig()`.

    - **parseconfigure**(`*args`)     

        See `Pytester.parseconfigure()`.

    - **getitem**(`source, funcname='test_func'`)     

        See `Pytester.getitem()`.

    - **getitems**(`source`)      

        See `Pytester.getitems()`.

    - **getmodulecol**(`source, configargs=(), withinit=False`)       

        See `Pytester.getmodulecol()`.

    - **collect_by_name**(`modcol, name`)     

        See `Pytester.collect_by_name()`.

    - **popen**(`cmdargs, stdout=-1, stderr=-1, stdin=NotSetType.token, **kw`)        

        See `Pytester.popen()`.

    - **run**(`*cmdargs, timeout=None, stdin=NotSetType.token`)       

        See `Pytester.run()`.

    - **runpython**(`script`)     

        See `Pytester.runpython()`.

    - **runpython_c**(`command`)      

        See `Pytester.runpython_c()`.

    - **runpytest_subprocess**(`*args, timeout=None`)     

        See `Pytester.runpytest_subprocess()`.

    - **spawn_pytest**(`string, expect_timeout=10.0`)     

        See `Pytester.spawn_pytest()`.

    - **spawn**(`cmd, expect_timeout=10.0`)       

        See `Pytester.spawn()`.

## tmp_path {#tmp-path}

*Tutorial*: [How to use temporary directories and files in tests](/python/pytest/how_to_guides/temp#how-to-use-temporary-directories-and-files-in-tests)

- ### tmp_path()      

    Return a temporary directory path object which is unique to each test function invocation, created as a sub directory of the base temporary directory.

    By default, a new base temporary directory is created each test session, and old bases are removed after 3 sessions, to aid in debugging. This behavior can be configured with `tmp_path_retention_count` and `tmp_path_retention_policy`. If `--basetemp` is used then it is cleared each session. See [The default base temporary](/python/pytest/how_to_guides/temp#the-default-base-temporary-directory) directory.

    The returned object is a `pathlib.Path` object.

## tmp_path_factory {#tmp-path-factory}

*Tutorial*: [The tmp_path_factory fixture](/python/pytest/how_to_guides/temp#the-tmp-path-factory-fixture)

`tmp_path_factory`  is an instance of `TempPathFactory`:

- ### `final class` TempPathFactory     

    Factory for temporary directories under the common base temp directory.

    The base directory can be configured using the `--basetemp` option.

    - **mktemp**(`basename, numbered=True`)       

        Create a new temporary directory managed by the factory.

        *Parameters*:

        - `basename(str)` – Directory base name, must be a relative path.

        - `numbered(bool)` – If `True`, ensure the directory is unique by adding a numbered suffix greater than - any existing one: `basename="foo-"` and `numbered=True` means that this function will create directories named `"foo-0"`, `"foo-1"`, `"foo-2"` and so on.

        *Returns*: The path to the new directory.

        *Return type*:  `Path`

    - **getbasetemp**()     

        Return the base temporary directory, creating it if needed.

        *Returns*: The base temporary directory.

        *Return type*: `Path`

## tmpdir {#tmpdir}

*Tutorial*: [The tmpdir and tmpdir_factory fixtures](/python/pytest/how_to_guides/temp#the-tmpdir-and-tmpdir-factory-fixtures)

- ### tmpdir()

    Return a temporary directory path object which is unique to each test function invocation, created as a sub directory of the base temporary directory.

    By default, a new base temporary directory is created each test session, and old bases are removed after 3 sessions, to aid in debugging. If `--basetemp` is used then it is cleared each session. See [The default base temporary directory](/python/pytest/how_to_guides/temp#the-default-base-temporary-directory).

    The returned object is a `legacy_path` object.

    ::: tip Note
    These days, it is preferred to use `tmp_path`.

    [About the tmpdir and tmpdir_factory fixtures](/python/pytest/how_to_guides/temp#the-tmpdir-and-tmpdir-factory-fixtures).
    :::

## tmpdir_factory {#tmpdir-factory}

*Tutorial*: [The tmpdir and tmpdir_factory fixtures](/python/pytest/how_to_guides/temp#the-tmpdir-and-tmpdir-factory-fixtures)

`tmpdir_factory` is an instance of `TempdirFactory`:

- ### `final class` TempdirFactory      

    Backward compatibility wrapper that implements `py.path.local` for `TempPathFactory`.

    ::: tip Note
    These days, it is preferred to use `tmp_path_factory`.

    [About the tmpdir and tmpdir_factory fixtures](/python/pytest/how_to_guides/temp#the-tmpdir-and-tmpdir-factory-fixtures).
    ::: 

    - **mktemp**(`basename, numbered=True`)     

        Same as `TempPathFactory.mktemp()`, but returns a `py.path.local` object.

    - **getbasetemp**()     

        Same as `TempPathFactory.getbasetemp()`, but returns a `py.path.local` object.