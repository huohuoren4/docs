# Collection tree objects

These are the collector and item classes (collectively called “nodes”) which make up the collection tree.

## Node

- `class` **Node**      

    Base class of `Collector` and `Item`, the components of the test collection tree.

    `Collector`'s are the internal nodes of the tree, and `Item`'s are the leaf nodes.

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

    - `classmethod` **from_parent**(`parent, **kw`)     

        Public constructor for Nodes.

        This indirection got introduced in order to enable removing the fragile logic from the node constructors.

        Subclasses can use `super().from_parent(...)` when overriding the construction.

        *Parameters*:

        - `parent (Node)` – The parent node of this Node.

    - `property` **ihook**

        - fspath-sensitive hook proxy used to call pytest hooks.

    - **warn**(`warning`)       

        Issue a warning for this Node.

        Warnings will be displayed after the test session, unless explicitly suppressed.

        *Parameters*:

        - `warning (Warning)` – The warning instance to issue.

        *Raises*:

        - `ValueError` – If `warning` instance is not a subclass of Warning.

        *Example usage*:

        ```python
        node.warn(PytestWarning("some message"))
        node.warn(UserWarning("some message"))
        ```

        *Changed in version 6.2*: Any subclass of `Warning` is now accepted, rather than only `PytestWarning` subclasses.

    - `property` **nodeid**: `str`

       ` A ::`-separated string denoting its collection tree address.

    - **listchain**()     

        Return list of all parent collectors up to self, starting from the root of collection tree.

        *Returns*: The nodes.

        *Return type*: `List[Node]`

    - **add_marker**(`marker, append=True`)     

        Dynamically add a marker object to the node.

        *Parameters*:

        - `marker (Union[str, MarkDecorator])` – The marker.

        - `append (bool)` – Whether to append the marker, or prepend it.

    - **iter_markers**(`name=None`)     

        Iterate over all markers of the node.

        *Parameters*:

        - `name (Optional[str])` – If given, filter the results by the name attribute.

        *Returns*: An iterator of the markers of the node.

        *Return type*: `Iterator[Mark]`

    - `for ... in` **iter_markers_with_node**(`name=None`)        

        Iterate over all markers of the node.

        *Parameters*:

        - `name (Optional[str])` – If given, filter the results by the name attribute.

        *Returns*: An iterator of (node, mark) tuples.

        *Return type*: `Iterator[Tuple[Node, Mark]]`

    - **get_closest_marker**(`name: str`) → `Optional[Mark]`      

    - **get_closest_marker**(`name: str, default: Mark`) → `Mark`

        Return the first marker matching the name, from closest (for example function) to farther level (for example module level).

        *Parameters*:

        - `default` – Fallback return value if no marker was found.

        - `name` – Name to filter by.

    - **listextrakeywords**()       

        Return a set of all extra keywords in self and any parents.

    - **addfinalizer**(`fin`)     

        Register a function to be called without arguments when this node is finalized.

        This method can only be called when this node is active in a setup chain, for example during `self.setup()`.

    - **getparent**(`cls`)        

        Get the next parent node (including self) which is an instance of the given class.

        *Parameters*:

        - `cls (Type[_NodeType])` – The node class to search for.

        *Returns*: The node, if found.

        *Return type*: `Optional[_NodeType]`

    - **repr_failure**(`excinfo, style=None`)       

        Return a representation of a collection or test failure.

        ::: tip See also
        [Working with non-python tests](/python/pytest/further_topics/example_trick/work#working-with-non-python-tests)
        :::

        *Parameters*:

        - `excinfo (ExceptionInfo[BaseException])` – Exception information for the failure.

## Collector

- `class` **Collector**     

    - *Bases*: `Node`

    Base class of all collectors.

    `Collector` create children through `collect()` and thus iteratively build the collection tree.

    - `exception` **CollectError**      

        Bases: `Exception`

        An error during collection, contains a custom message.

    - **collect**()       

        Collect children (items and collectors) for this collector.

    - **repr_failure**(`excinfo`)       

        Return a representation of a collection failure.

        *Parameters*:

        - `excinfo (ExceptionInfo[BaseException])` – Exception information for the failure.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be `None`).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## Item

