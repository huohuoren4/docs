# How to use pytest with an existing test suite

Pytest can be used with most existing test suites, but its behavior differs from other test runners such as [nose](/python/pytest/how_to_guides/nose_test#how-to-run-tests-written-for-nose) or Python’s default unittest framework.

Before using this section you will want to [install pytest](/python/pytest/get_started#install-pytest).

## Running an existing test suite with pytest

Say you want to contribute to an existing repository somewhere. After pulling the code into your development space using some flavor of version control and (optionally) setting up a virtualenv you will want to run:

```shell
cd <repository>
pip install -e .  # Environment dependent alternatives include
                  # 'python setup.py develop' and 'conda develop'
```

in your project root. This will set up a symlink to your code in site-packages, allowing you to edit your code while your tests run against it as if it were installed.

Setting up your project in development mode lets you avoid having to reinstall every time you want to run your tests, and is less brittle than mucking about with sys.path to point your tests at local code.

Also consider using [tox](https://docs.pytest.org/en/latest/explanation/goodpractices.html#use-tox).
