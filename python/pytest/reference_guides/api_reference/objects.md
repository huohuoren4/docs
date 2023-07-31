# Objects

Objects accessible from fixtures or hooks or importable from `pytest`.

## CallInfo

- final class **CallInfo**        

    Result/Exception info of a function invocation.

    - **excinfo**: `Optional[ExceptionInfo[BaseException]]`

        The captured exception of the call, if it raised.

    - **start**: `float`

        The system time when the call started, in seconds since the epoch.

    - **stop**: `float`

        The system time when the call ended, in seconds since the epoch.

    - **duration**: `float`

        The call duration, in seconds.

    - **when**: `Literal['collect', 'setup', 'call', 'teardown']`

        The context of invocation: “collect”, “setup”, “call” or “teardown”.

    - property **result**: `TResult`

        The return value of the call, if it didn’t raise.

        Can only be accessed if excinfo is None.

    - classmethod **from_call**(`func, when, reraise=None`)     

        Call func, wrapping the result in a CallInfo.

        *Parameters*:

        - `func (Callable[[], TResult])` – The function to call. Called without arguments.

        - `when (Literal['collect', 'setup', 'call', 'teardown'])` – The phase in which the function is called.

        - `reraise (Optional[Union[Type[BaseException], Tuple[Type[BaseException], ...]]])` – Exception or - exceptions that shall propagate if raised by the function, instead of being wrapped in the CallInfo.

## CollectReport

- final class **CollectReport**       

    - *Bases*: `BaseReport`

    Collection report object.

    Reports can contain arbitrary extra attributes.

    - **nodeid**: `str`

        Normalized collection nodeid.

    - **outcome**: `Literal['passed', 'failed', 'skipped']`

        Test outcome, always one of “passed”, “failed”, “skipped”.

    - **longrepr**: `Union[None, ExceptionInfo[BaseException], Tuple[str, int, str], str, TerminalRepr]`

        None or a failure representation.

    - **result**
        
        The collected items and collection nodes.

    - **sections**: `List[Tuple[str, str]]`

        Tuples of str `(heading, content)` with extra information for the test report. Used by pytest to add text captured from `stdout`, `stderr`, and intercepted logging events. May be used by other plugins to add arbitrary information to reports.

    - property **caplog**: `str`

        Return captured log lines, if log capturing is enabled.

        *New in version 3.5.*

    - property **capstderr**: `str`

        Return captured text from stderr, if capturing is enabled.

        *New in version 3.0.*

    - property **capstdout**: `str`

        Return captured text from stdout, if capturing is enabled.

        *New in version 3.0.*

    - property **count_towards_summary**: `bool`

        Experimental Whether this report should be counted towards the totals shown at the end of the test session: “1 passed, 1 failure, etc”.

        ::: tip Note
        This function is considered experimental, so beware that it is subject to changes even in patch releases.
        :::

    - property **failed**: `bool`

        Whether the outcome is failed.

    - property **fspath**: `str`

        The path portion of the reported node, as a string.

    - property **head_line**: `Optional[str]`

        Experimental The head line shown with longrepr output for this report, more commonly during traceback representation during failures:

        ```shell
        ________ Test.foo ________
        ```

        In the example above, the head_line is “Test.foo”.

        ::: tip Note
        This function is considered experimental, so beware that it is subject to changes even in patch releases.
        :::

    - property **longreprtext**: `str`

        Read-only property that returns the full string representation of `longrepr`.

        *New in version 3.0.*

    - property **passed**: `bool`

        Whether the outcome is passed.

    - property **skipped**: `bool`

        Whether the outcome is skipped.

## Config