- `class` **Item**      

    - *Bases*: `Node`

    Base class of all test invocation items.

    Note that for a single function there might be multiple test invocation items.

    - **user_properties**: `List[Tuple[str, object]]`

        A list of tuples (name, value) that holds user defined properties for this test.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

    - **runtest**()       

        Run the test case for this item.

        Must be implemented by subclasses.

        ::: tip See also
        [Working with non-python tests](/python/pytest/further_topics/example_trick/work#working-with-non-python-tests)
        :::

    - **add_report_section**(`when, key, content`)      

        Add a new report section, similar to what’s done internally to add stdout and stderr captured output:

        ```python
        item.add_report_section("call", "stdout", "report section contents")
        ```

        *Parameters*:

        - `when (str)` – One of the possible capture states, `"setup"`, `"call"`, `"teardown"`.

        - `key (str)` – Name of the section, can be customized at will. Pytest uses `"stdout"` and `"stderr"` internally.

        - `content (str)` – The full contents as a string.

    - **reportinfo**()        

        Get location information for this item for test reports.

        *Returns a tuple with three elements*:

        - The path of the test (default `self.path`)

        - The 0-based line number of the test (default `None`)

        - A name of the test to be shown (default `""`)

        ::: tip See also
        [Working with non-python tests](/python/pytest/further_topics/example_trick/work#working-with-non-python-tests)
        ::: 

    - `property` **location**: `Tuple[str, Optional[int], str]`

        Returns a tuple of `(relfspath, lineno, testname)` for this item where `relfspath` is file path relative to `config.rootpath` and lineno is a 0-based line number.

## File

- `class` **File**      

    - *Bases*: `FSCollector`

    Base class for collecting tests from a file.

    [Working with non-python tests](/python/pytest/further_topics/example_trick/work#working-with-non-python-tests)

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## FSCollector

- `class` **FSCollector**       

    - *Bases*: `Collector`

    Base class for filesystem collectors.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be `None`).

    - `classmethod` **from_parent**(`parent, *, fspath=None, path=None, **kw`)        

        The public constructor.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## Session

- `final class` `Session`       

    - *Bases*: `FSCollector`

    The root of the collection tree.

    `Session` collects the initial paths given as arguments to pytest.

    - `exception` **Interrupted**

        - *Bases*: `KeyboardInterrupt`

        Signals that the test run was interrupted.

    - `exception` **Failed**

        - *Bases*: `Exception`

        Signals a stop as failed test run.

    - `property` **startpath**: `Path`

        The path from which pytest was invoked.

        *New in version 7.0.0.*

    - **perform_collect**(`args: Optional[Sequence[str]] = None, genitems: Literal[True] = True`) → `Sequence[Item]`      

    - **perform_collect**(`args: Optional[Sequence[str]] = None, genitems: bool = True`) → `Sequence[Union[Item, Collector]]`

        Perform the collection phase for this session.

        This is called by the default `pytest_collection` hook implementation; see the documentation of this hook for more details. For testing purposes, it may also be called directly on a fresh `Session`.

        This function normally recursively expands any collectors collected from the session to their items, and only items are returned. For testing purposes, this may be suppressed by passing `genitems=False`, in which case the return value contains these collectors unexpanded, and `session.items` is empty.

    - `for ... in` **collect**()        

        Collect children (items and collectors) for this collector.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be `None`).

## Package

- `class` **Package**       

    - *Bases*: `Module`

    Collector for files and directories in a Python packages – directories with an `__init__.py` file.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - `for ... in` **collect**()        

        Collect children (items and collectors) for this collector.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## Module

- `class` **Module**        

    - *Bases*: `File`, `PyCollector`

    Collector for test classes and functions in a Python module.

    - **collect**()       

        Collect children (items and collectors) for this collector.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## Class

- `class` **Class**     

    - *Bases*: `PyCollector`

    Collector for test methods (and nested classes) in a Python class.

    - `classmethod` **from_parent**(`parent, *, name, obj=None, **kw`)        

        The public constructor.

    - **collect**()       

        Collect children (items and collectors) for this collector.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

## Function

- `class` **Function**      

    - *Bases*: `PyobjMixin`, `Item`

    Item responsible for setting up and executing a Python test function.

    - **Parameters**:

        - **name** – The full function name, including any decorations like those added by parametrization (`my_func[my_param]`).

        - **parent** – The parent Node.

        - **config** – The pytest Config object.

        - **callspec** – If given, this is function has been parametrized and the callspec contains meta information about the parametrization.

        - **callobj** – If given, the object which will be called when the Function is invoked, otherwise the callobj will be obtained from `parent` using `originalname`.

        - **keywords** – Keywords bound to the function object for “-k” matching.

        - **session** – The pytest Session object.

        - **fixtureinfo** – Fixture information already resolved at this fixture node..

        - **originalname** – The attribute name to use for accessing the underlying function object. Defaults to `name`. Set this if name is different from the original name, for example when it contains decorations like those added by parametrization (`my_func[my_param]`).

    - **originalname**

        Original function name, without any decorations (for example parametrization adds a `"[...]"` suffix to function names), used to access the underlying function object from `parent` (in case `callobj` is not given explicitly).

        *New in version 3.0.*

    - `classmethod` **from_parent**(`parent, **kw`)     

        The public constructor.

    - `property` **function**

        Underlying python ‘function’ object.

    - **runtest**()     

        Execute the underlying test function.

    - **repr_failure**(`excinfo`)     

        Return a representation of a collection or test failure.

        ::: tip See also
        [Working with non-python tests](/python/pytest/further_topics/example_trick/work#working-with-non-python-tests)
        :::

        *Parameters*:

        - `excinfo (ExceptionInfo[BaseException])` – Exception information for the failure.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

    - **user_properties**: `List[Tuple[str, object]]`

        A list of tuples (name, value) that holds user defined properties for this test.

## FunctionDefinition

- `class` **FunctionDefinition**        

    - *Bases*: `Function`

    This class is a stop gap solution until we evolve to have actual function definition nodes and manage to get rid of `metafunc`.

    - **runtest**()       

        Execute the underlying test function.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - **parent**

        The parent collector node.

    - **config**: `Config`

        The pytest config object.

    - **session**: `Session`

        The pytest session this node is part of.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - **setup**()

        Execute the underlying test function.

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the `path` attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using `path` instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

    - **user_properties**: `List[Tuple[str, object]]`

        A list of tuples (name, value) that holds user defined properties for this test.
