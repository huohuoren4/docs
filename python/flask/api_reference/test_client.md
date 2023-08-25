# Test Client {#test-client}

## `class` flask.testing.FlaskClient(`*args, **kwargs`)

Works like a regular Werkzeug test client but has knowledge about Flask’s contexts to defer the cleanup of the request context until the end of a `with` block. For general information about how to use this class refer to `werkzeug.test.Client`.

::: details Changelog
*Changed in version 0.12*: `app.test_client()` includes preset default environment, which can be set after instantiation of the app.`test_client()` object in `client.environ_base`.
:::

Basic usage is outlined in the [Testing Flask Applications](https://flask.palletsprojects.com/en/2.3.x/testing/) chapter.

- *Parameters*:

    - `args (t.Any)` –

    - `kwargs (t.Any)` –

- ### open(`*args, buffered=False, follow_redirects=False, **kwargs`)

    Generate an environ dict from the given arguments, make a request to the application using it, and return the response.

    *Parameters*:

    - `args (t.Any)` – Passed to `EnvironBuilder` to create the environ for the request. If a single arg is passed, it can be an existing `EnvironBuilder` or an environ dict.

    - `buffered (bool)` – Convert the iterator returned by the app into a list. If the iterator has a `close()` method, it is called automatically.

    - `follow_redirects (bool)` – Make additional requests to follow `HTTP` redirects until a non-redirect status is returned. `TestResponse.history` lists the intermediate responses.

    - `kwargs (t.Any)` –

    *Return type*: `TestResponse`

    ::: details Changelog
    *Changed in version 2.1*: Removed the `as_tuple` parameter.

    *Changed in version 2.0*: The request input stream is closed when calling `response.close()`. Input streams for redirects are automatically closed.

    *Changed in version 0.5*: If a dict is provided as file in the dict for the data parameter the content type has to be called `content_type` instead of `mimetype`. This change was made for consistency with `werkzeug.FileWrapper`.

    *Changed in version 0.5*: Added the `follow_redirects` parameter.
    :::

- ### session_transaction(`*args, **kwargs`)

    When used in combination with a `with` statement this opens a session transaction. This can be used to modify the session that the test client uses. Once the `with` block is left the session is stored back.

    ```python
    with client.session_transaction() as session:
        session['value'] = 42
    ```

    Internally this is implemented by going through a temporary test request context and since session handling could depend on request variables this function accepts the same arguments as `test_request_context()` which are directly passed through.

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `Generator[SessionMixin, None, None]`