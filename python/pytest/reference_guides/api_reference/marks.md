# Marks

Marks can be used apply meta data to test functions (but not fixtures), which can then be accessed by fixtures or plugins.

## pytest.mark.filterwarnings

*Tutorial*: [@pytest.mark.filterwarnings](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#filterwarnings)

Add warning filters to marked test items.

- **pytest.mark.filterwarnings**(`filter`)

    *Parameters*:

    - `filter (str)` – A warning specification string, which is composed of contents of the tuple `(action, message, category, module, lineno)` as specified in The Warnings Filter section of the Python documentation, separated by `":"`. Optional fields can be omitted. Module names passed for filtering are not regex-escaped.

    *For example*:

    ```shell
    @pytest.mark.filterwarnings("ignore:.*usage will be deprecated.*:DeprecationWarning")
    def test_foo():
        ...
    ```

## pytest.mark.parametrize

*Tutorial*: [How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#parametrize)

This mark has the same signature as [pytest.Metafunc.parametrize()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Metafunc.parametrize); see there.

## pytest.mark.skip

*Tutorial*: [Skipping test functions](https://docs.pytest.org/en/latest/how-to/skipping.html#skip)

Unconditionally skip a test function.

- **pytest.mark.skip**(`reason=None`)

    *Parameters*:

    - `reason (str)` – Reason why the test function is being skipped.

## pytest.mark.skipif

*Tutorial*: [Skipping test functions](https://docs.pytest.org/en/latest/how-to/skipping.html#skipif)

Skip a test function if a condition is `True`.

- **pytest.mark.skipif**(`condition, *, reason=None`)

    *Parameters*:

    - `condition (bool or str)` – `True/False` if the condition should be skipped or a [condition string](https://docs.pytest.org/en/latest/historical-notes.html#string-conditions).

    - `reason (str)` – Reason why the test function is being skipped.

## pytest.mark.usefixtures

*Tutorial*: [Use fixtures in classes and modules with usefixtures](https://docs.pytest.org/en/latest/how-to/fixtures.html#usefixtures)

Mark a test function as using the given fixture names.

- **pytest.mark.usefixtures**(`*names`)

    *Parameters*:

    - `args` – The names of the fixture to use, as strings.

::: tip Note
When using `usefixtures` in hooks, it can only load fixtures when applied to a test function before test setup (for example in the `pytest_collection_modifyitems` hook).

Also note that this mark has no effect when applied to fixtures.
:::

## pytest.mark.xfail

*Tutorial*: [XFail: mark test functions as expected to fail](https://docs.pytest.org/en/latest/how-to/skipping.html#xfail)

Marks a test function as expected to fail.

- **pytest.mark.xfail**(`condition=None, *, reason=None, raises=None, run=True, strict=False`)

    *Parameters*:

    - `condition (bool or str)` – Condition for marking the test function as xfail (`True/False` or a condition string). If a bool, you also have to specify `reason` (see condition string).

    - `reason (str)` – Reason why the test function is marked as xfail.

    - `raises (Type[Exception])` – Exception subclass (or tuple of subclasses) expected to be raised by the test function; other exceptions will fail the test.

    - `run (bool)` – If the test function should actually be executed. If `False`, the function will always xfail and will not be executed (useful if a function is segfaulting).

    - `strict (bool)` -  

        - If `False` (the default) the function will be shown in the terminal output as `xfailed` if it fails and as `xpass` if it passes. In both cases this will not cause the test suite to fail as a whole. This is particularly useful to mark flaky tests (tests that fail at random) to be tackled later.

        - If `True`, the function will be shown in the terminal output as `xfailed` if it fails, but if it unexpectedly passes then it will fail the test suite. This is particularly useful to mark functions that are always failing and there should be a clear indication if they unexpectedly start to pass (for example a new release of a library fixes a known bug).

## Custom marks

Marks are created dynamically using the factory object `pytest.mark` and applied as a decorator.

*For example*:

```python
@pytest.mark.timeout(10, "slow", method="thread")
def test_function():
    ...
```

Will create and attach a [Mark](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Mark) object to the collected [Item](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item), which can then be accessed by fixtures or hooks with [Node.iter_markers](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.Node.iter_markers). The `mark` object will have the following attributes:

```python
mark.args == (10, "slow")
mark.kwargs == {"method": "thread"}
```

Example for using multiple custom markers:

```python
@pytest.mark.timeout(10, "slow", method="thread")
@pytest.mark.slow
def test_function():
    ...
```

When [Node.iter_markers](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.Node.iter_markers) or [Node.iter_markers_with_node](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.Node.iter_markers_with_node) is used with multiple markers, the marker closest to the function will be iterated over first. The above example will result in `@pytest.mark.slow` followed by `@pytest.mark.timeout(...)`.