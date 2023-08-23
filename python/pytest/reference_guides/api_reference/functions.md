# Functions {#functions}

## pytest.approx {#pytest-approx}

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

    However, comparisons like this are tedious to write and difficult to understand. Furthermore, absolute comparisons like the one above are usually discouraged because there’s no tolerance that works well for all situations. `1e-6` is good for numbers around `1`, but too small for very big numbers and too big for very small ones. It’s better to express the tolerance as a fraction of the expected value, but relative comparisons like that are even more difficult to write correctly and concisely.

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

    - `math.isclose(a, b, rel_tol=1e-9, abs_tol=0.0)`: True if the relative tolerance is met w.r.t. either a or b or if the absolute tolerance is met. Because the relative tolerance is calculated w.r.t. both a and b, this test is symmetric (i.e. neither a nor b is a “reference value”). You have to specify an absolute tolerance if you want to compare to `0.0` because there is no tolerance by default. More information: `math.isclose()`.

    - `numpy.isclose(a, b, rtol=1e-5, atol=1e-8)`: True if the difference between a and b is less that the sum of the relative tolerance w.r.t. b and the absolute tolerance. Because the relative tolerance is only calculated w.r.t. b, this test is asymmetric and you can think of b as the reference value. Support for comparing sequences is provided by `numpy.allclose()`. More information: `numpy.isclose`.

    - `unittest.TestCase.assertAlmostEqual(a, b)`: True if a and b are within an absolute tolerance of `1e-7`. No relative tolerance is considered , so this function is not appropriate for very large or very small numbers. Also, it’s only available in subclasses of `unittest.TestCase` and it’s ugly because it doesn’t follow PEP8. More information: `unittest.TestCase.assertAlmostEqual()`.

    - `a == pytest.approx(b, rel=1e-6, abs=1e-12)`: True if the relative tolerance is met w.r.t. b or if the absolute tolerance is met. Because the relative tolerance is only calculated w.r.t. b, this test is asymmetric and you can think of b as the reference value. In the special case that you explicitly specify an absolute tolerance but not a relative tolerance, only the absolute tolerance is considered.

    ::: tip Note
    `approx` can handle numpy arrays, but we recommend the specialised test helpers in [Test Support (numpy.testing)](https://numpy.org/doc/stable/reference/routines.testing.html) if you need support for comparisons, NaNs, or ULP-based tolerances.

    To match strings using regex, you can use `Matches` from the [re_assert package](https://github.com/asottile/re-assert).
    :::

    ::: warning Warning
    *Changed in version 3.2.*

    In order to avoid inconsistent behavior, `TypeError` is raised for `>`, `>=`, `<` and `<=` comparisons. The example below illustrates the problem:

    ```shell
    assert approx(0.1) > 0.1 + 1e-10  # calls approx(0.1).__gt__(0.1 + 1e-10)
    assert 0.1 + 1e-10 > approx(0.1)  # calls approx(0.1).__lt__(0.1 + 1e-10)
    ```

    In the second example one expects `approx(0.1).__le__(0.1 + 1e-10)` to be called. But instead, `approx(0.1).__lt__(0.1 + 1e-10)` is used to comparison. This is because the call hierarchy of rich comparisons follows a fixed behavior. More information: `object.__ge__()`
    :::

    *Changed in version 3.7.1*: `approx` raises `TypeError` when it encounters a dict value or sequence element of nonnumeric type.

    *Changed in version 6.1.0*: `approx` falls back to strict equality for nonnumeric types instead of raising `TypeError`.

## pytest.fail {#pytest-fail}

*Tutorial*: [How to use skip and xfail to deal with tests that cannot succeed](/python/pytest/how_to_guides/skip_xfail#how-to-use-skip-and-xfail-to-deal-with-tests-that-cannot-succeed)

- **fail**(`reason[, pytrace=True, msg=None]`)    

    Explicitly fail an executing test with the given message.

    *Parameters*:

    - `reason (str)` – The message to show the user as reason for the failure.

    - `pytrace (bool)` – If False, msg represents the full failure information and no python traceback will be reported.

    - `python (Optional[str])` – Same as `reason`, but deprecated. Will be removed in a future version, use `reason` instead.

## pytest.skip {#pytest-skip}

- **skip**(`reason[, allow_module_level=False, msg=None]`)  

    Skip an executing test with the given message.

    This function should be called only during testing (setup, call or teardown) or during collection by using the `allow_module_level` flag. This function can be called in doctests as well.

    *Parameters*:

    - `reason (str)` – The message to show the user as reason for the skip.

    - `allow_module_level (bool)` – Allows this function to be called at module level. Raising the skip exception at module level will stop the execution of the module and prevent the collection of all tests in the module, even those defined before the `skip` call. Defaults to False.

    - `msg (Optional[str])` – Same as `reason`, but deprecated. Will be removed in a future version, use `reason` instead.

    ::: tip Note
    It is better to use the `pytest.mark.skipif`) marker when possible to declare a test to be skipped under certain conditions like mismatching platforms or dependencies. Similarly, use the `# doctest: +SKIP` directive (see `doctest.SKIP`) to skip a doctest statically.
    :::

## pytest.importorskip {#pytest-importorskip}

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

## pytest.xfail {#pytest-xfail}

- **xfail**(`reason=''`)    

    Imperatively xfail an executing test or setup function with the given reason.

    This function should be called only during testing (setup, call or teardown).

    *Parameters*:
        
    - `reason (str)` – The message to show the user as reason for the xfail.

    ::: tip Note
    It is better to use the `pytest.mark.xfail` marker when possible to declare a test to be xfailed under certain conditions like known bugs or missing features.
    :::

## pytest.exit {#pytest-exit}

- **exit**(`reason[, returncode=False, msg=None]`)  

    Exit testing process.

    *Parameters*:

    - `reason (str)` – The message to show as the reason for exiting pytest. reason has a default value only because `msg` is deprecated.

    - `returncode (Optional[int])` – Return code to be used when exiting pytest.

    - `msg (Optional[str])` – Same as `reason`, but deprecated. Will be removed in a future version, use `reason` instead.

## pytest.main {#pytest-main}

- **main**(`args=None, plugins=None`)     

    Perform an in-process test run.

    *Parameters*:

    - `args (Optional[Union[List[str], PathLike[str]]])` – List of command line arguments. If `None` or not given, defaults to reading arguments directly from the process command line (`sys.argv`).

    - `plugins (Optional[Sequence[Union[str, object]]])` – List of plugin objects to be auto-registered during initialization.

    *Returns*: An exit code.

    *Return type*: `Union[int, ExitCode]`

## pytest.param {#pytest-param}

- **param**(`*values[, id][, marks]`)     

    Specify a parameter in `pytest.mark.parametrize` calls or [parametrized fixtures](/python/pytest/how_to_guides/fixture#using-marks-with-parametrized-fixtures).

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

## pytest.raises {#pytest-raises}

*Tutorial*: [Assertions about expected exceptions](https://docs.pytest.org/en/latest/how-to/assert.html#assertraises)

- `with` **raises**(`expected_exception: Union[Type[E], Tuple[Type[E], ...]], *, match: Optional[Union[str, Pattern[str]]] = ...`) → `RaisesContext[E] as excinfo`      

- `with` **raises**(`expected_exception: Union[Type[E], Tuple[Type[E], ...]], func: Callable[[...], Any], *args: Any, **kwargs: Any`) → `ExceptionInfo[E] as excinfo`

    Assert that a code block/function call raises an exception.

    *Parameters*:

    - `expected_exception (Type[E] | Tuple[Type[E], ...])` – The expected exception type, or a tuple if one of multiple possible exception types are expected.

    - `match (str | Pattern[str] | None)` – If specified, a string containing a regular expression, or a regular expression object, that is tested against the string representation of the exception ande its `PEP-678 <https://peps.python.org/pep-0678/> __notes__`  using `re.search()`. 

    To match a literal string that may contain [special characters](https://docs.python.org/3/library/re.html#re-syntax), the pattern can first be escaped with `re.escape()`. (This is only used when `pytest.raises()` is used as a context manager, and passed through to the function otherwise. When using `pytest.raises()` as a function, you can use: `pytest.raises(Exc, func, match="passed on").match("my pattern").)`

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

    The context manager produces an `ExceptionInfo` object which can be used to inspect the details of the captured exception:

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

    When using `pytest.mark.parametrize` it is possible to parametrize tests such that some runs raise an exception and others do not.

    See [Parametrizing conditional raising](/python/pytest/further_topics/example_trick/parametrize#parametrizing-conditional-raising) for an example.

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

## pytest.deprecated_call {#pytest-deprecated-call}

*Tutorial*: [Ensuring code triggers a deprecation warning](/python/pytest/how_to_guides/warning#ensuring-code-triggers-a-deprecation-warning)

- `with` **deprecated_call**(`*, match: Optional[Union[str, Pattern[str]]] = ...`) → `WarningsRecorder`    

- `with` **deprecated_call**(`func: Callable[[...], T], *args: Any, **kwargs: Any`) → `T`

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

    The context manager produces a list of `warnings.WarningMessage` objects, one for each warning raised.

## pytest.register_assert_rewrite {#pytest-register-assert-rewrite}

*Tutorial*: [Assertion Rewriting](/python/pytest/how_to_guides/write_plugin#assertion-rewriting)

- **register_assert_rewrite**(`*names`)     

    Register one or more module names to be rewritten on import.

    This function will make sure that this module or all modules inside the package will get their assert statements rewritten. Thus you should make sure to call this before the module is actually imported, usually in your `__init__.py` if you are a plugin using a package.

    *Parameters*:

    - `names (str)` – The module names to register.

## pytest.warns {#pytest-warns}

*Tutorial*: [Asserting warnings with the warns function](/python/pytest/how_to_guides/warning#asserting-warnings-with-the-warns-function)

- `with` **warns**(`expected_warning: ~typing.Union[~typing.Type[Warning], ~typing.Tuple[~typing.Type[Warning], ...]] = <class Warning>, *, match: ~typing.Optional[~typing.Union[str, ~typing.Pattern[str]]] = None`) → `WarningsChecker`      

- `with` **warns**(`expected_warning: Union[Type[Warning], Tuple[Type[Warning], ...]], func: Callable[[...], T], *args: Any, **kwargs: Any`) → `T`

    Assert that code raises a particular class of warning.

    Specifically, the parameter `expected_warning` can be a warning class or sequence of warning classes, and the code inside the `with` block must issue at least one warning of that class or classes.

    This helper produces a list of `warnings.WarningMessage` objects, one for each warning emitted (regardless of whether it is an `expected_warning` or not). Since pytest 8.0, unmatched warnings are also re-emitted when the context closes.

    This function can be used as a context manager:

    ```shell
    >>> import pytest
    >>> with pytest.warns(RuntimeWarning):
    ···     warnings.warn("my warning", RuntimeWarning)
    ```

    In the context manager form you may use the keyword argument `match` to assert that the warning matches a text or regex:

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

    When using `pytest.mark.parametrize` it is possible to parametrize tests such that some runs raise a warning and others do not.

    This could be achieved in the same way as with exceptions, see [Parametrizing conditional raising](/python/pytest/further_topics/example_trick/parametrize#parametrizing-conditional-raising) for an example.

## pytest.freeze_includes {#pytest-freeze-includes}

*Tutorial*: [Freezing pytest](/python/pytest/further_topics/example_trick/basic_pattern#freezing-pytest)

- **freeze_includes**()   

   Return a list of module names used by pytest that should be included by `cx_freeze`.