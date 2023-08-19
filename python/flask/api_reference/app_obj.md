# API

This part of the documentation covers all the interfaces of Flask. For parts where Flask depends on external libraries, we document the most important right here and provide links to the canonical documentation.

## Application Object

- ### `class` flask.Flask(`import_name, static_url_path=None, static_folder='static', static_host=None, host_matching=False, subdomain_matching=False, template_folder='templates', instance_path=None, instance_relative_config=False, root_path=None`)

    The flask object implements a WSGI application and acts as the central object. It is passed the name of the module or package of the application. Once it is created it will act as a central registry for the view functions, the URL rules, template configuration and much more.

    The name of the package is used to resolve resources from inside the package or the folder the module is contained in depending on if the package parameter resolves to an actual python package (a folder with an `__init__.py` file inside) or a standard module (just a `.py` file).

    For more information about resource loading, see `open_resource()`.

    Usually you create a Flask instance in your main module or in the `__init__.py` file of your package like this:

    ```python
    from flask import Flask
    app = Flask(__name__)
    ```

    ::: tip About the First Parameter
    The idea of the first parameter is to give Flask an idea of what belongs to your application. This name is used to find resources on the filesystem, can be used by extensions to improve debugging information and a lot more.

    So it’s important what you provide there. If you are using a single module, `__name__` is always the correct value. If you however are using a package, it’s usually recommended to hardcode the name of your package there.

    For example if your application is defined in `yourapplication/app.py` you should create it with one of the two versions below:

    ```python
    app = Flask('yourapplication')
    app = Flask(__name__.split('.')[0])
    ```

    Why is that? The application will work even with `__name__`, thanks to how resources are looked up. However it will make debugging more painful. Certain extensions can make assumptions based on the import name of your application. For example the Flask-SQLAlchemy extension will look for the code in your application that triggered an SQL query in debug mode. If the import name is not properly set up, that debugging information is lost. (For example it would only pick up SQL queries in `yourapplication.app` and not `yourapplication.views.frontend`)
    :::

    ::: details Changelog
    *New in version 1.0*: The `host_matching` and `static_host` parameters were added.

    *New in version 1.0*: The `subdomain_matching` parameter was added. Subdomain matching needs to be enabled manually now. Setting `SERVER_NAME` does not implicitly enable it.

    *New in version 0.11*: The root_path parameter was added.

    *New in version 0.8*: The `instance_path` and `instance_relative_config` parameters were added.

    *New in version 0.7*: The `static_url_path`, `static_folder`, and `template_folder` parameters were added.
    :::

    - *Parameters*:

        - `import_name (str)` – the name of the application package

        - `static_url_path (str | None)` – can be used to specify a different path for the static files on the web. Defaults to the name of the `static_folder` folder.

        - `static_folder (str | os.PathLike | None)` – The folder with static files that is served at `static_url_path`. Relative to the application `root_path` or an absolute path. Defaults to `'static'`.

        - `static_host (str | None)` – the host to use when adding the static route. Defaults to None. Required when using `host_matching=True` with a `static_folder` configured.

        - `host_matching (bool)` – set `url_map.host_matching` attribute. Defaults to `False`.

        - `subdomain_matching (bool)` – consider the subdomain relative to `SERVER_NAME` when matching routes. Defaults to `False`.

        - `template_folder (str | os.PathLike | None)` – the folder that contains the templates that should be used by the application. Defaults to `'templates'` folder in the root path of the application.

        - `instance_path (str | None)` – An alternative instance path for the application. By default the folder `'instance'` next to the package or module is assumed to be the instance path.

        - `instance_relative_config (bool)` – if set to `True` relative filenames for loading the config are assumed to be relative to the instance path instead of the application root.

        - `root_path (str | None)` – The path to the root of the application files. This should only be set manually when it can’t be detected automatically, such as for namespace packages.

    - #### aborter

        An instance of `aborter_class` created by `make_aborter()`. This is called by `flask.abort()` to raise HTTP errors, and can be called directly as well.

        ::: details Changelog
        *New in version 2.2*: Moved from `flask.abort`, which calls this object.
        :::

    - #### aborter_class

        alias of `Aborter`

    - #### add_template_filter(`f, name=None`)

        Register a custom template filter. Works exactly like the `template_filter()` decorator.

        *Parameters*:

        - `name (str | None)` – the optional name of the filter, otherwise the function name will be used.

        - `f (Callable[[...], Any])` –

        *Return type*: `None`

    - #### add_template_global(`f, name=None`)

        Register a custom template global function. Works exactly like the `template_global()` decorator.

        ::: details Changelog
        *New in version 0.10.*
        :::

        *Parameters*:

        - `name (str | None)` – the optional name of the global function, otherwise the function name will be used.

        - `f (Callable[[...], Any])` –

        *Return type*: `None`

    - #### add_template_test(`f, name=None`)

        Register a custom template test. Works exactly like the `template_test()` decorator.

        ::: details Changelog
        *New in version 0.10.*
        :::

        *Parameters*:

        - `name (str | None)` – the optional name of the test, otherwise the function name will be used.

        - `f (Callable[[...], bool])` –

        *Return type*: `None`

    - #### add_url_rule(`rule, endpoint=None, view_func=None, provide_automatic_options=None, **options`)

        Register a rule for routing incoming requests and building URLs. The `route()` decorator is a shortcut to call this with the `view_func` argument. These are equivalent:

        ```python
        @app.route("/")
        def index():
            ...
        ```

        ```python
        def index():
            ...

        app.add_url_rule("/", view_func=index)
        ```

        See [URL Route Registrations](https://flask.palletsprojects.com/en/2.3.x/api/#url-route-registrations).

        The endpoint name for the route defaults to the name of the view function if the `endpoint` parameter isn’t passed. An error will be raised if a function has already been registered for the endpoint.

        The `methods` parameter defaults to `["GET"]`. `HEAD` is always added automatically, and `OPTIONS` is added automatically by default.

        `view_func` does not necessarily need to be passed, but if the rule should participate in routing an endpoint name must be associated with a view function at some point with the `endpoint()` decorator.

        ```python
        app.add_url_rule("/", endpoint="index")

        @app.endpoint("index")
        def index():
            ...
        ```

        If `view_func` has a `required_methods` attribute, those methods are added to the passed and automatic methods. If it has a `provide_automatic_methods` attribute, it is used as the default if the parameter is not passed.

        *Parameters*:

        - `rule (str)` – The URL rule string.

        - `endpoint (str | None)` – The endpoint name to associate with the rule and view function. Used when routing and building URLs. Defaults to `view_func.__name__`.

        - `view_func (ft.RouteCallable | None)` – The view function to associate with the endpoint name.

        - `provide_automatic_options (bool | None)` – Add the `OPTIONS` method and respond to `OPTIONS` requests automatically.

        - `options (t.Any)` – Extra options passed to the `Rule` object.

        *Return type*: `None`

    - #### after_request(`f`)

        Register a function to run after each request to this object.

        The function is called with the response object, and must return a response object. This allows the functions to modify or replace the response before it is sent.

        If a function raises an exception, any remaining `after_request` functions will not be called. Therefore, this should not be used for actions that must execute, such as to close resources. Use `teardown_request()` for that.

        This is available on both app and blueprint objects. When used on an app, this executes after every request. When used on a blueprint, this executes after every request that the blueprint handles. To register with a blueprint and execute after every request, use `Blueprint.after_app_request()`.

        *Parameters*:

        - `f (T_after_request)` –

        *Return type*: `T_after_request`

    - #### after_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.AfterRequestCallable]]`

        A data structure of functions to call at the end of each request, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `after_request()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### app_context()

        Create an `AppContext`. Use as a `with` block to push the context, which will make `current_app` point at this application.

        An application context is automatically pushed by `RequestContext.push()` when handling a request, and when running a CLI command. Use this to manually create a context outside of these situations.

        ```python
        with app.app_context():
            init_db()
        ```

        See [The Application Context](https://flask.palletsprojects.com/en/2.3.x/appcontext/).

        ::: details Changelog
        *New in version 0.9.*
        :::

        *Return type*: `AppContext`

    - #### app_ctx_globals_class

        alias of `_AppCtxGlobals`

    - #### async_to_sync(`func`)

        Return a sync function that will run the coroutine function.

        ```python
        result = app.async_to_sync(func)(*args, **kwargs)
        ```

        Override this method to change how the app converts async code to be synchronously callable.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `func (Callable[[...], Coroutine])` –

        *Return type*: `Callable[[…], Any]`

    - #### auto_find_instance_path()

        Tries to locate the instance path if it was not provided to the constructor of the application class. It will basically calculate the path to a folder named `instance` next to your main file or the package.

        ::: details Changelog
        *New in version 0.8.*
        :::

        *Return type*: `str`

    - #### before_request(`f`)

        Register a function to run before each request.

        For example, this can be used to open a database connection, or to load the logged in user from the session.

        ```python
        @app.before_request
        def load_user():
            if "user_id" in session:
                g.user = db.session.get(session["user_id"])
        ```

        The function will be called without any arguments. If it returns a non-`None` value, the value is handled as if it was the return value from the view, and further request handling is stopped.

        This is available on both app and blueprint objects. When used on an app, this executes before every request. When used on a blueprint, this executes before every request that the blueprint handles. To register with a blueprint and execute before every request, use `Blueprint.before_app_request()`.

        *Parameters*:

        - `f (T_before_request)` –

        *Return type*: `T_before_request`

    - #### before_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.BeforeRequestCallable]]`

        A data structure of functions to call at the beginning of each request, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `before_request()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### blueprints: `dict[str, Blueprint]`

        Maps registered blueprint names to blueprint objects. The dict retains the order the blueprints were registered in. Blueprints can be registered multiple times, this dict does not track how often they were attached.

        ::: details Changelog
        *New in version 0.7.*
        :::

    - #### cli

        The Click command group for registering CLI commands for this object. The commands are available from the `flask` command once the application has been discovered and blueprints have been registered.

    - #### config

        The configuration dictionary as `Config`. This behaves exactly like a regular dictionary but supports additional methods to load a config from files.

    - #### config_class

        alias of `Config`

    - #### context_processor(`f`)

        Registers a template context processor function. These functions run before rendering a template. The keys of the returned dict are added as variables available in the template.

        This is available on both app and blueprint objects. When used on an app, this is called for every rendered template. When used on a blueprint, this is called for templates rendered from the blueprint’s views. To register with a blueprint and affect every template, use `Blueprint.app_context_processor()`.

        *Parameters*:

        - `f (T_template_context_processor)` –

        *Return type*: `T_template_context_processor`

    - #### create_global_jinja_loader()

        Creates the loader for the Jinja2 environment. Can be used to override just the loader and keeping the rest unchanged. It’s discouraged to override this function. Instead one should override the `jinja_loader()` function instead.

        The global loader dispatches between the loaders of the application and the individual blueprints.

        ::: details Changelog
        *New in version 0.7.*
        :::

        *Return type*: `DispatchingJinjaLoader`

    - #### create_jinja_environment()

        Create the Jinja environment based on `jinja_options` and the various Jinja-related methods of the app. Changing `jinja_options` after this will have no effect. Also adds Flask-related globals and filters to the environment.

        ::: details Changelog
        *Changed in version 0.11*: `Environment.auto_reload` set in accordance with `TEMPLATES_AUTO_RELOAD` configuration option.

        *New in version 0.5.*
        :::

        *Return type*: `Environment`

    - #### create_url_adapter(`request`)

        Creates a URL adapter for the given request. The URL adapter is created at a point where the request context is not yet set up so the request is passed explicitly.

        ::: details Changelog
        *Changed in version 1.0*: `SERVER_NAME` no longer implicitly enables subdomain matching. Use `subdomain_matching` instead.

        *Changed in version 0.9*: This can now also be called without a request object when the URL adapter is created for the application context.

        *New in version 0.6.*
        :::

        *Parameters*:

        - `request (Request | None)` –

        *Return type*: `MapAdapter | None`

    - #### `property` debug: `bool`

        Whether debug mode is enabled. When using `flask run` to start the development server, an interactive debugger will be shown for unhandled exceptions, and the server will be reloaded when code changes. This maps to the `DEBUG` config key. It may not behave as expected if set late.

        Do not enable debug mode when deploying in production.

        *Default*: `False`

    - #### default_config = `{'APPLICATION_ROOT': '/', 'DEBUG': None, 'EXPLAIN_TEMPLATE_LOADING': False, 'MAX_CONTENT_LENGTH': None, 'MAX_COOKIE_SIZE': 4093, 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(days=31), 'PREFERRED_URL_SCHEME': 'http', 'PROPAGATE_EXCEPTIONS': None, 'SECRET_KEY': None, 'SEND_FILE_MAX_AGE_DEFAULT': None, 'SERVER_NAME': None, 'SESSION_COOKIE_DOMAIN': None, 'SESSION_COOKIE_HTTPONLY': True, 'SESSION_COOKIE_NAME': 'session', 'SESSION_COOKIE_PATH': None, 'SESSION_COOKIE_SAMESITE': None, 'SESSION_COOKIE_SECURE': False, 'SESSION_REFRESH_EACH_REQUEST': True, 'TEMPLATES_AUTO_RELOAD': None, 'TESTING': False, 'TRAP_BAD_REQUEST_ERRORS': None, 'TRAP_HTTP_EXCEPTIONS': False, 'USE_X_SENDFILE': False}`

        Default configuration parameters.

    - #### delete(`rule, **options`)

        Shortcut for `route()` with `methods=["DELETE"]`.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `rule (str)` –

        - `options (Any)` –

        *Return type*: `Callable[[T_route], T_route]`

    - #### dispatch_request()

        Does the request dispatching. Matches the URL and returns the return value of the view or error handler. This does not have to be a response object. In order to convert the return value to a proper response object, call `make_response()`.

        ::: details Changelog
        *Changed in version 0.7*: This no longer does the exception handling, this code was moved to the new `full_dispatch_request()`.
        :::

        *Return type*: `ft.ResponseReturnValue`

    - #### do_teardown_appcontext(`exc=<object object>`)

        Called right before the application context is popped.

        When handling a request, the application context is popped after the request context. See `do_teardown_request()`.

        This calls all functions decorated with `teardown_appcontext()`. Then the `appcontext_tearing_down` signal is sent.

        This is called by `AppContext.pop()`.

        ::: details Changelog
        *New in version 0.9.*
        :::

        *Parameters*:

        - `exc (BaseException | None)` –

        *Return type*: `None`

    - #### do_teardown_request(`exc=<object object>`)

        Called after the request is dispatched and the response is returned, right before the request context is popped.

        This calls all functions decorated with `teardown_request()`, and `Blueprint.teardown_request()` if a blueprint handled the request. Finally, the `request_tearing_down` signal is sent.

        This is called by `RequestContext.pop()`, which may be delayed during testing to maintain access to resources.

        *Parameters*:

        - `exc (BaseException | None)` – An unhandled exception raised while dispatching the request. Detected from the current exception information if not passed. Passed to each teardown function.

        *Return type*: `None`

        ::: details Changelog
        *Changed in version 0.9*: Added the `exc` argument.
        :::

    - #### endpoint(`endpoint`)

        Decorate a view function to register it for the given endpoint. Used if a rule is added without a `view_func` with `add_url_rule()`.

        ```python
        app.add_url_rule("/ex", endpoint="example")

        @app.endpoint("example")
        def example():
            ...
        ```

        *Parameters*:

        - `endpoint (str)` – The endpoint name to associate with the view function.

        *Return type*: `Callable[[F], F]`

    - #### ensure_sync(`func`)

        Ensure that the function is synchronous for WSGI workers. Plain `def` functions are returned as-is. `async def` functions are wrapped to run and wait for the response.

        Override this method to change how the app runs async views.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `func (Callable)` –

        *Return type*: `Callable`

    - #### error_handler_spec: `dict[ft.AppOrBlueprintKey, dict[int | None, dict[type[Exception], ft.ErrorHandlerCallable]]]`

        A data structure of registered error handlers, in the format `{scope: {code: {class: handler}}}`. The `scope` key is the name of a blueprint the handlers are active for, or `None` for all requests. The `code` key is the HTTP status code for `HTTPException`, or `None` for other exceptions. The innermost dictionary maps exception classes to handler functions.

        To register an error handler, use the `errorhandler()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### errorhandler(`code_or_exception`)

        Register a function to handle errors by code or exception class.

        A decorator that is used to register a function given an error code. Example:

        ```python
        @app.errorhandler(404)
        def page_not_found(error):
            return 'This page does not exist', 404
        ```

        You can also register handlers for arbitrary exceptions:

        ```python
        @app.errorhandler(DatabaseError)
        def special_exception_handler(error):
            return 'Database connection failed', 500
        ```

        This is available on both app and blueprint objects. When used on an app, this can handle errors from every request. When used on a blueprint, this can handle errors from requests that the blueprint handles. To register with a blueprint and affect every request, use `Blueprint.app_errorhandler()`.

        ::: details Changelog
        *New in version 0.7*: Use `register_error_handler()` instead of modifying `error_handler_spec` directly, for application wide error handlers.

        *New in version 0.7*: One can now additionally also register custom exception types that do not necessarily have to be a subclass of the `HTTPException` class.
        :::

        *Parameters*:

        - `code_or_exception (type[Exception] | int)` – the code as integer for the handler, or an arbitrary exception

        *Return type*: `Callable[[T_error_handler], T_error_handler]`

    - #### extensions: `dict`

        a place where extensions can store application specific state. For example this is where an extension could store database engines and similar things.

        The key must match the name of the extension module. For example in case of a “Flask-Foo” extension in `flask_foo`, the key would be `'foo'`.

        ::: details Changelog
        *New in version 0.7.*
        :::

    - #### full_dispatch_request()

        Dispatches the request and on top of that performs request pre and postprocessing as well as HTTP exception catching and error handling.

        ::: details Changelog
        *New in version 0.7.*
        :::

        *Return type*: `Response`

    - #### get(`rule, **options`)

        Shortcut for `route()` with `methods=["GET"]`.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `rule (str)` –

        - `options (Any)` –

        *Return type*: `Callable[[T_route], T_route]`

    - #### get_send_file_max_age(`filename`)

        Used by `send_file()` to determine the `max_age` cache value for a given file path if it wasn’t passed.

        By default, this returns `SEND_FILE_MAX_AGE_DEFAULT` from the configuration of `current_app`. This defaults to `None`, which tells the browser to use conditional requests instead of a timed cache, which is usually preferable.

        ::: details Changelog
        *Changed in version 2.0*: The default configuration is `None` instead of 12 hours.

        New in version 0.9.
        :::

        *Parameters*:

        - `filename (str | None)` –

        *Return type*: `int | None`

    - #### `property` got_first_request: `bool`

        This attribute is set to `True` if the application started handling the first request.

        *Deprecated since version 2.3*: Will be removed in Flask 2.4.

        ::: details Changelog
        *New in version 0.8.*
        :::

    - #### handle_exception(`e`)

        Handle an exception that did not have an error handler associated with it, or that was raised from an error handler. This always causes a 500 `InternalServerError`.

        Always sends the `got_request_exception` signal.

        If `PROPAGATE_EXCEPTIONS` is `True`, such as in debug mode, the error will be re-raised so that the debugger can display it. Otherwise, the original exception is logged, and an `InternalServerError` is returned.

        If an error handler is registered for `InternalServerError` or `500`, it will be used. For consistency, the handler will always receive the `InternalServerError`. The original unhandled exception is available as `e.original_exception`.

        ::: details Changelog
        *Changed in version 1.1.0*: Always passes the `InternalServerError` instance to the handler, setting `original_exception` to the unhandled error.

        *Changed in version 1.1.0*: `after_request` functions and other finalization is done even for the default 500 response when there is no handler.

        *New in version 0.3.*
        :::

        *Parameters*:

        - `e (Exception)` –

        *Return type*: `Response`

    - #### handle_http_exception(`e`)

        Handles an HTTP exception. By default this will invoke the registered error handlers and fall back to returning the exception as response.

        ::: details Changelog
        *Changed in version 1.0.3*: `RoutingException`, used internally for actions such as slash redirects during routing, is not passed to error handlers.

        *Changed in version 1.0*: Exceptions are looked up by code and by MRO, so `HTTPException` subclasses can be handled with a catch-all handler for the base `HTTPException`.

        *New in version 0.3.*
        :::

        *Parameters*: 

        - `e (HTTPException)` –

        *Return type*: `HTTPException | ft.ResponseReturnValue`

    - #### handle_url_build_error(`error, endpoint, values`)

        Called by `url_for()` if a `BuildError` was raised. If this returns a value, it will be returned by `url_for`, otherwise the error will be re-raised.

        Each function in `url_build_error_handlers` is called with `error`, `endpoint` and `values`. If a function returns `None` or raises a `BuildError`, it is skipped. Otherwise, its return value is returned by `url_for`.

        *Parameters*:

        - `error (BuildError)` – The active `BuildError` being handled.

        - `endpoint (str)` – The endpoint being built.

        - `values (dict[str, Any])` – The keyword arguments passed to `url_for`.

        *Return type*: `str`

    - #### handle_user_exception(`e`)

        This method is called whenever an exception occurs that should be handled. A special case is `HTTPException` which is forwarded to the `handle_http_exception()` method. This function will either return a response value or reraise the exception with the same traceback.

        ::: details Changelog
        *Changed in version 1.0*: Key errors raised from request data like `form` show the bad key in debug mode rather than a generic bad request message.

        *New in version 0.7.*
        :::

        *Parameters*:

        - `e (Exception)` –

        *Return type*: `HTTPException | ft.ResponseReturnValue`

    - #### `property` has_static_folder: `bool`

        `True` if `static_folder` is set.

        ::: details Changelog
        *New in version 0.5.*
        :::

    - #### import_name

        The name of the package or module that this object belongs to. Do not change this once it is set by the constructor.

    - #### inject_url_defaults(`endpoint, values`)

        Injects the URL defaults for the given endpoint directly into the values dictionary passed. This is used internally and automatically called on URL building.

        ::: details Changelog
        *New in version 0.7.*
        :::

        *Parameters*:

        - `endpoint (str)` –

        - `values (dict)` –

        *Return type*: `None`

    - #### instance_path

        Holds the path to the instance folder.

        ::: details Changelog
        *New in version 0.8.*
        :::

    - #### iter_blueprints()

        Iterates over all blueprints by the order they were registered.

        ::: details Changelog
        *New in version 0.11.*
        :::

        *Return type*: `t.ValuesView[Blueprint]`

    - #### `property` jinja_env: `Environment`

        The Jinja environment used to load templates.

        The environment is created the first time this property is accessed. Changing `jinja_options` after that will have no effect.

    - #### jinja_environment

        alias of `Environment`

    - #### `property` jinja_loader: `FileSystemLoader | None`

        The Jinja loader for this object’s templates. By default this is a class `jinja2.loaders.FileSystemLoader` to `template_folder` if it is set.

        ::: details Changelog
        *New in version 0.5.*
        :::

    - #### jinja_options: `dict = {}`

        Options that are passed to the Jinja environment in `create_jinja_environment()`. Changing these options after the environment is created (accessing `jinja_env`) will have no effect.

        ::: details Changelog
        *Changed in version 1.1.0*: This is a `dict` instead of an `ImmutableDict` to allow easier configuration.
        :::

    - #### json: `JSONProvider`

        Provides access to JSON methods. Functions in `flask.json` will call methods on this provider when the application context is active. Used for handling JSON requests and responses.

        An instance of `json_provider_class`. Can be customized by changing that attribute on a subclass, or by assigning to this attribute afterwards.

        The default, `DefaultJSONProvider`, uses Python’s built-in `json` library. A different provider can use a different JSON library.

        ::: details Changelog
        *New in version 2.2.*
        :::

    - #### json_provider_class

        alias of `DefaultJSONProvider`

    - #### log_exception(`exc_info`)

        Logs an exception. This is called by `handle_exception()` if debugging is disabled and right before the handler is called. The default implementation logs the exception as error on the `logger`.

        ::: details Changelog
        *New in version 0.8.*
        :::

        *Parameters*:

        - `exc_info (tuple[type, BaseException, traceback] | tuple[None, None, None])` –

        *Return type*: `None`

    - #### `property` logger: `Logger`

        A standard Python `Logger` for the app, with the same name as `name`.

        In debug mode, the logger’s `level` will be set to `DEBUG`.

        If there are no handlers configured, a default handler will be added. See `Logging` for more information.

        ::: details Changelog
        *Changed in version 1.1.0*: The logger takes the same name as `name` rather than hard-coding `"flask.app"`.

        *Changed in version 1.0.0*: Behavior was simplified. The logger is always named `"flask.app"`. The level is only set during configuration, it doesn’t check `app.debug` each time. Only one format is used, not different ones depending on `app.debug`. No handlers are removed, and a handler is only added if no handlers are already configured.

        *New in version 0.3.*
        :::

    - #### make_aborter()

        Create the object to assign to `aborter`. That object is called by `flask.abort()` to raise HTTP errors, and can be called directly as well.

        By default, this creates an instance of `aborter_class`, which defaults to `werkzeug.exceptions.Aborter`.

        ::: details Changelog
        *New in version 2.2.*
        :::

        *Return type*: `Aborter`

    - #### make_config(`instance_relative=False`)

        Used to create the config attribute by the Flask constructor. The `instance_relative` parameter is passed in from the constructor of Flask (there named `instance_relative_config`) and indicates if the config should be relative to the instance path or the root path of the application.

        ::: details Changelog
        *New in version 0.8.*
        :::

        *Parameters*:

        - `instance_relative (bool)` –

        *Return type*: `Config`

    - #### make_default_options_response()

        This method is called to create the default `OPTIONS` response. This can be changed through subclassing to change the default behavior of `OPTIONS` responses.

        ::: details Changelog
        *New in version 0.7.*
        :::

        *Return type*: `Response`

    - #### make_response(`rv`)

        Convert the return value from a view function to an instance of `response_class`.

        *Parameters*:

        - `rv (ft.ResponseReturnValue)` – the return value from the view function. The view function must return a response. Returning `None`, or the view ending without returning, is not allowed. The following types are allowed for `view_rv`:

            - `str`: A response object is created with the string encoded to UTF-8 as the body.

            - `bytes`: A response object is created with the bytes as the body.

            - `dict`: A dictionary that will be jsonify’d before being returned.

            - `list`: A list that will be jsonify’d before being returned.

            - `generator` or `iterator`: A generator that returns `str` or `bytes` to be streamed as the response.

            - `tuple`: Either `(body, status, headers)`, `(body, status)`, or `(body, headers)`, where `body` is any of the other types allowed here, `status` is a string or an integer, and `headers` is a dictionary or a list of `(key, value)` tuples. If `body` is a `response_class` instance, `status` overwrites the exiting value and `headers` are extended.

            - `response_class`: The object is returned unchanged.

            - other `Response` class: The object is coerced to `response_class`.

            - `callable()`: The function is called as a WSGI application. The result is used to create a response object.

        *Return type*: `Response`

        ::: details Changelog
        *Changed in version 2.2*: A generator will be converted to a streaming response. A list will be converted to a JSON response.

        *Changed in version 1.1*: A dict will be converted to a JSON response.

        *Changed in version 0.9*: Previously a tuple was interpreted as the arguments for the response object.
        :::

    - #### make_shell_context()

        Returns the shell context for an interactive shell for this application. This runs all the registered shell context processors.

        ::: details Changelog
        *New in version 0.11.*
        :::

        *Return type*: `dict`

    - #### `property` name: `str`

        The name of the application. This is usually the import name with the difference that it’s guessed from the run file if the import name is main. This name is used as a display name when Flask needs the name of the application. It can be set and overridden to change the value.

        ::: details Changelog
        *New in version 0.8.*
        :::

    - #### open_instance_resource(`resource, mode='rb'`)

        Opens a resource from the application’s instance folder (`instance_path`). Otherwise works like `open_resource()`. Instance resources can also be opened for writing.

        *Parameters*:

        - `resource (str)` – the name of the resource. To access resources within subfolders use forward slashes as separator.

        - `mode (str)` – resource file opening mode, default is `‘rb’`.

        *Return type*: `IO`

    - #### open_resource(`resource, mode='rb'`)

        Open a resource file relative to `root_path` for reading.

        For example, if the file `schema.sql` is next to the file `app.py` where the `Flask` app is defined, it can be opened with:

        ```python
        with app.open_resource("schema.sql") as f:
            conn.executescript(f.read())
        ```

        *Parameters*:

        - `resource (str)` – Path to the resource relative to `root_path`.

        - `mode (str)` – Open the file in this mode. Only reading is supported, valid values are `“r”` (or `“rt”`) and `“rb”`.

        *Return type*: `IO`

    - #### patch(`rule, **options`)

        Shortcut for `route()` with `methods=["PATCH"]`.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `rule (str)` –

        - `options (Any)` –

        *Return type*: `Callable[[T_route], T_route]`

    - #### permanent_session_lifetime

        A `timedelta` which is used to set the expiration date of a permanent session. The default is 31 days which makes a permanent session survive for roughly one month.

        This attribute can also be configured from the config with the `PERMANENT_SESSION_LIFETIME` configuration key. Defaults to `timedelta(days=31)`

    - #### post(`rule, **options`)

        Shortcut for `route()` with `methods=["POST"]`.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `rule (str)` –

        - `options (Any)` –

        *Return type*: `Callable[[T_route], T_route]`

    - #### preprocess_request()

        Called before the request is dispatched. Calls `url_value_preprocessors` registered with the app and the current blueprint (if `any`). Then calls `before_request_funcs` registered with the app and the blueprint.

        If any `before_request()` handler returns a non-None value, the value is handled as if it was the return value from the view, and further request handling is stopped.

        *Return type*: `ft.ResponseReturnValue | None`

    - #### process_response(`response`)

        Can be overridden in order to modify the response object before it’s sent to the WSGI server. By default this will call all the `after_request()` decorated functions.

        ::: details Changelog
        *Changed in version 0.5*: As of Flask 0.5 the functions registered for after request execution are called in reverse order of registration.
        :::

        *Parameters*:

        - `response (Response)` – a `response_class` object.

        *Returns*: a new response object or the same, has to be an instance of `response_class`.

        *Return type*: `Response`

    - #### put(`rule, **options`)

        Shortcut for `route()` with `methods=["PUT"]`.

        ::: details Changelog
        *New in version 2.0.*
        :::

        *Parameters*:

        - `rule (str)` –

        - `options (Any)` –

        *Return type*: `Callable[[T_route], T_route]`

    - #### redirect(`location, code=302`)

        Create a redirect response object.

        This is called by `flask.redirect()`, and can be called directly as well.

        *Parameters*:

        - `location (str)` – The URL to redirect to.

        - `code (int)` – The status code for the redirect.

        *Return type*: `Response`

        ::: details Changelog
        *New in version 2.2*: Moved from `flask.redirect`, which calls this method.
        :::

    - #### register_blueprint(`blueprint, **options`)

        Register a `Blueprint` on the application. Keyword arguments passed to this method will override the defaults set on the blueprint.

        Calls the blueprint’s `register()` method after recording the blueprint in the application’s `blueprints`.

        *Parameters*:

        - `blueprint (Blueprint)` – The blueprint to register.

        - `url_prefix` – Blueprint routes will be prefixed with this.

        - `subdomain` – Blueprint routes will match on this subdomain.

        - `url_defaults` – Blueprint routes will use these default values for view arguments.

        - `options (t.Any)` – Additional keyword arguments are passed to `BlueprintSetupState`. They can be accessed in `record()` callbacks.

        *Return type*: `None`

        ::: details Changelog
        *Changed in version 2.0.1*: The `name` option can be used to change the (pre-dotted) name the blueprint is registered with. This allows the same blueprint to be registered multiple times with unique names for `url_for`.

        *New in version 0.7.*
        :::

    - #### register_error_handler(`code_or_exception, f`)

        Alternative error attach function to the `errorhandler()` decorator that is more straightforward to use for non decorator usage.

        ::: details Changelog
        *New in version 0.7.*
        :::

        *Parameters*:

        - `code_or_exception (type[Exception] | int)` –

        - `f (ft.ErrorHandlerCallable)` –

        *Return type*: `None`

    - #### request_class

        alias of `Request`

    - #### request_context(`environ`)

        Create a `RequestContext` representing a WSGI environment. Use a `with` block to push the context, which will make `request` point at this request.

        See [The Request Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/).

        Typically you should not call this from your own code. A request context is automatically pushed by the `wsgi_app()` when handling a request. Use `test_request_context()` to create an environment and context instead of this method.

        *Parameters*:

        - `environ (dict)` – a `WSGI` environment

        *Return type*: `RequestContext`

    - #### response_class

        alias of `Response`

    - #### root_path

        Absolute path to the package on the filesystem. Used to look up resources contained in the package.

    - #### route(`rule, **options`)

        Decorate a view function to register it with the given URL rule and options. Calls `add_url_rule()`, which has more details about the implementation.

        ```python
        @app.route("/")
        def index():
            return "Hello, World!"
        ```

        See [URL Route Registrations](https://flask.palletsprojects.com/en/2.3.x/api/#url-route-registrations).

        The endpoint name for the route defaults to the name of the view function if the `endpoint` parameter isn’t passed.

        The `methods` parameter defaults to `["GET"]`. `HEAD` and `OPTIONS` are added automatically.

        *Parameters*:

        - `rule (str)` – The URL rule string.

        - `options (Any)` – Extra options passed to the `Rule` object.

        *Return type*: `Callable[[T_route], T_route]`

    - #### run(`host=None, port=None, debug=None, load_dotenv=True, **options`)

        Runs the application on a local development server.

        Do not use `run()` in a production setting. It is not intended to meet security and performance requirements for a production server. Instead, see [Deploying to Production](https://flask.palletsprojects.com/en/2.3.x/deploying/) for WSGI server recommendations.

        If the `debug` flag is set the server will automatically reload for code changes and show a debugger in case an exception happened.

        If you want to run the application in debug mode, but disable the code execution on the interactive debugger, you can pass `use_evalex=False` as parameter. This will keep the debugger’s traceback screen active, but disable code execution.

        It is not recommended to use this function for development with automatic reloading as this is badly supported. Instead you should be using the flask command line script’s `run` support.

        ::: tip Keep in Mind
        Flask will suppress any server error with a generic error page unless it is in debug mode. As such to enable just the interactive debugger without the code reloading, you have to invoke `run()` with `debug=True` and `use_reloader=False`. Setting `use_debugger` to `True` without being in debug mode won’t catch any exceptions because there won’t be any to catch.
        :::

        *Parameters*:

        - `host (str | None)` – the hostname to listen on. Set this to `'0.0.0.0'` to have the server available externally as well. Defaults to `'127.0.0.1'` or the host in the `SERVER_NAME` config variable if present.

        - `port (int | None)` – the port of the webserver. Defaults to `5000` or the port defined in the `SERVER_NAME` config variable if present.

        - `debug (bool | None)` – if given, enable or disable debug mode. See `debug`.

        - `load_dotenv (bool)` – Load the nearest `.env` and `.flaskenv` files to set environment variables. Will also change the working directory to the directory containing the first file found.

        - `options (Any)` – the options to be forwarded to the underlying Werkzeug server. See `werkzeug.serving.run_simple()` for more information.

        *Return type*: `None`

        ::: details Changelog
        *Changed in version 1.0*: If installed, python-dotenv will be used to load environment variables from `.env` and `.flaskenv` files.

        The `FLASK_DEBUG` environment variable will override `debug`.

        Threaded mode is enabled by default.

        *Changed in version 0.10*: The default port is now picked from the `SERVER_NAME` variable.
        :::

    - #### secret_key

        If a secret key is set, cryptographic components can use this to sign cookies and other things. Set this to a complex random value when you want to use the secure cookie for instance.

        This attribute can also be configured from the config with the `SECRET_KEY` configuration key. Defaults to `None`.

    - #### select_jinja_autoescape(`filename`)

        Returns `True` if autoescaping should be active for the given template name. If no template name is given, returns `True`.

        ::: details Changelog
        *Changed in version 2.2*: Autoescaping is now enabled by default for `.svg` files.

        *New in version 0.5.*
        :::

        *Parameters*:

        - `filename (str)` –

        *Return type*: `bool`

    - send_static_file(`filename`)

        The view function used to serve files from `static_folder`. A route is automatically registered for this view at `static_url_path` if `static_folder` is set.

        ::: details Changelog
        *New in version 0.5.*
        :::

        *Parameters*:

        - `filename (str)` –

        *Return type*: `Response`

    - #### session_interface: `SessionInterface = <flask.sessions.SecureCookieSessionInterface object>`

        the session interface to use. By default an instance of `SecureCookieSessionInterface` is used here.

        ::: details Changelog
        *New in version 0.8.*
        :::

    - #### shell_context_processor(`f`)

        Registers a shell context processor function.

        ::: details Changelog
        *New in version 0.11.*
        :::

        *Parameters*:

        - `f (T_shell_context_processor)` –

        *Return type*: `T_shell_context_processor`

    - #### shell_context_processors: `list[ft.ShellContextProcessorCallable]`

        A list of shell context processor functions that should be run when a shell context is created.

        ::: details Changelog
        *New in version 0.11.*
        :::

    - #### should_ignore_error(`error`)

        This is called to figure out if an error should be ignored or not as far as the teardown system is concerned. If this function returns `True` then the teardown handlers will not be passed the error.

        ::: details Changelog
        *New in version 0.10.*
        :::

        *Parameters*:

        - `error (BaseException | None)` –

        *Return type*: `bool`

    - #### `property` static_folder: `str | None`

        The absolute path to the configured static folder. `None` if no static folder is set.

    - #### `property` static_url_path: `str | None`

        The URL prefix that the static route will be accessible from.

        If it was not configured during init, it is derived from `static_folder`.

    - #### teardown_appcontext(`f`)

        Registers a function to be called when the application context is popped. The application context is typically popped after the request context for each request, at the end of CLI commands, or after a manually pushed context ends.

        ```python
        with app.app_context():
            ...
        ```

        When the `with` block exits (or `ctx.pop()` is called), the teardown functions are called just before the app context is made inactive. Since a request context typically also manages an application context it would also be called when you pop a request context.

        When a teardown function was called because of an unhandled exception it will be passed an error object. If an `errorhandler()` is registered, it will handle the exception and the teardown will not receive it.

        Teardown functions must avoid raising exceptions. If they execute code that might fail they must surround that code with a `try/except` block and log any errors.

        The return values of teardown functions are ignored.

        ::: details Changelog
        *New in version 0.9.*
        :::

        *Parameters*:

        - `f (T_teardown)` –

        *Return type*: `T_teardown`

        - teardown_appcontext_funcs: `list[ft.TeardownCallable]`

        A list of functions that are called when the application context is destroyed. Since the application context is also torn down if the request ends this is the place to store code that disconnects from databases.

        ::: details Changelog
        *New in version 0.9.*
        :::

    - #### teardown_request(`f`)

        Register a function to be called when the request context is popped. Typically this happens at the end of each request, but contexts may be pushed manually as well during testing.

        ```python
        with app.test_request_context():
            ...
        ```

        When the `with` block exits (or `ctx.pop()` is called), the teardown functions are called just before the request context is made inactive.

        When a teardown function was called because of an unhandled exception it will be passed an error object. If an `errorhandler()` is registered, it will handle the exception and the teardown will not receive it.

        Teardown functions must avoid raising exceptions. If they execute code that might fail they must surround that code with a `try/except` block and log any errors.

        The return values of teardown functions are ignored.

        This is available on both app and blueprint objects. When used on an app, this executes after every request. When used on a blueprint, this executes after every request that the blueprint handles. To register with a blueprint and execute after every request, use `Blueprint.teardown_app_request()`.

        *Parameters*:

        - `f (T_teardown)` –

        *Return type*: `T_teardown`

    - #### teardown_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.TeardownCallable]]`

        A data structure of functions to call at the end of each request even if an exception is raised, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `teardown_request()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### template_context_processors: `dict[ft.AppOrBlueprintKey, list[ft.TemplateContextProcessorCallable]]`

        A data structure of functions to call to pass extra context values when rendering templates, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `context_processor()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### template_filter(`name=None`)

        A decorator that is used to register custom template filter. You can specify a name for the filter, otherwise the function name will be used. Example:

        ```python
        @app.template_filter()
        def reverse(s):
            return s[::-1]
        ```

        *Parameters*:

        - `name (str | None)` – the optional name of the filter, otherwise the function name will be used.

        *Return type*: `Callable[[T_template_filter], T_template_filter]`

    - #### template_folder

        The path to the templates folder, relative to `root_path`, to add to the template loader. `None` if templates should not be added.

    - #### template_global(`name=None`)

        A decorator that is used to register a custom template global function. You can specify a name for the global function, otherwise the function name will be used. *Example*:

        ```python
        @app.template_global()
        def double(n):
            return 2 * n
        ```

        ::: details Changelog
        *New in version 0.10.*
        :::

        *Parameters*:

        - `name (str | None)` – the optional name of the global function, otherwise the function name will be used.

        *Return type*: `Callable[[T_template_global], T_template_global]`

    - #### template_test(`name=None`)

        A decorator that is used to register custom template test. You can specify a name for the test, otherwise the function name will be used. Example:

        ```python
        @app.template_test()
        def is_prime(n):
            if n == 2:
                return True
            for i in range(2, int(math.ceil(math.sqrt(n))) + 1):
                if n % i == 0:
                    return False
            return True
        ```

        ::: details Changelog
        *New in version 0.10.*
        :::

        *Parameters*:

        - `name (str | None)` – the optional name of the test, otherwise the function name will be used.

        *Return type*: `Callable[[T_template_test], T_template_test]`

    - #### test_cli_runner(`**kwargs`)

        Create a CLI runner for testing CLI commands. See [Running Commands with the CLI Runner](https://flask.palletsprojects.com/en/2.3.x/testing/#testing-cli).

        Returns an instance of `test_cli_runner_class`, by default `FlaskCliRunner`. The Flask app object is passed as the first argument.

        ::: details Changelog
        *New in version 1.0.*
        :::

        *Parameters*:

        - `kwargs (t.Any)` –

        *Return type*: `FlaskCliRunner`

    - #### test_cli_runner_class: `type[FlaskCliRunner] | None = None`

        The `CliRunner` subclass, by default `FlaskCliRunner` that is used by `test_cli_runner()`. Its `__init__` method should take a `Flask` app object as the first argument.

        ::: details Changelog
        *New in version 1.0.*
        :::

    - #### test_client(`use_cookies=True, **kwargs`)

        Creates a test client for this application. For information about unit testing head over to [Testing Flask Applications](https://flask.palletsprojects.com/en/2.3.x/testing/).

        Note that if you are testing for assertions or exceptions in your application code, you must set `app.testing = True` in order for the exceptions to propagate to the test client. Otherwise, the exception will be handled by the application (not visible to the test client) and the only indication of an `AssertionError` or other exception will be a 500 status code response to the test client. See the `testing` attribute. For example:

        ```python
        app.testing = True
        client = app.test_client()
        ```

        The test client can be used in a `with` block to defer the closing down of the context until the end of the `with` block. This is useful if you want to access the context locals for testing:

        ```python
        with app.test_client() as c:
            rv = c.get('/?vodka=42')
            assert request.args['vodka'] == '42'
        ```

        Additionally, you may pass optional keyword arguments that will then be passed to the application’s `test_client_class` constructor. For example:

        ```python
        from flask.testing import FlaskClient

        class CustomClient(FlaskClient):
            def __init__(self, *args, **kwargs):
                self._authentication = kwargs.pop("authentication")
                super(CustomClient,self).__init__( *args, **kwargs)

        app.test_client_class = CustomClient
        client = app.test_client(authentication='Basic ....')
        ```

        See `FlaskClient` for more information.

        ::: details Changelog
        *Changed in version 0.11*: Added `**kwargs` to support passing additional keyword arguments to the constructor of `test_client_class`.

        *New in version 0.7*: The use_cookies parameter was added as well as the ability to override the client to be used by setting the `test_client_class` attribute.

        *Changed in version 0.4*: added support for `with` block usage for the client.
        :::

        *Parameters*:

        - `use_cookies (bool)` –

        - `kwargs (t.Any)` –

        *Return type*: `FlaskClient`

    - #### test_client_class: `type[FlaskClient] | None = None`

        The `test_client()` method creates an instance of this test client class. Defaults to `FlaskClient`.

        ::: details Changelog
        *New in version 0.7.*
        :::

    - #### test_request_context(`*args, **kwargs`)

        Create a `RequestContext` for a WSGI environment created from the given values. This is mostly useful during testing, where you may want to run a function that uses request data without dispatching a full request.

        See [The Request Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/).

        Use a `with` block to push the context, which will make `request` point at the request for the created environment.

        ```python
        with app.test_request_context(...):
            generate_report()
        ```

        When using the shell, it may be easier to push and pop the context manually to avoid indentation.

        ```python
        ctx = app.test_request_context(...)
        ctx.push()
        ...
        ctx.pop()
        ```

        Takes the same arguments as Werkzeug’s `EnvironBuilder`, with some defaults from the application. See the linked Werkzeug docs for most of the available arguments. Flask-specific behavior is listed here.

        *Parameters*:

        - `path` – URL path being requested.

        - `base_url` – Base URL where the app is being served, which `path` is relative to. If not given, built from `PREFERRED_URL_SCHEME`, `subdomain`, `SERVER_NAME`, and `APPLICATION_ROOT`.

        - `subdomain` – Subdomain name to append to `SERVER_NAME`.

        - `url_scheme` – Scheme to use instead of `PREFERRED_URL_SCHEME`.

        - `data` – The request body, either as a string or a dict of form keys and values.

        - `json` – If given, this is serialized as JSON and passed as `data`. Also defaults `content_type` to `application/json`.

        - `args (Any)` – other positional arguments passed to `EnvironBuilder`.

        - `kwargs (Any)` – other keyword arguments passed to `EnvironBuilder`.

        *Return type*: `RequestContext`

    - #### testing

        The testing flag. Set this to `True` to enable the test mode of Flask extensions (and in the future probably also Flask itself). For example this might activate test helpers that have an additional runtime cost which should not be enabled by default.

        If this is enabled and `PROPAGATE_EXCEPTIONS` is not changed from the default it’s implicitly enabled.

        This attribute can also be configured from the config with the `TESTING` configuration key. Defaults to `False`.

    - #### trap_http_exception(`e`)

        Checks if an HTTP exception should be trapped or not. By default this will return `False` for all exceptions except for a bad request key error if `TRAP_BAD_REQUEST_ERRORS` is set to True. It also returns True if `TRAP_HTTP_EXCEPTIONS` is set to `True`.

        This is called for all HTTP exceptions raised by a view function. If it returns `True` for any exception the error handler for this exception is not called and it shows up as regular exception in the traceback. This is helpful for debugging implicitly raised HTTP exceptions.

        ::: details Changelog
        *Changed in version 1.0*: Bad request errors are not trapped by default in debug mode.

        *New in version 0.8.*
        :::

        *Parameters*:

        - `e (Exception)` –

        *Return type*: `bool`

    - #### update_template_context(`context`)

        Update the template context with some commonly used variables. This injects request, session, config and g into the template context as well as everything template context processors want to inject. Note that the as of Flask 0.6, the original values in the context will not be overridden if a context processor decides to return a value with the same key.

        *Parameters*:

        - `context (dict)` – the context as a dictionary that is updated in place to add extra variables.

        *Return type*: `None`

    - #### url_build_error_handlers: `list[t.Callable[[Exception, str, dict[str, t.Any]], str]]`

        A list of functions that are called by `handle_url_build_error()` when `url_for()` raises a `BuildError`. Each function is called with `error`, `endpoint` and `values`. If a function returns `None` or raises a `BuildError`, it is skipped. Otherwise, its return value is returned by `url_for`.

        ::: details Changelog
        *New in version 0.9.*
        :::

    - #### url_default_functions: `dict[ft.AppOrBlueprintKey, list[ft.URLDefaultCallable]]`

        A data structure of functions to call to modify the keyword arguments when generating URLs, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `url_defaults()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### url_defaults(`f`)

        Callback function for URL defaults for all view functions of the application. It’s called with the endpoint and values and should update the values passed in place.

        This is available on both app and blueprint objects. When used on an app, this is called for every request. When used on a blueprint, this is called for requests that the blueprint handles. To register with a blueprint and affect every request, use `Blueprint.app_url_defaults()`.

        *Parameters*:

        - `f (T_url_defaults)` –

        *Return type*: `T_url_defaults`

    - #### url_for(`endpoint, *, _anchor=None, _method=None, _scheme=None, _external=None, **values`)

        Generate a URL to the given endpoint with the given values.

        This is called by `flask.url_for()`, and can be called directly as well.

        An endpoint is the name of a URL rule, usually added with `@app.route()`, and usually the same name as the view function. A route defined in a `Blueprint` will prepend the blueprint’s name separated by a `.` to the endpoint.

        In some cases, such as email messages, you want URLs to include the scheme and domain, like `https://example.com/hello`. When not in an active request, URLs will be external by default, but this requires setting `SERVER_NAME` so Flask knows what domain to use. `APPLICATION_ROOT` and `PREFERRED_URL_SCHEME` should also be configured as needed. This config is only used when not in an active request.

        Functions can be decorated with `url_defaults()` to modify keyword arguments before the URL is built.

        If building fails for some reason, such as an unknown endpoint or incorrect values, the app’s `handle_url_build_error()` method is called. If that returns a string, that is returned, otherwise a `BuildError` is raised.

        *Parameters*:

        - `endpoint (str)` – The endpoint name associated with the URL to generate. If this starts with a ., the current blueprint name (if any) will be used.

        - `_anchor (str | None)` – If given, append this as `#anchor` to the URL.

        - `_method (str | None)` – If given, generate the URL associated with this method for the endpoint.

        - `_scheme (str | None)` – If given, the URL will have this scheme if it is external.

        - `_external (bool | None) `– If given, prefer the URL to be internal (False) or require it to be external (True). External URLs include the scheme and domain. When not in an active request, URLs are external by default.

        - `values (Any)` – Values to use for the variable parts of the URL rule. Unknown keys are appended as query string arguments, like `?a=b&c=d`.

        *Return type*: `str`

        ::: details Changelog
        *New in version 2.2*: Moved from `flask.url_for`, which calls this method.
        ::: 

    - #### url_map

        The `Map` for this instance. You can use this to change the routing converters after the class was created but before any routes are connected. Example:

        ```python
        from werkzeug.routing import BaseConverter

        class ListConverter(BaseConverter):
            def to_python(self, value):
                return value.split(',')
            def to_url(self, values):
                return ','.join(super(ListConverter, self).to_url(value)
                                for value in values)

        app = Flask(__name__)
        app.url_map.converters['list'] = ListConverter
        ```

    - #### url_map_class

        alias of `Map`

    - #### url_rule_class

        alias of `Rule`

    - #### url_value_preprocessor(`f`)

        Register a URL value preprocessor function for all view functions in the application. These functions will be called before the `before_request()` functions.

        The function can modify the values captured from the matched url before they are passed to the view. For example, this can be used to pop a common language code value and place it in g rather than pass it to every view.

        The function is passed the endpoint name and values dict. The return value is ignored.

        This is available on both app and blueprint objects. When used on an app, this is called for every request. When used on a blueprint, this is called for requests that the blueprint handles. To register with a blueprint and affect every request, use `Blueprint.app_url_value_preprocessor()`.

        *Parameters*:

        - `f (T_url_value_preprocessor)` –

        *Return type*: `T_url_value_preprocessor`

    - #### url_value_preprocessors: `dict[ft.AppOrBlueprintKey, list[ft.URLValuePreprocessorCallable]]`

        A data structure of functions to call to modify the keyword arguments passed to the view function, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

        To register a function, use the `url_value_preprocessor()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### view_functions: `dict[str, t.Callable]`

        A dictionary mapping endpoint names to view functions.

        To register a view function, use the `route()` decorator.

        This data structure is internal. It should not be modified directly and its format may change at any time.

    - #### wsgi_app(`environ, start_response`)

        The actual WSGI application. This is not implemented in `__call__()` so that middlewares can be applied without losing a reference to the app object. Instead of doing this:

        ```python
        app = MyMiddleware(app)
        ```

        It’s a better idea to do this instead:

        ```python
        app.wsgi_app = MyMiddleware(app.wsgi_app)
        ```

        Then you still have the original application object around and can continue to call methods on it.

        ::: details Changelog
        *Changed in version 0.7*: Teardown events for the request and app contexts are called even if an unhandled error occurs. Other events may not be called depending on when an error occurs during dispatch. See [Callbacks and Errors](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#callbacks-and-errors).
        :::

        *Parameters*:

        - `environ (dict)` – A WSGI environment.

        - `start_response (Callable)` – A callable accepting a status code, a list of headers, and an optional exception context to start the response.

        *Return type*: `Any`


