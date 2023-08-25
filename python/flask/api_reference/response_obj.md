# Response Objects {#response-objects}

## `class` flask.Response(`response=None, status=None, headers=None, mimetype=None, content_type=None, direct_passthrough=False`)

The response object that is used by default in `Flask`. Works like the response object from Werkzeug but is set to have an `HTML` mimetype by default. Quite often you don’t have to create this object yourself because `make_response()` will take care of that for you.

If you want to replace the response object used you can subclass this and set `response_class` to your subclass.

::: details Changelog
*Changed in version 1.0*: `JSON` support is added to the response, like the request. This is useful when testing to get the test client response data as `JSON`.

*Changed in version 1.0*: Added `max_cookie_size`.
:::

- *Parameters*:

    - `response (Iterable[str] | Iterable[bytes])` –

    - `status (int | str | HTTPStatus | None)` –

    - `headers (Headers)` –

    - `mimetype (str | None)` –

    - `content_type (str | None)` –

    - `direct_passthrough (bool)` –

- ### accept_ranges

    The `Accept-Ranges` header. Even though the name would indicate that multiple values are supported, it must be one string token only.

    The values `'bytes'` and `'none'` are common.

    ::: details Changelog
    *New in version 0.7.*
    :::

- ### `property` access_control_allow_credentials: `bool`

    Whether credentials can be shared by the browser to JavaScript code. As part of the preflight request it indicates whether credentials can be used on the cross origin request.

- ### access_control_allow_headers

    Which headers can be sent with the cross origin request.

- ### access_control_allow_methods

    Which methods can be used for the cross origin request.

- ### access_control_allow_origin

    The origin or `‘*’` for any origin that may make cross origin requests.

- ### access_control_expose_headers

    Which headers can be shared by the browser to JavaScript code.

- ### access_control_max_age

    The maximum age in seconds the access control settings can be cached for.

- ### add_etag(`overwrite=False, weak=False`)

    Add an etag for the current response if there is none yet.

    ::: details Changelog
    *Changed in version 2.0*: `SHA-1` is used to generate the value. `MD5` may not be available in some environments.
    :::

    *Parameters*:

    - `overwrite (bool)` –

    - `weak (bool)` –

    *Return type*: `None`

- ### age

    The Age response-header field conveys the sender’s estimate of the amount of time since the response (or its revalidation) was generated at the origin server.

    Age values are non-negative decimal integers, representing time in seconds.

- ### `property` allow: `HeaderSet`

    The Allow entity-header field lists the set of methods supported by the resource identified by the Request-URI. The purpose of this field is strictly to inform the recipient of valid methods associated with the resource. An Allow header field MUST be present in a `405` (Method Not Allowed) response.

- ### autocorrect_location_header = `False`

    If a redirect `Location` header is a relative URL, make it an absolute URL, including scheme and domain.

    ::: details Changelog
    *Changed in version 2.1*: This is disabled by default, so responses will send relative redirects.

    *New in version 0.8.*
    :::

- ### automatically_set_content_length = `True`

    Should this response object automatically set the content-length header if possible? This is true by default.

    ::: details Changelog
    *New in version 0.8.*
    :::

- ### `property` cache_control: `ResponseCacheControl`

    The `Cache-Control` general-header field is used to specify directives that MUST be obeyed by all caching mechanisms along the request/response chain.

- ### calculate_content_length()

    Returns the content length if available or `None` otherwise.

    *Return type*: `int | None`

- ### call_on_close(`func`)

    Adds a function to the internal list of functions that should be called as part of closing down the response. Since 0.7 this function also returns the function that was passed so that this can be used as a decorator.

    ::: details Changelog
    *New in version 0.6.*
    :::

    *Parameters*:

    - `func (Callable[[], Any])` –

    *Return type*: `Callable[[], Any]`

- ### `property` charset: `str`

    The charset used to encode body and cookie data. Defaults to `UTF-8`.

    *Deprecated since version 2.3*: Will be removed in `Werkzeug` 3.0. Response data must always be `UTF-8`.

- ### close()

    Close the wrapped response if possible. You can also use the object in a with statement which will automatically close it.

    ::: details Changelog
    *New in version 0.9*: Can now be used in a `with` statement.
    :::

    *Return type*: `None`

