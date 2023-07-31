# Constants

## pytest.__version__

The current pytest version, as a string:

```shell
>>> import pytest
>>> pytest.__version__
'7.0.0'
```

## pytest.version_tuple

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