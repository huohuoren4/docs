# Incoming Request Data {#incoming-request-data}

## `class` flask.Request(`environ, populate_request=True, shallow=False`)

The request object used by default in Flask. Remembers the matched endpoint and view arguments.

It is what ends up as request. If you want to replace the request object used you can subclass this and set `request_class` to your subclass.

The request object is a `Request` subclass and provides all of the attributes `Werkzeug` defines plus a few `Flask` specific ones.

- *Parameters*:

  - `environ (WSGIEnvironment)` –

  - `populate_request (bool)` –

  - `shallow (bool)` –

- ### `property` accept_charsets: `CharsetAccept`

List of charsets this client supports as `CharsetAccept` object.

- ### `property` accept_encodings: `Accept`

List of encodings this client accepts. Encodings in a `HTTP` term are compression encodings such as gzip. For charsets have a look at `accept_charset`.

- ### `property` accept_languages: `LanguageAccept`

List of languages this client accepts as `LanguageAccept` object.

- ### `property` accept_mimetypes: `MIMEAccept`

List of mimetypes this client supports as `MIMEAccept` object.

- ### access_control_request_headers

Sent with a preflight request to indicate which headers will be sent with the cross origin request. Set `access_control_allow_headers` on the response to indicate which headers are allowed.

- ### access_control_request_method
Sent with a preflight request to indicate which method will be used for the cross origin request. Set `access_control_allow_methods` on the response to indicate which methods are allowed.

- ### `property` access_route: `list[str]`

If a forwarded header exists this is a list of all ip addresses from the client ip to the last proxy server.

- ### `classmethod` application(`f`)

    Decorate a function as responder that accepts the request as the last argument. This works like the `responder()` decorator but the function is passed the request object as the last argument and the request object will be closed automatically:

    ```python
    @Request.application
    def my_wsgi_app(request):
        return Response('Hello World!')
    ```

    As of `Werkzeug` 0.14 `HTTP` exceptions are automatically caught and converted to responses instead of failing.

    *Parameters*:

    - f (`t.Callable[[Request], WSGIApplication]`) – the `WSGI` callable to decorate

    Returns: a new `WSGI` callable

    *Return type*: `WSGIApplication`

- ### `property` args: `MultiDict[str, str]`

    The parsed URL parameters (the part in the URL after the question mark).

    By default an `ImmutableMultiDict` is returned from this function. This can be changed by setting `parameter_storage_class` to a different type. This might be necessary if the order of the form data is important.

    *Changed in version 2.3*: Invalid bytes remain percent encoded.

- ### `property` authorization: `Authorization | None`

    The Authorization header parsed into an Authorization object. None if the header is not present.

    *Changed in version 2.3*: Authorization is no longer a dict. The token attribute was added for auth schemes that use a token instead of parameters.

- ### `property` base_url: `str`

    Like url but without the query string.

- ### `property` blueprint: `str | None`

    The registered name of the current blueprint.

    This will be `None` if the endpoint is not part of a blueprint, or if URL matching failed or has not been performed yet.

    This does not necessarily match the name the blueprint was created with. It may have been nested, or registered with a different name.

- ### `property` blueprints: `list[str]`

    The registered names of the current blueprint upwards through parent blueprints.

    This will be an empty list if there is no current blueprint, or if URL matching failed.

    ::: details Changelog
    *New in version 2.0.1.*
    :::

- ### `property` cache_control: `RequestCacheControl`

    A `RequestCacheControl` object for the incoming cache control headers.

- ### `property` charset: `str`

    The charset used to decode body, form, and cookie data. Defaults to `UTF-8`.

    *Deprecated since version 2.3*: Will be removed in `Werkzeug` 3.0. Request data must always be `UTF-8`.

- ### close()

    Closes associated resources of this request object. This closes all file handles explicitly. You can also use the request object in a with statement which will automatically close it.

    ::: details Changelog
    *New in version 0.9.*
    :::

    *Return type*: `None`

