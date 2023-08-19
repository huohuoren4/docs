# Application Globals

To share data that is valid for one request only from one function to another, a global variable is not good enough because it would break in threaded environments. Flask provides you with a special object that ensures it is only valid for the active request and that will return different values for each request. In a nutshell: it does the right thing, like it does for `request` and `session`.

## flask.g

A namespace object that can store data during an [application context](https://flask.palletsprojects.com/en/2.3.x/appcontext/). This is an instance of `Flask.app_ctx_globals_class`, which defaults to `ctx._AppCtxGlobals`.

This is a good place to store resources during a request. For example, a `before_request` function could load a user object from a session id, then set `g.user` to be used in the view function.

This is a proxy. See [Notes On Proxies](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#notes-on-proxies) for more information.

::: details Changelog
*Changed in version 0.10*: Bound to the application context instead of the request context.
:::

## `class` flask.ctx._AppCtxGlobals

A plain object. Used as a namespace for storing data during an application context.

Creating an app context automatically creates this object, which is made available as the `g` proxy.

- ### `'key' in g`

    Check whether an attribute is present.

    ::: details Changelog
    *New in version 0.10.*
    :::

- ### iter(g)

    Return an iterator over the attribute names.

    ::: details Changelog
    *New in version 0.10.*
    :::

- ### get(`name, default=None`)

    Get an attribute by name, or a default value. Like `dict.get()`.

    *Parameters*:

    - `name (str)` – Name of attribute to get.

    - `default (Any | None)` – Value to return if the attribute is not present.

    *Return type*:
    `Any`

    ::: details Changelog
    *New in version 0.10.*
    :::

- ### pop(`name, default=<object object>`)

    Get and remove an attribute by name. Like `dict.pop()`.

    *Parameters*:

    - `name (str)` – Name of attribute to pop.

    - `default (Any)` – Value to return if the attribute is not present, instead of raising a `KeyError`.

    *Return type*: `Any`

    ::: details Changelog
    *New in version 0.11.*
    :::

- ### setdefault(`name, default=None`)

    Get the value of an attribute if it is present, otherwise set and return a default value. Like `dict.setdefault()`.

    *Parameters*:

    `name (str)` – Name of attribute to get.

    `default (Any | None)` – Value to set and return if the attribute is not present.

    *Return type*: `Any`

    ::: details Changelog
    *New in version 0.11.*
    :::