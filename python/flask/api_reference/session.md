# Sessions {#sessions}

If you have set `Flask.secret_key` (or configured it from `SECRET_KEY`) you can use sessions in Flask applications. A session makes it possible to remember information from one request to another. The way Flask does this is by using a signed cookie. The user can look at the session contents, but can’t modify it unless they know the secret key, so make sure to set that to something complex and unguessable.

To access the current session you can use the `session` object:

## `class` flask.session

The session object works pretty much like an ordinary dict, with the difference that it keeps track of modifications.

This is a proxy. See [Notes On Proxies](/python/flask/user_guide/request_context#notes-on-proxies) for more information.

The following attributes are interesting:

- ### new

    `True` if the session is new, `False` otherwise.

- ### modified

    `True` if the session object detected a modification. Be advised that modifications on mutable structures are not picked up automatically, in that situation you have to explicitly set the attribute to `True` yourself. Here an example:

    ```python
    # this change is not picked up because a mutable object (here
    # a list) is changed.
    session['objects'].append(42)
    # so mark it as modified yourself
    session.modified = True
    ```

- ### permanent

    If set to `True` the session lives for `permanent_session_lifetime` seconds. The default is `31` days. If set to `False` (which is the default) the session will be deleted when the user closes the browser.