- final class **Config**      

    Access to configuration values, pluginmanager and plugin hooks.

    - **Parameters**:

        - **pluginmanager** (`PytestPluginManager`) – A pytest `PluginManager`.

        - **invocation_params** (`InvocationParams`) – Object containing parameters regarding the [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main) invocation.

    - final class **InvocationParams**(`*, args, plugins, dir`)     

        Holds parameters passed during [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main).

        The object attributes are read-only.

        *New in version 5.1.*

        ::: tip Note
        Note that the environment variable `PYTEST_ADDOPTS` and the `addopts` ini option are handled by pytest, not being included in the `args` attribute.

        Plugins accessing `InvocationParams` must be aware of that.
        ::: 

    - **args**: `Tuple[str, ...]`

        The command-line arguments as passed to [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main).

    - **plugins**: `Optional[Sequence[Union[str, object]]]`

        Extra plugins, might be `None`.

    - **dir**: `Path`

        The directory from which [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main) was invoked.

    - class **ArgsSource**(`value`)     

        Indicates the source of the test arguments.

        *New in version 7.2.*

        - **ARGS** = 1

            Command line arguments.

        - **INCOVATION_DIR** = 2

            Invocation directory.

        - **TESTPATHS** = 3

            ‘testpaths’ configuration value.

    - **option**

        Access to command line option as attributes.

        - **Type**: [argparse.Namespace](https://docs.python.org/3/library/argparse.html#argparse.Namespace)

    - **invocation_params**

        The parameters with which pytest was invoked.

        *Type*: [InvocationParams](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config.InvocationParams)

    - **pluginmanager**

        The plugin manager handles plugin registration and hook invocation.

        *Type*: `PytestPluginManager`

    - **stash**

        A place where plugins can store information on the config for their own use.

        *Type*: `Stash`

    - property **rootpath**: `Path`

        The path to the [rootdir](https://docs.pytest.org/en/latest/reference/customize.html#rootdir).

        *Type*: [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

        *New in version 6.1.*

    - property **inipath**: `Optional[Path]`

        The path to the configfile.

        *Type*: `Optional[pathlib.Path]`

        *New in version 6.1.*

    - **add_cleanup**(`func`)     

        Add a function to be called when the config object gets out of use (usually coinciding with pytest_unconfigure).

    - classmethod **fromdictargs**(`option_dict, args`)     

        Constructor usable for subprocesses.

    - **issue_config_time_warning**(`warning, stacklevel`)      

        Issue and handle a warning during the “configure” stage.

        During `pytest_configure` we can’t capture warnings using the `catch_warnings_for_item` function because it is not possible to have hook wrappers around `pytest_configure`.

        This function is mainly intended for plugins that need to issue warnings during `pytest_configure` (or similar stages).

        *Parameters*:

        - `warning (Warning)` – The `warning` instance.

        - `stacklevel (int)` – `stacklevel` forwarded to `warnings.warn`.

    - **addinivalue_line**(`name, line`)        

        Add a line to an ini-file option. The option must have been declared but might not yet be set in which case the line becomes the first line in its value.

    - **getini**(`name`)        

        Return configuration value from an ini file.

        If the specified name hasn’t been registered through a prior parser.addini call (usually from a plugin), a ValueError is raised.

    - **getoption**(`name, default=<NOTSET>, skip=False`)       

        Return command line option value.

        *Parameters*:

        - `name (str)` – Name of the option. You may also specify the literal `--OPT` option instead of the “dest” option name.

        - `default` – Default value if no option of that name exists.

        - `skip (bool)` – If True, raise pytest.skip if option does not exists or has a None value.

    - **getvalue**(`name, path=None`)       

        *Deprecated*, use `getoption()` instead.

    - getvalueorskip(`name, path=None`)     

        *Deprecated*, use `getoption(skip=True)` instead.

## ExceptionInfo

- final class **ExceptionInfo**       

    Wraps `sys.exc_info()` objects and offers help for navigating the traceback.

    - classmethod **from_exception**(`exception, exprinfo=None`)        

        Return an ExceptionInfo for an existing exception.

        The exception must have a non-`None` `__traceback__` attribute, otherwise this function fails with an assertion error. This means that the exception must have been raised, or added a traceback with the with_traceback() method.

        *Parameters*:

        - `exprinfo (Optional[str])` – A text string helping to determine if we should strip AssertionError from the output. Defaults to the exception `message/__str__()`.

        *New in version 7.4.*

    - classmethod **from_exc_info**(`exc_info, exprinfo=None`)      

        Like `from_exception()`, but using old-style exc_info tuple.

    - classmethod **from_current**(`exprinfo=None`)       

        Return an `ExceptionInfo` matching the current traceback.

        ::: warning Warning
        Experimental API
        :::

        *Parameters*:

        - `exprinf (Optional[str])` – A text string helping to determine if we should strip - `AssertionError` from the output. Defaults to the exception `message/__str__()`.

    - classmethod **for_later**()     

        Return an unfilled ExceptionInfo.

    - **fill_unfilled**(`exc_info`)     

        Fill an unfilled ExceptionInfo created with `for_later()`.

    - property **type**: `Type[E]`

        The exception class.

    - property **value**: `E`

        The exception value.

    - property **tb**: `TracebackType`

        The exception raw traceback.

    - property **typename**: `str`

        The type name of the exception.

    - property **traceback**: `Traceback`

        The traceback.

    - **exconly**(`tryshort=False`)     

        Return the exception as a string.

        When ‘tryshort’ resolves to True, and the exception is an AssertionError, only the actual exception part of the exception representation is returned (so ‘AssertionError: ‘ is removed from the beginning).

    - **errisinstance**(`exc`)        

        Return True if the exception is an instance of exc.

        Consider using `isinstance(excinfo.value, exc)` instead.

    - **getrepr**(`showlocals=False, style='long', abspath=False, tbfilter=True, funcargs=False, - truncate_locals=True, chain=True`)       

        Return `str()`able representation of this exception info.

        *Parameters*:

        - `showlocals (bool)` – Show locals per traceback entry. Ignored if `style=="native"`.

        - `style (str)` – long|short|line|no|native|value traceback style.

        - `abspath (bool)` – If paths should be changed to absolute or left unchanged.

        - `tbfilter (Union[bool, Callable[[ExceptionInfo[BaseException]], Traceback]])` – A filter for traceback entries.

            If false, don’t hide any entries.

            If true, hide internal entries and entries that contain a local variable `__tracebackhide__ = True`.

            If a callable, delegates the filtering to the callable.

            Ignored if `style` is `"native"`.

        - `funcargs (bool)` – Show fixtures (“funcargs” for legacy purposes) per traceback entry.

        - `truncate_locals (bool)` – With `showlocals==True`, make sure locals can be safely represented as strings.

        - `chain (bool)` – If chained exceptions in Python 3 should be shown.

        *Changed in version 3.9*: Added the `chain` parameter.

    - **match**(`regexp`)       

        Check whether the regular expression `regexp` matches the string representation of the exception using [re.search()](https://docs.python.org/3/library/re.html#re.search).

        If it matches `True` is returned, otherwise an `AssertionError` is raised.

## ExitCode

- final class **ExitCode**(`value`)     

    Encodes the valid exit codes by pytest.

    Currently users and plugins may supply other exit codes as well.

    *New in version 5.0.*

    - **OK** = 0

        Tests passed.

    - **TESTS_FAILED** = 1

        Tests failed.

    - **INTERRUPTED** = 2

        pytest was interrupted.

    - **INTERNAL_ERROR** = 3

        An internal error got in the way.

    - **USAGE_ERROR** = 4

        pytest was misused.

    - **NO_TESTS_COLLECTED** = 5

        pytest couldn’t find tests.

## FixtureDef

- final class **FixtureDef**      

    - *Bases*: `Generic[FixtureValue]`

    A container for a fixture definition.

    *Note*: At this time, only explicitly documented fields and methods are considered public stable API.

    - property **scope**: `Literal['session', 'package', 'module', 'class', 'function']`

        Scope string, one of `“function”`, `“class”`,` “module”`, `“package”`, `“session”`.

## MarkDecorator

- class **MarkDecorator**     

    A decorator for applying a mark on test functions and classes.

    `MarkDecorators` are created with `pytest.mark`:

    ```python
    mark1 = pytest.mark.NAME              # Simple MarkDecorator
    mark2 = pytest.mark.NAME(name1=value) # Parametrized MarkDecorator
    ```

    and can then be applied as decorators to test functions:

    ```python
    @mark2
    def test_function():
        pass
    ```

    When a `MarkDecorator` is called, it does the following:

    1. If called with a single class as its only positional argument and no additional keyword arguments, it attaches the mark to the class so it gets applied automatically to all test cases found in that class.

    2. If called with a single function as its only positional argument and no additional keyword arguments, it attaches the mark to the function, containing all the arguments already stored internally in the `MarkDecorator`.

    3. When called in any other case, it returns a new `MarkDecorator` instance with the original `MarkDecorator’s` content updated with the arguments passed to this call.

    *Note*: The rules above prevent a `MarkDecorator` from storing only a single function or class reference as its positional argument with no additional keyword or positional arguments. You can work around this by using `with_args()`.

    - property **name**: `str`

        Alias for `mark.name`.

    - property **args**: `Tuple[Any, ...]`

        Alias for `mark.args`.

    - property **kwargs**: `Mapping[str, Any]`

        Alias for `mark.kwargs`.

    - **with_args**(`*args, **kwargs`)      

        Return a MarkDecorator with extra arguments added.

        Unlike calling the MarkDecorator, `with_args()` can be used even if the sole argument is a `callable/class`.

## MarkGenerator

- final class **MarkGenerator**       

    Factory for [MarkDecorator](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MarkDecorator) objects - exposed as a `pytest.mark` singleton instance.

    *Example*:

    ```python
    import pytest

    @pytest.mark.slowtest
    def test_function():
       pass
    ```

    applies a ‘slowtest’ [Mark](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Mark) on `test_function`.

## Mark

- final class **Mark**        

    A pytest mark.

    - **name**: `str`

        Name of the mark.

    - **args**: `Tuple[Any, ...]`

        Positional arguments of the mark decorator.

    - **kwargs**: `Mapping[str, Any]`

        Keyword arguments of the mark decorator.

    - **combined_with**(`other`)        

        Return a new Mark which is a combination of this Mark and another Mark.

        Combines by appending args and merging kwargs.

        *Parameters*:

        - `other (Mark)` – The mark to combine with.

        *Return type*: `Mark`

## Metafunc

- final class **Metafunc**        

    Objects passed to the pytest_generate_tests hook.

    They help to inspect a test function and to generate tests according to test configuration or values specified in the class or module where a test function is defined.

    - **definition**

        Access to the underlying [_pytest.python.FunctionDefinition](https://docs.pytest.org/en/latest/reference/reference.html#pytest.python.FunctionDefinition).

    - **config**

        Access to the [pytest.Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) object for the test session.

    - **module**

        The module object where the test function is defined in.

    - **function**

        Underlying Python test function.

    - **fixturenames**

        Set of fixture names required by the test function.

    - **cls**

        Class object where the test function is defined in or `None`.

    - **parametrize**(`argnames, argvalues, indirect=False, ids=None, scope=None, *, _param_mark=None`)       

        Add new invocations to the underlying test function using the list of argvalues for the given argnames. Parametrization is performed during the collection phase. If you need to setup expensive resources see about setting indirect to do it rather than at test setup time.

        Can be called multiple times, in which case each call parametrizes all previous parametrizations, e.g.

        ```shell
        unparametrized:         t
        parametrize ["x", "y"]: t[x], t[y]
        parametrize [1, 2]:     t[x-1], t[x-2], t[y-1], t[y-2]
        ```

        *Parameters*:

        - `argnames (Union[str, Sequence[str]])` – A comma-separated string denoting one or more argument names, or a list/tuple of argument strings.

        - `argvalues (Iterable[Union[ParameterSet, Sequence[object], object]])` – The list of argvalues determines how often a test is invoked with different argument values. If only one argname was specified argvalues is a list of values. If N argnames were specified, argvalues must be a list of N-tuples, where each tuple-element specifies a value for its respective argname.

        - `indirect (Union[bool, Sequence[str]])` – A list of arguments’ names (subset of argnames) or a boolean. If True the list contains all names from the argnames. Each argvalue corresponding to an argname in this list will be passed as request.param to its respective argname fixture function so that it can perform more expensive setups during the setup phase of a test rather than at collection time.

        - `ids (Optional[Union[Iterable[Optional[object]], Callable[[Any], Optional[object]]]])` – Sequence of (or generator for) ids for `argvalues`, or a callable to return part of the id for each argvalue. With sequences (and generators like `itertools.count()`) the returned ids should be of type `string`, `int`, `float`, `bool`, or `None`. They are mapped to the corresponding index in `argvalues`. `None` means to use the auto-generated id. If it is a callable it will be called for each entry in `argvalues`, and the return value is used as part of the auto-generated id for the whole set (where parts are joined with dashes (“-“)). This is useful to provide more specific ids for certain items, e.g. dates. Returning `None` will use an auto-generated id. If no ids are provided they will be generated automatically from the argvalues.

        - `scope (Optional[Literal['session', 'package', 'module', 'class', 'function']])` – If specified it denotes the scope of the parameters. The scope is used for grouping tests by parameter instances. It will also override any fixture-function defined scope, allowing to set a dynamic scope using test context or configuration.

## Parser

- final class **Parser**      

    `Parser` for command line arguments and `ini`-file values.

    - **Variables**:

        - **extra_info** – Dict of generic param -> value to display in case there’s an error processing the command line arguments.

    - **getgroup**(`name, description='', after=None`)        

        Get (or create) a named option Group.

        *Parameters*:

        - `name (str)` – Name of the option group.

        - `description (str)` – Long description for –help output.

        - `after (Optional[str])` – Name of another group, used for ordering –help output.

        *Returns*: The option group.

        *Return type*: `OptionGroup`

        The returned group object has an `addoption` method with the same signature as [parser.addoption](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Parser.addoption) but will be shown in the respective group in the output of `pytest --help`.

    - **addoption**(`*opts, **attrs`)       

        Register a command line option.

        *Parameters*:

        - `opts (str)` – Option names, can be short or long options.

        - `attrs (Any)` – Same attributes as the argparse library’s `add_argument()` function accepts.

        After command line parsing, options are available on the pytest config object via `config.option.NAME` where `NAME` is usually set by passing a `dest` attribute, for example `addoption("--long", dest="NAME", ...)`.

    - **parse_known_args**(`args, namespace=None`)      

        Parse the known arguments at this point.

        *Returns*: An argparse namespace object.

        *Return type*: `Namespace`

    - **parse_known_and_unknown_args**(`args, namespace=None`)        

        Parse the known arguments at this point, and also return the remaining unknown arguments.

        *Returns*: A tuple containing an argparse namespace object for the known arguments, and a list of the unknown arguments.

        *Return type*: `Tuple[Namespace, List[str]]`

    - **addini**(`name, help, type=None, default=None`)     

        Register an ini-file option.

        *Parameters*:

        - `name (str)` – Name of the ini-variable.

        - `type (Optional[Literal['string', 'paths', 'pathlist', 'args', 'linelist', 'bool']])` – Type of the variable. Can be:

            - `string`: a string

            - `bool`: a boolean

            - `args`: a list of strings, separated as in a shell

            - `linelist`: a list of strings, separated by line breaks

            - `paths`: a list of [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path), separated as in a shell

            - `pathlist`: a list of `py.path`, separated as in a shell

            *New in version 7.0*: The `paths` variable type.

            Defaults to `string` if `None` or not passed.

        - `default (Optional[Any])` – Default value if no ini-file option exists but is queried.

        The value of ini-variables can be retrieved via a call to [config.getini(name)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config.getini).

## OptionGroup

- class **OptionGroup**       

    A group of options shown in its own section.

    - **addoption**(`*opts, **attrs`)       

        Add an option to this group.

        If a shortened version of a long option is specified, it will be suppressed in the help. `addoption('--twowords', '--two-words')` results in help showing `--two-words` only, but `--twowords` gets accepted and the automatic destination is in `args.twowords`.

        *Parameters*:

        - `opts (str)` – Option names, can be short or long options.

        - `attrs (Any)` – Same attributes as the argparse library’s `add_argument()` function accepts.

## PytestPluginManager

- final class **PytestPluginManager**     

    - *Bases*: `PluginManager`

    - A [pluggy.PluginManager](https://pluggy.readthedocs.io/en/stable/api_reference.html#pluggy.PluginManager) with additional pytest-specific functionality:

        - Loading plugins from the command line, `PYTEST_PLUGINS` env variable and `pytest_plugins` global variables found in plugins being loaded.

        - `conftest.py` loading during start-up.

    - **parse_hookimpl_opts**(`plugin, name`)       

    - **parse_hookspec_opts**(`module_or_class, name`)      

    - **register**(`plugin, name=None`)     

        Register a plugin and return its name.

        If a name is not specified, a name is generated using get_canonical_name().

        If the name is blocked from registering, returns None.

        If the plugin is already registered, raises a ValueError.

    - **getplugin**(`name`)       

    - **hasplugin**(`name`)       

        Return whether a plugin with the given name is registered.

    - **import_plugin**(`modname, consider_entry_points=False`)     

        Import a plugin with `modname`.

        If `consider_entry_points` is True, entry point names are also considered to find a plugin.

    - **add_hookcall_monitoring**(`before, after`)

        Add before/after tracing functions for all hooks.

        Returns an undo function which, when called, removes the added tracers.

        `before(hook_name, hook_impls, kwargs)` will be called ahead of all hook calls and receive a - hookcaller instance, a list of HookImpl instances and the keyword arguments for the hook call.

        `after(outcome, hook_name, hook_impls, kwargs)` receives the same arguments as `before` but also a - `_Result` object which represents the result of the overall hook call.

    - **add_hookspecs**(`module_or_class`)

        Add new hook specifications defined in the given `module_or_class`.

        Functions are recognized as hook specifications if they have been decorated with a matching `HookspecMarker`.

    - **check_pending**()

        Verify that all hooks which have not been verified against a hook specification are optional, otherwise raise `PluginValidationError`.

    - **enable_tracing**()

        Enable tracing of hook calls.

        Returns an undo function which, when called, removes the added tracing.

    - **get_canonical_name**(`plugin`)

        Return a canonical name for a plugin object.

        Note that a plugin may be registered under a different name specified by the caller of [register(plugin, name)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.PytestPluginManager.register). To obtain the name of n registered plugin use [get_name(plugin)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.PytestPluginManager.get_name) instead.

    - **get_hookcallers**(`plugin`)

        Get all hook callers for the specified plugin.

    - **get_name**(`plugin`)

        Return the name the plugin is registered under, or `None` if is isn’t.

    - **get_plugin**(`name`)

        Return the plugin registered under the given name, if any.

    - **get_plugins**()

        Return a set of all registered plugin objects.

    - **has_plugin**(`name`)

        Return whether a plugin with the given name is registered.

    - **is_blocked**(`name`)

        Return whether the given plugin name is blocked.

    - **is_registered**(`plugin`)

        Return whether the plugin is already registered.

    - **list_name_plugin**()

        Return a list of (name, plugin) pairs for all registered plugins.

    - **list_plugin_distinfo**()

        Return a list of (plugin, distinfo) pairs for all setuptools-registered plugins.

    - **load_setuptools_entrypoints**(`group, name=None`)

        Load modules from querying the specified setuptools `group`.

        *Parameters*:

        - `group (str)` – Entry point group to load plugins.

        - `name (str)` – If given, loads only plugins with the given `name`.

        *Return type*: `int`

        *Returns*: The number of plugins loaded by this call.

    - **set_blocked**(`name`)

        Block registrations of the given name, unregister if already registered.

    - **subset_hook_caller**(`name, remove_plugins`)

        Return a proxy `_hooks._HookCaller` instance for the named method which manages calls to all registered plugins except the ones from `remove_plugins`.

    - **unregister**(`plugin=None, name=None`)

        Unregister a plugin and all of its hook implementations.

        The plugin can be specified either by the plugin object or the plugin name. If both are specified, they must agree.

## TestReport

- final class **TestReport**      

    - Bases: `BaseReport`

    Basic test report object (also used for setup and teardown calls if they fail).

    Reports can contain arbitrary extra attributes.

    - **nodeid**: `str`

        Normalized collection nodeid.

    - **location**: `Tuple[str, Optional[int], str]`

        A (filesystempath, lineno, domaininfo) tuple indicating the actual location of a test item - it might be different from the collected one e.g. if a method is inherited from a different module. The filesystempath may be relative to `config.rootdir`. The line number is 0-based.

    - **keywords**: `Mapping[str, Any]`

        A name -> value dictionary containing all keywords and markers associated with a test invocation.

    - **outcome**: `Literal['passed', 'failed', 'skipped']`

        Test outcome, always one of “passed”, “failed”, “skipped”.

    - **longrepr**: `Union[None, ExceptionInfo[BaseException], Tuple[str, int, str], str, TerminalRepr]`

        None or a failure representation.

    - **when**: `Optional[str]`

        One of ‘setup’, ‘call’, ‘teardown’ to indicate runtest phase.

    - **user_properties**

        User properties is a list of tuples (name, value) that holds user defined properties of the test.

    - **sections**: `List[Tuple[str, str]]`

        Tuples of str `(heading, content)` with extra information for the test report. Used by pytest to add text captured from `stdout`, `stderr`, and intercepted logging events. May be used by other plugins to add arbitrary information to reports.

    - **duration**: `float`

        Time it took to run just the test.

    - **start**: `float`

        The system time when the call started, in seconds since the epoch.

    - **stop**: `float`

        The system time when the call ended, in seconds since the epoch.

    - classmethod **from_item_and_call**(`item, call`)      

        Create and fill a TestReport with standard item and call info.

        *Parameters*:

        - `item (Item)` – The item.

        - `call (CallInfo[None])` – The call info.

    - property **caplog**: `str`

        Return captured log lines, if log capturing is enabled.

        *New in version 3.5.*

    - property **capstderr**: `str`

        Return captured text from stderr, if capturing is enabled.

        *New in version 3.0.*

    - property **capstdout**: `str`

        Return captured text from stdout, if capturing is enabled.

        *New in version 3.0.*

    - property **count_towards_summary**: `bool`

        Experimental Whether this report should be counted towards the totals shown at the end of the test session: “1 passed, 1 failure, etc”.

        ::: tip Note
        This function is considered experimental, so beware that it is subject to changes even in patch releases.
        ::: 

    - property **failed**: `bool`

        Whether the outcome is failed.

    - property **fspath**: `str`

        The path portion of the reported node, as a string.

    - property **head_line**: `Optional[str]`

        Experimental The head line shown with longrepr output for this report, more commonly during traceback representation during failures:

        ```shell
        ________ Test.foo ________
        ```

        In the example above, the head_line is “Test.foo”.

        ::: tip Note
        This function is considered experimental, so beware that it is subject to changes even in patch releases.
        :::

    - property **longreprtext**: `str`

        Read-only property that returns the full string representation of `longrepr`.

        *New in version 3.0.*

    - property **passed**: `bool`

        Whether the outcome is passed.

    - property **skipped**: `bool`

        Whether the outcome is skipped.

## TestShortLogReport

- class **TestShortLogReport**        

    Used to store the test status result category, shortletter and verbose word. For example `"rerun", "R", ("RERUN", {"yellow": True})`.

    - **Variables**:

        - **category** – The class of result, for example `“passed”`, `“skipped”`, `“error”`, or the empty string.

        - **letter** – The short letter shown as testing progresses, for example `"."`, `"s"`, `"E"`, or the empty string.

        - **word** – Verbose word is shown as testing progresses in verbose mode, for example `"PASSED"`, `"SKIPPED"`, `"ERROR"`, or the empty string.

    - **category**: `str`

        Alias for field number 0

    - **letter**: `str`

        Alias for field number 1

    - **word**: `Union[str, Tuple[str, Mapping[str, bool]]]`

        Alias for field number 2

## _Result

Result object used within [hook wrappers](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#hookwrapper), see [_Result in the pluggy documentation](https://pluggy.readthedocs.io/en/stable/api_reference.html#pluggy._callers._Result) for more information.

## Stash

- class **Stash**     

    `Stash` is a type-safe heterogeneous mutable mapping that allows keys and value types to be defined separately from where it (the `Stash`) is created.

    Usually you will be given an object which has a `Stash`, for example [Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) or a [Node](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.Node):

    ```python
    stash: Stash = some_object.stash
    ```

    If a module or plugin wants to store data in this `Stash`, it creates [StashKeys](https://docs.pytest.org/en/latest/reference/reference.html#pytest.StashKey) for its keys (at the module level):

    ```python
    # At the top-level of the module
    some_str_key = StashKey[str]()
    some_bool_key = StashKey[bool]()
    ```

    To store information:

    ```python
    # Value type must match the key.
    stash[some_str_key] = "value"
    stash[some_bool_key] = True
    ```

    To retrieve the information:

    ```python
    # The static type of some_str is str.
    some_str = stash[some_str_key]
    # The static type of some_bool is bool.
    some_bool = stash[some_bool_key]
    ```

    - **__setitem__**(`key, value`)     

        Set a value for key.

    - **__getitem__**(`key`)        

        Get the value for key.

        Raises `KeyError` if the key wasn’t set before.

    - **get**(`key, default`)       

        Get the value for key, or return default if the key wasn’t set before.

    - **setdefault**(`key, default`)        

        Return the value of key if already set, otherwise set the value of key to default and return - default.

    - **__delitem__**(`key`)        

        Delete the value for key.

        Raises `KeyError` if the key wasn’t set before.

    - **__contains__**(`key`)       

        Return whether key was set.

    - **__len__**()       

        Return how many items exist in the stash.

- class **StashKey**      

    - *Bases*: `Generic[T]`

    `StashKey` is an object used as a key to a [Stash](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Stash).

    A `StashKey` is associated with the type T of the value of the key.

    A `StashKey` is unique and cannot conflict with another key.
