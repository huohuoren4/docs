# Useful Functions and Classes {#useful-functions-and-classes}

## flask.current_app

A proxy to the application handling the current request. This is useful to access the application without needing to import it, or if it can’t be imported, such as when using the application factory pattern or in blueprints and extensions.

This is only available when an [application context](/python/flask/user_guide/app_context#the-application-context) is pushed. This happens automatically during requests and CLI commands. It can be controlled manually with `app_context()`.

This is a proxy. See [Notes On Proxies](/python/flask/user_guide/request_context#notes-on-proxies) for more information.

## flask.has_request_context()

If you have code that wants to test if a request context is there or not this function can be used. For instance, you may want to take advantage of request information if the request object is available, but fail silently if it is unavailable.

```python
class User(db.Model):

    def __init__(self, username, remote_addr=None):
        self.username = username
        if remote_addr is None and has_request_context():
            remote_addr = request.remote_addr
        self.remote_addr = remote_addr
```

Alternatively you can also just test any of the context bound objects (such as `request` or `g`) for truthness:

```python
class User(db.Model):

    def __init__(self, username, remote_addr=None):
        self.username = username
        if remote_addr is None and request:
            remote_addr = request.remote_addr
        self.remote_addr = remote_addr
```

::: details Changelog
*New in version 0.7.*
:::

*Return type*: `bool`

## flask.copy_current_request_context(`f`)

A helper function that decorates a function to retain the current request context. This is useful when working with greenlets. The moment the function is decorated a copy of the request context is created and then pushed when the function is called. The current session is also included in the copied request context.

*Example*:

```python
import gevent
from flask import copy_current_request_context

@app.route('/')
def index():
    @copy_current_request_context
    def do_some_work():
        # do some work here, it can access flask.request or
        # flask.session like you would otherwise in the view function.
        ...
    gevent.spawn(do_some_work)
    return 'Regular response'
```

::: details Changelog
*New in version 0.10.*
:::

*Parameters*:

- `f (Callable)` –

*Return type*: `Callable`

## flask.has_app_context()

Works like `has_request_context()` but for the application context. You can also just do a boolean check on the current_app object instead.

::: details Changelog
*New in version 0.9.*
:::

*Return type*: `bool`

## flask.url_for(`endpoint, *, _anchor=None, _method=None, _scheme=None, _external=None, **values`)

Generate a URL to the given endpoint with the given values.

This requires an active request or application context, and calls `current_app.url_for()`. See that method for full documentation.

*Parameters*:

- `endpoint (str)` – The endpoint name associated with the URL to generate. If this starts with a `.`, the current blueprint name (if any) will be used.

- `_anchor (str | None)` – If given, append this as `#anchor` to the URL.

- `_method (str | None)` – If given, generate the URL associated with this method for the endpoint.

- `_scheme (str | None)` – If given, the URL will have this scheme if it is external.

- `_external (bool | None)` – If given, prefer the URL to be internal (`False`) or require it to be external (`True`). External URLs include the scheme and domain. When not in an active request, URLs are external by default.

- `values (Any)` – Values to use for the variable parts of the URL rule. Unknown keys are appended as query string arguments, like `?a=b&c=d`.

*Return type*: `str`

::: details Changelog
*Changed in version 2.2*: Calls `current_app.url_for`, allowing an app to override the behavior.

*Changed in version 0.10*: The `_scheme` parameter was added.

*Changed in version 0.9*: The `_anchor` and `_method` Parameters were added.

*Changed in version 0.9*: Calls `app.handle_url_build_error` on build errors.
:::

## flask.abort(`code, *args, **kwargs`)

Raise an `HTTPException` for the given status code.

If `current_app` is available, it will call its `aborter` object, otherwise it will use `werkzeug.exceptions.abort()`.

*Parameters*:

- `code (int | BaseResponse)` – The status code for the exception, which must be registered in `app.aborter`.

- `args (t.Any)` – Passed to the exception.

- `kwargs (t.Any)` – Passed to the exception.

*Return type*: `t.NoReturn`

::: details Changelog
*New in version 2.2*: Calls `current_app.aborter` if available instead of always using Werkzeug’s default `abort`.
:::

## flask.redirect(`location, code=302, Response=None`)

Create a redirect response object.

If · is available, it will use its `redirect()` method, otherwise it will use `werkzeug.utils.redirect()`.

*Parameters*:

`location (str)` – The URL to redirect to.

`code (int)` – The status code for the redirect.

`Response (type[BaseResponse] | None)` – The response class to use. Not used when `current_app` is active, which uses `app.response_class`.

*Return type*: `BaseResponse`

::: details Changelog
*New in version 2.2*: Calls `current_app.redirect` if available instead of always using Werkzeug’s default `redirect`.
:::

## flask.make_response(`*args`)

Sometimes it is necessary to set additional headers in a view. Because views do not have to return response objects but can return a value that is converted into a response object by Flask itself, it becomes tricky to add headers to it. This function can be called instead of using a return and you will get a response object which you can use to attach headers.

If view looked like this and you want to add a new header:

```python
def index():
    return render_template('index.html', foo=42)
```

You can now do something like this:

```python
def index():
    response = make_response(render_template('index.html', foo=42))
    response.headers['X-Parachutes'] = 'parachutes are cool'
    return response
```

This function accepts the very same arguments you can return from a view function. This for example creates a response with a `404` error code:

```python
response = make_response(render_template('not_found.html'), 404)
```

The other use case of this function is to force the return value of a view function into a response which is helpful with view decorators:

```python
response = make_response(view_function())
response.headers['X-Parachutes'] = 'parachutes are cool'
```

Internally this function does the following things:

- if no arguments are passed, it creates a new response argument

- if one argument is passed, `flask.Flask.make_response()` is invoked with it.

- if more than one argument is passed, the arguments are passed to the `flask.Flask.make_response()` function as tuple.

::: details Changelog
*New in version 0.6.*
:::

*Parameters*:

- `args (t.Any)` –

*Return type*: `Response`

## flask.after_this_request(`f`)

Executes a function after this request. This is useful to modify response objects. The function is passed the response object and has to return the same or a new one.

*Example*:

```python
@app.route('/')
def index():
    @after_this_request
    def add_header(response):
        response.headers['X-Foo'] = 'Parachute'
        return response
    return 'Hello World!'
```

This is more useful if a function other than the view function wants to modify a response. For instance think of a decorator that wants to add some headers without converting the return value into a response object.

::: details Changelog
*New in version 0.9.*
:::

*Parameters*:

- `f (Callable[[ResponseClass], ResponseClass] | Callable[[ResponseClass], Awaitable[ResponseClass]])` –

*Return type*: `Callable[[ResponseClass], ResponseClass] | Callable[[ResponseClass], Awaitable[ResponseClass]]`

## flask.send_file(`path_or_file, mimetype=None, as_attachment=False, download_name=None, conditional=True, etag=True, last_modified=None, max_age=None`)

Send the contents of a file to the client.

The first argument can be a file path or a file-like object. Paths are preferred in most cases because Werkzeug can manage the file and get extra information from the path. Passing a file-like object requires that the file is opened in binary mode, and is mostly useful when building a file in memory with `io.BytesIO`.

Never pass file paths provided by a user. The path is assumed to be trusted, so a user could craft a path to access a file you didn’t intend. Use `send_from_directory()` to safely serve user-requested paths from within a directory.

If the WSGI server sets a `file_wrapper` in `environ`, it is used, otherwise Werkzeug’s built-in wrapper is used. Alternatively, if the HTTP server supports `X-Sendfile`, configuring Flask with `USE_X_SENDFILE = True` will tell the server to send the given path, which is much more efficient than reading it in Python.

*Parameters*:

- `path_or_file (os.PathLike | str | t.BinaryIO)` – The path to the file to send, relative to the current working directory if a relative path is given. Alternatively, a file-like object opened in binary mode. Make sure the file pointer is seeked to the start of the data.

- `mimetype (str | None)` – The MIME type to send for the file. If not provided, it will try to detect it from the file name.

- `as_attachment (bool)` – Indicate to a browser that it should offer to save the file instead of displaying it.

- `download_name (str | None)` – The default name browsers will use when saving the file. Defaults to the passed file name.

- `conditional (bool)` – Enable conditional and range responses based on request headers. Requires passing a file path and `environ`.

- `etag (bool | str)` – Calculate an ETag for the file, which requires passing a file path. Can also be a string to use instead.

- `last_modified (datetime | int | float | None)` – The last modified time to send for the file, in seconds. If not provided, it will try to detect it from the file path.

- `max_age (None | (int | t.Callable[[str | None], int | None]))` – How long the client should cache the file, in seconds. If set, `Cache-Control` will be `public`, otherwise it will be `no-cache` to prefer conditional caching.

*Return type*: `Response`

::: details Changelog
*Changed in version 2.0*: `download_name` replaces the `attachment_filename` parameter. If `as_attachment=False`, it is passed with `Content-Disposition: inline` instead.

*Changed in version 2.0*: `max_age` replaces the `cache_timeout` parameter. `conditional` is enabled and `max_age` is not set by default.

*Changed in version 2.0*: `etag` replaces the `add_etags` parameter. It can be a string to use instead of generating one.

*Changed in version 2.0*: Passing a file-like object that inherits from `TextIOBase` will raise a `ValueError` rather than sending an empty file.

*New in version 2.0*: Moved the implementation to Werkzeug. This is now a wrapper to pass some Flask-specific arguments.

*Changed in version 1.1*: `filename` may be a `PathLike` object.

*Changed in version 1.1*: Passing a `BytesIO` object supports range requests.

*Changed in version 1.0.3*: Filenames are encoded with ASCII instead of Latin-1 for broader compatibility with WSGI servers.

*Changed in version 1.0*: UTF-8 filenames as specified in `RFC 2231` are supported.

*Changed in version 0.12*: The filename is no longer automatically inferred from file objects. If you want to use automatic MIME and etag support, pass a filename via `filename_or_fp` or `attachment_filename`.

*Changed in version 0.12*: `attachment_filename` is preferred over `filename` for `MIME` detection.

*Changed in version 0.9*: `cache_timeout` defaults to `Flask.get_send_file_max_age()`.

*Changed in version 0.7*: `MIME` guessing and etag support for file-like objects was deprecated because it was unreliable. Pass a filename if you are able to, otherwise attach an etag yourself.

*Changed in version 0.5*: The `add_etags`, `cache_timeout` and `conditional` parameters were added. The default behavior is to add etags.

*New in version 0.2.*
:::

## flask.send_from_directory(`directory, path, **kwargs`)

Send a file from within a directory using `send_file()`.

```python
@app.route("/uploads/<path:name>")
def download_file(name):
    return send_from_directory(
        app.config['UPLOAD_FOLDER'], name, as_attachment=True
    )
```

This is a secure way to serve files from a folder, such as static files or uploads. Uses `safe_join()` to ensure the path coming from the client is not maliciously crafted to point outside the specified directory.

If the final path does not point to an existing regular file, raises a `404 NotFound` error.

*Parameters*:

- `directory (os.PathLike | str)` – The directory that path must be located under, relative to the current application’s root path.

- `path (os.PathLike | str)` – The path to the file to send, relative to `directory`.

- `kwargs (t.Any)` – Arguments to pass to `send_file()`.

*Return type*: `Response`

::: details Changelog
*Changed in version 2.0*: `path` replaces the `filename` parameter.

*New in version 2.0*: Moved the implementation to `Werkzeug`. This is now a wrapper to pass some Flask-specific arguments.

*New in version 0.5.*
:::