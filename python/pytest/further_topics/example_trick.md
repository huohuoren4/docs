# Examples and customization tricks

Here is a (growing) list of examples. Contact us if you need more examples or have questions. Also take a look at the [comprehensive documentation](https://docs.pytest.org/en/latest/contents.html#toc) which contains many example snippets as well. Also, [pytest on stackoverflow.com](http://stackoverflow.com/search?q=pytest) often comes with example answers.

For basic examples, see

- [Get Started](https://docs.pytest.org/en/latest/getting-started.html#get-started) for basic introductory examples

- [How to write and report assertions in tests](https://docs.pytest.org/en/latest/how-to/assert.html#assert) for basic assertion examples

- [Fixtures](https://docs.pytest.org/en/latest/reference/fixtures.html#fixtures) for basic fixture/setup examples

- [How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#parametrize) for basic test function parametrization

- [How to use unittest-based tests with pytest](https://docs.pytest.org/en/latest/how-to/unittest.html#unittest) for basic unittest integration

- [How to run tests written for nose](https://docs.pytest.org/en/latest/how-to/nose.html#noseintegration) for basic nosetests integration

The following examples aim at various use cases you might encounter.

- [Demo of Python failure reports with pytest](https://docs.pytest.org/en/latest/example/reportingdemo.html)

- [Basic patterns and examples](https://docs.pytest.org/en/latest/example/simple.html)

    - [How to change command line options defaults](https://docs.pytest.org/en/latest/example/simple.html#how-to-change-command-line-options-defaults)

    - [Pass different values to a test function, depending on command line options](https://docs.pytest.org/en/latest/example/simple.html#pass-different-values-to-a-test-function-depending-on-command-line-options)

    - [Dynamically adding command line options](https://docs.pytest.org/en/latest/example/simple.html#dynamically-adding-command-line-options)

    - Control skipping of tests according to command line option

    - Writing well integrated assertion helpers

    - Detect if running from within a pytest run

    - Adding info to test report header

    - Profiling test duration

    - Incremental testing - test steps

    - Package/Directory-level fixtures (setups)

    - Post-process test reports / failures

    - Making test result information available in fixtures

    - PYTEST_CURRENT_TEST environment variable

    - Freezing pytest

- Parametrizing tests

    - Generating parameters combinations, depending on command line

    - Different options for test IDs

    - A quick port of “testscenarios”

    - Deferring the setup of parametrized resources

    - Indirect parametrization

    - Apply indirect on particular arguments

    - Parametrizing test methods through per-class configuration

    - Parametrization with multiple fixtures

    - Parametrization of optional implementations/imports

    - Set marks or test ID for individual parametrized test

    - Parametrizing conditional raising
    
- Working with custom markers

    - Marking test functions and selecting them for a run

    - Selecting tests based on their node ID

    - Using -k expr to select tests based on their name

    - Registering markers

    - Marking whole classes or modules

    - Marking individual tests when using parametrize

    - Custom marker and command line option to control test runs

    - Passing a callable to custom markers

    - Reading markers which were set from multiple places

    - Marking platform specific tests with pytest

    - Automatically adding markers based on test names

- A session-fixture which can look at all collected tests

- Changing standard (Python) test discovery

    - Ignore paths during test collection

    - Deselect tests during test collection

    - Keeping duplicate paths specified from command line

    - Changing directory recursion

    - Changing naming conventions

    - Interpreting cmdline arguments as Python packages

    - Finding out what is collected

    - Customizing test collection

- Working with non-python tests

    - A basic example for specifying tests in Yaml files