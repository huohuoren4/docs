# Session Interface {#session-interface}

::: details Changelog
*New in version 0.8.*
:::

The session interface provides a simple way to replace the session implementation that Flask is using.

## `class` flask.sessions.SessionInterface

The basic interface you have to implement in order to replace the default session interface which uses werkzeug’s securecookie implementation. The only methods you have to implement are `open_session()` and `save_session()`, the others have useful defaults which you don’t need to change.

The session object returned by the `open_session()` method has to provide a dictionary like interface plus the properties and methods from the `SessionMixin`. We recommend just subclassing a dict and adding that mixin:

```python
class Session(dict, SessionMixin):
    pass
```

If `open_session()` returns `None` Flask will call into `make_null_session()` to create a session that acts as replacement if the session support cannot work because some requirement is not fulfilled. The default `NullSession` class that is created will complain that the secret key was not set.

To replace the session interface on an application all you have to do is to assign `flask.Flask.session_interface`:

```python
app = Flask(__name__)
app.session_interface = MySessionInterface()
```

Multiple requests with the same session may be sent and handled concurrently. When implementing a new session interface, consider whether reads or writes to the backing store must be synchronized. There is no guarantee on the order in which the session for each request is opened or saved, it will occur in the order that requests begin and end processing.

::: details Changelog
*New in version 0.8.*
:::

- ### get_cookie_domain(`app`)

    The value of the `Domain` parameter on the session cookie. If not set, browsers will only send the cookie to the exact domain it was set from. Otherwise, they will send it to any subdomain of the given value as well.

    Uses the `SESSION_COOKIE_DOMAIN` config.

    *Changed in version 2.3*: Not set by default, does not fall back to `SERVER_NAME`.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `str | None`

- ### get_cookie_httponly(`app`)

    Returns `True` if the session cookie should be httponly. This currently just returns the value of the `SESSION_COOKIE_HTTPONLY` config var.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `bool`

- ### get_cookie_name(`app`)

    The name of the session cookie. Uses `app.config[“SESSION_COOKIE_NAME”]`.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `str`

- ### get_cookie_path(`app`)

    Returns the path for which the cookie should be valid. The default implementation uses the value from the `SESSION_COOKIE_PATH` config var if it’s set, and falls back to `APPLICATION_ROOT` or uses `/` if it’s `None`.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `str`

- ### get_cookie_samesite(`app`)

    Return `'Strict'` or `'Lax'` if the cookie should use the `SameSite` attribute. This currently just returns the value of the `SESSION_COOKIE_SAMESITE` setting.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `str`

- ### get_cookie_secure(`app`)

    Returns `True` if the cookie should be secure. This currently just returns the value of the `SESSION_COOKIE_SECURE` setting.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `bool`

- ### get_expiration_time(`app, session`)

    A helper method that returns an expiration date for the session or `None` if the session is linked to the browser session. The default implementation returns now + the permanent session lifetime configured on the application.

    *Parameters*:

    - `app (Flask)` –

    - `session (SessionMixin)` –

    *Return type*: `datetime | None`

- ### is_null_session(`obj`)

    Checks if a given object is a null session. Null sessions are not asked to be saved.

    This checks if the object is an instance of `null_session_class` by default.

    *Parameters*:

    - `obj (object)` –

    *Return type*: `bool`

- ### make_null_session(`app`)

    Creates a null session which acts as a replacement object if the real session support could not be loaded due to a configuration error. This mainly aids the user experience because the job of the null session is to still support lookup without complaining but modifications are answered with a helpful error message of what failed.

    This creates an instance of `null_session_class` by default.

    *Parameters*:

    - `app (Flask)` –

    *Return type*: `NullSession`

- ### null_session_class

    `make_null_session()` will look here for the class that should be created when a null session is requested. Likewise the `is_null_session()` method will perform a typecheck against this type.

    alias of `NullSession`

- ### open_session(`app, request`)

    This is called at the beginning of each request, after pushing the request context, before matching the URL.

    This must return an object which implements a dictionary-like interface as well as the `SessionMixin` interface.

    This will return None to indicate that loading failed in some way that is not immediately an error. The request context will fall back to `using make_null_session()` in this case.

    *Parameters*:

    - `app (Flask)` –

    - `request (Request)` –

    *Return type*: `SessionMixin | None`

- ### pickle_based = `False`

    A flag that indicates if the session interface is pickle based. This can be used by `Flask` extensions to make a decision in regards to how to deal with the session object.

    ::: details Changelog
    *New in version 0.10.*
    :::

- ### save_session(`app, session, response`)

    This is called at the end of each request, after generating a response, before removing the request context. It is skipped if `is_null_session()` returns `True`.

    *Parameters*:

    - `app (Flask)` –

    - `session (SessionMixin)` –

    - `response (Response)` –

    *Return type*: `None`