- ### content_encoding

    The `Content-Encoding` entity-header field is used as a modifier to the media-type. When present, its value indicates what additional content codings have been applied to the entity-body, and thus what decoding mechanisms must be applied in order to obtain the media-type referenced by the `Content-Type` header field.

    ::: details Changelog
    *New in version 0.9.*
    :::

- ### `property` content_length: `int | None`

    The `Content-Length` entity-header field indicates the size of the entity-body in bytes or, in the case of the `HEAD` method, the size of the entity-body that would have been sent had the request been a `GET`.

- ### content_md5

    The `Content-MD5` entity-header field, as defined in `RFC 1864`, is an `MD5` digest of the entity-body for the purpose of providing an end-to-end message integrity check (MIC) of the entity-body. (Note: a `MIC` is good for detecting accidental modification of the entity-body in transit, but is not proof against malicious attacks.)

    ::: details Changelog
    *New in version 0.9.*
    :::

- ### content_type

    The `Content-Type` entity-header field indicates the media type of the entity-body sent to the recipient or, in the case of the `HEAD` method, the media type that would have been sent had the request been a `GET`.

- ### `property` cookies: `ImmutableMultiDict[str, str]`

    A dict with the contents of all cookies transmitted with the request.

- ### `property` data: `bytes`

    The raw data read from stream. Will be empty if the request represents form data.

    To get the raw data even if it represents form data, use `get_data()`.

- ### date

    The Date general-header field represents the date and time at which the message was originated, having the same semantics as orig-date in RFC 822.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### dict_storage_class

    alias of `ImmutableMultiDict`

- ### `property` encoding_errors: `str`

    How errors when decoding bytes are handled. Defaults to `“replace”`.

    *Deprecated since version 2.3*: Will be removed in `Werkzeug` 3.0.

- ### `property` endpoint: `str | None`

    The endpoint that matched the request URL.

    This will be `None` if matching failed or has not been performed yet.

    This in combination with `view_args` can be used to reconstruct the same URL or a modified URL.

- ### environ: `WSGIEnvironment`

    The `WSGI` environment containing `HTTP` headers and information from the `WSGI` server.

- ### `property` files: `ImmutableMultiDict[str, FileStorage]`

    `MultiDict` object containing all uploaded files. Each key in files is the name from the `<input type="file" name="">`. Each value in `files` is a `Werkzeug` `FileStorage` object.

    It basically behaves like a standard file object you know from Python, with the difference that it also has a `save()` function that can store the file on the filesystem.

    Note that files will only contain data if the request method was `POST`, `PUT` or `PATCH` and the `<form>` that posted to the request had `enctype="multipart/form-data"`. It will be empty otherwise.

    See the `MultiDict / FileStorage` documentation for more details about the used data structure.

- ### `property` form: `ImmutableMultiDict[str, str]`

    The form parameters. By default an `ImmutableMultiDict` is returned from this function. This can be changed by setting `parameter_storage_class` to a different type. This might be necessary if the order of the form data is important.

    Please keep in mind that file uploads will not end up here, but instead in the files attribute.

    ::: details Changelog
    *Changed in version 0.9*: Previous to `Werkzeug` 0.9 this would only contain form data for `POST` and `PUT` requests.
    :::

- ### form_data_parser_class

    alias of `FormDataParser`

- ### `classmethod` from_values(`*args, **kwargs`)

    Create a new request object based on the values provided. If environ is given missing values are filled from there. This method is useful for small scripts when you need to simulate a request from an URL. Do not use this method for unittesting, there is a full featured client object (`Client`) that allows to create `multipart` requests, support for cookies etc.

    This accepts the same options as the `EnvironBuilder`.

    ::: details Changelog
    *Changed in version 0.5*: This method now accepts the same arguments as `EnvironBuilder`. Because of this the `environ` parameter is now called `environ_overrides`.
    :::

    *Returns*: request object

    *Parameters*:

    - `args (Any)` –

    - `kwargs (Any)` –

    *Return type*: `Request`

- ### `property` full_path: `str`

    Requested path, including the query string.

