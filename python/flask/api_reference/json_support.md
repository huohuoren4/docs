# JSON Support {#json-support}

Flask uses Python’s built-in `json` module for handling JSON by default. The JSON implementation can be changed by assigning a different provider to `flask.Flask.json_provider_class` or `flask.Flask.json`. The functions provided by `flask.json` will use methods on `app.json` if an app context is active.

Jinja’s `|tojson` filter is configured to use the app’s JSON provider. The filter marks the output with `|safe`. Use it to render data inside HTML `<script>` tags.

```html
<script>
    const names = {{ names|tojson }};
    renderChart(names, {{ axis_data|tojson }});
</script>
```

## flask.json.jsonify(`*args, **kwargs`)

Serialize the given arguments as JSON, and return a `Response` object with the `application/json` mimetype. A dict or list returned from a view will be converted to a JSON response automatically without needing to call this.

This requires an active request or application context, and calls `app.json.response()`.

In debug mode, the output is formatted with indentation to make it easier to read. This may also be controlled by the provider.

Either positional or keyword arguments can be given, not both. If no arguments are given, `None` is serialized.

*Parameters*:

- `args (t.Any)` – A single value to serialize, or multiple values to treat as a list to serialize.

- `kwargs (t.Any) `– Treat as a dict to serialize.

*Return type*: `Response`

::: details Changelog
*Changed in version 2.2*: Calls `current_app.json.response`, allowing an app to override the behavior.

*Changed in version 2.0.2*: `decimal.Decimal` is supported by converting to a string.

