# pytest: helps you write better programs

::: tip Tip
pytest document version: `7.4.0`. the lastest version is only maintained. 
:::

The `pytest` framework makes it easy to write small, readable tests, and can scale to support complex functional testing for applications and libraries.

`pytest` requires: `Python 3.8+` or `PyPy3`.

*PyPI package name*: [pytest](https://pypi.org/project/pytest/)

## A quick example

```python
# content of test_sample.py
def inc(x):
    return x + 1


def test_answer():
    assert inc(3) == 5
```

To execute it:

```shell
$ pytest
=========================== test session starts ============================
platform linux -- Python 3.x.y, pytest-7.x.y, pluggy-1.x.y
rootdir: /home/sweet/project
collected 1 item

test_sample.py F                                                     [100%]

================================= FAILURES =================================
_______________________________ test_answer ________________________________

    def test_answer():
>       assert inc(3) == 5
E       assert 4 == 5
E        +  where 4 = inc(3)

test_sample.py:6: AssertionError
========================= short test summary info ==========================
FAILED test_sample.py::test_answer - assert 4 == 5
============================ 1 failed in 0.12s =============================
```

Due to `pytest`’s detailed assertion introspection, only plain `assert` statements are used. See [Get started](/python/pytest/get_started) for a basic introduction to using pytest.

## Features

- Detailed info on failing [assert statements](/python/pytest/how_to_guides/assert#how-to-write-and-report-assertions-in-tests) (no need to remember `self.assert*` names)

- [Auto-discovery](/python/pytest/explanation/integration_practice#conventions-for-python-test-discovery) of test modules and functions

- [Modular fixtures](/python/pytest/reference_guides/fixture_reference#fixtures-reference) for managing small or parametrized long-lived test resources

- Can run [unittest](/python/pytest/how_to_guides/unittest#how-to-use-unittest-based-tests-with-pytest) (including trial) and [nose](/python/pytest/how_to_guides/nose_test#how-to-run-tests-written-for-nose) test suites out of the box

- Python 3.8+ or PyPy 3

- Rich plugin architecture, with over 800+ [external plugins](/python/pytest/reference_guides/plugin_list#plugin-list) and thriving community

## Documentation

- [Get started](/python/pytest/get_started) - install pytest and grasp its basics just twenty minutes

- [How-to guides](/python/pytest/how_to_guides/invoke_pytest#how-to-invoke-pytest) - step-by-step guides, covering a vast range of use-cases and needs

- [Reference guides](/python/pytest/reference_guides/fixture_reference#fixtures-reference) - includes the complete pytest API reference, lists of - plugins and more

- [Explanation](/python/pytest/explanation/anatomy#anatomy-of-a-test) - background, discussion of key topics, answers to higher-level questions

## Bugs/Requests

Please use the [GitHub issue tracker](https://github.com/pytest-dev/pytest/issues) to submit bugs or request features.

## Support pytest

[Open Collective](https://opencollective.com/) is an online funding platform for open and transparent communities. It provides tools to raise money and share your finances in full transparency.

It is the platform of choice for individuals and companies that want to make one-time or monthly donations directly to the project.

See more details in the [pytest collective](https://opencollective.com/pytest).

## pytest for enterprise

Available as part of the Tidelift Subscription.

The maintainers of pytest and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use.

[Learn more](https://tidelift.com/subscription/pkg/pypi-pytest?utm_source=pypi-pytest&utm_medium=referral&utm_campaign=enterprise&utm_term=repo).

## Security

pytest has never been associated with a security vulnerability, but in any case, to report a security vulnerability please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.