- ### get_data(`cache=True, as_text=False, parse_form_data=False`)

    This reads the buffered incoming data from the client into one bytes object. By default this is cached but that behavior can be changed by setting cache to `False`.

    Usually it’s a bad idea to call this method without checking the content length first as a client could send dozens of megabytes or more to cause memory problems on the server.

    Note that if the form data was already parsed this method will not return anything as form data parsing does not cache the data like this method does. To implicitly invoke form data parsing function set `parse_form_data` to `True`. When this is done the return value of this method will be an empty string if the form parser handles the data. This generally is not necessary as if the whole data is cached (which is the default) the form parser will used the cached data to parse the form data. Please be generally aware of checking the content length first in any case before calling this method to avoid exhausting server memory.

    If `as_text` is set to `True` the return value will be a decoded string.

    ::: details Changelog
    *New in version 0.9.*
    :::

    *Parameters*:

    - `cache (bool)` –

    - `as_text (bool)` –

    - `parse_form_data (bool)` –

    *Return type*: `bytes | str`

- ### get_json(`force=False, silent=False, cache=True`)

    Parse `data` as `JSON`.

    If the `mimetype` does not indicate `JSON` (`application/json`, see `is_json`), or parsing fails, `on_json_loading_failed()` is called and its return value is used as the return value. By default this raises a `415` Unsupported Media Type resp.

    *Parameters*:

    - `force (bool)` – Ignore the mimetype and always try to parse `JSON`.

    - `silent (bool)` – Silence mimetype and parsing errors, and return `None` instead.

    - `cache (bool)` – Store the parsed JSON to return for subsequent calls.

    *Return type*: `Any | None`

    *Changed in version 2.3*: Raise a `415` error instead of `400`.

    ::: details Changelog
    *Changed in version 2.1*: Raise a `400` error if the content type is incorrect.
    :::

- ### headers

    The headers received with the request.

- ### `property` host: `str`

    The host name the request was made to, including the port if it’s non-standard. Validated with `trusted_hosts`.

- ### `property` host_url: `str`

    The request URL scheme and host only.

- ### `property` if_match: `ETags`

    An object containing all the etags in the `If-Match` header.

    *Return type*: `ETags`

- ### `property` if_modified_since: `datetime | None`

    The parsed `If-Modified-Since` header as a datetime object.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### `property` if_none_match: `ETags`

    An object containing all the etags in the `If-None-Match` header.

    *Return type*: `ETags`

- ### `property` if_range: `IfRange`

    The parsed `If-Range` header.

    ::: details Changelog
    *Changed in version 2.0*: `IfRange.date` is timezone-aware.

    *New in version 0.7.*
    :::

- ### `property` if_unmodified_since: `datetime | None`

    The parsed `If-Unmodified-Since` header as a datetime object.

    ::: details hangelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### input_stream

    The raw `WSGI` input stream, without any safety checks.

    This is dangerous to use. It does not guard against infinite streams or reading past `content_length` or `max_content_length`.

    Use `stream` instead.

- ### `property` is_json: `bool`

    Check if the mimetype indicates JSON data, either `application/json` or `application/*+json`.

- ### is_multiprocess

    boolean that is `True` if the application is served by a `WSGI` server that spawns multiple processes.

- ### is_multithread

    boolean that is `True` if the application is served by a multithreaded `WSGI` server.

- ### is_run_once

    boolean that is `True` if the application will be executed only once in a process lifetime. This is the case for `CGI` for example, but it’s not guaranteed that the execution only happens one time.

- ### `property` is_secure: `bool`

    `True` if the request was made with a secure protocol (`HTTPS` or `WSS`).

- ### `property` json: `Any | None`

    The parsed `JSON` data if `mimetype` indicates `JSON` (`application/json`, see `is_json`).

    Calls `get_json()` with default arguments.

    If the request content type is not `application/json`, this will raise a `415` Unsupported Media Type error.

    *Changed in version 2.3*: Raise a `415` error instead of `400`.

    ::: details Changelog
    *Changed in version 2.1*: Raise a `400` error if the content type is incorrect.
    :::

