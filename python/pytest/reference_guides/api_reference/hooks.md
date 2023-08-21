# Hooks

*Tutorial*: [Writing plugins](/python/pytest/how_to_guides/write_plugin#writing-plugins)

Reference to all hooks which can be implemented by [conftest.py files](/python/pytest/how_to_guides/write_plugin#conftest-py-local-per-directory-plugins) and [plugins](/python/pytest/how_to_guides/write_plugin#writing-plugins).

## Bootstrapping hooks

Bootstrapping hooks called for plugins registered early enough (internal and setuptools plugins).

- **pytest_load_initial_conftests**(`early_config, parser, args`)       

    Called to implement the loading of initial conftest files ahead of command line option parsing.

    ::: tip Note
    This hook will not be called for `conftest.py` files, only for setuptools plugins.
    :::

    *Parameters*:

    - `early_config (Config)` – The pytest config object.

    - `args (List[str])` – Arguments passed on the command line.

    - `parser (Parser)` – To add command line options.

- **pytest_cmdline_preparse**(`config, args`)       

    *(Deprecated)* modify command line arguments before option parsing.

    This hook is considered deprecated and will be removed in a future pytest version. Consider using `pytest_load_initial_conftests` instead.

    ::: tip Note
    This hook will not be called for `conftest.py` files, only for setuptools plugins.
    ::: 

    *Parameters*:

    - `config (Config)` – The pytest config object.

    - `args (List[str])` – Arguments passed on the command line.

- **pytest_cmdline_parse**(`pluginmanager, args`)       

    Return an initialized `Config`, parsing the specified args.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    ::: tip Note
    This hook will only be called for plugin classes passed to the `plugins` arg when using `pytest.main` to perform an in-process test run.
    ::: 

    *Parameters*:

    - `pluginmanager (PytestPluginManager)` – The pytest plugin manager.

    - `args (List[str])` – List of arguments passed on the command line.

    *Returns*: A pytest config object.

    *Return type*: `Optional[Config]`

- **pytest_cmdline_main**(`config`)     

    Called for performing the main command line action. The default implementation will invoke the configure hooks and runtest_mainloop.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `config (Config)` – The pytest config object.

    *Returns*: The exit code.

    *Return type*: `Optional[Union[ExitCode, int]]`

## Initialization hooks

Initialization hooks called for plugins and `conftest.py` files.

- **pytest_addoption**(`parser, pluginmanager`)     

    Register argparse-style options and ini-style config values, called once at the beginning of a test run.

    ::: tip Note
    This function should be implemented only in plugins or `conftest.py` files situated at the tests root directory due to how pytest [discovers plugins during startup](/python/pytest/how_to_guides/write_plugin#plugin-discovery-order-at-tool-startup).
    :::

    *Parameters*:

    - `parser (pytest.Parser)` – To add command line options, call `parser.addoption(...`). To add ini-file values call `parser.addini(...)`.

    - `pluginmanager (pytest.PytestPluginManager)` – The pytest plugin manager, which can be used to install `hookspec()`’s or `hookimpl()`’s and allow one plugin to call another plugin’s hooks to change how command line options are added.

    Options can later be accessed through the `config` object, respectively:

    - `config.getoption(name)` to retrieve the value of a command line option.

    - `config.getini(name)` to retrieve a value read from an ini-style file.

    The config object is passed around on many internal objects via the `.config` attribute or can be retrieved as the `pytestconfig` fixture.

    ::: tip Note
    This hook is incompatible with hook wrappers.
    :::

- **pytest_addhooks**(`pluginmanager`)        

    Called at plugin registration time to allow adding new hooks via a call to `pluginmanager.add_hookspecs(module_or_class, prefix)`.

    *Parameters*:

    - `pluginmanager (pytest.PytestPluginManager)` – The pytest plugin manager.

    ::: tip Note
    This hook is incompatible with hook wrappers.
    ::: 

- **pytest_configure**(`config`)        

    Allow plugins and conftest files to perform initial configuration.

    This hook is called for every plugin and initial conftest file after command line options have been parsed.

    After that, the hook is called for other conftest files as they are imported.

    ::: tip Note
    This hook is incompatible with hook wrappers.
    :::

    *Parameters*:

    - `config (pytest.Config)` – The pytest `config` object.

- **pytest_unconfigure**(`config`)        

    Called before test process is exited.

    *Parameters*:

    - `config (Config)` – The pytest config object.

- **pytest_sessionstart**(`session`)      

    Called after the `Session` object has been created and before performing collection and entering the run test loop.

    *Parameters*:

    - `session (Session)` – The pytest session object.

- **pytest_sessionfinish**(`session, exitstatus`)     

    Called after whole test run finished, right before returning the exit status to the system.

    *Parameters*:

    - `session (Session)` – The pytest session object.

    - `exitstatus (Union[int, ExitCode])` – The status which pytest will return to the system.

- **pytest_plugin_registered**(`plugin, manager`)     

    A new pytest plugin got registered.

    *Parameters*:

    - `plugin (_PluggyPlugin)` – The plugin module or instance.

    - `manager (pytest.PytestPluginManager)` – pytest plugin manager.

    ::: tip Note
    This hook is incompatible with hook wrappers.
    ::: 

## Collection hooks

`pytest` calls the following hooks for collecting files and directories:

- **pytest_collection**(`session`)        

    Perform the collection phase for the given session.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result). The return value is not used, but only stops further processing.

    The default collection phase is this (see individual hooks for full details):

    1. Starting from `session` as the initial collector:

       - `pytest_collectstart(collector)`

       - `report = pytest_make_collect_report(collector)`

       - `pytest_exception_interact(collector, call, report)` if an interactive exception occurred

       - For each collected node:

           - If an item, `pytest_itemcollected(item)`

           - If a collector, recurse into it.

       - `pytest_collectreport(report)`

    2. `pytest_collection_modifyitems(session, config, items)`

       - `pytest_deselected(items)` for any deselected items (may be called multiple times)

    3. `pytest_collection_finish(session)`

    4. Set `session.items` to the list of collected items

    5. Set `session.testscollected` to the number of collected items

    You can implement this hook to only perform some action before collection, for example the terminal plugin uses it to start displaying the collection counter (and returns `None`).

    *Parameters*:

  - `session (Session)` – The pytest session object.

- **pytest_ignore_collect**(`collection_path, path, config`)      

    Return True to prevent considering this path for collection.

    This hook is consulted for all files and directories prior to calling more specific hooks.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `collection_path(Path)` – The path to analyze.

    - `path(LEGACY_PATH)` – The path to analyze (deprecated).

    - `config(Config)` – The pytest config object.

    *Changed in version 7.0.0*: The `collection_path` parameter was added as a `pathlib.Path` equivalent of the `path` parameter. The `path` parameter has been deprecated.

- **pytest_collect_file**(`file_path, path, parent`)      

    Create a `Collector` for the given path, or None if not relevant.

    The new node needs to have the specified `parent` as a parent.

    *Parameters*:

    - `file_path (Path)` – The path to analyze.

    - `path (LEGACY_PATH)` – The path to collect (deprecated).

    *Changed in version 7.0.0*: The `file_path` parameter was added as a `pathlib.Path` equivalent of the `path` parameter. The `path` parameter has been deprecated.

- **pytest_pycollect_makemodule**(`module_path, path, parent`)      

    Return a `pytest.Module` collector or None for the given path.

    This hook will be called for each matching test module path. The `pytest_collect_file` hook needs to be used if you want to create test modules for files that do not match as a test module.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `module_path (Path)` – The path of the module to collect.

    - `path (LEGACY_PATH)` – The path of the module to collect (deprecated).

    *Changed in version 7.0.0*: The `module_path` parameter was added as a `pathlib.Path` equivalent of the `path` parameter.

    The `path` parameter has been deprecated in favor of `fspath`.

For influencing the collection of objects in Python modules you can use the following hook:

- **pytest_pycollect_makeitem**(`collector, name, obj`)       

    Return a custom item/collector for a Python object in a module, or None.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `collector (Union[Module, Class])` – The module/class collector.

    - `name (str)` – The name of the object in the module/class.

    - `obj (object)` – The object.

    *Returns*: The created items/collectors.

    *Return type*: `Union[None, Item, Collector, List[Union[Item, Collector]]]`

- **pytest_generate_tests**(`metafunc`)     

    Generate (multiple) parametrized calls to a test function.

    *Parameters*：

    - `metafunc (Metafunc)` – The Metafunc helper for the test function.

- **pytest_make_parametrize_id**(`config, val, argname`)        

    Return a user-friendly string representation of the given `val` that will be used by @pytest.mark.parametrize calls, or None if the hook doesn’t know about `val`.

    The parameter name is available as `argname`, if required.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `config (Config)` – The pytest config object.

    - `val (object)` – The parametrized value.

    - `argname (str)` – The automatic parameter name produced by pytest.

Hooks for influencing test skipping:

- **pytest_markeval_namespace**(`config`)       

    Called when constructing the globals dictionary used for evaluating string conditions in xfail/skipif markers.

    This is useful when the condition for a marker requires objects that are expensive or impossible to obtain during collection time, which is required by normal boolean conditions.

    *New in version 6.2.*

    *Parameters*: 

    - `config (Config)` – The pytest config object.

    *Returns*: A dictionary of additional globals to add.

    *Return type*: `Dict[str, Any]`

After collection is complete, you can modify the order of items, delete or otherwise amend the test items:

- **pytest_collection_modifyitems**(`session, config, items`)       

    Called after collection has been performed. May filter or re-order the items in-place.

    *Parameters*:

    - `session (Session)` – The pytest session object.

    - `config (Config)` – The pytest config object.

    - `items (List[Item])` – List of item objects.

    ::: tip Note
    If this hook is implemented in `conftest.py` files, it always receives all collected items, not only those under the `conftest.py` where it is implemented.
    ::: 

- **pytest_collection_finish**(`session`)       

    Called after collection has been performed and modified.

    *Parameters*:

    - `session (Session)` – The pytest session object.

## Test running (runtest) hooks

All runtest related hooks receive a `pytest.Item` object.

- **pytest_runtestloop**(`session`)       

    Perform the main runtest loop (after collection finished).

    The default hook implementation performs the runtest protocol for all items collected in the session (`session.items`), unless the collection failed or the `collectonly` pytest option is set.

    If at any point `pytest.exit()` is called, the loop is terminated immediately.

    If at any point `session.shouldfail` or `session.shouldstop` are set, the loop is terminated after the runtest protocol for the current item is finished.

    *Parameters*:

    - `session (Session)` – The pytest session object.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result). The return value is not used, but only stops further processing.