- ### should_set_cookie(`app, session`)

    Used by session backends to determine if a `Set-Cookie` header should be set for this session cookie for this response. If the session has been modified, the cookie is set. If the session is permanent and the `SESSION_REFRESH_EACH_REQUEST` config is true, the cookie is always set.

    This check is usually skipped if the session was deleted.

    ::: details Changelog
    *New in version 0.11.*
    :::

    *Parameters*:

    - `app (Flask)` –

    - `session (SessionMixin)` –

    *Return type*: `bool`

## `class` flask.sessions.SecureCookieSessionInterface

The default session interface that stores sessions in signed cookies through the itsdangerous module.

- ### `static` digest_method(`string=b'', *, usedforsecurity=True`)

    the hash function to use for the signature. The default is sha1

- ### key_derivation = `'hmac'`

    the name of the itsdangerous supported key derivation. The default is `hmac`.

- ### open_session(`app, request`)

    This is called at the beginning of each request, after pushing the request context, before matching the URL.

    This must return an object which implements a dictionary-like interface as well as the `SessionMixin` interface.

    This will return `None` to indicate that loading failed in some way that is not immediately an error. The request context will fall back to using `make_null_session()` in this case.

    *Parameters*:

    - `app (Flask)` –

    - `request (Request)` –

    *Return type*: `SecureCookieSession | None`

- ### salt = `'cookie-session'`

the salt that should be applied on top of the secret key for the signing of cookie based sessions.

- ### save_session(`app, session, response`)

    This is called at the end of each request, after generating a response, before removing the request context. It is skipped if `is_null_session()` returns `True`.

    *Parameters*:

    - `app (Flask)` –

    - `session (SessionMixin)` –

    - `response (Response)` –

    *Return type*: `None`

- ### serializer = `<flask.json.tag.TaggedJSONSerializer object>`

    A python serializer for the payload. The default is a compact `JSON` derived serializer with support for some extra Python types such as datetime objects or tuples.

- ### session_class

    alias of `SecureCookieSession`

## `class` flask.sessions.SecureCookieSession(`initial=None`)

Base class for sessions based on signed cookies.

This session backend will set the `modified` and `accessed` attributes. It cannot reliably track whether a session is new (vs. empty), so new remains hard coded to `False`.

- *Parameters*:

    - `initial (t.Any)` –

- ### accessed = `False`

    header, which allows caching proxies to cache different pages for different users.

- ### get(`key, default=None`)

    Return the value for key if key is in the dictionary, else default.

    *Parameters*:

    - `key (str)` –

    - `default (Any | None)` –

    *Return type*: `Any`

- ### modified = `False`

    When data is changed, this is set to `True`. Only the session dictionary itself is tracked; if the session contains mutable data (for example a nested dict) then this must be set to `True` manually when modifying that data. The session cookie will only be written to the response if this is `True`.

- ### setdefault(`key, default=None`)

    Insert key with a value of default if key is not in the dictionary.

    Return the value for key if key is in the dictionary, else default.

    *Parameters*:

    - `key (str`) –

    - `default (Any | None)` –

    *Return type*: `Any`

## `class` flask.sessions.NullSession(`initial=None)`

Class used to generate nicer error messages if sessions are not available. Will still allow read-only access to the empty session but fail on setting.

- *Parameters*:

    - `initial (t.Any)` –

- ### `clear()` → `None` 

    Remove all items from D.

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `NoReturn`

- ### pop(`k[, d]`) → `v`

    remove specified key and return the corresponding value.

    If the key is not found, return the default if given; otherwise, raise a `KeyError`.

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `NoReturn`

- ### popitem(`*args, **kwargs`)

    Remove and return a `(key, value)` pair as a 2-tuple.

    Pairs are returned in `LIFO` (last-in, first-out) order. Raises `KeyError` if the dict is empty.

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `NoReturn`

- ### setdefault(`*args, **kwargs`)

    Insert key with a value of default if key is not in the dictionary.

    Return the value for key if key is in the dictionary, else default.

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `NoReturn`

- ### update(`[E, ]**F`) → `None`

    Update `D` from dict/iterable `E` and `F`.

    If `E` is present and has a `.keys()` method, then does: `for k in E: D[k] = E[k] If E` is present and lacks a `.keys()` method, then does: `for k, v in E: D[k] = v` In either case, this is followed by: `for k in F: D[k] = F[k]`

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `NoReturn`

## class flask.sessions.SessionMixin

Expands a basic dictionary with session attributes.

- ### accessed = `True`

    Some implementations can detect when session data is read or written and set this when that happens. The mixin default is hard coded to `True`.

    - ### modified = `True`

    Some implementations can detect changes to the session and set this when that happens. The mixin default is hard coded to ·.

    - ### `property` permanent: `bool`

    This reflects the `'_permanent'` key in the dict.

::: details Notice
The `PERMANENT_SESSION_LIFETIME` config can be an integer or `timedelta`. The `permanent_session_lifetime` attribute is always a 
`timedelta`.
:::