- ### list_storage_class

    alias of `ImmutableList`

- ### make_form_data_parser()

    Creates the form data parser. Instantiates the `form_data_parser_class` with some parameters.

    ::: details Changelog
    *New in version 0.8.*
    :::

    *Return type*: `FormDataParser`

- ### `property` max_content_length: `int | None`

    Read-only view of the `MAX_CONTENT_LENGTH` config key.

- ### max_form_memory_size: `int | None = None`

    the maximum form field size. This is forwarded to the form data parsing function (`parse_form_data()`). When set and the `form` or `files` attribute is accessed and the data in memory for post data is longer than the specified value a `RequestEntityTooLarge` exception is raised.

    ::: details Changelog
    *New in version 0.5.*
    :::

- ### max_form_parts = `1000`

    The maximum number of multipart parts to parse, passed to `form_data_parser_class`. Parsing form data with more than this many parts will raise `RequestEntityTooLarge`.

    ::: details Changelog
    *New in version 2.2.3.*
    :::

- ### max_forwards

    The `Max-Forwards` request-header field provides a mechanism with the `TRACE` and `OPTIONS` methods to limit the number of proxies or gateways that can forward the request to the next inbound server.

- ### method

    The method the request was made with, such as `GET`.

- ### `property` mimetype: `str`

    Like `content_type`, but without parameters (eg, without charset, type etc.) and always lowercase. For example if the content type is `text/HTML; charset=utf-8` the mimetype would be `'text/html'`.

- ### `property` mimetype_params: `dict[str, str]`

    The mimetype parameters as `dict`. For example if the content type is `text/html; charset=utf-8` the params would be `{'charset': 'utf-8'}`.

- ### on_json_loading_failed(`e`)

    Called if `get_json()` fails and isn’t silenced.

    If this method returns a value, it is used as the return value for `get_json()`. The default implementation raises `BadRequest`.

    *Parameters*:

    - e (ValueError | None) – If parsing failed, this is the exception. It will be `None` if the content type wasn’t `application/json`.

    *Return type*: `Any`

    *Changed in version 2.3*: Raise a `415` error instead of `400`.

- ### origin

    The host that the request originated from. Set `access_control_allow_origin` on the response to indicate which origins are allowed.

- ### parameter_storage_class

    alias of `ImmutableMultiDict`

- ### path

    The path part of the URL after `root_path`. This is the path used for routing within the application.

- ### `property` pragma: `HeaderSet`

    The Pragma general-header field is used to include implementation-specific directives that might apply to any recipient along the request/response chain. All pragma directives specify optional behavior from the viewpoint of the protocol; however, some systems MAY require that behavior be consistent with the directives.

- ### query_string

    The part of the URL after the `“?”`. This is the raw value, use `args` for the parsed values.

- ### `property` range: `Range | None`

    The parsed `Range` header.

    ::: details Changelog
    *New in version 0.7.*
    :::

    *Return type*: `Range`

- ### referrer

    The `Referer[sic]` request-header field allows the client to specify, for the server’s benefit, the address (`URI`) of the resource from which the Request-URI was obtained (the “referrer”, although the header field is misspelled).

- ### remote_addr

    The address of the client sending the request.

- ### remote_user

    If the server supports user authentication, and the script is protected, this attribute contains the username the user has authenticated as.

- ### root_path

    The prefix that the application is mounted under, without a trailing slash. `path` comes after this.

- ### `property` root_url: `str`

    The request URL scheme, host, and root path. This is the root that the application is accessed from.

- ### routing_exception: `Exception | None = None`

    If matching the URL failed, this is the exception that will be raised / was raised as part of the request handling. This is usually a `NotFound` exception or something similar.

- ### scheme
 
    The URL scheme of the protocol the request used, such as `https` or `wss`.

- ### `property` script_root: `str`

    Alias for `self.root_path`. `environ["SCRIPT_ROOT"]` without a trailing slash.

- ### server

    The address of the server. `(host, port)`, `(path, None)` for unix sockets, or None if not known.