- **pytest_runtest_protocol**(`item, nextitem`)     

    Perform the runtest protocol for a single test item.

    The default runtest protocol is this (see individual hooks for full details):

    `pytest_runtest_logstart(nodeid, location)`

    *Setup phase*:

    - `call = pytest_runtest_setup(item) (wrapped in CallInfo(when="setup"))`

    - `report = pytest_runtest_makereport(item, call)`

    - `pytest_runtest_logreport(report)`

    - `pytest_exception_interact(call, report)` if an interactive exception occurred

    *Call phase*, if the the setup passed and the `setuponly` pytest option is not set:

    - `call = pytest_runtest_call(item)` (wrapped in `CallInfo(when="call")`)

    - `report = pytest_runtest_makereport(item, call)`

    - `pytest_runtest_logreport(report)`

    - `pytest_exception_interact(call, report)` if an interactive exception occurred

    *Teardown phase*:

    - `call = pytest_runtest_teardown(item, nextitem)` (wrapped in `CallInfo(when="teardown")`)

    - `report = pytest_runtest_makereport(item, call)`

    - `pytest_runtest_logreport(report)`

    - `pytest_exception_interact(call, report)` if an interactive exception occurred

- **pytest_runtest_logfinish**(`nodeid, location`)

    *Parameters*:

    - `item (Item)` – Test item for which the runtest protocol is performed.

    - `nextitem (Optional[Item])` – The scheduled-to-be-next test item (or None if this is the end my friend).

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result). The return value is not used, but only stops further processing.

