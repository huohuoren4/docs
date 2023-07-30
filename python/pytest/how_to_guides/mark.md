# How to mark test functions with attributes

By using the `pytest.mark` helper you can easily set metadata on your test functions. You can find the full list of builtin markers in the API Reference. Or you can list all the markers, including builtin and custom, using the CLI - `pytest --markers`.

Here are some of the builtin markers:

- [usefixtures](/python/pytest/how_to_guides/fixture#use-fixtures-in-classes-and-modules-with-usefixtures) - use fixtures on a test function or class
- [filterwarnings](/python/pytest/reference_guides/api_reference#pytest-mark-filterwarnings) - filter certain warnings of a test function
- [skip](/python/pytest/how_to_guides/skip_xfail#skipping-test-functions) - always skip a test function
- [skipif](/python/pytest/how_to_guides/skip_xfail#skipping-test-functions) - skip a test function if a certain condition is met
- [xfail](/python/pytest/how_to_guides/skip_xfail#xfail-mark-test-functions-as-expected-to-fail) - produce an “expected failure” outcome if a certain condition is met
- [parametrize](/python/pytest/how_to_guides/params_fixture#pytest-mark-parametrize-parametrizing-test-functions) - perform multiple calls to the same test function.

It’s easy to create custom markers or to apply markers to whole test classes or modules. Those markers can be used by plugins, and also are commonly used to select tests on the command-line with the -m option.

See Working with custom markers for examples which also serve as documentation.

::: tip Note
Marks can only be applied to tests, having no effect on [fixtures](/python/pytest/reference_guides/fixture_reference#fixtures-reference).
:::

## Registering marks

You can register custom marks in your `pytest.ini` file like this:

```ini
[pytest]
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    serial
```

or in your pyproject.toml file like this:

```ini
[tool.pytest.ini_options]
markers = [
    "slow: marks tests as slow (deselect with '-m \"not slow\"')",
    "serial",
]
```

Note that everything past the `:` after the mark name is an optional description.

Alternatively, you can register new markers programmatically in a [pytest_configure](http://localhost:8080/python/pytest/reference_guides/api_reference#initialization-hooks) hook:

```python
def pytest_configure(config):
    config.addinivalue_line(
        "markers", "env(name): mark test to run only on named environment"
    )
```

Registered marks appear in pytest’s help text and do not emit warnings (see the next section). It is recommended that third-party plugins always register their markers.

## Raising errors on unknown marks

Unregistered marks applied with the `@pytest.mark.name_of_the_mark` decorator will always emit a warning in order to avoid silently doing something surprising due to mistyped names. As described in the previous section, you can disable the warning for custom marks by registering them in your `pytest.ini` file or using a custom `pytest_configure` hook.

When the `--strict-markers` command-line flag is passed, any unknown marks applied with the `@pytest.mark.name_of_the_mark` decorator will trigger an error. You can enforce this validation in your project by adding `--strict-markers` to `addopts`:

```ini
[pytest]
addopts = --strict-markers
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    serial
```