- ### shallow: `bool`

    Set when creating the request object. If `True`, reading from the request body will cause a `RuntimeException`. Useful to prevent modifying the stream from middleware.

- ### `property` stream: `IO[bytes]`

    The `WSGI` input stream, with safety checks. This stream can only be consumed once.

    Use `get_data()` to get the full data as bytes or text. The `data` attribute will contain the full bytes only if they do not represent form data. The `form` attribute will contain the parsed form data in that case.

    Unlike `input_stream`, this stream guards against infinite streams or reading past `content_length` or `max_content_length`.

    If `max_content_length` is set, it can be enforced on streams if `wsgi.input_terminated` is set. Otherwise, an empty stream is returned.

    If the limit is reached before the underlying stream is exhausted (such as a file that is too large, or an infinite stream), the remaining contents of the stream cannot be read safely. Depending on how the server handles this, clients may show a “connection reset” failure instead of seeing the `413` response.

    *Changed in version 2.3*: Check `max_content_length` preemptively and while reading.

    ::: details Changelog
    *Changed in version 0.9*: The stream is always set (but may be consumed) even if form parsing was accessed first.
    :::

- ### trusted_hosts: `list[str] | None = None`

    Valid host names when handling requests. By default all hosts are trusted, which means that whatever the client says the host is will be accepted.

    Because `Host` and `X-Forwarded-Host` headers can be set to any value by a malicious client, it is recommended to either set this property or implement similar validation in the proxy (if the application is being run behind one).

    ::: details Changelog
    *New in version 0.9.*
    :::

- ### `property` url: `str`

    The full request URL with the scheme, host, root path, path, and query string.

- ### `property` url_charset: `str`

    The charset to use when decoding percent-encoded bytes in `args`. Defaults to the value of `charset`, which defaults to `UTF-8`.

    *Deprecated since version 2.3*: Will be removed in `Werkzeug` 3.0. Percent-encoded bytes must always be `UTF-8`.

    ::: details Changelog
    *New in version 0.6.*
    :::

- ### `property` url_root: `str`

    Alias for `root_url`. The URL with scheme, host, and root path. For example, `https://example.com/app/`.

- ### url_rule: `Rule | None = None`

    The internal URL rule that matched the request. This can be useful to inspect which methods are allowed for the URL from a before/after handler (`request.url_rule.methods`) etc. Though if the request’s method was invalid for the URL rule, the valid list is available in `routing_exception.valid_methods` instead (an attribute of the Werkzeug exception `MethodNotAllowed`) because the request was never internally bound.

    ::: details Changelog
    *New in version 0.6.*
    :::

- ### `property` user_agent: `UserAgent`

    The user agent. Use `user_agent.string` to get the header value. Set `user_agent_class` to a subclass of `UserAgent` to provide parsing for the other properties or other extended data.

    ::: details Changelog
    *Changed in version 2.1*: The built-in parser was removed. Set `user_agent_class` to a `UserAgent` subclass to parse data from the string.
    :::

- ### user_agent_class

    alias of `UserAgent`

- ### `property` values: `CombinedMultiDict[str, str]`

    A `werkzeug.datastructures.CombinedMultiDict` that combines `args` and `form`.

    For `GET` requests, only `args` are present, not `form`.

    ::: details Changelog
    *Changed in version 2.0*: For `GET` requests, only `args` are present, not `form`.
    :::

- ### view_args: `dict[str, t.Any] | None = None`

    A dict of view arguments that matched the request. If an exception happened when matching, this will be `None`.

- ### `property` want_form_data_parsed: `bool`

    `True` if the request method carries content. By default this is true if a `Content-Type` is sent.

    ::: details Changelog
    *New in version 0.8.*
    :::

## flask.request

To access incoming request data, you can use the global `request` object. `Flask` parses incoming request data for you and gives you access to it through that global object. Internally `Flask` makes sure that you always get the correct data for the active thread if you are in a multithreaded environment.

This is a proxy. See [Notes On Proxies](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#notes-on-proxies) for more information.

The request object is an instance of a `Request`.