- **pytest_runtest_logstart**(`nodeid, location`)     

    Called at the start of running the runtest protocol for a single item.

    See `pytest_runtest_protocol` for a description of the runtest protocol.

    *Parameters*:

    - `nodeid (str)` – Full node ID of the item.

    - `location (Tuple[str, Optional[int], str])` – A tuple of `(filename, lineno, testname)` where `filename` is a file path relative to `config.rootpath` and `lineno` is 0-based.

- **pytest_runtest_logfinish**(`nodeid, location`)        

    Called at the end of running the runtest protocol for a single item.

    See `pytest_runtest_protocol` for a description of the runtest protocol.

    *Parameters*:

    - `nodeid(str)` – Full node ID of the item.

    - `location(Tuple[str, Optional[int], str])` – A tuple of `(filename, lineno, testname)` where `filename` is a file path relative to `config.rootpath` and `lineno` is 0-based.

- **pytest_runtest_setup**(`item`)        

    Called to perform the setup phase for a test item.

    The default implementation runs `setup()` on `item` and all of its parents (which haven’t been setup yet). This includes obtaining the values of fixtures required by the item (which haven’t been obtained yet).

    *Parameters*:

    - `item (Item)` – The item.

- **pytest_runtest_call**(`item`)       

    Called to run the test for test item (the call phase).

    The default implementation calls `item.runtest()`.

    *Parameters*:

    - `item (Item)` – The item.