- ### content_encoding

    The `Content-Encoding` entity-header field is used as a modifier to the media-type. When present, its value indicates what additional content codings have been applied to the entity-body, and thus what decoding mechanisms must be applied in order to obtain the media-type referenced by the `Content-Type` header field.

- ### `property` content_language: `HeaderSet`

    The `Content-Language` entity-header field describes the natural language(s) of the intended audience for the enclosed entity. Note that this might not be equivalent to all the languages used within the entity-body.

- ### content_length

    The `Content-Length` entity-header field indicates the size of the entity-body, in decimal number of `OCTETs`, sent to the recipient or, in the case of the `HEAD` method, the size of the entity-body that would have been sent had the request been a `GET`.

- ### content_location

    The `Content-Location` entity-header field MAY be used to supply the resource location for the entity enclosed in the message when that entity is accessible from a location separate from the requested resource’s URI.

- ### content_md5

    The `Content-MD5` entity-header field, as defined in `RFC 1864`, is an MD5 digest of the entity-body for the purpose of providing an end-to-end message integrity check (MIC) of the entity-body. (Note: a MIC is good for detecting accidental modification of the entity-body in transit, but is not proof against malicious attacks.)

- ### `property` content_range: `ContentRange`

    The `Content-Range` header as a `ContentRange` object. Available even if the header is not set.

    ::: details Changelog
    *New in version 0.7.*
    :::

- ### `property` content_security_policy: `ContentSecurityPolicy`

    The `Content-Security-Policy` header as a `ContentSecurityPolicy` object. Available even if the header is not set.

    The `Content-Security-Policy` header adds an additional layer of security to help detect and mitigate certain types of attacks.

- ### `property` content_security_policy_report_only: `ContentSecurityPolicy`

    The `Content-Security-policy-report-only` header as a ContentSecurityPolicy object. Available even if the header is not set.

    The `Content-Security-Policy-Report-Only` header adds a `csp` policy that is not enforced but is reported thereby helping detect certain types of attacks.

- ### content_type

    The `Content-Type` entity-header field indicates the media type of the entity-body sent to the recipient or, in the case of the `HEAD` method, the media type that would have been sent had the request been a `GET`.

- ### cross_origin_embedder_policy

    Prevents a document from loading any cross-origin resources that do not explicitly grant the document permission. Values must be a member of the `werkzeug.http.COEP` enum.

- ### cross_origin_opener_policy

    Allows control over sharing of browsing context group with cross-origin documents. Values must be a member of the `werkzeug.http.COOP` enum.

- ### `property` data: `bytes | str`

    A descriptor that calls `get_data()` and `set_data()`.

- ### date

    The Date general-header field represents the date and time at which the message was originated, having the same semantics as orig-date in `RFC 822`.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### default_mimetype: `str | None = 'text/html'`

    the default mimetype if none is provided.

- ### default_status = `200`

    the default status if none is provided.

- ### delete_cookie(`key, path='/', domain=None, secure=False, httponly=False, samesite=None`)

    Delete a cookie. Fails silently if key doesn’t exist.

    *Parameters*:

    - `key (str)` – the key (name) of the cookie to be deleted.

    - `path (str | None)` – if the cookie that should be deleted was limited to a path, the path has to be defined here.

    - `domain (str | None)` – if the cookie that should be deleted was limited to a domain, that domain has to be defined here.

    - `secure (bool)` – If `True`, the cookie will only be available via `HTTPS`.

    - `httponly (bool)` – Disallow JavaScript access to the cookie.

    - `samesite (str | None)` – Limit the scope of the cookie to only be attached to requests that are “same-site”.

    *Return type*: `None`

- ### direct_passthrough

    Pass the response body directly through as the `WSGI` iterable. This can be used when the body is a binary file or other iterator of bytes, to skip some unnecessary checks. Use `send_file()` instead of setting this manually.