*Changed in version 0.11*: Added support for serializing top-level arrays. This was a security risk in ancient browsers. See [JSON Security](/python/flask/user_guide/security#json-security).

*New in version 0.2.*
:::

## flask.json.dumps(`obj, **kwargs`)

Serialize data as `JSON`.

If `current_app` is available, it will use its `app.json.dumps()` method, otherwise it will use `json.dumps()`.

*Parameters*:

- `obj (Any)` – The data to serialize.

- kwargs (Any) – Arguments passed to the dumps implementation.

*Return type*: `str`

*Changed in version 2.3*: The `app` parameter was removed.

::: details Changelog
*Changed in version 2.2*: Calls `current_app.json.dumps`, allowing an `app` to override the behavior.

*Changed in version 2.0.2*: `decimal.Decimal` is supported by converting to a string.

*Changed in version 2.0*: encoding will be removed in `Flask 2.1`.

*Changed in version 1.0.3*: `app` can be passed directly, rather than requiring an `app` context for configuration.
:::

## flask.json.dump(`obj, fp, **kwargs`)

Serialize data as `JSON` and write to a file.

If `current_app` is available, it will use its `app.json.dump()` method, otherwise it will `use json.dump()`.

*Parameters*:

- `obj (Any)` – The data to serialize.

- `fp (IO[str])` – A file opened for writing text. Should use the `UTF-8` encoding to be valid `JSON`.

- `kwargs (Any)` – Arguments passed to the dump implementation.

*Return type*: `None`

*Changed in version 2.3*: The app parameter was removed.

::: details Changelog
*Changed in version 2.2*: Calls `current_app.json.dump`, allowing an `app` to override the behavior.

*Changed in version 2.0*: Writing to a binary file, and the encoding argument, will be removed in `Flask 2.1`.
:::

## flask.json.loads(`s, **kwargs`)

Deserialize data as `JSON`.

If `current_app` is available, it will use its `app.json.loads()` method, otherwise it will use `json.loads()`.

*Parameters*:

- `s (str | bytes)` – Text or `UTF-8` bytes.

- `kwargs (Any)` – Arguments passed to the loads implementation.

*Return type*: `Any`

*Changed in version 2.3*: The `app` parameter was removed.

::: details Changelog
*Changed in version 2.2*: Calls `current_app.json.loads`, allowing an `app` to override the behavior.

*Changed in version 2.0*: encoding will be removed in `Flask 2.1`. The data must be a string or `UTF-8` bytes.

*Changed in version 1.0.3*: `app` can be passed directly, rather than requiring an `app` context for configuration.
:::

## flask.json.load(`fp, **kwargs`)

Deserialize data as JSON read from a file.

If `current_app` is available, it will use its `app.json.load()` method, otherwise it will use `json.load()`.

*Parameters*:

- `fp (IO)` – A file opened for reading text or `UTF-8` bytes.

- `kwargs (Any)` – Arguments passed to the load implementation.

*Return type*: `Any`

Changed in version 2.3: The app parameter was removed.

::: details Changelog
*Changed in version 2.2*: Calls `current_app.json.load`, allowing an app to override the behavior.

*Changed in version 2.2*: The `app` parameter will be removed in `Flask 2.3`.

*Changed in version 2.0*: encoding will be removed in `Flask 2.1`. The file must be text mode, or binary mode with `UTF-8` bytes.
:::

## `class` flask.json.provider.JSONProvider(`app`)

A standard set of JSON operations for an application. Subclasses of this can be used to customize JSON behavior or use different JSON libraries.

To implement a provider for a specific library, subclass this base class and implement at least `dumps()` and `loads()`. All other methods have default implementations.

To use a different provider, either subclass `Flask` and set `json_provider_class` to a provider class, or set `app.json` to an instance of the class.

- *Parameters*:

    - `app (Flask)` – An application instance. This will be stored as a `weakref.proxy` on the `_app` attribute.

::: details Changelog
*New in version 2.2.*
:::

- ### dumps(`obj, **kwargs`)

    Serialize data as `JSON`.

    *Parameters*:

    - `obj (Any)` – The data to serialize.

    - `kwargs (Any)` – May be passed to the underlying JSON library.

    *Return type*: `str`

- ### dump(obj, fp, **kwargs)

    Serialize data as JSON and write to a file.

    *Parameters*:

    - `obj (Any)` – The data to serialize.

    - `fp (IO[str])` – A file opened for writing text. Should use the `UTF-8` encoding to be valid JSON.

    - `kwargs (Any)` – May be passed to the underlying JSON library.

    *Return type*: `None`

- ### loads(`s, **kwargs`)

    Deserialize data as JSON.

    *Parameters*:

    - `s (str | bytes)` – Text or `UTF-8` bytes.

    - `kwargs (Any)` – May be passed to the underlying JSON library.

    *Return type*: `Any`

- ### load(`fp, **kwargs`)

    Deserialize data as `JSON` read from a file.

    *Parameters*:

    `fp (IO)` – A file opened for reading text or UTF-8 bytes.

    `kwargs (Any)` – May be passed to the underlying JSON library.

    *Return type*: `Any`

- ### response(`*args, **kwargs`)

    Serialize the given arguments as JSON, and return a `Response` object with the `application/json` mimetype.

    The `jsonify()` function calls this method for the current application.

    Either positional or keyword arguments can be given, not both. If no arguments are given, `None` is serialized.

    *Parameters*:

    `args (t.Any)` – A single value to serialize, or multiple values to treat as a list to serialize.

    `kwargs (t.Any) `– Treat as a dict to serialize.

    *Return type*: `Response`

## `class` flask.json.provider.DefaultJSONProvider(`app`)

Provide `JSON` operations using Python’s built-in `json` library. Serializes the following additional data types:

1. `datetime.datetime` and `datetime.date` are serialized to `RFC 822` strings. This is the same as the `HTTP` date format.

2. `uuid.UUID` is serialized to a string.

3. `dataclasses.dataclass` is passed to `dataclasses.asdict()`.

4. `Markup` (or any object with a `__html__` method) will call the `__html__` method to get a string.

- *Parameters*:

    - `app (Flask)` –

- ### `static` default(`o`)

    Apply this function to any object that `json.dumps()` does not know how to serialize. It should return a valid `JSON` type or raise a `TypeError`.

    *Parameters*:

    - `o (Any)` –

    *Return type*: `Any`

- ### ensure_ascii = `True`

    Replace non-ASCII characters with escape sequences. This may be more compatible with some clients, but can be disabled for better performance and size.

- ### sort_keys = `True`

    Sort the keys in any serialized dicts. This may be useful for some caching situations, but can be disabled for better performance. When enabled, keys must all be strings, they are not converted before sorting.

- ### compact: `bool | None = None`

    If `True`, or `None` out of debug mode, the `response()` output will not add indentation, newlines, or spaces. If `False`, or `None` in debug mode, it will use a non-compact representation.

- ### mimetype = `'application/json'`

    The mimetype set in `response()`.

- ### dumps(`obj, **kwargs`)

    Serialize data as `JSON` to a string.

    Keyword arguments are passed to `json.dumps()`. Sets some parameter defaults from the default, `ensure_ascii`, and `sort_keys` attributes.

    *Parameters*:

    - `obj (Any)` – The data to serialize.

    - `kwargs (Any)` – Passed to json.dumps().

    *Return type*: `str`

- ### loads(`s, **kwargs`)

    Deserialize data as `JSON` from a string or bytes.

    *Parameters*:

    - `s (str | bytes)` – Text or `UTF-8` bytes.

    - `kwargs (Any)` – Passed to `json.loads()`.

    *Return type*: `Any`

- ### response(`*args, **kwargs`)

    Serialize the given arguments as `JSON`, and return a `Response` object with it. The response mimetype will be `“application/json”` and can be changed with `mimetype`.

    If compact is `False` or debug mode is enabled, the output will be formatted to be easier to read.

    Either positional or keyword arguments can be given, not both. If no arguments are given, `None` is serialized.

    *Parameters*:

    - `args (t.Any)` – A single value to serialize, or multiple values to treat as a list to serialize.

    - `kwargs (t.Any)` – Treat as a dict to serialize.

    *Return type*: `Response`

## Tagged JSON

A compact representation for lossless serialization of non-standard JSON types. `SecureCookieSessionInterface` uses this to serialize the session data, but it may be useful in other places. It can be extended to support other types.

### `class` flask.json.tag.TaggedJSONSerializer

Serializer that uses a tag system to compactly represent objects that are not `JSON` types. Passed as the intermediate serializer to `itsdangerous.Serializer`.

The following extra types are supported:

1. `dict`

2. `tuple`

3. `bytes`

4. `Markup`

5. `UUID`

6. `datetime`

- #### default_tags = `[<class 'flask.json.tag.TagDict'>, <class 'flask.json.tag.PassDict'>, <class 'flask.json.tag.TagTuple'>, <class 'flask.json.tag.PassList'>, <class 'flask.json.tag.TagBytes'>, <class 'flask.json.tag.TagMarkup'>, <class 'flask.json.tag.TagUUID'>, <class 'flask.json.tag.TagDateTime'>]`

    Tag classes to bind when creating the serializer. Other tags can be added later using `register()`.

- #### dumps(`value`)

    Tag the value and dump it to a compact `JSON` string.

    *Parameters*:

    - `value (Any)` –

    *Return type*: `str`

- #### loads(`value`)

    Load data from a `JSON` string and deserialized any tagged objects.

    *Parameters*:

    - `value (str)` –

    *Return type*: `Any`

- #### register(`tag_class, force=False, index=None`)

    Register a new tag with this serializer.

    *Parameters*:

    - `tag_class (type[flask.json.tag.JSONTag])` – tag class to register. Will be instantiated with this serializer instance.

    - `force (bool) `– overwrite an existing tag. If false (default), a `KeyError` is raised.

    - `index (int | None)` – index to insert the new tag in the tag order. Useful when the new tag is a special case of an existing tag. If `None` (default), the tag is appended to the end of the order.

    *Raises*:

    `KeyError` – if the tag key is already registered and `force` is not true.

    *Return type*: `None`

- #### tag(`value`)

    Convert a value to a tagged representation if necessary.

    *Parameters*:

    `value (Any)` –

    *Return type*: `dict[str, Any]`

- #### untag(`value`)

    Convert a tagged representation back to the original type.

    *Parameters*:

    - `value (dict[str, Any])` –

    *Return type*: `Any`

- #### `class` flask.json.tag.JSONTag(`serializer`)

    Base class for defining type tags for `TaggedJSONSerializer`.

    *Parameters*:

    - `serializer (TaggedJSONSerializer)` –

- #### check(`value`)

    Check if the given value should be tagged by this tag.

    *Parameters*:

    - `value (Any)` –

    *Return type*: `bool`

- #### key: `str | None = None`

    The tag to mark the serialized object with. If `None`, this tag is only used as an intermediate step during tagging.

- #### tag(`value`)

    Convert the value to a valid `JSON` type and add the tag structure around it.

    *Parameters*:

    - `value (Any)` –

    *Return type*: `Any`

- #### to_json(`value`)

    Convert the Python object to an object that is a valid `JSON` type. The tag will be added later.

    *Parameters*:

    - `value (Any) `–

    *Return type*: `Any`

- #### to_python(`value`)

    Convert the `JSON` representation back to the correct type. The tag will already be removed.

    *Parameters*:

    - `value (Any)` –

    *Return type*: `Any`

Let’s see an example that adds support for `OrderedDict`. Dicts don’t have an order in `JSON`, so to handle this we will dump the items as a list of `[key, value]` pairs. Subclass `JSONTag` and give it the new key `' od'` to identify the type. The session serializer processes dicts first, so insert the new tag at the front of the order since `OrderedDict` must be processed before `dict`.

```python
from flask.json.tag import JSONTag

class TagOrderedDict(JSONTag):
    __slots__ = ('serializer',)
    key = ' od'

    def check(self, value):
        return isinstance(value, OrderedDict)

    def to_json(self, value):
        return [[k, self.serializer.tag(v)] for k, v in iteritems(value)]

    def to_python(self, value):
        return OrderedDict(value)

app.session_interface.serializer.register(TagOrderedDict, index=0)
```