- **pytest_runtest_teardown**(`item, nextitem`)     

    Called to perform the teardown phase for a test item.

    The default implementation runs the finalizers and calls `teardown()` on `item` and all of its parents (which need to be torn down). This includes running the teardown phase of fixtures required by the item (if they go out of scope).

    *Parameters*:

    - `item (Item)` – The item.

    - `nextitem (Optional[Item])` – The scheduled-to-be-next test item (None if no further test item is scheduled). This argument is used to perform exact teardowns, i.e. calling just enough finalizers so that nextitem only needs to call setup functions.

- **pytest_runtest_makereport**(`item, call`)     

    Called to create a `TestReport` for each of the setup, call and teardown runtest phases of a test item.

    See `pytest_runtest_protocol` for a description of the runtest protocol.

    *Parameters*:

    - `item (Item)` – The item.

    - `call (CallInfo[None])` – The `CallInfo` for the phase.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    For deeper understanding you may look at the default implementation of these hooks in `_pytest.runner` and maybe also in `_pytest.pdb` which interacts with `_pytest.capture` and its input/output capturing in order to immediately drop into interactive debugging when a test failure occurs.

- **pytest_pyfunc_call**(`pyfuncitem`)        

    Call underlying test function.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `pyfuncitem (Function)` – The function item.

## Reporting hooks

Session related reporting hooks:

- **pytest_collectstart**(`collector`)      

    Collector starts collecting.

    *Parameters*:

    - `collector (Collector)` – The `collector`.

- **pytest_make_collect_report**(`collector`)       

    Perform `collector.collect()` and return a `CollectReport`.

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    *Parameters*:

    - `collector (Collector)` – The `collector`.

- **pytest_itemcollected**(`item`)      

    We just collected a test item.

    *Parameters*:

    - `item (Item)` – The `item`.

- **pytest_collectreport**(`report`)        

    Collector finished collecting.

    *Parameters*:

    - `report(CollectReport)` – The collect report.

- **pytest_deselected**(`items`)      

    Called for deselected test items, e.g. by keyword.

    May be called multiple times.

    *Parameters*:

    - `items (Sequence[Item])` – The items.