- ### expires

    The Expires entity-header field gives the date/time after which the response is considered stale. A stale cache entry may not normally be returned by a cache.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### `classmethod` force_type(`response, environ=None`)

    Enforce that the `WSGI` response is a response object of the current type. Werkzeug will use the `Response` internally in many situations like the exceptions. If you call `get_response()` on an exception you will get back a regular `Response` object, even if you are using a custom subclass.

    This method can enforce a given response type, and it will also convert arbitrary `WSGI` callables into response objects if an environ is provided:

    ```python
    # convert a Werkzeug response object into an instance of the
    # MyResponseClass subclass.
    response = MyResponseClass.force_type(response)

    # convert any WSGI application into a response object
    response = MyResponseClass.force_type(response, environ)
    ```

    This is especially useful if you want to post-process responses in the main dispatcher and use functionality provided by your subclass.

    Keep in mind that this will modify response objects in place if possible!

    *Parameters*:

    - `response (Response)` – a response object or wsgi application.

    - `environ (WSGIEnvironment | None)` – a `WSGI` environment object.

    *Returns*: a response object.

    *Return type*: `Response`

- ### freeze()

    Make the response object ready to be pickled. Does the following:

    - Buffer the response into a list, ignoring `implicity_sequence_conversion` and `direct_passthrough`.

    - Set the `Content-Length` header.

    - Generate an `ETag` header if one is not already set.

    ::: details Changelog
    *Changed in version 2.1*: Removed the `no_etag` parameter.

    *Changed in version 2.0*: An `ETag` header is always added.

    *Changed in version 0.6*: The `Content-Length` header is set.
    :::

    *Return type*: `None`

- ### classmethod from_app(`app, environ, buffered=False`)

    Create a new response object from an application output. This works best if you pass it an application that returns a generator all the time. Sometimes applications may use the `write()` callable returned by the `start_response` function. This tries to resolve such edge cases automatically. But if you don’t get the expected output you should set buffered to `True` which enforces buffering.

    *Parameters*:

    - `app (WSGIApplication)` – the WSGI application to execute.

    - `environ (WSGIEnvironment)` – the WSGI environment to execute against.

    - `buffered (bool)` – set to True to enforce buffering.

    *Returns*: a response object.

    *Return type*: `Response`

- ### get_app_iter(`environ`)

    Returns the application iterator for the given environ. Depending on the request method and the current status code the return value might be an empty response rather than the one from the response.

    If the request method is `HEAD` or the status code is in a range where the `HTTP` specification requires an empty response, an empty iterable is returned.

    ::: details Changelog
    *New in version 0.6.*
    :::

    *Parameters*:

    - `environ (WSGIEnvironment)` – the `WSGI` environment of the request.

    *Returns*: a response iterable.

    *Return type*: `t.Iterable[bytes]`

- ### get_data(`as_text=False`)

    The string representation of the response body. Whenever you call this property the response iterable is encoded and flattened. This can lead to unwanted behavior if you stream big data.

    This behavior can be disabled by setting `implicit_sequence_conversion` to `False`.

    If `as_text` is set to `True` the return value will be a decoded string.

    ::: details Changelog
    *New in version 0.9.*
    :::

    *Parameters*:

    - `as_text (bool)` –

    *Return type*: `bytes | str`

- ### get_etag()

    Return a tuple in the form `(etag, is_weak)`. If there is no `ETag` the return value is `(None, None)`.

    *Return type*: `tuple[str, bool] | tuple[None, None]`

- ### get_json(`force=False, silent=False`)

    Parse `data` as `JSON`. Useful during testing.

    If the mimetype does not indicate JSON (`application/json`, see `is_json`), this returns None.

    Unlike `Request.get_json()`, the result is not cached.

    *Parameters*:

    - `force (bool)` – Ignore the mimetype and always try to parse `JSON`.

    - `silent (bool)` – Silence parsing errors and return `None` instead.

    *Return type*: `Any | None`

- ### get_wsgi_headers(`environ`)

    This is automatically called right before the response is started and returns headers modified for the given environment. It returns a copy of the headers from the response with some modifications applied if necessary.

    For example the location header (if present) is joined with the root URL of the environment. Also the content length is automatically set to zero here for certain status codes.

    ::: details Changelog
    *Changed in version 0.6*: Previously that function was called `fix_headers` and modified the response object in place. Also since 0.6, IRIs in location and content-location headers are handled properly.

    Also starting with 0.6, Werkzeug will attempt to set the content length if it is able to figure it out on its own. This is the case if all the strings in the response iterable are already encoded and the iterable is buffered.
    :::

    *Parameters*:

    - `environ (WSGIEnvironment)` – the `WSGI` environment of the request.

    *Returns*: returns a new `Headers` object.

    *Return type*: `Headers`

