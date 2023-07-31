# Warnings

Custom warnings generated in some situations such as improper usage or deprecated features.

## class PytestWarning

- *Bases*: `UserWarning`

Base class for all warnings emitted by pytest.

## class PytestAssertRewriteWarning

- *Bases*: `PytestWarning`

Warning emitted by the pytest assert rewrite module.

## class PytestCacheWarning

- *Bases*: `PytestWarning`

Warning emitted by the cache plugin in various situations.

## class PytestCollectionWarning

- *Bases*: `PytestWarning`

Warning emitted when pytest is not able to collect a file or symbol in a module.

## class PytestConfigWarning

- *Bases*: `PytestWarning`

Warning emitted for configuration issues.

## class PytestDeprecationWarning

- *Bases*: `PytestWarning`, `DeprecationWarning`

Warning class for features that will be removed in a future version.

## class PytestExperimentalApiWarning

- *Bases*: `PytestWarning`, `FutureWarning`

Warning category used to denote experiments in pytest.

Use sparingly as the API might change or even be removed completely in a future version.

## class PytestReturnNotNoneWarning

- *Bases*: `PytestRemovedIn8Warning`

Warning emitted when a test function is returning value other than None.

## class PytestRemovedIn8Warning

- *Bases*: `PytestDeprecationWarning`

Warning class for features that will be removed in pytest 8.

## class PytestRemovedIn9Warning

- *Bases*: `PytestDeprecationWarning`
 
Warning class for features that will be removed in pytest 9.

## class PytestUnhandledCoroutineWarning

- *Bases*: `PytestReturnNotNoneWarning`

Warning emitted for an unhandled coroutine.

A coroutine was encountered when collecting test functions, but was not handled by any async-aware ## plugin. Coroutine test functions are not natively supported.

## class PytestUnknownMarkWarning

- *Bases*: `PytestWarning`

Warning emitted on use of unknown markers.
 
See How to mark test functions with attributes for details.

## class PytestUnraisableExceptionWarning

- *Bases*: `PytestWarning`

An unraisable exception was reported.

Unraisable exceptions are exceptions raised in `__del__` implementations and similar situations when the exception cannot be raised as normal.

## class PytestUnhandledThreadExceptionWarning

- *Bases*: `PytestWarning`

An unhandled exception occurred in a Thread.

Such exceptions don’t propagate normally.

Consult the [Internal pytest warnings](https://docs.pytest.org/en/latest/how-to/capture-warnings.html#internal-warnings) section in the documentation for more information.