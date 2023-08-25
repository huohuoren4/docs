# Useful Internals {#useful-internals}

## `class` flask.ctx.RequestContext(`app, environ, request=None, session=None`)

The request context contains per-request information. The Flask app creates and pushes it at the beginning of the request, then pops it at the end of the request. It will create the URL adapter and request object for the WSGI environment provided.

Do not attempt to use this class directly, instead use `test_request_context()` and `request_context()` to create this object.

When the request context is popped, it will evaluate all the functions registered on the application for teardown execution (`teardown_request()`).

The request context is automatically popped at the end of the request. When using the interactive debugger, the context will be restored so `request` is still accessible. Similarly, the test client can preserve the context after the request ends. However, teardown functions may already have closed some resources such as database connections.

- *Parameters*:

    - `app (Flask)` –

    - `environ (dict)` –

    - `request (Request | None)` –

    - `session (SessionMixin | None)` –

- ### copy()

    Creates a copy of this request context with the same request object. This can be used to move a request context to a different greenlet. Because the actual request object is the same this cannot be used to move a request context to a different thread unless access to the request object is locked.

    ::: details Changelog
    *Changed in version 1.1*: The current session object is used instead of reloading the original data. This prevents `flask.session` pointing to an out-of-date object.

    *New in version 0.10.*
    :::

    *Return type*: `RequestContext`

- ### match_request()

    Can be overridden by a subclass to hook into the matching of the request.

    *Return type*: `None`

- ### pop(`exc=<object object>`)

    Pops the request context and unbinds it by doing that. This will also trigger the execution of functions registered by the `teardown_request()` decorator.

    ::: details Changelog
    *Changed in version 0.9*: Added the exc argument.
    :::

    *Parameters*:

    - `exc (BaseException | None)` –

    *Return type*: `None`

## flask.globals.request_ctx

The current `RequestContext`. If a request context is not active, accessing attributes on this proxy will raise a `RuntimeError`.

This is an internal object that is essential to how Flask handles requests. Accessing this should not be needed in most cases. Most likely you want request and session instead.

## class flask.ctx.AppContext(`app`)

The app context contains application-specific information. An app context is created and pushed at the beginning of each request if one is not already active. An app context is also pushed when running CLI commands.

- *Parameters*:

    - `app (Flask)` –

- ### pop(`exc=<object object>`)

    Pops the app context.

    *Parameters*:

    - `exc (BaseException | None)` –

    *Return type*: `None`

- ### push()

    Binds the app context to the current context.

    *Return type*: `None`

## flask.globals.app_ctx

The current `AppContext`. If an app context is not active, accessing attributes on this proxy will raise a `RuntimeError`.

This is an internal object that is essential to how `Flask` handles requests. Accessing this should not be needed in most cases. Most likely you want `current_app` and `g` instead.

## `class` flask.blueprints.BlueprintSetupState(`blueprint, app, options, first_registration`)

Temporary holder object for registering a blueprint with the application. An instance of this class is created by the `make_setup_state()` method and later passed to all register callback functions.

- *Parameters*:

    - `blueprint (Blueprint)` –

    - `app (Flask)` –

    - `options (t.Any)` –

    - `first_registration (bool)` –

- ### add_url_rule(`rule, endpoint=None, view_func=None, **options`)

    A helper method to register a rule (and optionally a view function) to the application. The endpoint is automatically prefixed with the blueprint’s name.

    *Parameters*:

    - `rule (str)` –

    - `endpoint (str | None)` –

    - `view_func (Callable | None)` –

    - `options (Any)` –

    *Return type*: `None`

- ### app

    a reference to the current application

- ### blueprint

    a reference to the blueprint that created this setup state.

- ### first_registration

    as blueprints can be registered multiple times with the application and not everything wants to be registered multiple times on it, this attribute can be used to figure out if the blueprint was registered in the past already.

- ### options

    a dictionary with all options that were passed to the `register_blueprint()` method.

- ### subdomain

    The subdomain that the blueprint should be active for, None otherwise.

- ### url_defaults

    A dictionary with URL defaults that is added to each and every URL that was defined with the blueprint.

- ### url_prefix

    The prefix that should be used for all URLs defined on the blueprint.