- **pytest_report_header**(`config, start_path, startdir`)    

    Return a string or list of strings to be displayed as header info for terminal reporting.

    *Parameters*:

    - `config (Config)` – The pytest config object.

    - `start_path (Path)` – The starting dir.

    - `startdir (LEGACY_PATH)` – The starting dir (deprecated).

    ::: tip Note
    Lines returned by a plugin are displayed before those of plugins which ran before it. If you want to have your line(s) displayed first, use [trylast=True](/python/pytest/how_to_guides/hook_func#hook-function-ordering-call-example).
    :::

    ::: tip Note
    This function should be implemented only in plugins or `conftest.py` files situated at the tests root directory due to how pytest [discovers plugins during startup](/python/pytest/how_to_guides/write_plugin#plugin-discovery-order-at-tool-startup).
    ::: 

    *Changed in version 7.0.0*: The `start_path` parameter was added as a `pathlib.Path` equivalent of the `startdir` parameter. The `startdir` parameter has been deprecated.

- **pytest_report_collectionfinish**(`config, start_path, startdir, items`)     

    Return a string or list of strings to be displayed after collection has finished successfully.

    These strings will be displayed after the standard “collected X items” message.

    *New in version 3.2*.

    *Parameters*:

    - config (Config) – The pytest config object.

    - start_path (Path) – The starting dir.

    - startdir (LEGACY_PATH) – The starting dir (deprecated).

    - items (Sequence[Item]) – List of pytest items that are going to be executed; this list should not be modified.

    ::: tip Note
    Lines returned by a plugin are displayed before those of plugins which ran before it. If you want to have your line(s) displayed first, use [trylast=True](/python/pytest/how_to_guides/hook_func#hook-function-ordering-call-example).
    :::

    *Changed in version 7.0.0*: The `start_path` parameter was added as a `pathlib.Path` equivalent of the `startdir` parameter. The `startdir` parameter has been deprecated.

- **pytest_report_teststatus**(`report, config`)      

    Return result-category, shortletter and verbose word for status reporting.

    The result-category is a category in which to count the result, for example “passed”, “skipped”, “error” or the empty string.

    The shortletter is shown as testing progresses, for example “.”, “s”, “E” or the empty string.

    The verbose word is shown as testing progresses in verbose mode, for example “PASSED”, “SKIPPED”, “ERROR” or the empty string.

    pytest may style these implicitly according to the report outcome. To provide explicit styling, return a tuple for the verbose word, for example `"rerun", "R", ("RERUN", {"yellow": True})`.

    *Parameters*:

    - `report (Union[CollectReport, TestReport])` – The report object whose status is to be returned.

    - `config (Config)` – The pytest `config` object.

    *Returns*: The test status.

    *Return type*: `TestShortLogReport | Tuple[str, str, Union[str, Tuple[str, Mapping[str, bool]]]]`

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

- **pytest_report_to_serializable**(`config, report`)     

    Serialize the given report object into a data structure suitable for sending over the wire, e.g. converted to JSON.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

    - `report (Union[CollectReport, TestReport])` – The report.

- **pytest_report_from_serializable**(`config, data`)     

     Restore a report object previously serialized with `pytest_report_to_serializable`.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

- **pytest_terminal_summary**(`terminalreporter, exitstatus, config`)     

    Add a section to terminal summary reporting.

    *Parameters*:

    - `terminalreporter (TerminalReporter)` – The internal terminal reporter object.

    - `exitstatus (ExitCode)` – The exit status that will be reported back to the OS.

    - `config (Config)` – The pytest config object.

    *New in version 4.2*: The `config` parameter.

- **pytest_fixture_setup**(`fixturedef, request`)       

    Perform fixture setup execution.

    *Parameters*:

    - `fixturdef` – The fixture definition object.

    - `request (SubRequest)` – The fixture `request` object.

    *Returns*: The return value of the call to the fixture function.

    *Return type*: `Optional[object]`

    Stops at first non-None result, see [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result).

    ::: tip Note
    If the fixture function returns None, other implementations of this hook function will continue to be called, according to the behavior of the [firstresult: stop at first non-None result](/python/pytest/how_to_guides/hook_func#firstresult-stop-at-first-non-none-result) option.
    :::

- **pytest_fixture_post_finalizer**(`fixturedef, request`)      

    Called after fixture teardown, but before the cache is cleared, so the fixture result `fixturedef.cached_result` is still available (not `None`).

    *Parameters*:

    - `fixturdef` – The fixture definition object.

    - `request (SubRequest)` – The fixture `request` object.

- **pytest_warning_recorded**(`warning_message, when, nodeid, location`)        

    Process a warning captured by the internal pytest warnings plugin.

    *Parameters*:

    - `warning_message (warnings.WarningMessage)` – The captured warning. This is the same object produced by `warnings.catch_warnings()`, and contains the same attributes as the parameters of `warnings.showwarning()`.

    - `when (Literal['config', 'collect', 'runtest'])` – Indicates when the warning was captured. Possible values:

        - `"config"`: during pytest configuration/initialization stage.

        - `"collect"`: during test collection.

        - `"runtest"`: during test execution.

    - `nodeid (str)` – Full id of the item.

    - `location (Optional[Tuple[str, int, str]])` – When available, holds information about the execution context of the captured warning (filename, linenumber, function). `function` evaluates to `<module>` when the execution context is at the module level.

    *New in version 6.0.*

*Central hook for reporting about test execution*:

- **pytest_runtest_logreport**(`report`)      

    Process the `TestReport` produced for each of the setup, call and teardown runtest phases of an item.

    See `pytest_runtest_protocol` for a description of the runtest protocol.

*Assertion related hooks*:

- **pytest_assertrepr_compare**(`config, op, left, right`)      

    Return explanation for comparisons in failing assert expressions.

    Return None for no custom explanation, otherwise return a list of strings. The strings will be joined by newlines but any newlines in a string will be escaped. Note that all but the first line will be indented slightly, the intention is for the first line to be a summary.

    *Parameters*:

    - `config (Config)` – The pytest config object.

    - `op (str)` – The operator, e.g. `"=="`, `"!="`, `"not in"`.

    - `left (object)` – The left operand.

    - `right (object)` – The right operand.

- **pytest_assertion_pass**(`item, lineno, orig, expl`)     

    Called whenever an assertion passes.

    *New in version 5.0*.

    Use this hook to do some processing after a passing assertion. The original assertion information is available in the `orig` string and the pytest introspected assertion information is available in the `expl` string.

    This hook must be explicitly enabled by the `enable_assertion_pass_hook` ini-file option:

    ```ini
    [pytest]
    enable_assertion_pass_hook=true
    ```

    You need to clean the `.pyc` files in your project directory and interpreter libraries when enabling this option, as assertions will require to be re-written.

    *Parameters*:

    - `item (Item)` – pytest item object of current test.

    - `lineno (int)` – Line number of the assert statement.

    - `orig (str)` – String with the original assertion.

    - `expl (str)` – String with the assert explanation.

## Debugging/Interaction hooks

There are few hooks which can be used for special reporting or interaction with exceptions:

- **pytest_internalerror**(`excrepr, excinfo`)        

    Called for internal errors.

    Return True to suppress the fallback handling of printing an INTERNALERROR message directly to sys.stderr.

    *Parameters*:

    - `excrepr (ExceptionRepr)` – The exception repr object.

    - `excinfo (ExceptionInfo[BaseException])` – The exception info.

- **pytest_keyboard_interrupt**(`excinfo`)      

    Called for keyboard interrupt.

    *Parameters*:

    - `excinfo (ExceptionInfo[Union[KeyboardInterrupt, Exit]])` – The exception info.

- **pytest_exception_interact**(`node, call, report`)     

    Called when an exception was raised which can potentially be interactively handled.

    May be called during collection (see `pytest_make_collect_report`), in which case `report` is a `CollectReport`.

    May be called during runtest of an item (see `pytest_runtest_protocol`), in which case `report` is a `TestReport`.

    This hook is not called if the exception that was raised is an internal exception like `skip.Exception`.

    *Parameters*:

    - `node (Union[Item, Collector])` – The item or collector.

    - `call (CallInfo[Any])` – The call information. Contains the exception.

    - `report (Union[CollectReport, TestReport])` – The collection or test report.

- **pytest_enter_pdb**(`config, pdb`)     

    Called upon `pdb.set_trace()`.

    Can be used by plugins to take special action just before the python debugger enters interactive mode.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

    - `pdb (pdb.Pdb)` – The `Pdb` instance.

- **pytest_leave_pdb**(`config, pdb`)     

    Called when leaving pdb (e.g. with continue after `pdb.set_trace()`).

    Can be used by plugins to take special action just after the python debugger leaves interactive mode.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

    - `pdb (pdb.Pdb)` – The `Pdb` instance.