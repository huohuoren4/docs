# API Reference

## Constants

### pytest.__version__

The current pytest version, as a string:

```shell
>>> import pytest
>>> pytest.__version__
'7.0.0'
```

### pytest.version_tuple

*New in version 7.0.*

The current pytest version, as a tuple:

```shell
>>> import pytest
>>> pytest.version_tuple
(7, 0, 0)
```
For pre-releases, the last component will be a string with the prerelease version:

```shell
>>> import pytest
>>> pytest.version_tuple
(7, 0, '0rc1')
```

## Functions

### pytest.approx

- **approx**(`expected, rel=None, abs=None, nan_ok=False`)

    Assert that two numbers (or two ordered sequences of numbers) are equal to each other within some tolerance.

    Due to the [Floating Point Arithmetic: Issues and Limitations](https://docs.python.org/3/tutorial/floatingpoint.html), numbers that we would intuitively expect to be equal are not always so:

    ```shell
    >>> 0.1 + 0.2 == 0.3
    False
    ```

    This problem is commonly encountered when writing tests, e.g. when making sure that floating-point values are what you expect them to be. One way to deal with this problem is to assert that two floating-point numbers are equal to within some appropriate tolerance:

    ```shell
    >>> abs((0.1 + 0.2) - 0.3) < 1e-6
    True
    ```

    However, comparisons like this are tedious to write and difficult to understand. Furthermore, absolute comparisons like the one above are usually discouraged because there’s no tolerance that works well for all situations. `1e-6` is good for numbers around 1, but too small for very big numbers and too big for very small ones. It’s better to express the tolerance as a fraction of the expected value, but relative comparisons like that are even more difficult to write correctly and concisely.

    The `approx` class performs floating-point comparisons using a syntax that’s as intuitive as possible:

    ```shell
    >>> from pytest import approx
    >>> 0.1 + 0.2 == approx(0.3)
    True
    ```

    The same syntax also works for ordered sequences of numbers:

    ```shell
    >>> (0.1 + 0.2, 0.2 + 0.4) == approx((0.3, 0.6))
    True
    ```
    `numpy` arrays:

    ```shell
    >>> import numpy as np                                                          
    >>> np.array([0.1, 0.2]) + np.array([0.2, 0.4]) == approx(np.array([0.3, 0.6])) 
    True
    ```

    And for a `numpy` array against a scalar:

    ```shell
    >>> import numpy as np                                         
    >>> np.array([0.1, 0.2]) + np.array([0.2, 0.1]) == approx(0.3) 
    True
    ```

    Only ordered sequences are supported, because `approx` needs to infer the relative position of the sequences without ambiguity. This means `sets` and other unordered sequences are not supported.

    Finally, dictionary values can also be compared:

    ```shell
    >>> {'a': 0.1 + 0.2, 'b': 0.2 + 0.4} == approx({'a': 0.3, 'b': 0.6})
    True
    ```

    The comparison will be true if both mappings have the same keys and their respective values match the expected tolerances.

    *Tolerances*

    By default, `approx` considers numbers within a relative tolerance of `1e-6` (i.e. one part in a million) of its expected value to be equal. This treatment would lead to surprising results if the expected value was `0.0`, because nothing but `0.0` itself is relatively close to 0.0. To handle this case less surprisingly, `approx` also considers numbers within an absolute tolerance of `1e-12` of its expected value to be equal. Infinity and NaN are special cases. Infinity is only considered equal to itself, regardless of the relative tolerance. NaN is not considered equal to anything by default, but you can make it be equal to itself by setting the `nan_ok` argument to True. (This is meant to facilitate comparing arrays that use NaN to mean “no data”.)

    Both the relative and absolute tolerances can be changed by passing arguments to the `approx` constructor:

    ```shell
    >>> 1.0001 == approx(1)
    False
    >>> 1.0001 == approx(1, rel=1e-3)
    True
    >>> 1.0001 == approx(1, abs=1e-3)
    True
    ```

    If you specify `abs` but not `rel`, the comparison will not consider the relative tolerance at all. In other words, two numbers that are within the default relative tolerance of `1e-6` will still be considered unequal if they exceed the specified absolute tolerance. If you specify both `abs` and `rel`, the numbers will be considered equal if either tolerance is met:

    ```shell
    >>> 1 + 1e-8 == approx(1)
    True
    >>> 1 + 1e-8 == approx(1, abs=1e-12)
    False
    >>> 1 + 1e-8 == approx(1, rel=1e-6, abs=1e-12)
    True
    ```

    You can also use `approx` to compare nonnumeric types, or dicts and sequences containing nonnumeric types, in which case it falls back to strict equality. This can be useful for comparing dicts and sequences that can contain optional values:

    ```shell
    >>> {"required": 1.0000005, "optional": None} == approx({"required": 1, "optional": None})
    True
    >>> [None, 1.0000005] == approx([None,1])
    True
    >>> ["foo", 1.0000005] == approx([None,1])
    False
    ```

    If you’re thinking about using `approx`, then you might want to know how it compares to other good ways of comparing floating-point numbers. All of these algorithms are based on relative and absolute tolerances and should agree for the most part, but they do have meaningful differences:

    - `math.isclose(a, b, rel_tol=1e-9, abs_tol=0.0)`: True if the relative tolerance is met w.r.t. either a or b or if the absolute tolerance is met. Because the relative tolerance is calculated w.r.t. both a and b, this test is symmetric (i.e. neither a nor b is a “reference value”). You have to specify an absolute tolerance if you want to compare to `0.0` because there is no tolerance by default. More information: [math.isclose()](https://docs.python.org/3/library/math.html#math.isclose).

    - `numpy.isclose(a, b, rtol=1e-5, atol=1e-8)`: True if the difference between a and b is less that the sum of the relative tolerance w.r.t. b and the absolute tolerance. Because the relative tolerance is only calculated w.r.t. b, this test is asymmetric and you can think of b as the reference value. Support for comparing sequences is provided by [numpy.allclose()](https://numpy.org/doc/stable/reference/generated/numpy.allclose.html#numpy.allclose). More information: numpy.isclose.

    - `unittest.TestCase.assertAlmostEqual(a, b)`: True if a and b are within an absolute tolerance of `1e-7`. No relative tolerance is considered , so this function is not appropriate for very large or very small numbers. Also, it’s only available in subclasses of `unittest.TestCase` and it’s ugly because it doesn’t follow PEP8. More information: [unittest.TestCase.assertAlmostEqual()](https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertAlmostEqual).

    - `a == pytest.approx(b, rel=1e-6, abs=1e-12)`: True if the relative tolerance is met w.r.t. b or if the absolute tolerance is met. Because the relative tolerance is only calculated w.r.t. b, this test is asymmetric and you can think of b as the reference value. In the special case that you explicitly specify an absolute tolerance but not a relative tolerance, only the absolute tolerance is considered.

    ::: tip Note
    `approx` can handle numpy arrays, but we recommend the specialised test helpers in [Test Support (numpy.testing)](https://numpy.org/doc/stable/reference/routines.testing.html) if you need support for comparisons, NaNs, or ULP-based tolerances.

    To match strings using regex, you can use [Matches](https://github.com/asottile/re-assert#re_assertmatchespattern-str-args-kwargs) from the [re_assert package](https://github.com/asottile/re-assert).
    :::

    ::: warning Warning
    *Changed in version 3.2.*

    In order to avoid inconsistent behavior, [TypeError](https://docs.python.org/3/library/exceptions.html#TypeError) is raised for `>`, `>=`, `<` and `<=` comparisons. The example below illustrates the problem:

    ```shell
    assert approx(0.1) > 0.1 + 1e-10  # calls approx(0.1).__gt__(0.1 + 1e-10)
    assert 0.1 + 1e-10 > approx(0.1)  # calls approx(0.1).__lt__(0.1 + 1e-10)
    ```

    In the second example one expects `approx(0.1).__le__(0.1 + 1e-10)` to be called. But instead, `approx(0.1).__lt__(0.1 + 1e-10)` is used to comparison. This is because the call hierarchy of rich comparisons follows a fixed behavior. More information: [object.__ge__()](https://docs.python.org/3/reference/datamodel.html#object.__ge__)
    :::

    *Changed in version 3.7.1*: `approx` raises `TypeError` when it encounters a dict value or sequence element of nonnumeric type.

    *Changed in version 6.1.0*: `approx` falls back to strict equality for nonnumeric types instead of raising `TypeError`.

### pytest.fail

**Tutorial**: [How to use skip and xfail to deal with tests that cannot succeed](https://docs.pytest.org/en/latest/how-to/skipping.html#skipping)

- **fail**(`reason[, pytrace=True, msg=None]`)    

    Explicitly fail an executing test with the given message.

    *Parameters*:

    - `reason (str)` – The message to show the user as reason for the failure.

    - `pytrace (bool)` – If False, msg represents the full failure information and no python traceback will be reported.

    - `python (Optional[str])` – Same as reason, but deprecated. Will be removed in a future version, use reason instead.

### pytest.skip

- **skip**(`reason[, allow_module_level=False, msg=None]`)  

    Skip an executing test with the given message.

    This function should be called only during testing (setup, call or teardown) or during collection by using the `allow_module_level` flag. This function can be called in doctests as well.

    *Parameters*:

    - `reason (str)` – The message to show the user as reason for the skip.

    - `allow_module_level (bool)` – Allows this function to be called at module level. Raising the skip exception at module level will stop the execution of the module and prevent the collection of all tests in the module, even those defined before the `skip` call. Defaults to False.

    - `msg (Optional[str])` – Same as `reason`, but deprecated. Will be removed in a future version, use `reason` instead.

    ::: tip Note
    It is better to use [the pytest.mark.skipif](/python/pytest/reference_guides/fixture_reference#pytest-mark-skipif-ref) marker when possible to declare a test to be skipped under certain conditions like mismatching platforms or dependencies. Similarly, use the` # doctest: +SKIP` directive (see [doctest.SKIP](https://docs.python.org/3/library/doctest.html#doctest.SKIP)) to skip a doctest statically.
    :::

### pytest.importorskip

- **importorskip**(`modname, minversion=None, reason=None`)   

    Import and return the requested module `modname`, or skip the current test if the module cannot be imported.

    *Parameters*:

    - `modname (str)` – The name of the module to import.

    - `minversion (Optional[str])` – If given, the imported module’s `__version__` attribute must be at least this minimal version, otherwise the test is still skipped.

    - `reason (Optional[str])` – If given, this reason is shown as the message when the module cannot be imported.

    *Returns*: The imported module. This should be assigned to its canonical name.

    *Return type*: `Any`

    *Example*:

    ```shell
    docutils = pytest.importorskip("docutils")
    ```

### pytest.xfail

- **xfail**(`reason=''`)    

    Imperatively xfail an executing test or setup function with the given reason.

    This function should be called only during testing (setup, call or teardown).

    *Parameters*:
        
    - `reason (str)` – The message to show the user as reason for the xfail.

    ::: tip Note
    It is better to use the [pytest.mark.xfail](/python/pytest/reference_guides/fixture_reference#pytest-mark-xfail-ref) marker when possible to declare a test to be xfailed under certain conditions like known bugs or missing features.
    :::

### pytest.exit

- **exit**(`reason[, returncode=False, msg=None]`)  

    Exit testing process.

    *Parameters*:

    - `reason (str)` – The message to show as the reason for exiting pytest. reason has a default value only because `msg` is deprecated.

    - `returncode (Optional[int])` – Return code to be used when exiting pytest.

    - `msg (Optional[str])` – Same as `reason`, but deprecated. Will be removed in a future version, use `reason` instead.

### pytest.main

- **main**(`args=None, plugins=None`)     

    Perform an in-process test run.

    *Parameters*:

    - `args (Optional[Union[List[str], PathLike[str]]])` – List of command line arguments. If `None` or not given, defaults to reading arguments directly from the process command line ([sys.argv](https://docs.python.org/3/library/sys.html#sys.argv)).

    - `plugins (Optional[Sequence[Union[str, object]]])` – List of plugin objects to be auto-registered during initialization.

    *Returns*: An exit code.

    *Return type*: `Union[int, ExitCode]`

### pytest.param

- **param**(`*values[, id][, marks]`)     

    Specify a parameter in [pytest.mark.parametrize](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-parametrize) calls or [parametrized fixtures](https://docs.pytest.org/en/latest/how-to/fixtures.html#fixture-parametrize-marks).

    ```python
    @pytest.mark.parametrize(
        "test_input,expected",
        [
            ("3+5", 8),
            pytest.param("6*9", 42, marks=pytest.mark.xfail),
        ],
    )
    def test_eval(test_input, expected):
        assert eval(test_input) == expected
    ```

    *Parameters*:

    - `values (object)` – Variable args of the values of the parameter set, in order.

    - `marks (Union[MarkDecorator, Collection[Union[MarkDecorator, Mark]]])` – A single mark or a list of marks to be applied to this parameter set.

    - `id (Optional[str])` – The id to attribute to this parameter set.

### pytest.raises

**Tutorial**: [Assertions about expected exceptions](https://docs.pytest.org/en/latest/how-to/assert.html#assertraises)

- **with raises**(`expected_exception: Union[Type[E], Tuple[Type[E], ...]], *, match: Optional[Union[str, Pattern[str]]] = ...`) → `RaisesContext[E] as excinfo`      

- **with raises**(`expected_exception: Union[Type[E], Tuple[Type[E], ...]], func: Callable[[...], Any], *args: Any, **kwargs: Any`) → `ExceptionInfo[E] as excinfo`

    Assert that a code block/function call raises an exception.

    *Parameters*:

    - `expected_exception (Type[E] | Tuple[Type[E], ...])` – The expected exception type, or a tuple if one of multiple possible exception types are expected.

    - `match (str | Pattern[str] | None)` – If specified, a string containing a regular expression, or a regular expression object, that is tested against the string representation of the exception ande its `PEP-678 <https://peps.python.org/pep-0678/> __notes__`  using [re.search()](https://docs.python.org/3/library/re.html#re.search). 

    To match a literal string that may contain [special characters](https://docs.python.org/3/library/re.html#re-syntax), the pattern can first be escaped with [re.escape()](https://docs.python.org/3/library/re.html#re.escape). (This is only used when [pytest.raises()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.raises) is used as a context manager, and passed through to the function otherwise. When using [pytest.raises()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.raises) as a function, you can use: `pytest.raises(Exc, func, match="passed on").match("my pattern").)`

    Use `pytest.raises` as a context manager, which will capture the exception of the given type:

    ```shell
    >>> import pytest
    >>> with pytest.raises(ZeroDivisionError):
    ···     1/0
    ```

    If the code block does not raise the expected exception (`ZeroDivisionError` in the example above), or no exception at all, the check will fail instead.

    You can also use the keyword argument `match` to assert that the exception matches a text or regex:

    ```shell
    >>> with pytest.raises(ValueError, match='must be 0 or None'):
    ···    raise ValueError("value must be 0 or None")

    >>> with pytest.raises(ValueError, match=r'must be \d+$'):
    ···    raise ValueError("value must be 42")
    ```

    The `match` argument searches the formatted exception string, which includes any `PEP-678 <https://peps.python.org/pep-0678/> __notes__`:

    ```shell
    >>> with pytest.raises(ValueError, match=r'had a note added'):  
    ···     e = ValueError("value must be 42")
    ···     e.add_note("had a note added")
    ···     raise e
    ```

    The context manager produces an **ExceptionInfo** object which can be used to inspect the details of the captured exception:

    ```shell
    >>> with pytest.raises(ValueError) as exc_info:
    ···    raise ValueError("value must be 42")
    >>> assert exc_info.type is ValueError
    >>> assert exc_info.value.args[0] == "value must be 42"
    ```

    ::: tip Note
    When using `pytest.raises` as a context manager, it’s worthwhile to note that normal context manager rules apply and that the exception raised must be the final line in the scope of the context manager. Lines of code after that, within the scope of the context manager will not be executed. For example:

    ```shell
    >>> value = 15
    >>> with pytest.raises(ValueError) as exc_info:
    ···    if value > 10:
    ···        raise ValueError("value must be <= 10")
    ···    assert exc_info.type is ValueError  # this will not execute
    ```

    - Instead, the following approach must be taken (note the difference in scope):

    ```shell
    >>> with pytest.raises(ValueError) as exc_info:
    ···    if value > 10:
    ···        raise ValueError("value must be <= 10")
    ···     assert exc_info.type is ValueError
    ```
    :::

    Using with `pytest.mark.parametrize`

    When using [pytest.mark.parametrize](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-parametrize-ref) it is possible to parametrize tests such that some runs raise an exception and others do not.

    See [Parametrizing conditional raising](https://docs.pytest.org/en/latest/example/parametrize.html#parametrizing-conditional-raising) for an example.

    *Legacy form*

    It is possible to specify a callable by passing a to-be-called lambda:

    ```shell
    raises(ZeroDivisionError, lambda: 1/0)
    <ExceptionInfo ...>
    ```

    or you can specify an arbitrary callable with arguments:

    ```shell
    def f(x): return 1/x

    raises(ZeroDivisionError, f, 0)
    <ExceptionInfo ...>
    raises(ZeroDivisionError, f, x=0)
    <ExceptionInfo ...>
    ```

    The form above is fully supported but discouraged for new code because the context manager form is regarded as more readable and less error-prone.

    ::: tip Note
    Similar to caught exception objects in Python, explicitly clearing local references to returned `ExceptionInfo` objects can help the Python interpreter speed up its garbage collection.

    Clearing those references breaks a reference cycle (`ExceptionInfo` –> caught exception –> frame stack raising the exception –> current frame stack –> local variables –> `ExceptionInfo`) which makes Python keep all objects referenced from that cycle (including all local variables in the current frame) alive until the next cyclic garbage collection run. More detailed information can be found in the official Python documentation for [the try statement](https://docs.python.org/3/reference/compound_stmts.html#try).
    :::

### pytest.deprecated_call

**Tutorial**: [Ensuring code triggers a deprecation warning](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#ensuring-function-triggers)

- **with deprecated_call**(`*, match: Optional[Union[str, Pattern[str]]] = ...`) → `WarningsRecorder`    

- **with deprecated_call**(`func: Callable[[...], T], *args: Any, **kwargs: Any`) → `T`

    Assert that code produces a `DeprecationWarning` or `PendingDeprecationWarning`.

    This function can be used as a context manager:

    ```shell
    import warnings
    def api_call_v2():
        warnings.warn('use v3 of this api', DeprecationWarning)
        return 200

    import pytest
    with pytest.deprecated_call():
    assert api_call_v2() == 200
    ```

    It can also be used by passing a function and `*args` and `**kwargs`, in which case it will ensure calling `func(*args, **kwargs)` produces one of the warnings types above. The return value is the return value of the function.

    In the context manager form you may use the keyword argument `match` to assert that the warning matches a text or regex.

    The context manager produces a list of warnings.WarningMessage objects, one for each warning raised.

### pytest.register_assert_rewrite

**Tutorial**: [Assertion Rewriting](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#assertion-rewriting)

- **register_assert_rewrite**(`*names`)     

    Register one or more module names to be rewritten on import.

    This function will make sure that this module or all modules inside the package will get their assert statements rewritten. Thus you should make sure to call this before the module is actually imported, usually in your `__init__.py` if you are a plugin using a package.

    *Parameters*:

    - `names (str)` – The module names to register.

### pytest.warns

**Tutorial**: Asserting warnings with the warns function

- **with warns**(`expected_warning: ~typing.Union[~typing.Type[Warning], ~typing.Tuple[~typing.Type[Warning], ...]] = <class Warning>, *, match: ~typing.Optional[~typing.Union[str, ~typing.Pattern[str]]] = None`) → `WarningsChecker`      

- **with warns**(`expected_warning: Union[Type[Warning], Tuple[Type[Warning], ...]], func: Callable[[...], T], *args: Any, **kwargs: Any`) → `T`

    Assert that code raises a particular class of warning.

    Specifically, the parameter `expected_warning` can be a warning class or sequence of warning classes, and the code inside the `with` block must issue at least one warning of that class or classes.

    This helper produces a list of **warnings.WarningMessage** objects, one for each warning emitted (regardless of whether it is an `expected_warning` or not). Since pytest 8.0, unmatched warnings are also re-emitted when the context closes.

    This function can be used as a context manager:

    ```shell
    >>> import pytest
    >>> with pytest.warns(RuntimeWarning):
    ···     warnings.warn("my warning", RuntimeWarning)
    ```

    In the context manager form you may use the keyword argument match to assert that the warning matches a text or regex:

    ```shell
    >>> with pytest.warns(UserWarning, match='must be 0 or None'):
            warnings.warn("value must be 0 or None", UserWarning)

    >>> with pytest.warns(UserWarning, match=r'must be \d+$'):
            warnings.warn("value must be 42", UserWarning)

    >>> with pytest.warns(UserWarning):  # catch re-emitted warning
            with pytest.warns(UserWarning, match=r'must be \d+$'):
                warnings.warn("this is not here", UserWarning)
    Traceback (most recent call last):
    Failed: DID NOT WARN. No warnings of type ...UserWarning... were emitted...
    ...
    ```

    Using with `pytest.mark.parametrize`

    When using [pytest.mark.parametrize](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-parametrize-ref) it is possible to parametrize tests such that some runs raise a warning and others do not.

    This could be achieved in the same way as with exceptions, see [Parametrizing conditional raising](https://docs.pytest.org/en/latest/example/parametrize.html#parametrizing-conditional-raising) for an example.

### pytest.freeze_includes

**Tutorial**: [Freezing pytest](https://docs.pytest.org/en/latest/example/simple.html#freezing-pytest)

- **freeze_includes**()   

   Return a list of module names used by pytest that should be included by cx_freeze.

## Marks

Marks can be used apply meta data to test functions (but not fixtures), which can then be accessed by fixtures or plugins.

### pytest.mark.filterwarnings

**Tutorial**: [@pytest.mark.filterwarnings](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#filterwarnings)

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

### pytest.mark.parametrize

**Tutorial**: [How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#parametrize)

This mark has the same signature as [pytest.Metafunc.parametrize()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Metafunc.parametrize); see there.

### pytest.mark.skip

**Tutorial**: [Skipping test functions](https://docs.pytest.org/en/latest/how-to/skipping.html#skip)

Unconditionally skip a test function.

- **pytest.mark.skip**(`reason=None`)

    *Parameters*:

    - `reason (str)` – Reason why the test function is being skipped.

### pytest.mark.skipif

**Tutorial**: [Skipping test functions](https://docs.pytest.org/en/latest/how-to/skipping.html#skipif)

Skip a test function if a condition is `True`.

- **pytest.mark.skipif**(`condition, *, reason=None`)

    *Parameters*:

    - `condition (bool or str)` – `True/False` if the condition should be skipped or a [condition string](https://docs.pytest.org/en/latest/historical-notes.html#string-conditions).

    - `reason (str)` – Reason why the test function is being skipped.

### pytest.mark.usefixtures

**Tutorial**: [Use fixtures in classes and modules with usefixtures](https://docs.pytest.org/en/latest/how-to/fixtures.html#usefixtures)

Mark a test function as using the given fixture names.

- **pytest.mark.usefixtures**(`*names`)

    *Parameters*:

    - `args` – The names of the fixture to use, as strings.

::: tip Note
When using `usefixtures` in hooks, it can only load fixtures when applied to a test function before test setup (for example in the `pytest_collection_modifyitems` hook).

Also note that this mark has no effect when applied to fixtures.
:::

### pytest.mark.xfail

**Tutorial**: [XFail: mark test functions as expected to fail](https://docs.pytest.org/en/latest/how-to/skipping.html#xfail)

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

### Custom marks

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

## Fixtures

**Tutorial**: [Fixtures reference](https://docs.pytest.org/en/latest/reference/fixtures.html#fixture)

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

For more details, consult the full fixtures docs.

### @pytest.fixture

- **@fixture**(`fixture_function: FixtureFunction, *, scope: Union[Literal['session', 'package', 'module', 'class', 'function'], Callable[[str, Config], Literal['session', 'package', 'module', 'class', 'function']]] = 'function', params: Optional[Iterable[object]] = None, autouse: bool = False, ids: Optional[Union[Sequence[Optional[object]], Callable[[Any], Optional[object]]]] = None, name: Optional[str] = None`) → `FixtureFunction`  

- **@fixture**(`fixture_function: None = None, *, scope: Union[Literal['session', 'package', 'module', 'class', 'function'], Callable[[str, Config], Literal['session', 'package', 'module', 'class', 'function']]] = 'function', params: Optional[Iterable[object]] = None, autouse: bool = False, ids: Optional[Union[Sequence[Optional[object]], Callable[[Any], Optional[object]]]] = None, name: Optional[str] = None`) → `FixtureFunctionMarker`

    Decorator to mark a fixture factory function.

    This decorator can be used, with or without parameters, to define a fixture function.

    The name of the fixture function can later be referenced to cause its invocation ahead of running tests: test modules or classes can use the `pytest.mark.usefixtures(fixturename)` marker.

    Test functions can directly use fixture names as input arguments in which case the fixture instance returned from the fixture function will be injected.

    Fixtures can provide their values to test functions using `return` or `yield` statements. When using `yield` the code block after the `yield` statement is executed as teardown code regardless of the test outcome, and must yield exactly once.

    *Parameters*:

    - `scope` – The scope for which this fixture is shared; one of `"function"` (default), `"class"`, `"module"`, `"package"` or `"session"`. This parameter may also be a callable which receives `(fixture_name, config)` as parameters, and must return a str with one of the values mentioned above. See [Dynamic scope ](https://docs.pytest.org/en/latest/how-to/fixtures.html#dynamic-scope)in the docs for more information.

    - `params` – An optional list of parameters which will cause multiple invocations of the fixture function and all of the tests using it. The current parameter is available in `request.param`.

    - `autouse` – If True, the fixture func is activated for all tests that can see it. If False (the default), an explicit reference is needed to activate the fixture.

    - `ids` – Sequence of ids each corresponding to the params so that they are part of the test id. If no ids are provided they will be generated automatically from the params.

    - `name` – The name of the fixture. This defaults to the name of the decorated function. If a fixture is used in the same module in which it is defined, the function name of the fixture will be shadowed by the function arg that requests the fixture; one way to resolve this is to name the decorated function `fixture_<fixturename>` and then use `@pytest.fixture(name='<fixturename>')`.

### capfd

**Tutorial**: [How to capture stdout/stderr output](https://docs.pytest.org/en/latest/how-to/capture-stdout-stderr.html#captures)

- **capfd**()   

    Enable text capturing of writes to file descriptors `1` and `2`.

    The captured output is made available via `capfd.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `text` objects.

    Returns an instance of [CaptureFixture[str]](https://docs.pytest.org/en/latest/reference/reference.html#pytest.CaptureFixture).

    *Example*:

    ```python
    def test_system_echo(capfd):
        os.system('echo "hello"')
        captured = capfd.readouterr()
        assert captured.out == "hello\n"
    ```

### capfdbinary

**Tutorial**: [How to capture stdout/stderr output](https://docs.pytest.org/en/latest/how-to/capture-stdout-stderr.html#captures)

- **capfdbinary**()     

    Enable bytes capturing of writes to file descriptors `1` and `2`.

    The captured output is made available via `capfd.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `byte` objects.

    Returns an instance of [CaptureFixture[bytes]](https://docs.pytest.org/en/latest/reference/reference.html#pytest.CaptureFixture).

    *Example*:

    ```python
    def test_system_echo(capfdbinary):
        os.system('echo "hello"')
        captured = capfdbinary.readouterr()
        assert captured.out == b"hello\n"
    ```

### caplog

**Tutorial**: [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging)

- **caplog**()      

    Access and control log capturing.

    Captured logs are available through the following properties/methods:

    ```shell
    * caplog.messages        -> list of format-interpolated log messages
    * caplog.text            -> string containing formatted log output
    * caplog.records         -> list of logging.LogRecord instances
    * caplog.record_tuples   -> list of (logger_name, level, message) tuples
    * caplog.clear()         -> clear captured records and formatted log output string
    ```

    Returns a [pytest.LogCaptureFixture](https://docs.pytest.org/en/latest/reference/reference.html#pytest.LogCaptureFixture) instance.

- final class **LogCaptureFixture**   

    Provides access and control of log capturing.

    - property **handler**: `LogCaptureHandler`

        Get the logging handler used by the fixture.

    - **get_records**(`when`)   

        Get the logging records for one of the possible test phases.

        *Parameters*:

        - `when (Literal['setup', 'call', 'teardown'])` – Which test phase to obtain the records from. Valid values are: “setup”, “call” and “teardown”.

        *Returns*:  The list of captured records at the given stage.

        *Return type*:  `List[LogRecord]`

        *New in version 3.4.*

    - property **text**: str

        The formatted log text.

    - property **records**: `List[LogRecord]`

        The list of log records.

    - property **record_tuples**: `List[Tuple[str, int, str]]`

        A list of a stripped down version of log records intended for use in assertion comparison.

        The format of the tuple is: `(logger_name, log_level, message)`

    - property **messages**: `List[str]`

        A list of format-interpolated log messages.

        Unlike ‘records’, which contains the format string and parameters for interpolation, log messages in this list are all interpolated.

        Unlike ‘text’, which contains the output from the handler, log messages in this list are unadorned with levels, timestamps, etc, making exact comparisons more reliable.

        Note that traceback or stack info (from [logging.exception()](https://docs.python.org/3/library/logging.html#logging.exception) or the `exc_info` or `stack_info` arguments to the logging functions) is not included, as this is added by the formatter in the handler.

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

    - **with at_level**(`level, logger=None`)   

        Context manager that sets the level for capturing of logs. After the end of the ‘with’ statement the level is restored to its original value.

        Will enable the requested logging level if it was disabled via logging.disable().

        *Parameters*:

        - `level (Union[int, str])` – The level.

        - `logger (Optional[str])` – The logger to update. If not given, the root logger.

### capsys

**Tutorial**: [How to capture stdout/stderr output](https://docs.pytest.org/en/latest/how-to/capture-stdout-stderr.html#captures)

- **capsys**()      

    Enable text capturing of writes to `sys.stdout` and `sys.stderr`.

    The captured output is made available via `capsys.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `text` objects.

    Returns an instance of [CaptureFixture[str]](https://docs.pytest.org/en/latest/reference/reference.html#pytest.CaptureFixture).

    *Example*:

    ```python
    def test_output(capsys):
        print("hello")
        captured = capsys.readouterr()
        assert captured.out == "hello\n"
    ```

- class **CaptureFixture**    

    Object returned by the [capsys](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-capsys), [capsysbinary](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-capsysbinary), [capfd](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-capfd) and [capfdbinary](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-capfdbinary) fixtures.

    - **readouterr**()  

        Read and return the captured output so far, resetting the internal buffer.

        *Returns*: The captured content as a namedtuple with out and err string attributes.

        *Return type*: `CaptureResult`

    - **with disabled**()   

        Temporarily disable capturing while inside the with block.

### capsysbinary

**Tutorial**: [How to capture stdout/stderr output](https://docs.pytest.org/en/latest/how-to/capture-stdout-stderr.html#captures)

- **capsysbinary**()  

    Enable bytes capturing of writes to `sys.stdout` and `sys.stderr`.

    The captured output is made available via `capsysbinary.readouterr()` method calls, which return a `(out, err)` namedtuple. `out` and `err` will be `bytes` objects.

    *Returns* an instance of [CaptureFixture[bytes]](https://docs.pytest.org/en/latest/reference/reference.html#pytest.CaptureFixture).

    *Example*:

    ```python
    def test_output(capsysbinary):
        print("hello")
        captured = capsysbinary.readouterr()
        assert captured.out == b"hello\n"
    ```

### config.cache

**Tutorial**: [How to re-run failed tests and maintain state between test runs](https://docs.pytest.org/en/latest/how-to/cache.html#cache)

The `config.cache` object allows other plugins and fixtures to store and retrieve values across test runs. To access it from fixtures request `pytestconfig` into your fixture and get it with `pytestconfig.cache`.

Under the hood, the cache plugin uses the simple `dumps/loads` API of the json stdlib module.

`config.cache` is an instance of `pytest.Cache`:

- final class **Cache**   

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

### doctest_namespace

**Tutorial**: [How to run doctests](https://docs.pytest.org/en/latest/how-to/doctest.html#doctest)

- **doctest_namespace**()     

    Fixture that returns a dict that will be injected into the namespace of doctests.

    Usually this fixture is used in conjunction with another `autouse` fixture:

    ```python
    @pytest.fixture(autouse=True)
    def add_np(doctest_namespace):
        doctest_namespace["np"] = numpy
    ```

    For more details: [‘doctest_namespace’ fixture](https://docs.pytest.org/en/latest/how-to/doctest.html#doctest-namespace).

### monkeypatch

**Tutorial**: [How to monkeypatch/mock modules and environments](https://docs.pytest.org/en/latest/how-to/monkeypatch.html#monkeypatching)

- **monkeypatch**()     

    A convenient fixture for monkey-patching.

    The fixture provides these methods to modify objects, dictionaries, or [os.environ](https://docs.python.org/3/library/os.html#os.environ):

    - [monkeypatch.setattr(`obj, name, value, raising=True`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.setattr)

    - [monkeypatch.delattr(`obj, name, raising=True`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.delattr)

    - [monkeypatch.setitem(`mapping, name, value`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.setitem)

    - [monkeypatch.delitem(`obj, name, raising=True`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.delitem)

    - [monkeypatch.setenv(`name, value, prepend=None`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.setenv)

    - [monkeypatch.delenv(`name, raising=True`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.delenv)

    - [monkeypatch.syspath_prepend(`path`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.syspath_prepend)

    - [monkeypatch.chdir(`path`)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.chdir)

    - [monkeypatch.context()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.context)

    All modifications will be undone after the requesting test function or fixture has finished. The `raising` parameter determines if a [KeyError](https://docs.python.org/3/library/exceptions.html#KeyError) or [AttributeError](https://docs.python.org/3/library/exceptions.html#AttributeError) will be raised if the set/deletion operation does not have the specified target.

    To undo modifications done by the fixture in a contained scope, use [context()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.context).

    Returns a [MonkeyPatch](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch) instance.

- final class **MonkeyPatch**       

    Helper to conveniently monkeypatch attributes/items/environment variables/syspath.

    Returned by the [monkeypatch](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-monkeypatch) fixture.

    *Changed in version 6.2*: Can now also be used directly as `pytest.MonkeyPatch()`, for when the fixture is not available. In this case, use [with MonkeyPatch.context() as mp](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.context): or remember to call [undo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.undo) explicitly.

    - classmethod **with context**()        

        Context manager that returns a new [MonkeyPatch](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch) object which undoes any patching done inside the · block upon exit.

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

        The code above replaces the [os.getcwd()](https://docs.python.org/3/library/os.html#os.getcwd) function by a `lambda` which always returns `"/"`.

        For convenience, you can specify a string as `target` which will be interpreted as a dotted import path, with the last part being the attribute name:

        ```python
        monkeypatch.setattr("os.getcwd", lambda: "/")
        ```

        Raises [AttributeError](https://docs.python.org/3/library/exceptions.html#AttributeError) if the attribute does not exist, unless `raising` is set to False.

        *Where to patch*

        `monkeypatch.setattr` works by (temporarily) changing the object that a name points to with another one. There can be many names pointing to any individual object, so for patching to work you must ensure that you patch the name used by the system under test.

        See the section [Where to patch](https://docs.python.org/3/library/unittest.mock.html#where-to-patch) in the [unittest.mock](https://docs.python.org/3/library/unittest.mock.html#module-unittest.mock) docs for a complete explanation, which is meant for [unittest.mock.patch()](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.patch) but applies to `monkeypatch.setattr` as well.

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

        Prefer to use [context()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.MonkeyPatch.context) instead.
        :::

### pytestconfig

- **pytestconfig**()        

    Session-scoped fixture that returns the session’s [pytest.Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) object.

    *Example*:

    ```python
    def test_foo(pytestconfig):
        if pytestconfig.getoption("verbose") > 0:
            ...
    ```

### pytester

*New in version 6.2.*

Provides a [Pytester](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester) instance that can be used to run and test pytest itself.

It provides an empty directory where pytest can be executed in isolation, and contains facilities to write tests, configuration files, and match against expected output.

To use it, include in your topmost `conftest.py` file:

```python
pytest_plugins = "pytester"
```

- final class **Pytester**      

    Facilities to write tests/configuration files, execute pytest in isolation, and match against expected output, perfect for black-box testing of pytest plugins.

    It attempts to isolate the test run from external factors as much as possible, modifying the current working directory to path and environment variables during initialization.

    - exception **TimeoutExpired**        

    - **plugins**: `List[Union[str, object]]`

        A list of plugins to use with [parseconfig()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfig) and [runpytest()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpytest). Initially this is an empty list but plugins can be added to the list. The type of items to add to the list depends on the method using them so refer to them for details.

    - property **path**: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

        Temporary directory path used to create files/run tests from, etc.

    - **make_hook_recorder**(`pluginmanager`)     

        Create a new [HookRecorder](https://docs.pytest.org/en/latest/reference/reference.html#pytest.HookRecorder) for a [PytestPluginManager](https://docs.pytest.org/en/latest/reference/reference.html#pytest.PytestPluginManager).

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

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

        *Examples*:

        ```python
        pytester.makefile(".txt", "line1", "line2")

        pytester.makefile(".ini", pytest="[pytest]\naddopts=-rs\n")
        ```

        To create binary files, use [pathlib.Path.write_bytes()](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_bytes) directly:

        ```python
        filename = pytester.path.joinpath("foo.bin")
        filename.write_bytes(b"...")
        ```

    - **makeconftest**(`source`)      

        Write a contest.py file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The conftest.py file.

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

    - **makeini**(`source`)     

        Write a tox.ini file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The tox.ini file.

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

    - **getinicfg**(`source`)       

        Return the pytest section from the tox.ini config file.

    - **makepyprojecttoml**(`source`)       

        Write a pyproject.toml file.

        *Parameters*:

        - `source (str)` – The contents.

        *Returns*: The pyproject.ini file.

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

        *New in version 6.0.*

    - **makepyfile**(`*args, **kwargs`)     

        Shortcut for .makefile() with a .py extension.

        Defaults to the test name with a ‘.py’ extension, e.g test_foobar.py, overwriting existing files.

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

        Shortcut for .makefile() with a .txt extension.

        Defaults to the test name with a ‘.txt’ extension, e.g test_foobar.txt, overwriting existing files.

        *Examples*:

        ```python
        def test_something(pytester):
            # Initial file is created test_something.txt.
            pytester.maketxtfile("foobar")
            # To create multiple files, pass kwargs accordingly.
            pytester.maketxtfile(custom="foobar")
            # At this point, both 'test_something.txt' & 'custom.txt' exist in the test directory.
        ```

    - **syspathinsert**(`path=None`)        [source]

        Prepend a directory to sys.path, defaults to [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.path).

        This is undone automatically when this object dies at the end of each test.

        *Parameters*:

        - `path (Optional[Union[str, PathLike[str]]])` – The path.

    - **mkdir**(`name`)        

        Create a new (sub)directory.

        *Parameters*:

        - `name (Union[str, PathLike[str]])` – The name of the directory, relative to the pytester path.

        *Returns*: The created directory.

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

    - **mkpydir**(`name`)     

        Create a new python package.

        This creates a (sub)directory with an empty `__init__.py` file so it gets recognised as a Python package.

    - **copy_example**(`name=None`)     

        Copy file from project’s directory into the testdir.

        *Parameters*:

        - `name (Optional[str])` – The name of the file to copy.

        *Returns*: Path to the copied directory (inside `self.path`).

        *Return type*: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

    - **getnode**(`config, arg`)      

        Get the collection node of a file.

        *Parameters*:

        - `config (Config)` – A pytest config. See [parseconfig()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfig) and [parseconfigure()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfigure) for creating it.

        - `arg (Union[str, PathLike[str]])` – Path to the file.

        *Returns*: The node.

        *Return type*: `Union[Collector, Item]`

    - **getpathnode**(`path`)       

        Return the collection node of a file.

        This is like [getnode()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getnode) but uses [parseconfigure()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfigure) to create the (configured) pytest Config instance.

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

        This run writes “source” into a temporary file and runs `pytest.main()` on it, returning a [HookRecorder](https://docs.pytest.org/en/latest/reference/reference.html#pytest.HookRecorder) instance for the result.

        *Parameters*:

        - `source (str)` – The source code of the test module.

        - `cmdlineargs` – Any extra command line arguments to use.

    - **inline_genitems**(`*args`)        

        Run `pytest.main(['--collectonly'])` in-process.

        Runs the [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main) function to run all of pytest inside the test process itself like [inline_run()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.inline_run), but returns a tuple of the collected items and a [HookRecorder](https://docs.pytest.org/en/latest/reference/reference.html#pytest.HookRecorder) instance.

    - **inline_run**(`*args, plugins=(), no_reraise_ctrlc=False`)     

        Run `pytest.main()` in-process, returning a HookRecorder.

        Runs the [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main) function to run all of pytest inside the test process itself. This means it can return a [HookRecorder](https://docs.pytest.org/en/latest/reference/reference.html#pytest.HookRecorder) instance which gives more detailed results from that run than can be done by matching stdout/stderr from [runpytest()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpytest).

        *Parameters*:

        - `args (Union[str, PathLike[str]])` – Command line arguments to pass to [pytest.main()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.main).

        - `plugins` – Extra plugin instances the `pytest.main()` instance should use.

        - `no_reraise_ctrlc (bool)` – Typically we reraise keyboard interrupts from the child run. If True, the KeyboardInterrupt exception is captured.

    - **runpytest_inprocess**(`*args, **kwargs`)      

        Return result of running pytest in-process, providing a similar interface to what self.runpytest() provides.

    - **runpytest**(`*args, **kwargs`)        

        Run pytest inline or in a subprocess, depending on the command line option “–runpytest” and return a [RunResult](https://docs.pytest.org/en/latest/reference/reference.html#pytest.RunResult).

    - **parseconfig**(`*args`)      

        Return a new pytest [pytest.Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) instance from given commandline args.

        This invokes the pytest bootstrapping code in _pytest.config to create a new [pytest.PytestPluginManager](https://docs.pytest.org/en/latest/reference/reference.html#pytest.PytestPluginManager) and call the [pytest_cmdline_parse](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_cmdline_parse) hook to create a new pytest.Config instance.

        If [plugins](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.plugins) has been populated they should be plugin modules to be registered with the plugin manager.

    - **parseconfigure**(`*args`)       

        Return a new pytest configured Config instance.

        Returns a new [pytest.Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) instance like [parseconfig()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfig), but also calls the [pytest_configure](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_configure) hook.

    - **getitem**(`source, funcname='test_func'`)       

        Return the test item for a test function.

        Writes the source to a python file and runs pytest’s collection on the resulting module, returning the test item for the requested function name.

        *Parameters*:

        - `source(Union[str, PathLike[str]])` – The module source.

        - `funcname(str)` – The name of the test function for which to return a test item.

        *Returns*: The test item.

        *Return type*: [Item](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item)

    - **getitems**(`source`)        

        Return all test items collected from the module.

        Writes the source to a Python file and runs pytest’s collection on the resulting module, returning all test items contained within.

    - **getmodulecol**(`source, configargs=(), *, withinit=False`)        

        Return the module collection node for `source`.

        Writes `source` to a file using [makepyfile()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makepyfile) and then runs the pytest collection on it, returning the collection node for the test module.

        *Parameters*:

        - `source (Union[str, PathLike[str]])` – The source code of the module to collect.

        - `configargs` – Any extra arguments to pass to parseconfigure().

        - `withinit (bool)` – Whether to also write an `__init__.py` file to the same directory to ensure it is a package.

    - **collect_by_name**(`modcol, name`)     

        Return the collection node for name from the module collection.

        Searches a module collection node for a collection node matching the given name.

        *Parameters*:

        - `modcol (Collector)` – A module collection node; see getmodulecol().

        - `name (str)` – The name of the node to return.

    - **popen**(`cmdargs, stdout=-1, stderr=-1, stdin=NotSetType.token, **kw`)        [source]

        Invoke [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen).

        Calls [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen) making sure the current working directory is in `PYTHONPATH`.

        You probably want to use [run()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.run) instead.

    - **run**(`*cmdargs, timeout=None, stdin=NotSetType.token`)       

        Run a command with arguments.

        Run a process using [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen) saving the stdout and stderr.

        *Parameters*:

        - cmdargs (Union[str, PathLike[str]]) – The sequence of arguments to pass to [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen), with path-like objects being converted to str automatically.

        - timeout (Optional[float]) – The period in seconds after which to timeout and raise [Pytester.TimeoutExpired](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.TimeoutExpired).

        - stdin (Union[NotSetType, bytes, IO[Any], int]) – Optional standard input.

            - If it is `CLOSE_STDIN` (Default), then this method calls [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen) with `stdin=subprocess.PIPE`, and the standard input is closed immediately after the new command is started.

            - If it is of type [bytes](https://docs.python.org/3/library/stdtypes.html#bytes), these bytes are sent to the standard input of the command.

            - Otherwise, it is passed through to [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen). For further information in this case, consult the document of the · parameter in [subprocess.Popen](https://docs.python.org/3/library/subprocess.html#subprocess.Popen).

        *Returns*: The result.

        *Return type*: [RunResult](https://docs.pytest.org/en/latest/reference/reference.html#pytest.RunResult)

    - **runpython**(`script`)       

        Run a python script using sys.executable as interpreter.

    - **runpython_c**(`command`)        

        Run `python -c "command"`.

    - **runpytest_subprocess**(`*args, timeout=None`)       

        Run pytest as a subprocess with given arguments.

        Any plugins added to the [plugins](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.plugins) list will be added using the `-p` command line option. Additionally `--basetemp` is used to put any temporary files and directories in a numbered directory prefixed with “runpytest-” to not conflict with the normal numbered pytest location for temporary files and directories.

        *Parameters*:

        - `args (Union[str, PathLike[str]])` – The sequence of arguments to pass to the pytest subprocess.

        - `timeout (Optional[float])` – The period in seconds after which to timeout and raise [Pytester.TimeoutExpired](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.TimeoutExpired).

        *Returns*: The result.

        *Return type*: [RunResult](https://docs.pytest.org/en/latest/reference/reference.html#pytest.RunResult)

    - **spawn_pytest**(`string, expect_timeout=10.0`)     

        Run pytest using pexpect.

        This makes sure to use the right pytest and sets up the temporary directory locations.

        The pexpect child is returned.

    - **spawn**(`cmd, expect_timeout=10.0`)       

        Run a command using pexpect.

        The pexpect child is returned.

- final class **RunResult**       

    The result of running a command from [Pytester](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester).

    - **ret**: `Union[int, ExitCode]`

        The return value.

    - **outlines**

        List of lines captured from stdout.

    - **errlines**

        List of lines captured from stderr.

    - **stdout**

        LineMatcher of stdout.

        Use e.g. [str(stdout)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.LineMatcher.__str__) to reconstruct stdout, or the commonly used [stdout.fnmatch_lines()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.LineMatcher.fnmatch_lines) method.

    - **stderr**

        - [LineMatcher](https://docs.pytest.org/en/latest/reference/reference.html#pytest.LineMatcher) of stderr.

    - **duration**

        - Duration in seconds.

    - **parseoutcomes**()     

        Return a dictionary of outcome noun -> count from parsing the terminal output that the test process produced.

        The returned nouns will always be in plural form:

        ```shell
        ======= 1 failed, 1 passed, 1 warning, 1 error in 0.13s ====
        ```

        Will return `{"failed": 1, "passed": 1, "warnings": 1, "errors": 1}`.

    - classmethod **parse_summary_nouns**(`lines`)        

        Extract the nouns from a pytest terminal summary line.

        It always returns the plural noun for consistency:

        ```shell
        ======= 1 failed, 1 passed, 1 warning, 1 error in 0.13s ====
        ```

        Will return {"failed": 1, "passed": 1, "warnings": 1, "errors": 1}.

    - **assert_outcomes**(`passed=0, skipped=0, failed=0, errors=0, xpassed=0, xfailed=0, warnings=None, deselected=None`)      

        Assert that the specified outcomes appear with the respective numbers (0 means it didn’t occur) in the text output from a test run.

        `warnings` and `deselected` are only checked if not None.

- class **LineMatcher**       

    Flexible matching of text.

    This is a convenience class to test large texts like the output of commands.

    The constructor takes a list of lines without their trailing newlines, i.e. `text.splitlines()`.

    - **__str__**()       

        Return the entire original text.

        *New in version 6.2*: You can use [str()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.LineMatcher.str) in older versions.

    - **fnmatch_lines_random**(`lines2`)        

        Check lines exist in the output in any order (using [fnmatch.fnmatch()](https://docs.python.org/3/library/fnmatch.html#fnmatch.fnmatch)).

    - **re_match_lines_random**(`lines2`)     

        Check lines exist in the output in any order (using [re.match()](https://docs.python.org/3/library/re.html#re.match)).

    - **get_lines_after**(`fnline`)       

        Return all lines following the given line in the text.

        The given line can contain glob wildcards.

    - **fnmatch_lines**(`lines2, *, consecutive=False`)       

        Check lines exist in the output (using [fnmatch.fnmatch()](https://docs.python.org/3/library/fnmatch.html#fnmatch.fnmatch)).

        The argument is a list of lines which have to match and can use glob wildcards. If they do not match a pytest.fail() is called. The matches and non-matches are also shown as part of the error message.

        *Parameters*:

        - `lines2 (Sequence[str])` – String patterns to match.

        - `consecutive (bool)` – Match lines consecutively?

    - **re_match_lines**(`lines2, *, consecutive=False`)        

        Check lines exist in the output (using [re.match()](https://docs.python.org/3/library/re.html#re.match)).

        The argument is a list of lines which have to match using `re.match`. If they do not match a pytest.fail() is called.

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

- final class **HookRecorder**        

    Record all hooks called in a plugin manager.

    Hook recorders are created by [Pytester](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester).

    This wraps all the hook calls in the plugin manager, recording each call before propagating the normal calls.

    - **getcalls**(`names`)       

        Get all recorded calls to hooks with the given names (or name).

    - **matchreport**(`inamepart='', names=('pytest_runtest_logreport', 'pytest_collectreport'), when=None`)      

        Return a testreport whose dotted import path matches.

- final class **RecordedHookCall**        [source]

    A recorded call to a hook.

    The arguments to the hook call are set as attributes. For example:

    ```python
    calls = hook_recorder.getcalls("pytest_runtest_setup")
    # Suppose pytest_runtest_setup was called once with `item=an_item`.
    assert calls[0].item is an_item
    ```

### record_property

**Tutorial**: [record_property](https://docs.pytest.org/en/latest/how-to/output.html#record-property-example)

- **record_property**()       

    Add extra properties to the calling test.

    User properties become part of the test report and are available to the configured reporters, like JUnit XML.

    The fixture is callable with `name, value`. The value is automatically XML-encoded.

    *Example*:

    ```python
    def test_function(record_property):
        record_property("example_key", 1)
    ```

### record_testsuite_property

**Tutorial**: [record_testsuite_property](https://docs.pytest.org/en/latest/how-to/output.html#record-testsuite-property-example)

- **record_testsuite_property**()     

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
    Currently this fixture does not work with the pytest-xdist plugin. See [issue #7767](https://github.com/pytest-dev/pytest/issues/7767) for details.
    :::

### recwarn

**Tutorial**: [Asserting warnings with the warns function](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#assertwarnings)

- **recwarn**()     

    Return a [WarningsRecorder](https://docs.pytest.org/en/latest/reference/reference.html#pytest.WarningsRecorder) instance that records all warnings emitted by test functions.

    See <https://docs.pytest.org/en/latest/how-to/capture-warnings.html> for information on warning categories.

- class **WarningsRecorder**      

    A context manager to record raised warnings.

    Each recorded warning is an instance of `warnings.WarningMessage`.

    Adapted from `warnings.catch_warnings`.

    :::: tip Note
    `DeprecationWarning` and `PendingDeprecationWarning` are treated differently; see [Ensuring code triggers a deprecation warning](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#ensuring-function-triggers).
    :::

    - property **list**: `List[WarningMessage]`

        The list of recorded warnings.

    - **pop**(`cls=<class 'Warning'>`)        

        Pop the first recorded warning which is an instance of `cls`, but not an instance of a child class of any other match. Raises `AssertionError` if there is no match.

    - **clear**()     

        Clear the list of recorded warnings.

### request

**Example**: [Pass different values to a test function, depending on command line options](https://docs.pytest.org/en/latest/example/simple.html#request-example)

The `request` fixture is a special fixture providing information of the requesting test function.

- class **FixtureRequest**        

    A request for a fixture from a test or fixture function.

    A request object gives access to the requesting test context and has an optional param attribute in case the fixture is parametrized indirectly.

    - **fixturename**:` Optional[str]`

        Fixture for which this request is being performed.

    - property **scope**: `Literal['session', 'package', 'module', 'class', 'function']`

        Scope string, one of “function”, “class”, “module”, “package”, “session”.

    - property **fixturenames**: `List[str]`

        Names of all active fixtures in this request.

    - property **node**

        Underlying collection node (depends on current request scope).

    - property **config**: `Config`

        The pytest config object associated with this request.

    - property **function**

        Test function object if the request has a per-function scope.

    - property **cls**

        Class (can be None) where the test function was collected.

    - property **instance**

        Instance (can be None) on which test function was collected.

    - property **module**

        Python module object where the test function was collected.

    - property **path**: [Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path)

        Path where the test function was collected.

    - property **keywords**: MutableMapping[str, Any]

        Keywords/markers dictionary for the underlying node.

    - property **session**: `Session`

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

### testdir

Identical to [pytester](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-pytester), but provides an instance whose methods return legacy `py.path.local` objects instead when applicable.

New code should avoid using [testdir](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-testdir) in favor of [pytester](https://docs.pytest.org/en/latest/reference/reference.html#std-fixture-pytester).

- final class **Testdir**     

    Similar to [Pytester](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester), but this class works with legacy legacy_path objects instead.

    All methods just forward to an internal Pytester instance, converting results to `legacy_path` objects as necessary.

    - exception **TimeoutExpired**

    - property **tmpdir**: `LocalPath`

        Temporary directory where tests are executed.

    - **make_hook_recorder**(`pluginmanager`)     

        See [Pytester.make_hook_recorder()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.make_hook_recorder).

    - **chdir**()       

        See [Pytester.chdir()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.chdir).

    - **finalize**()        

        See `Pytester._finalize()`.

    - **makefile**(`ext, *args, **kwargs`)        

        See [Pytester.makefile()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makefile).

    - **makeconftest**(`source`)      

        See [Pytester.makeconftest()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makeconftest).

    - **makeini**(`source`)       

        See [Pytester.makeini()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makeini).

    - **getinicfg**(`source`)     

        See [Pytester.getinicfg()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getinicfg).

    - **makepyprojecttoml**(`source`)     

        See [Pytester.makepyprojecttoml()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makepyprojecttoml).

    - **makepyfile**(`*args, **kwargs`)       

        See [Pytester.makepyfile()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.makepyfile).

    - **maketxtfile**(`*args, **kwargs`)      

        See [Pytester.maketxtfile()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.maketxtfile).

    - **syspathinsert**(`path=None`)      

        See [Pytester.syspathinsert()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.syspathinsert).

    - **mkdir**(`name`)       

        See [Pytester.mkdir()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.mkdir).

    - **mkpydir**(`name`)     

        See [Pytester.mkpydir()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.mkpydir).

    - **copy_example**(`name=None`)       

        See [Pytester.copy_example()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.copy_example).

    - **getnode**(`config, arg`)      

        See [Pytester.getnode()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getnode).

    - **getpathnode**(`path`)     

        See [Pytester.getpathnode()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getpathnode).

    - **genitems**(`colitems`)        

        See [Pytester.genitems()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.genitems).

    - **runitem**(`source`)       

        See [Pytester.runitem()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runitem).

    - **inline_runsource**(`source, *cmdlineargs`)        

        See [Pytester.inline_runsource()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.inline_runsource).

    - **inline_genitems**(`*args`)        

        See [Pytester.inline_genitems()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.inline_genitems).

    - **inline_run**(`*args, plugins=(), no_reraise_ctrlc=False`)     

        See [Pytester.inline_run()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.inline_run).

    - **runpytest_inprocess**(`*args, **kwargs`)      

        See [Pytester.runpytest_inprocess()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpytest_inprocess).

    - **runpytest**(`*args, **kwargs`)        

        See [Pytester.runpytest()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpytest).

    - **parseconfig**(`*args`)        

        See [Pytester.parseconfig()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfig).

    - **parseconfigure**(`*args`)     

        See [Pytester.parseconfigure()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.parseconfigure).

    - **getitem**(`source, funcname='test_func'`)     

        See [Pytester.getitem()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getitem).

    - **getitems**(`source`)      

        See [Pytester.getitems()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getitems).

    - **getmodulecol**(`source, configargs=(), withinit=False`)       

        See [Pytester.getmodulecol()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.getmodulecol).

    - **collect_by_name**(`modcol, name`)     

        See [Pytester.collect_by_name()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.collect_by_name).

    - **popen**(`cmdargs, stdout=-1, stderr=-1, stdin=NotSetType.token, **kw`)        

        See [Pytester.popen()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.popen).

    - **run**(`*cmdargs, timeout=None, stdin=NotSetType.token`)       

        See [Pytester.run()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.run).

    - **runpython**(`script`)     

        See [Pytester.runpython()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpython).

    - **runpython_c**(`command`)      

        See [Pytester.runpython_c()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpython_c).

    - **runpytest_subprocess**(`*args, timeout=None`)     

        See [Pytester.runpytest_subprocess()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.runpytest_subprocess).

    - **spawn_pytest**(`string, expect_timeout=10.0`)     

        See [Pytester.spawn_pytest()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.spawn_pytest).

    - **spawn**(`cmd, expect_timeout=10.0`)       

        See [Pytester.spawn()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Pytester.spawn).

### tmp_path

**Tutorial**: [How to use temporary directories and files in tests](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmp-path)

- **tmp_path**()      [source]

    Return a temporary directory path object which is unique to each test function invocation, created as a sub directory of the base temporary directory.

    By default, a new base temporary directory is created each test session, and old bases are removed after 3 sessions, to aid in debugging. This behavior can be configured with [tmp_path_retention_count](https://docs.pytest.org/en/latest/reference/reference.html#confval-tmp_path_retention_count) and [tmp_path_retention_policy](https://docs.pytest.org/en/latest/reference/reference.html#confval-tmp_path_retention_policy). If `--basetemp` is used then it is cleared each session. See [The default base temporary](https://docs.pytest.org/en/latest/how-to/tmp_path.html#base-temporary-directory) directory.

    The returned object is a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) object.

### tmp_path_factory

**Tutorial**: [The tmp_path_factory fixture](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmp-path-factory-example)

`tmp_path_factory`  is an instance of [TempPathFactory](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TempPathFactory):

- final class **TempPathFactory**     

    Factory for temporary directories under the common base temp directory.

    The base directory can be configured using the `--basetemp` option.

    - **mktemp**(`basename, numbered=True`)       [source]

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

### tmpdir

**Tutorial**: [The tmpdir and tmpdir_factory fixtures](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmpdir-and-tmpdir-factory)

- **tmpdir**()

    Return a temporary directory path object which is unique to each test function invocation, created as a sub directory of the base temporary directory.

    By default, a new base temporary directory is created each test session, and old bases are removed after 3 sessions, to aid in debugging. If `--basetemp` is used then it is cleared each session. See [The default base temporary directory](https://docs.pytest.org/en/latest/how-to/tmp_path.html#base-temporary-directory).

    The returned object is a [legacy_path](https://py.readthedocs.io/en/latest/path.html) object.

    ::: tip Note
    These days, it is preferred to use `tmp_path`.

    [About the tmpdir and tmpdir_factory fixtures](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmpdir-and-tmpdir-factory).
    :::

### tmpdir_factory

**Tutorial**: [The tmpdir and tmpdir_factory fixtures](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmpdir-and-tmpdir-factory)

`tmpdir_factory` is an instance of [TempdirFactory](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TempdirFactory):

- final class **TempdirFactory**      

    Backward compatibility wrapper that implements `py.path.local` for [TempPathFactory](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TempPathFactory).

    ::: tip Note
    These days, it is preferred to use `tmp_path_factory`.

    [About the tmpdir and tmpdir_factory fixtures](https://docs.pytest.org/en/latest/how-to/tmp_path.html#tmpdir-and-tmpdir-factory).
    ::: 

    - **mktemp**(`basename, numbered=True`)     

        Same as [TempPathFactory.mktemp()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TempPathFactory.mktemp), but returns a `py.path.local` object.

    - **getbasetemp**()     

        Same as [TempPathFactory.getbasetemp()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TempPathFactory.getbasetemp), but returns a `py.path.local` object.

## Hooks

**Tutorial**: [Writing plugins](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#writing-plugins)

Reference to all hooks which can be implemented by [conftest.py files](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#localplugin) and [plugins](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#plugins).

### Bootstrapping hooks

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

    This hook is considered deprecated and will be removed in a future pytest version. Consider using [pytest_load_initial_conftests](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_load_initial_conftests) instead.

    ::: tip Note
    This hook will not be called for `conftest.py` files, only for setuptools plugins.
    ::: 

    *Parameters*:

    - `config (Config)` – The pytest config object.

    - `args (List[str])` – Arguments passed on the command line.

- **pytest_cmdline_parse**(`pluginmanager, args`)       

    Return an initialized [Config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config), parsing the specified args.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    ::: tip Note
    This hook will only be called for plugin classes passed to the `plugins` arg when using pytest.main to perform an in-process test run.
    ::: 

    *Parameters*:

    - `pluginmanager (PytestPluginManager)` – The pytest plugin manager.

    - `args (List[str])` – List of arguments passed on the command line.

    *Returns*: A pytest config object.

    *Return type*: `Optional[Config]`

- **pytest_cmdline_main**(`config`)     

    Called for performing the main command line action. The default implementation will invoke the configure hooks and runtest_mainloop.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    *Parameters*:

    - `config (Config)` – The pytest config object.

    *Returns*: The exit code.

    *Return type*: `Optional[Union[ExitCode, int]]`

### Initialization hooks

Initialization hooks called for plugins and `conftest.py` files.

- **pytest_addoption**(`parser, pluginmanager`)     

    Register argparse-style options and ini-style config values, called once at the beginning of a test run.

    ::: tip Note
    This function should be implemented only in plugins or `conftest.py` files situated at the tests root directory due to how pytest [discovers plugins during startup](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#pluginorder).
    :::

    *Parameters*:

    - `parser (pytest.Parser)` – To add command line options, call [parser.addoption(...)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Parser.addoption). To add ini-file values call [parser.addini(...)](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Parser.addini).

    - `pluginmanager (pytest.PytestPluginManager)` – The pytest plugin manager, which can be used to install `hookspec()`’s or `hookimpl()`’s and allow one plugin to call another plugin’s hooks to change how command line options are added.

    Options can later be accessed through the [config](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Config) object, respectively:

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

    - `config (pytest.Config)` – The pytest config object.

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

### Collection hooks

`pytest` calls the following hooks for collecting files and directories:

- **pytest_collection**(`session`)        

    Perform the collection phase for the given session.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult). The return value is not used, but only stops further processing.

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

    Stops at first non-None result, see firstresult: stop at first non-None result.

    *Parameters*:

    - `collection_path(Path)` – The path to analyze.

    - `path(LEGACY_PATH)` – The path to analyze (deprecated).

    - `config(Config)` – The pytest config object.

    *Changed in version 7.0.0*: The `collection_path` parameter was added as a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) equivalent of the `path` parameter. The `path` parameter has been deprecated.

- **pytest_collect_file**(`file_path, path, parent`)      

    Create a [Collector](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Collector) for the given path, or None if not relevant.

    The new node needs to have the specified `parent` as a parent.

    *Parameters*:

    - `file_path (Path)` – The path to analyze.

    - `path (LEGACY_PATH)` – The path to collect (deprecated).

    *Changed in version 7.0.0*: The `file_path` parameter was added as a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) equivalent of the `path` parameter. The `path` parameter has been deprecated.

- **pytest_pycollect_makemodule**(`module_path, path, parent`)      

    Return a [pytest.Module](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Module) collector or None for the given path.

    This hook will be called for each matching test module path. The [pytest_collect_file](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_collect_file) hook needs to be used if you want to create test modules for files that do not match as a test module.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    *Parameters*:

    - `module_path (Path)` – The path of the module to collect.

    - `path (LEGACY_PATH)` – The path of the module to collect (deprecated).

    *Changed in version 7.0.0*: The `module_path` parameter was added as a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) equivalent of the `path` parameter.

    The path parameter has been deprecated in favor of `fspath`.

For influencing the collection of objects in Python modules you can use the following hook:

- **pytest_pycollect_makeitem**(`collector, name, obj`)       

    Return a custom item/collector for a Python object in a module, or None.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

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

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

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

### Test running (runtest) hooks

All runtest related hooks receive a pytest.Item object.

- **pytest_runtestloop**(`session`)       

    Perform the main runtest loop (after collection finished).

    The default hook implementation performs the runtest protocol for all items collected in the session (`session.items`), unless the collection failed or the `collectonly` pytest option is set.

    If at any point [pytest.exit()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.exit) is called, the loop is terminated immediately.

    If at any point `session.shouldfail` or `session.shouldstop` are set, the loop is terminated after the runtest protocol for the current item is finished.

    *Parameters*:

    - `session (Session)` – The pytest session object.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult). The return value is not used, but only stops further processing.

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

    - `call = pytest_runtest_call(item)` (wrapped in CallInfo(when="call"))

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

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult). The return value is not used, but only stops further processing.

- **pytest_runtest_logstart**(`nodeid, location`)     

    Called at the start of running the runtest protocol for a single item.

    See [pytest_runtest_protocol](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_runtest_protocol) for a description of the runtest protocol.

    *Parameters*:

    - `nodeid (str)` – Full node ID of the item.

    - `location (Tuple[str, Optional[int], str])` – A tuple of `(filename, lineno, testname)` where filename is a file path relative to `config.rootpath` and `lineno` is 0-based.

- **pytest_runtest_logfinish**(`nodeid, location`)        

    Called at the end of running the runtest protocol for a single item.

    See [pytest_runtest_protocol](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_runtest_protocol) for a description of the runtest protocol.

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

    Called to create a [TestReport](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TestReport) for each of the setup, call and teardown runtest phases of a test item.

    See [pytest_runtest_protocol](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_runtest_protocol) for a description of the runtest protocol.

    *Parameters*:

    - `item (Item)` – The item.

    - `call (CallInfo[None])` – The CallInfo for the phase.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    For deeper understanding you may look at the default implementation of these hooks in `_pytest.runner` and maybe also in `_pytest.pdb` which interacts with `_pytest.capture` and its input/output capturing in order to immediately drop into interactive debugging when a test failure occurs.

- **pytest_pyfunc_call**(`pyfuncitem`)        

    Call underlying test function.

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    *Parameters*:

    - `pyfuncitem (Function)` – The function item.

### Reporting hooks

Session related reporting hooks:

- **pytest_collectstart**(`collector`)      

    Collector starts collecting.

    *Parameters*:

    - `collector (Collector)` – The `collector`.

- **pytest_make_collect_report**(`collector`)       

    Perform [collector.collect()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Collector.collect) and return a [**CollectReport**](https://docs.pytest.org/en/latest/reference/reference.html#pytest.CollectReport).

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

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
    Lines returned by a plugin are displayed before those of plugins which ran before it. If you want to have your line(s) displayed first, use [trylast=True](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#plugin-hookorder).
    :::

    ::: tip Note
    This function should be implemented only in plugins or `conftest.py` files situated at the tests root directory due to how pytest [discovers plugins during startup](https://docs.pytest.org/en/latest/how-to/writing_plugins.html#pluginorder).
    ::: 

    *Changed in version 7.0.0*: The `start_path` parameter was added as a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) equivalent of the `startdir` parameter. The `startdir` parameter has been deprecated.

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
    Lines returned by a plugin are displayed before those of plugins which ran before it. If you want to have your line(s) displayed first, use [trylast=True](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#plugin-hookorder).
    :::

    *Changed in version 7.0.0*: The `start_path` parameter was added as a [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) equivalent of the `startdir` parameter. The `startdir` parameter has been deprecated.

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

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

- **pytest_report_to_serializable**(`config, report`)     

    Serialize the given report object into a data structure suitable for sending over the wire, e.g. converted to JSON.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

    - `report (Union[CollectReport, TestReport])` – The report.

- **pytest_report_from_serializable**(`config, data`)     

     Restore a report object previously serialized with [pytest_report_to_serializable](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_report_to_serializable).

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

    Stops at first non-None result, see [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult).

    ::: tip Note
    If the fixture function returns None, other implementations of this hook function will continue to be called, according to the behavior of the [firstresult: stop at first non-None result](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#firstresult) option.
    :::

- **pytest_fixture_post_finalizer**(`fixturedef, request`)      

    Called after fixture teardown, but before the cache is cleared, so the fixture result `fixturedef.cached_result` is still available (not `None`).

    *Parameters*:

    - `fixturdef` – The fixture definition object.

    - `request (SubRequest)` – The fixture `request` object.

- **pytest_warning_recorded**(`warning_message, when, nodeid, location`)        

    Process a warning captured by the internal pytest warnings plugin.

    *Parameters*:

    - `warning_message (warnings.WarningMessage)` – The captured warning. This is the same object produced by `warnings.catch_warnings()`, and contains the same attributes as the parameters of [warnings.showwarning()](https://docs.python.org/3/library/warnings.html#warnings.showwarning).

    - `when (Literal['config', 'collect', 'runtest'])` – Indicates when the warning was captured. Possible values:

        - `"config"`: during pytest configuration/initialization stage.

        - `"collect"`: during test collection.

        - `"runtest"`: during test execution.

    - `nodeid (str)` – Full id of the item.

    - `location (Optional[Tuple[str, int, str]])` – When available, holds information about the execution context of the captured warning (filename, linenumber, function). `function` evaluates to `<module>` when the execution context is at the module level.

    *New in version 6.0.*

*Central hook for reporting about test execution*:

- **pytest_runtest_logreport**(`report`)      

    Process the [TestReport](https://docs.pytest.org/en/latest/reference/reference.html#pytest.TestReport) produced for each of the setup, call and teardown runtest phases of an item.

    See [pytest_runtest_protocol](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_runtest_protocol) for a description of the runtest protocol.

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

### Debugging/Interaction hooks

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

    May be called during collection (see [pytest_make_collect_report](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_make_collect_report)), in which case `report` is a `CollectReport`.

    May be called during runtest of an item (see [pytest_runtest_protocol](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_runtest_protocol)), in which case `report` is a `TestReport`.

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

    Called when leaving pdb (e.g. with continue after pdb.set_trace()).

    Can be used by plugins to take special action just after the python debugger leaves interactive mode.

    *Parameters*:

    - `config (Config)` – The pytest `config` object.

    - `pdb (pdb.Pdb)` – The `Pdb` instance.

## Collection tree objects

These are the collector and item classes (collectively called “nodes”) which make up the collection tree.

### Node

- class **Node**      

    Base class of `Collector` and `Item`, the components of the test collection tree.

    `Collector`'s are the internal nodes of the tree, and `Item`'s are the leaf nodes.

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.Node.path) instead.

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

    - classmethod **from_parent**(`parent, **kw`)     

        Public constructor for Nodes.

        This indirection got introduced in order to enable removing the fragile logic from the node constructors.

        Subclasses can use `super().from_parent(...)` when overriding the construction.

        *Parameters*:

        - `parent (Node)` – The parent node of this Node.

    - property **ihook**

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

        *Changed in version 6.2*: Any subclass of [Warning](https://docs.python.org/3/library/exceptions.html#Warning) is now accepted, rather than only [PytestWarning](https://docs.pytest.org/en/latest/reference/reference.html#pytest.PytestWarning) subclasses.

    - property **nodeid**: `str`

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

        - name (Optional[str]) – If given, filter the results by the name attribute.

        *Returns*: An iterator of the markers of the node.

        *Return type*: `Iterator[Mark]`

    - for ... in **iter_markers_with_node**(`name=None`)        

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

        This method can only be called when this node is active in a setup chain, for example during self.setup().

    - **getparent**(`cls`)        

        Get the next parent node (including self) which is an instance of the given class.

        *Parameters*:

        - `cls (Type[_NodeType])` – The node class to search for.

        *Returns*: The node, if found.

        *Return type*: `Optional[_NodeType]`

    - **repr_failure**(`excinfo, style=None`)       

        Return a representation of a collection or test failure.

        ::: tip See also
        [Working with non-python tests](https://docs.pytest.org/en/latest/example/nonpython.html#non-python-tests)
        :::

        *Parameters*:

        - excinfo (ExceptionInfo[BaseException]) – Exception information for the failure.

### Collector

- class **Collector**     

    - *Bases*: `Node`

    Base class of all collectors.

    `Collector` create children through `collect()` and thus iteratively build the collection tree.

    - exception **CollectError**      

        Bases: [Exception](https://docs.python.org/3/library/exceptions.html#Exception)

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

        Filesystem path where this node was collected from (can be None).

    - **fspath**: `LocalPath`

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Collector.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Collector.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### Item

- class **Item**      

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

        A LEGACY_PATH copy of the path attribute. Intended for usage for methods not migrated to pathlib.Path yet, such as Item.reportinfo(). Will be deprecated in a future release, prefer using path instead.

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
        [Working with non-python tests](https://docs.pytest.org/en/latest/example/nonpython.html#non-python-tests)
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
        [Working with non-python tests](https://docs.pytest.org/en/latest/example/nonpython.html#non-python-tests)
        ::: 

    - property **location**: `Tuple[str, Optional[int], str]`

        Returns a tuple of `(relfspath, lineno, testname)` for this item where `relfspath` is file path relative to `config.rootpath` and lineno is a 0-based line number.

### File

- class **File**      

    - *Bases*: `FSCollector`

    Base class for collecting tests from a file.

    [Working with non-python tests.](https://docs.pytest.org/en/latest/example/nonpython.html#non-python-tests)

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

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.File.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### FSCollector

- class **FSCollector**       

    - *Bases*: `Collector`

    Base class for filesystem collectors.

    - **path**: `Path`

        Filesystem path where this node was collected from (can be None).

    - classmethod **from_parent**(`parent, *, fspath=None, path=None, **kw`)        

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

        A `LEGACY_PATH` copy of the path attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.nodes.FSCollector.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### Session

- final class `Session`       

    - *Bases*: `FSCollector`

    The root of the collection tree.

    `Session` collects the initial paths given as arguments to pytest.

    - exception **Interrupted**

        - *Bases*: KeyboardInterrupt

        Signals that the test run was interrupted.

    - exception **Failed**

        - *Bases*: `Exception`

        Signals a stop as failed test run.

    - property **startpath**: `Path`

        The path from which pytest was invoked.

        *New in version 7.0.0.*

    - **perform_collect**(`args: Optional[Sequence[str]] = None, genitems: Literal[True] = True`) → `Sequence[Item]`      

    - **perform_collect**(`args: Optional[Sequence[str]] = None, genitems: bool = True`) → `Sequence[Union[Item, Collector]]`

        Perform the collection phase for this session.

        This is called by the default [pytest_collection](https://docs.pytest.org/en/latest/reference/reference.html#std-hook-pytest_collection) hook implementation; see the documentation of this hook for more details. For testing purposes, it may also be called directly on a fresh `Session`.

        This function normally recursively expands any collectors collected from the session to their items, and only items are returned. For testing purposes, this may be suppressed by passing `genitems=False`, in which case the return value contains these collectors unexpanded, and `session.items` is empty.

    - for ... in **collect**()        

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

### Package

- class **Package**       

    - *Bases*: `Module`

    Collector for files and directories in a Python packages – directories with an `__init__.py` file.

    - **name**: `str`

        A unique name within the scope of the parent node.

    - for ... in **collect**()        

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

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Package.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Package.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### Module

- class **Module**        

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

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Module.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Module.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### Class

- class **Class**     

    - *Bases*: `PyCollector`

    Collector for test methods (and nested classes) in a Python class.

    - classmethod **from_parent**(`parent, *, name, obj=None, **kw`)        

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

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Class.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Class.path) instead.

    - **keywords**: `MutableMapping[str, Any]`

        Keywords/markers collected from all scopes.

    - **own_markers**: `List[Mark]`

        The marker objects belonging to this node.

    - **extra_keyword_matches**: `Set[str]`

        Allow adding of extra keywords to use for matching.

    - **stash**: `Stash`

        A place where plugins can store information on the node for their own use.

### Function

- class **Function**      

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

    - classmethod **from_parent**(`parent, **kw`)     

        The public constructor.

    - property **function**

        Underlying python ‘function’ object.

    - **runtest**()     

        Execute the underlying test function.

    - **repr_failure**(`excinfo`)     

        Return a representation of a collection or test failure.

        ::: tip See also
        Working with non-python tests
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

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Function.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as [Item.reportinfo()](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Item.reportinfo). Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.Function.path) instead.

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

### FunctionDefinition

- class **FunctionDefinition**        

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

        A `LEGACY_PATH` copy of the [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.python.FunctionDefinition.path) attribute. Intended for usage for methods not migrated to `pathlib.Path` yet, such as `Item.reportinfo()`. Will be deprecated in a future release, prefer using [path](https://docs.pytest.org/en/latest/reference/reference.html#pytest.python.FunctionDefinition.path) instead.

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

## Objects

Objects accessible from fixtures or hooks or importable from `pytest`.

### CallInfo

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

### CollectReport

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

### Config

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

### ExceptionInfo

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

### ExitCode

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

### FixtureDef

- final class **FixtureDef**      

    - *Bases*: `Generic[FixtureValue]`

    A container for a fixture definition.

    *Note*: At this time, only explicitly documented fields and methods are considered public stable API.

    - property **scope**: `Literal['session', 'package', 'module', 'class', 'function']`

        Scope string, one of `“function”`, `“class”`,` “module”`, `“package”`, `“session”`.

### MarkDecorator

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

### MarkGenerator

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

### Mark

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

### Metafunc

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

### Parser

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

### OptionGroup

- class **OptionGroup**       

    A group of options shown in its own section.

    - **addoption**(`*opts, **attrs`)       

        Add an option to this group.

        If a shortened version of a long option is specified, it will be suppressed in the help. `addoption('--twowords', '--two-words')` results in help showing `--two-words` only, but `--twowords` gets accepted and the automatic destination is in `args.twowords`.

        *Parameters*:

        - `opts (str)` – Option names, can be short or long options.

        - `attrs (Any)` – Same attributes as the argparse library’s `add_argument()` function accepts.

### PytestPluginManager

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

### TestReport

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

### TestShortLogReport

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

### _Result

Result object used within [hook wrappers](https://docs.pytest.org/en/latest/how-to/writing_hook_functions.html#hookwrapper), see [_Result in the pluggy documentation](https://pluggy.readthedocs.io/en/stable/api_reference.html#pluggy._callers._Result) for more information.

### Stash

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

## Global Variables

pytest treats some global variables in a special manner when defined in a test module or `conftest.py` files.

- **collect_ignore**

    **Tutorial**: [Customizing test collection](https://docs.pytest.org/en/latest/example/pythoncollection.html#customizing-test-collection)
     
    Can be declared in `conftest.py` files to exclude test directories or modules. Needs to be a list of paths (`str`, [pathlib.Path](https://docs.python.org/3/library/pathlib.html#pathlib.Path) or any [os.PathLike](https://docs.python.org/3/library/os.html#os.PathLike)).

    ```python
    collect_ignore = ["setup.py"]
    ```

- **collect_ignore_glob**

    **Tutorial**: [Customizing test collection](https://docs.pytest.org/en/latest/example/pythoncollection.html#customizing-test-collection)

    Can be declared in conftest.py files to exclude test directories or modules with Unix shell-style wildcards. Needs to be `list[str]` where `str` can contain glob patterns.

    ```python
    collect_ignore_glob = ["*_ignore.py"]
    ```

- **pytest_plugins**

    **Tutorial**: [Requiring/Loading plugins in a test module or conftest file](https://docs.pytest.org/en/latest/how-to/plugins.html#available-installable-plugins)

    Can be declared at the global level in test modules and `conftest.py` files to register additional - plugins. Can be either a `str` or `Sequence[str]`.

    ```python
    pytest_plugins = "myapp.testsupport.myplugin"
    ```

    ```python
    pytest_plugins = ("myapp.testsupport.tools", "myapp.testsupport.regression")
    ```

- **pytestmark**

    **Tutorial**: [Marking whole classes or modules](https://docs.pytest.org/en/latest/example/markers.html#scoped-marking)

    Can be declared at the global level in test modules to apply one or more [marks](https://docs.pytest.org/en/latest/reference/reference.html#marks-ref) to all test - functions and methods. Can be either a single mark or a list of marks (applied in left-to-right - order).

    ```python
    import pytest

    pytestmark = pytest.mark.webtest
    ```

    ```python
    import pytest

    pytestmark = [pytest.mark.integration, pytest.mark.slow]
    ```

## Environment Variables

Environment variables that can be used to change pytest’s behavior.

- **CI**

    When set (regardless of value), pytest acknowledges that is running in a CI process. Alternative to `BUILD_NUMBER` variable.

- **BUILD_NUMBER**

    When set (regardless of value), pytest acknowledges that is running in a CI process. Alternative to CI variable.

- **PYTEST_ADDOPTS**

    This contains a command-line (parsed by the py:mod:`shlex` module) that will be prepended to the command line given by the user, see [Builtin configuration file options](https://docs.pytest.org/en/latest/reference/customize.html#adding-default-options) for more information.

- **PYTEST_CURRENT_TEST**

    This is not meant to be set by users, but is set by pytest internally with the name of the current test so other processes can inspect it, see [PYTEST_CURRENT_TEST environment variable](https://docs.pytest.org/en/latest/example/simple.html#pytest-current-test-env) for more information.

- **PYTEST_DEBUG**

    When set, pytest will print tracing and debug information.

- **PYTEST_DISABLE_PLUGIN_AUTOLOAD**

    When set, disables plugin auto-loading through setuptools entrypoints. Only explicitly specified plugins will be loaded.

- **PYTEST_PLUGINS**

    Contains comma-separated list of modules that should be loaded as plugins:

    ```shell
    export PYTEST_PLUGINS=mymodule.plugin,xdist
    ```

- **PYTEST_THEME**

    Sets a [pygment style](https://pygments.org/docs/styles/) to use for the code output.

- **PYTEST_THEME_MODE**

    Sets the [PYTEST_THEME](https://docs.pytest.org/en/latest/reference/reference.html#envvar-PYTEST_THEME) to be either dark or light.

- **PY_COLORS**

    When set to `1`, pytest will use color in terminal output. When set to 0, pytest will not use color. `PY_COLORS` takes precedence over `NO_COLOR` and `FORCE_COLOR`.

- **NO_COLOR**

    When set (regardless of value), pytest will not use color in terminal output. `PY_COLORS` takes precedence over `NO_COLOR`, which takes precedence over `FORCE_COLOR`. See no-color.org for other libraries supporting this community standard.

- **FORCE_COLOR**

    When set (regardless of value), pytest will use color in terminal output. `PY_COLORS` and `NO_COLOR` take precedence over `FORCE_COLOR`.

## Exceptions

- final class **UsageError**      

    - *Bases*: `Exception`

    Error in pytest usage or invocation.

## Warnings

Custom warnings generated in some situations such as improper usage or deprecated features.

- class **PytestWarning**

    - *Bases*: `UserWarning`

    Base class for all warnings emitted by pytest.

- class **PytestAssertRewriteWarning**

    - *Bases*: `PytestWarning`

    Warning emitted by the pytest assert rewrite module.

- class **PytestCacheWarning**

    - *Bases*: `PytestWarning`

    Warning emitted by the cache plugin in various situations.

- class **PytestCollectionWarning**

    - *Bases*: `PytestWarning`

    Warning emitted when pytest is not able to collect a file or symbol in a module.

- class **PytestConfigWarning**

    - *Bases*: `PytestWarning`

    Warning emitted for configuration issues.

- class **PytestDeprecationWarning**

    - *Bases*: `PytestWarning`, `DeprecationWarning`

    Warning class for features that will be removed in a future version.

- class **PytestExperimentalApiWarning**

    - *Bases*: `PytestWarning`, `FutureWarning`

    Warning category used to denote experiments in pytest.

    Use sparingly as the API might change or even be removed completely in a future version.

- class **PytestReturnNotNoneWarning**

    - *Bases*: `PytestRemovedIn8Warning`

    Warning emitted when a test function is returning value other than None.

- class **PytestRemovedIn8Warning**

    - *Bases*: `PytestDeprecationWarning`

    Warning class for features that will be removed in pytest 8.

- class **PytestRemovedIn9Warning**

    - *Bases*: `PytestDeprecationWarning`
     
    Warning class for features that will be removed in pytest 9.

- class **PytestUnhandledCoroutineWarning**

    - *Bases*: `PytestReturnNotNoneWarning`

    Warning emitted for an unhandled coroutine.

    A coroutine was encountered when collecting test functions, but was not handled by any async-aware - plugin. Coroutine test functions are not natively supported.

- class **PytestUnknownMarkWarning**

    - *Bases*: `PytestWarning`

    Warning emitted on use of unknown markers.
     
    See How to mark test functions with attributes for details.

- class **PytestUnraisableExceptionWarning**

    - *Bases*: `PytestWarning`

    An unraisable exception was reported.

    Unraisable exceptions are exceptions raised in `__del__` implementations and similar situations when the exception cannot be raised as normal.

- class **PytestUnhandledThreadExceptionWarning**

    - *Bases*: `PytestWarning`

    An unhandled exception occurred in a Thread.

    Such exceptions don’t propagate normally.

Consult the [Internal pytest warnings](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#internal-warnings) section in the documentation for more information.

## Configuration Options

Here is a list of builtin configuration options that may be written in a `pytest.ini` (or `.pytest.ini`), `pyproject.toml`, `tox.ini`, or `setup.cfg` file, usually located at the root of your repository.

To see each file format in details, see [Configuration file formats](https://docs.pytest.org/en/latest/reference/customize.html#config-file-formats).

::: tip Warning
Usage of `setup.cfg` is not recommended except for very simple use cases. `.cfg` files use a different parser than `pytest.ini` and `tox.ini` which might cause hard to track down problems. When possible, it is recommended to use the latter files, or `pyproject.toml`, to hold your pytest configuration.
:::

Configuration options may be overwritten in the command-line by using `-o/--override-ini`, which can also be passed multiple times. The expected format is `name=value`. For example:

```python
pytest -o console_output_style=classic -o cache_dir=/tmp/mycache
```

- **addopts**

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

- **cache_dir**

    Sets a directory where stores content of cache plugin. Default directory is `.pytest_cache` which is created in [rootdir](https://docs.pytest.org/en/latest/reference/customize.html#rootdir). Directory may be relative or absolute path. If setting relative path, then directory is created relative to rootdir. Additionally path may contain environment variables, that will be expanded. For more information about cache plugin please refer to How to [re-run failed tests and maintain state between test runs](https://docs.pytest.org/en/latest/how-to/cache.html#cache-provider).

- **console_output_style**

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

- **doctest_encoding**

    Default encoding to use to decode text files with docstrings. [See how pytest handles doctests](https://docs.pytest.org/en/latest/how-to/doctest.html#doctest).

- **doctest_optionflags**

  One or more doctest flag names from the standard `doctest` module. [See how pytest handles doctests](https://docs.pytest.org/en/latest/how-to/doctest.html#doctest).

- **empty_parameter_set_mark**

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

- **faulthandler_timeout**

    Dumps the tracebacks of all threads if a test takes longer than X seconds to run (including fixture setup and teardown). Implemented using the [faulthandler.dump_traceback_later() ](https://docs.python.org/3/library/faulthandler.html#faulthandler.dump_traceback_later)function, so all caveats there apply.

    ```ini
    # content of pytest.ini
    [pytest]
    faulthandler_timeout=5
    ```

    For more information please refer to [Fault Handler](https://docs.pytest.org/en/latest/how-to/failures.html#faulthandler).

- **filterwarnings**

    Sets a list of filters and actions that should be taken for matched warnings. By default all warnings emitted during the test session will be displayed in a summary at the end of the test session.

    ```ini
    # content of pytest.ini
    [pytest]
    filterwarnings =
        error
        ignore::DeprecationWarning
    ```

    This tells pytest to ignore deprecation warnings and turn all other warnings into errors. For more information please refer to [How to capture warnings](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#warnings).

- **junit_duration_report**

    *New in version 4.1.*

    Configures how durations are recorded into the JUnit XML report:

    - `total` (the default): duration times reported include setup, call, and teardown times.

    - `call`: duration times reported include only call times, excluding setup and teardown.

    ```ini
    [pytest]
    junit_duration_report = call
    ```

- **junit_family**

    *New in version 4.2.*

    *Changed in version 6.1*: Default changed to `xunit2`.

    Configures the format of the generated JUnit XML file. The possible options are:

    - `xunit1` (or `legacy`): produces old style output, compatible with the xunit 1.0 format.

    - `xunit2`: produces [xunit 2.0 style output](https://github.com/jenkinsci/xunit-plugin/blob/xunit-2.3.2/src/main/resources/org/jenkinsci/plugins/xunit/types/model/xsd/junit-10.xsd), which should be more compatible with latest Jenkins versions. This is the default.

    ```ini
    [pytest]
    junit_family = xunit2
    ```

- **junit_logging**

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

- **junit_log_passing_tests**

    *New in version 4.6.*

    If `junit_logging != "no"`, configures if the captured output should be written to the JUnit XML file for passing tests. Default is `True`.

    ```ini
    [pytest]`
    junit_log_passing_tests = False
    ```

- **junit_suite_name**

    To set the name of the root test suite xml item, you can configure the `junit_suite_name` option in your config file:

    ```ini
    [pytest]
    junit_suite_name = my_suite
    ```

- **log_auto_indent**

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

- **log_cli**

    Enable log display during test run (also known as [“live logging”](https://docs.pytest.org/en/latest/how-to/logging.html#live-logs)). The default is `False`.

    ```ini
    [pytest]
    log_cli = True
    ```

- **log_cli_date_format**

    Sets a `time.strftime()`-compatible string that will be used when formatting dates for live logging.

    ```ini
    [pytest]
    log_cli_date_format = %Y-%m-%d %H:%M:%S
    ```

    For more information, see [Live Logs](https://docs.pytest.org/en/latest/how-to/logging.html#live-logs).

- **log_cli_format**

    Sets a `logging`-compatible string used to format live logging messages.

    ```ini
    [pytest]
    log_cli_format = %(asctime)s %(levelname)s %(message)s
    ```

    For more information, see [Live Logs](https://docs.pytest.org/en/latest/how-to/logging.html#live-logs).

- **log_cli_level**

    Sets the minimum log message level that should be captured for live logging. The integer value or the names of the levels can be used.

    ```ini
    [pytest]
    log_cli_level = INFO
    ```

    For more information, see [Live Logs](https://docs.pytest.org/en/latest/how-to/logging.html#live-logs).

- **log_date_format**

    Sets a `time.strftime()`-compatible string that will be used when formatting dates for logging capture.

    ```ini
    [pytest]
    log_date_format = %Y-%m-%d %H:%M:%S
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_file**

    Sets a file name relative to the current working directory where log messages should be written to, in addition to the other logging facilities that are active.

    ```ini
    [pytest]
    log_file = logs/pytest-logs.txt
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_file_date_format**

    Sets a `time.strftime()`-compatible string that will be used when formatting dates for the logging file.

    ```ini
    [pytest]
    log_file_date_format = %Y-%m-%d %H:%M:%S
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_file_format**

    Sets a `logging`-compatible string used to format logging messages redirected to the logging file.

    ```ini
    [pytest]
    log_file_format = %(asctime)s %(levelname)s %(message)s
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_file_level**

    Sets the minimum log message level that should be captured for the logging file. The integer value or the names of the levels can be used.

    ```ini
    [pytest]
    log_file_level = INFO
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_format**

    Sets a `logging`-compatible string used to format captured logging messages.

    ```ini
    [pytest]
    log_format = %(asctime)s %(levelname)s %(message)s
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **log_level**

    Sets the minimum log message level that should be captured for logging capture. The integer value or the names of the levels can be used.

    ```ini
    [pytest]
    log_level = INFO
    ```

    For more information, see [How to manage logging](https://docs.pytest.org/en/latest/how-to/logging.html#logging).

- **markers**

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

- **minversion**

    Specifies a minimal pytest version required for running tests.

    ```ini
    # content of pytest.ini
    [pytest]
    minversion = 3.0  # will fail if we run with pytest-2.8
    ```

- **norecursedirs**

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

- **python_classes**

    One or more name prefixes or glob-style patterns determining which classes are considered for test collection. Search for multiple glob patterns by adding a space between patterns. By default, pytest will consider any class prefixed with `Test` as a test collection. Here is an example of how to collect tests from classes that end in `Suite`:

    ```ini
    [pytest]
    python_classes = *Suite
    ```

    Note that `unittest.TestCase` derived classes are always collected regardless of this option, as `unittest’s` own collection framework is used to collect those tests.

- **python_files**

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

- **python_functions**

    One or more name prefixes or glob-patterns determining which test functions and methods are considered tests. Search for multiple glob patterns by adding a space between patterns. By default, pytest will consider any function prefixed with `test` as a test. Here is an example of how to collect test functions and methods that end in `_test`:

    ```ini
    [pytest]
    python_functions = *_test
    ```

    Note that this has no effect on methods that live on a `unittest.TestCase` derived class, as `unittest’s` own collection framework is used to collect those tests.

    See [Changing naming conventions](https://docs.pytest.org/en/latest/example/pythoncollection.html#change-naming-conventions) for more detailed examples.

- **pythonpath**

    Sets list of directories that should be added to the python search path. Directories will be added to the head of [sys.path](https://docs.python.org/3/library/sys.html#sys.path). Similar to the [PYTHONPATH](https://docs.python.org/3/using/cmdline.html#envvar-PYTHONPATH) environment variable, the directories will be included in where Python will look for imported modules. Paths are relative to the [rootdir](https://docs.pytest.org/en/latest/reference/customize.html#rootdir) directory. Directories remain in path for the duration of the test session.

    ```ini
    [pytest]
    pythonpath = src1 src2
    ```

    ::: tip Note
    pythonpath does not affect some imports that happen very early, most notably plugins loaded using the -p command line option.
    :::

- **required_plugins**

    A space separated list of plugins that must be present for pytest to run. Plugins can be listed with or without version specifiers directly following their name. Whitespace between different version specifiers is not allowed. If any one of the plugins is not found, emit an error.

    ```ini
    [pytest]
    required_plugins = pytest-django>=3.0.0,<4.0.0 pytest-html pytest-xdist>=1.0.0
    ```

- **testpaths**

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

- **tmp_path_retention_count**

    How many sessions should we keep the `tmp_path` directories, according to `tmp_path_retention_policy`.

    ```ini
    [pytest]
    tmp_path_retention_count = 3
    ```

    *Default*: `3`

- **tmp_path_retention_policy**

    Controls which directories created by the `tmp_path` fixture are kept around, based on test outcome.

    - `all`: retains directories for all tests, regardless of the outcome.

    - `failed`: retains directories only for tests with outcome `error` or `failed`.

    - `none`: directories are always removed after each test ends, regardless of the outcome.

    ```ini
    [pytest]
    tmp_path_retention_policy = "all"
    ```

    *Default*: `all`

- **usefixtures**

    List of fixtures that will be applied to all test functions; this is semantically the same to apply the `@pytest.mark.usefixtures` marker to all test functions.

    ```ini
    [pytest]
    usefixtures =
        clean_db
    ```

- **xfail_strict**

    If set to `True`, tests marked with `@pytest.mark.xfail` that actually succeed will by default fail the test suite. For more information, see [strict parameter](https://docs.pytest.org/en/latest/how-to/skipping.html#xfail-strict-tutorial).

    ```ini
    [pytest]
    xfail_strict = True
    ```

## Command-line Flags

All the command-line flags can be obtained by running `pytest --help`:

```shell
$ pytest --help
usage: pytest [options] [file_or_dir] [file_or_dir] [...]

positional arguments:
  file_or_dir

general:
  -k EXPRESSION         Only run tests which match the given substring
                        expression. An expression is a Python evaluatable
                        expression where all names are substring-matched
                        against test names and their parent classes.
                        Example: -k 'test_method or test_other' matches all
                        test functions and classes whose name contains
                        'test_method' or 'test_other', while -k 'not
                        test_method' matches those that don't contain
                        'test_method' in their names. -k 'not test_method
                        and not test_other' will eliminate the matches.
                        Additionally keywords are matched to classes and
                        functions containing extra names in their
                        'extra_keyword_matches' set, as well as functions
                        which have names assigned directly to them. The
                        matching is case-insensitive.
  -m MARKEXPR           Only run tests matching given mark expression. For
                        example: -m 'mark1 and not mark2'.
  --markers             show markers (builtin, plugin and per-project ones).
  -x, --exitfirst       Exit instantly on first error or failed test
  --fixtures, --funcargs
                        Show available fixtures, sorted by plugin appearance
                        (fixtures with leading '_' are only shown with '-v')
  --fixtures-per-test   Show fixtures per test
  --pdb                 Start the interactive Python debugger on errors or
                        KeyboardInterrupt
  --pdbcls=modulename:classname
                        Specify a custom interactive Python debugger for use
                        with --pdb.For example:
                        --pdbcls=IPython.terminal.debugger:TerminalPdb
  --trace               Immediately break when running each test
  --capture=method      Per-test capturing method: one of fd|sys|no|tee-sys
  -s                    Shortcut for --capture=no
  --runxfail            Report the results of xfail tests as if they were
                        not marked
  --lf, --last-failed   Rerun only the tests that failed at the last run (or
                        all if none failed)
  --ff, --failed-first  Run all tests, but run the last failures first. This
                        may re-order tests and thus lead to repeated fixture
                        setup/teardown.
  --nf, --new-first     Run tests from new files first, then the rest of the
                        tests sorted by file mtime
  --cache-show=[CACHESHOW]
                        Show cache contents, don't perform collection or
                        tests. Optional argument: glob (default: '*').
  --cache-clear         Remove all cache contents at start of test run
  --lfnf={all,none}, --last-failed-no-failures={all,none}
                        Which tests to run with no previously (known)
                        failures
  --sw, --stepwise      Exit on test failure and continue from last failing
                        test next time
  --sw-skip, --stepwise-skip
                        Ignore the first failing test but stop on the next
                        failing test. Implicitly enables --stepwise.

Reporting:
  --durations=N         Show N slowest setup/test durations (N=0 for all)
  --durations-min=N     Minimal duration in seconds for inclusion in slowest
                        list. Default: 0.005.
  -v, --verbose         Increase verbosity
  --no-header           Disable header
  --no-summary          Disable summary
  -q, --quiet           Decrease verbosity
  --verbosity=VERBOSE   Set verbosity. Default: 0.
  -r chars              Show extra test summary info as specified by chars:
                        (f)ailed, (E)rror, (s)kipped, (x)failed, (X)passed,
                        (p)assed, (P)assed with output, (a)ll except passed
                        (p/P), or (A)ll. (w)arnings are enabled by default
                        (see --disable-warnings), 'N' can be used to reset
                        the list. (default: 'fE').
  --disable-warnings, --disable-pytest-warnings
                        Disable warnings summary
  -l, --showlocals      Show locals in tracebacks (disabled by default)
  --no-showlocals       Hide locals in tracebacks (negate --showlocals
                        passed through addopts)
  --tb=style            Traceback print mode
                        (auto/long/short/line/native/no)
  --show-capture={no,stdout,stderr,log,all}
                        Controls how captured stdout/stderr/log is shown on
                        failed tests. Default: all.
  --full-trace          Don't cut any tracebacks (default is to cut)
  --color=color         Color terminal output (yes/no/auto)
  --code-highlight={yes,no}
                        Whether code should be highlighted (only if --color
                        is also enabled). Default: yes.
  --pastebin=mode       Send failed|all info to bpaste.net pastebin service
  --junit-xml=path      Create junit-xml style report file at given path
  --junit-prefix=str    Prepend prefix to classnames in junit-xml output

pytest-warnings:
  -W PYTHONWARNINGS, --pythonwarnings=PYTHONWARNINGS
                        Set which warnings to report, see -W option of
                        Python itself
  --maxfail=num         Exit after first num failures or errors
  --strict-config       Any warnings encountered while parsing the `pytest`
                        section of the configuration file raise errors
  --strict-markers      Markers not registered in the `markers` section of
                        the configuration file raise errors
  --strict              (Deprecated) alias to --strict-markers
  -c FILE, --config-file=FILE
                        Load configuration from `FILE` instead of trying to
                        locate one of the implicit configuration files.
  --continue-on-collection-errors
                        Force test execution even if collection errors occur
  --rootdir=ROOTDIR     Define root directory for tests. Can be relative
                        path: 'root_dir', './root_dir',
                        'root_dir/another_dir/'; absolute path:
                        '/home/user/root_dir'; path with variables:
                        '$HOME/root_dir'.

collection:
  --collect-only, --co  Only collect tests, don't execute them
  --pyargs              Try to interpret all arguments as Python packages
  --ignore=path         Ignore path during collection (multi-allowed)
  --ignore-glob=path    Ignore path pattern during collection (multi-
                        allowed)
  --deselect=nodeid_prefix
                        Deselect item (via node id prefix) during collection
                        (multi-allowed)
  --confcutdir=dir      Only load conftest.py's relative to specified dir
  --noconftest          Don't load any conftest.py files
  --keep-duplicates     Keep duplicate tests
  --collect-in-virtualenv
                        Don't ignore tests in a local virtualenv directory
  --import-mode={prepend,append,importlib}
                        Prepend/append to sys.path when importing test
                        modules and conftest files. Default: prepend.
  --doctest-modules     Run doctests in all .py modules
  --doctest-report={none,cdiff,ndiff,udiff,only_first_failure}
                        Choose another output format for diffs on doctest
                        failure
  --doctest-glob=pat    Doctests file matching pattern, default: test*.txt
  --doctest-ignore-import-errors
                        Ignore doctest ImportErrors
  --doctest-continue-on-failure
                        For a given doctest, continue to run after the first
                        failure

test session debugging and configuration:
  --basetemp=dir        Base temporary directory for this test run.
                        (Warning: this directory is removed if it exists.)
  -V, --version         Display pytest version and information about
                        plugins. When given twice, also display information
                        about plugins.
  -h, --help            Show help message and configuration info
  -p name               Early-load given plugin module name or entry point
                        (multi-allowed). To avoid loading of plugins, use
                        the `no:` prefix, e.g. `no:doctest`.
  --trace-config        Trace considerations of conftest.py files
  --debug=[DEBUG_FILE_NAME]
                        Store internal tracing debug information in this log
                        file. This file is opened with 'w' and truncated as
                        a result, care advised. Default: pytestdebug.log.
  -o OVERRIDE_INI, --override-ini=OVERRIDE_INI
                        Override ini option with "option=value" style, e.g.
                        `-o xfail_strict=True -o cache_dir=cache`.
  --assert=MODE         Control assertion debugging tools.
                        'plain' performs no assertion debugging.
                        'rewrite' (the default) rewrites assert statements
                        in test modules on import to provide assert
                        expression information.
  --setup-only          Only setup fixtures, do not execute tests
  --setup-show          Show setup of fixtures while executing tests
  --setup-plan          Show what fixtures and tests would be executed but
                        don't execute anything

logging:
  --log-level=LEVEL     Level of messages to catch/display. Not set by
                        default, so it depends on the root/parent log
                        handler's effective level, where it is "WARNING" by
                        default.
  --log-format=LOG_FORMAT
                        Log format used by the logging module
  --log-date-format=LOG_DATE_FORMAT
                        Log date format used by the logging module
  --log-cli-level=LOG_CLI_LEVEL
                        CLI logging level
  --log-cli-format=LOG_CLI_FORMAT
                        Log format used by the logging module
  --log-cli-date-format=LOG_CLI_DATE_FORMAT
                        Log date format used by the logging module
  --log-file=LOG_FILE   Path to a file when logging will be written to
  --log-file-level=LOG_FILE_LEVEL
                        Log file logging level
  --log-file-format=LOG_FILE_FORMAT
                        Log format used by the logging module
  --log-file-date-format=LOG_FILE_DATE_FORMAT
                        Log date format used by the logging module
  --log-auto-indent=LOG_AUTO_INDENT
                        Auto-indent multiline messages passed to the logging
                        module. Accepts true|on, false|off or an integer.
  --log-disable=LOGGER_DISABLE
                        Disable a logger by name. Can be passed multiple
                        times.

[pytest] ini-options in the first pytest.ini|tox.ini|setup.cfg|pyproject.toml file found:

  markers (linelist):   Markers for test functions
  empty_parameter_set_mark (string):
                        Default marker for empty parametersets
  norecursedirs (args): Directory patterns to avoid for recursion
  testpaths (args):     Directories to search for tests when no files or
                        directories are given on the command line
  filterwarnings (linelist):
                        Each line specifies a pattern for
                        warnings.filterwarnings. Processed after
                        -W/--pythonwarnings.
  usefixtures (args):   List of default fixtures to be used with this
                        project
  python_files (args):  Glob-style file patterns for Python test module
                        discovery
  python_classes (args):
                        Prefixes or glob names for Python test class
                        discovery
  python_functions (args):
                        Prefixes or glob names for Python test function and
                        method discovery
  disable_test_id_escaping_and_forfeit_all_rights_to_community_support (bool):
                        Disable string escape non-ASCII characters, might
                        cause unwanted side effects(use at your own risk)
  console_output_style (string):
                        Console output: "classic", or with additional
                        progress information ("progress" (percentage) |
                        "count" | "progress-even-when-capture-no" (forces
                        progress even when capture=no)
  xfail_strict (bool):  Default for the strict parameter of xfail markers
                        when not given explicitly (default: False)
  tmp_path_retention_count (string):
                        How many sessions should we keep the `tmp_path`
                        directories, according to
                        `tmp_path_retention_policy`.
  tmp_path_retention_policy (string):
                        Controls which directories created by the `tmp_path`
                        fixture are kept around, based on test outcome.
                        (all/failed/none)
  enable_assertion_pass_hook (bool):
                        Enables the pytest_assertion_pass hook. Make sure to
                        delete any previously generated pyc cache files.
  junit_suite_name (string):
                        Test suite name for JUnit report
  junit_logging (string):
                        Write captured log messages to JUnit report: one of
                        no|log|system-out|system-err|out-err|all
  junit_log_passing_tests (bool):
                        Capture log information for passing tests to JUnit
                        report:
  junit_duration_report (string):
                        Duration time to report: one of total|call
  junit_family (string):
                        Emit XML for schema: one of legacy|xunit1|xunit2
  doctest_optionflags (args):
                        Option flags for doctests
  doctest_encoding (string):
                        Encoding used for doctest files
  cache_dir (string):   Cache directory path
  log_level (string):   Default value for --log-level
  log_format (string):  Default value for --log-format
  log_date_format (string):
                        Default value for --log-date-format
  log_cli (bool):       Enable log display during test run (also known as
                        "live logging")
  log_cli_level (string):
                        Default value for --log-cli-level
  log_cli_format (string):
                        Default value for --log-cli-format
  log_cli_date_format (string):
                        Default value for --log-cli-date-format
  log_file (string):    Default value for --log-file
  log_file_level (string):
                        Default value for --log-file-level
  log_file_format (string):
                        Default value for --log-file-format
  log_file_date_format (string):
                        Default value for --log-file-date-format
  log_auto_indent (string):
                        Default value for --log-auto-indent
  pythonpath (paths):   Add paths to sys.path
  faulthandler_timeout (string):
                        Dump the traceback of all threads if a test takes
                        more than TIMEOUT seconds to finish
  addopts (args):       Extra command line options
  minversion (string):  Minimally required pytest version
  required_plugins (args):
                        Plugins that must be present for pytest to run

Environment variables:
  PYTEST_ADDOPTS           Extra command line options
  PYTEST_PLUGINS           Comma-separated plugins to load during startup
  PYTEST_DISABLE_PLUGIN_AUTOLOAD Set to disable plugin auto-loading
  PYTEST_DEBUG             Set to enable debug tracing of pytest's internals


to see available markers type: pytest --markers
to see available fixtures type: pytest --fixtures
(shown according to specified file_or_dir or current dir if not specified; fixtures with leading '_' are only shown with the '-v' option
```