- ### get_wsgi_response(`environ`)

    Returns the final WSGI response as tuple. The first item in the tuple is the application iterator, the second the status and the third the list of headers. The response returned is created specially for the given environment. For example if the request method in the WSGI environment is `'HEAD'` the response will be empty and only the headers and status code will be present.

    ::: details Changelog
    *New in version 0.6.*
    :::

    *Parameters*:

    - `environ (WSGIEnvironment)` – the `WSGI` environment of the request.

    *Returns*: an `(app_iter, status, headers)` tuple.

    *Return type*: `tuple[t.Iterable[bytes], str, list[tuple[str, str]]]`

- ### implicit_sequence_conversion = `True`

    if set to False accessing properties on the response object will not try to consume the response iterator and convert it into a list.

    ::: details Changelog
    *New in version 0.6.2*: That attribute was previously called `implicit_seqence_conversion`. (Notice the typo). If you did use this feature, you have to adapt your code to the name change.
    :::

- ### `property` is_json: `bool`

    Check if the mimetype indicates JSON data, either `application/json` or `application/*+json`.

- ### `property` is_sequence: `bool`

    If the iterator is buffered, this property will be True. A response object will consider an iterator to be buffered if the response attribute is a list or tuple.

    ::: details Changelog
    *New in version 0.6.*
    :::

- ### `property` is_streamed: `bool`

    If the response is streamed (the response is not an iterable with a length information) this property is True. In this case streamed means that there is no information about the number of iterations. This is usually True if a generator is passed to the response object.

    This is useful for checking before applying some sort of post filtering that should not take place for streamed responses.

- ### iter_encoded()

    Iter the response encoded with the encoding of the response. If the response object is invoked as WSGI application the return value of this method is used as application iterator unless `direct_passthrough` was activated.

    *Return type*: `Iterator[bytes]`

- ### `property` json: `Any | None`

    The parsed JSON data if mimetype indicates JSON (`application/json`, see `is_json`).

    Calls `get_json()` with default arguments.

- ### last_modified

    The Last-Modified entity-header field indicates the date and time at which the origin server believes the variant was last modified.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### location

    The Location response-header field is used to redirect the recipient to a location other than the Request-URI for completion of the request or identification of a new resource.

- ### make_conditional(`request_or_environ, accept_ranges=False, complete_length=None`)

    Make the response conditional to the request. This method works best if an etag was defined for the response already. The add_etag method can be used to do that. If called without etag just the date header is set.

    This does nothing if the request method in the request or environ is anything but `GET` or `HEAD`.

    For optimal performance when handling range requests, it’s recommended that your response data object implements `seekable`, `seek` and `tell` methods as described by `io.IOBase`. Objects returned by `wrap_file()` automatically implement those methods.

    It does not remove the body of the response because that’s something the `__call__()` function does for us automatically.

    Returns self so that you can do return `resp.make_conditional(req)` but modifies the object in-place.

    *Parameters*:

    - `request_or_environ (WSGIEnvironment | Request)` – a request object or WSGI environment to be used to make the response conditional against.

    - `accept_ranges (bool | str)` – This parameter dictates the value of Accept-Ranges header. If `False` (default), the header is not set. If `True`, it will be set to `"bytes"`. If it’s a string, it will use this value.

    - `complete_length (int | None)` – Will be used only in valid Range Requests. It will set `Content-Range` complete length value and compute `Content-Length` real value. This parameter is mandatory for successful Range Requests completion.

    *Raises*: `RequestedRangeNotSatisfiable` if `Range` header could not be parsed or satisfied.

    *Return type*: `Response`

    ::: details Changelog
    *Changed in version 2.0*: Range processing is skipped if length is 0 instead of raising a `416` Range Not Satisfiable error.
    :::

- ### make_sequence()

    Converts the response iterator in a list. By default this happens automatically if required. If `implicit_sequence_conversion` is disabled, this method is not automatically called and some properties might raise exceptions. This also encodes all the items.

    ::: details Changelog
    *New in version 0.6.*
    :::

    *Return type*: `None`

- ### `property` max_cookie_size: `int`

    Read-only view of the `MAX_COOKIE_SIZE` config key.

    See `max_cookie_size` in Werkzeug’s docs.

- ### `property` mimetype: `str | None`

    The mimetype (content type without charset etc.)

- ### `property` mimetype_params: `dict[str, str]`

    The mimetype parameters as dict. For example if the content type is `text/html; charset=utf-8` the params would be `{'charset': 'utf-8'}`.

    ::: details Changelog
    *New in version 0.5.*
    :::

- ### response: `t.Iterable[str] | t.Iterable[bytes]`

    The response body to send as the `WSGI` iterable. A list of strings or bytes represents a fixed-length response, any other iterable is a streaming response. Strings are encoded to bytes as `UTF-8`.

    Do not set to a plain string or bytes, that will cause sending the response to be very inefficient as it will iterate one byte at a time.

- ### `property` retry_after: `datetime | None`

    The Retry-After response-header field can be used with a `503` (Service Unavailable) response to indicate how long the service is expected to be unavailable to the requesting client.

    Time in seconds until expiration or date.

    ::: details Changelog
    *Changed in version 2.0*: The datetime object is timezone-aware.
    :::

- ### set_cookie(`key, value='', max_age=None, expires=None, path='/', domain=None, secure=False, httponly=False, samesite=None`)

    Sets a cookie.

    A warning is raised if the size of the cookie header exceeds `max_cookie_size`, but the header will still be set.

    *Parameters*:

    - `key (str)` – the key (name) of the cookie to be set.

    - `value (str)` – the value of the cookie.

    - `max_age (timedelta | int | None)` – should be a number of seconds, or `None` (default) if the cookie should last only as long as the client’s browser session.

    - `expires (str | datetime | int | float | None)` – should be a datetime object or `UNIX` timestamp.

    - `path (str | None)` – limits the cookie to a given path, per default it will span the whole domain.

    - `domain (str | None)` – if you want to set a cross-domain cookie. For example, `domain=".example.com"` will set a cookie that is readable by the domain `www.example.com`, `foo.example.com` etc. Otherwise, a cookie will only be readable by the domain that set it.

    - `secure (bool)` – If `True`, the cookie will only be available via `HTTPS`.

    - `httponly (bool)` – Disallow `JavaScript` access to the cookie.

    - `samesite (str | None)` – Limit the scope of the cookie to only be attached to requests that are “same-site”.

    *Return type*: `None`

- ### set_data(`value`)

    Sets a new string as response. The value must be a string or bytes. If a string is set it’s encoded to the charset of the response (`utf-8` by default).

    ::: details Changelog
    *New in version 0.9.*
    :::

    *Parameters*:

    - `value (bytes | str)` –

    *Return type*: `None`

- ### set_etag(`etag, weak=False`)

    Set the etag, and override the old one if there was one.

    *Parameters*:

    - `etag (str)` –

    - `weak (bool)` –

    *Return type*: `None`

- ### `property` status: `str`

    The `HTTP` status code as a string.

- ### `property` status_code: `int`

    The `HTTP` status code as a number.

- ### `property` stream: `ResponseStream`

    The response iterable as write-only stream.

- ### `property` vary: `HeaderSet`

    The Vary field value indicates the set of request-header fields that fully determines, while the response is fresh, whether a cache is permitted to use the response to reply to a subsequent request without revalidation.

- ### `property` www_authenticate: `WWWAuthenticate`

    The `WWW-Authenticate` header parsed into a `WWWAuthenticate` object. Modifying the object will modify the header value.

    This header is not set by default. To set this header, assign an instance of `WWWAuthenticate` to this attribute.

    ```python
    response.www_authenticate = WWWAuthenticate(
        "basic", {"realm": "Authentication Required"}
    )
    ```

    Multiple values for this header can be sent to give the client multiple options. Assign a list to set multiple headers. However, modifying the items in the list will not automatically update the header values, and accessing this attribute will only ever return the first value.

    To unset this header, assign `None` or use `del`.

    *Changed in version 2.3*: This attribute can be assigned to to set the header. A list can be assigned to set multiple header values. Use del to unset the header.

    *Changed in version 2.3*: `WWWAuthenticate` is no longer a `dict`. The `token` attribute was added for auth challenges that use a token instead of parameters.