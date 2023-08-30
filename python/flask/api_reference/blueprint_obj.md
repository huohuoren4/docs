# Blueprint Objects {#blueprint-objects}

## `class` flask.Blueprint(`name, import_name, static_folder=None, static_url_path=None, template_folder=None, url_prefix=None, subdomain=None, url_defaults=None, root_path=None, cli_group=<object object>`)

Represents a blueprint, a collection of routes and other app-related functions that can be registered on a real application later.

A blueprint is an object that allows defining application functions without requiring an application object ahead of time. It uses the same decorators as `Flask`, but defers the need for an application by recording them for later registration.

Decorating a function with a blueprint creates a deferred function that is called with `BlueprintSetupState` when the blueprint is registered on an application.

See [Modular Applications with Blueprints](/python/flask/user_guide/blueprint#modular-applications-with-blueprints) for more information.

- *Parameters*:

    - `name (str)` – The name of the blueprint. Will be prepended to each endpoint name.

    - `import_name (str)` – The name of the blueprint package, usually `__name__`. This helps locate the `root_path` for the blueprint.

    - `static_folder (str | os.PathLike | None)` – A folder with static files that should be served by the blueprint’s static route. The path is relative to the blueprint’s root path. Blueprint static files are disabled by default.

    - `static_url_path (str | None)` – The url to serve static files from. Defaults to `static_folder`. If the blueprint does not have a `url_prefix`, the app’s static route will take precedence, and the blueprint’s static files won’t be accessible.

    - `template_folder (str | os.PathLike | None)` – A folder with templates that should be added to the app’s template search path. The path is relative to the blueprint’s root path. Blueprint templates are disabled by default. Blueprint templates have a lower precedence than those in the app’s templates folder.

    - `url_prefix (str | None)` – A path to prepend to all of the blueprint’s URLs, to make them distinct from the rest of the app’s routes.

    - `subdomain (str | None)` – A subdomain that blueprint routes will match on by default.

    - `url_defaults (dict | None)` – A dict of default values that blueprint routes will receive by default.

    - `root_path (str | None)` – By default, the blueprint will automatically set this based on `import_name`. In certain situations this automatic detection can fail, so the path can be specified manually instead.

    - `cli_group (str | None)` –

::: details Changelog
*Changed in version 1.1.0*: Blueprints have a `cli` group to register nested CLI commands. The `cli_group` parameter controls the name of the group under the `flask` command.

*New in version 0.7.*
:::

- ### add_app_template_filter(`f, name=None`)

    Register a template filter, available in any template rendered by the application. Works like the `app_template_filter()` decorator. Equivalent to `Flask.add_template_filter()`.

    *Parameters*:

    - `name (str | None)` – the optional name of the filter, otherwise the function name will be used.

    - `f (Callable[[...], Any])` –

    *Return type*: `None`

- ### add_app_template_global(`f, name=None`)

    Register a template global, available in any template rendered by the application. Works like the `app_template_global()` decorator. Equivalent to `Flask.add_template_global()`.

    ::: details Changelog
    *New in version 0.10.*
    :::

    *Parameters*:

    - `name (str | None)` – the optional name of the global, otherwise the function name will be used.

    - `f (Callable[[...], Any])` –

    *Return type*: `None`

- ### add_app_template_test(`f, name=None`)

    Register a template test, available in any template rendered by the application. Works like the `app_template_test()` decorator. Equivalent to `Flask.add_template_test()`.

    ::: details Changelog
    *New in version 0.10.*
    :::

    *Parameters*:

    - `name (str | None)` – the optional name of the test, otherwise the function name will be used.

    - `f (Callable[[...], bool])` –

    *Return type*: `None`

- ### add_url_rule(`rule, endpoint=None, view_func=None, provide_automatic_options=None, **options`)

    Register a URL rule with the blueprint. See `Flask.add_url_rule()` for full documentation.

    The URL rule is prefixed with the blueprint’s URL prefix. The endpoint name, used with `url_for()`, is prefixed with the blueprint’s name.

    *Parameters*:

    - `rule (str)` –

    - `endpoint (str | None)` –

    - `view_func (ft.RouteCallable | None)` –

    - `provide_automatic_options (bool | None)` –

    - `options (t.Any)` –

    *Return type*: `None`

- ### after_app_request(`f`)

    Like `after_request()`, but after every request, not only those handled by the blueprint. Equivalent to `Flask.after_request()`.

    *Parameters*:

    - `f (T_after_request)` –

    *Return type*: `T_after_request`

- ### after_request(`f`)

    Register a function to run after each request to this object.

    The function is called with the response object, and must return a response object. This allows the functions to modify or replace the response before it is sent.

    If a function raises an exception, any remaining `after_request` functions will not be called. Therefore, this should not be used for actions that must execute, such as to close resources. Use `teardown_request()` for that.

    This is available on both app and blueprint objects. When used on an app, this executes after every request. When used on a blueprint, this executes after every request that the blueprint handles. To register with a blueprint and execute after every request, use `Blueprint.after_app_request()`.

    *Parameters*:

    - `f (T_after_request)` –

    *Return type*: `T_after_request`

- ### after_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.AfterRequestCallable]]`

    A data structure of functions to call at the end of each request, in the format `{scope: [functions]}`. The scope key is the name of a blueprint the functions are active for, or `None` for all requests.

    To register a function, use the `after_request()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### app_context_processor(`f`)

    Like `context_processor()`, but for templates rendered by every view, not only by the blueprint. Equivalent to `Flask.context_processor()`.

    *Parameters*:

    - `f (T_template_context_processor)` –

    *Return type*:
    T_template_context_processor

- ### app_errorhandler(`code`)

    Like `errorhandler()`, but for every request, not only those handled by the blueprint. Equivalent to `Flask.errorhandler()`.

    *Parameters*:

    - `code (type[Exception] | int)` –

    *Return type*: `Callable[[T_error_handler], T_error_handler]`

- ### app_template_filter(`name=None`)

    Register a template filter, available in any template rendered by the application. Equivalent to `Flask.template_filter()`.

    *Parameters*:

    - `name (str | None)` – the optional name of the filter, otherwise the function name will be used.

    *Return type*: `Callable[[T_template_filter], T_template_filter]`

- ### app_template_global(`name=None`)

    Register a template global, available in any template rendered by the application. Equivalent to `Flask.template_global()`.

    ::: details Changelog
    *New in version 0.10.*
    :::

    *Parameters*:

    - `name (str | None)` – the optional name of the global, otherwise the function name will be used.

    *Return type*: `Callable[[T_template_global], T_template_global]`

- ### app_template_test(`name=None`)

    Register a template test, available in any template rendered by the application. Equivalent to `Flask.template_test()`.

    ::: details Changelog
    *New in version 0.10.*
    :::

    *Parameters*:

    - `name (str | None)` – the optional name of the test, otherwise the function name will be used.

    *Return type*: `Callable[[T_template_test], T_template_test]`

- ### app_url_defaults(`f`)

    Like `url_defaults()`, but for every request, not only those handled by the blueprint. Equivalent to `Flask.url_defaults()`.

    *Parameters*:

    - `f (T_url_defaults)` –

    *Return type*: `T_url_defaults`

- ### app_url_value_preprocessor(`f`)

    Like `url_value_preprocessor()`, but for every request, not only those handled by the blueprint. Equivalent to `Flask.url_value_preprocessor()`.

    *Parameters*:

    - `f (T_url_value_preprocessor)` –

    *Return type*: `T_url_value_preprocessor`

- ### before_app_request(`f`)

    Like `before_request()`, but before every request, not only those handled by the blueprint. Equivalent to `Flask.before_request()`.

    *Parameters*:

    - `f (T_before_request)` –

    *Return type*: `T_before_request`

- ### before_request(`f`)

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

- ### before_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.BeforeRequestCallable]]`

    A data structure of functions to call at the beginning of each request, in the format `{scope: [functions]}`. The scope key is the name of a blueprint the functions are active for, or None for all requests.

    To register a function, use the `before_request()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### cli

    The Click command group for registering CLI commands for this object. The commands are available from the `flask` command once the application has been discovered and blueprints have been registered.

- ### context_processor(`f`)

    Registers a template context processor function. These functions run before rendering a template. The keys of the returned dict are added as variables available in the template.

    This is available on both app and blueprint objects. When used on an app, this is called for every rendered template. When used on a blueprint, this is called for templates rendered from the blueprint’s views. To register with a blueprint and affect every template, use `Blueprint.app_context_processor()`.

    *Parameters*:

    - `f (T_template_context_processor)` –

    *Return type*: `T_template_context_processor`

- ### delete(`rule, **options`)

    Shortcut for `route()` with `methods=["DELETE"]`.

    ::: details Changelog
    *New in version 2.0.*
    :::

    *Parameters*:

    - `rule (str)` –

    - `options (Any)` –

    *Return type*: `Callable[[T_route], T_route]`

- ### endpoint(`endpoint`)

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

- ### error_handler_spec: `dict[ft.AppOrBlueprintKey, dict[int | None, dict[type[Exception], ft.ErrorHandlerCallable]]]`

    A data structure of registered error handlers, in the format `{scope: {code: {class: handler}}}`. The scope key is the name of a blueprint the handlers are active for, or None for all requests. The code key is the HTTP status code for `HTTPException`, or `None` for other exceptions. The innermost dictionary maps exception classes to handler functions.

    To register an error handler, use the `errorhandler()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### errorhandler(`code_or_exception`)

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

- ### get(`rule, **options`)

    Shortcut for `route()` with `methods=["GET"]`.

    ::: details Changelog
    *New in version 2.0.*
    :::

    *Parameters*:

    - `rule (str)` –

    - `options (Any)` –

    *Return type*: `Callable[[T_route], T_route]`

- ### get_send_file_max_age(`filename`)

    Used by `send_file()` to determine the `max_age` cache value for a given file path if it wasn’t passed.

    By default, this returns `SEND_FILE_MAX_AGE_DEFAULT` from the configuration of `current_app`. This defaults to None, which tells the browser to use conditional requests instead of a timed cache, which is usually preferable.

    ::: details Changelog
    *Changed in version 2.0*: The default configuration is None instead of `12` hours.

    *New in version 0.9.*
    :::

    *Parameters*:

    - `filename (str | None)` –

    *Return type*: `int | None`

- ### `property` has_static_folder: `bool`

    `True` if `static_folder` is set.

    ::: details Changelog
    *New in version 0.5.*
    :::

- ### import_name

    The name of the package or module that this object belongs to. Do not change this once it is set by the constructor.

- ### `property` jinja_loader: `FileSystemLoader | None`

    The Jinja loader for this object’s templates. By default this is a class `jinja2.loaders.FileSystemLoader` to `template_folder` if it is set.

    ::: details Changelog
    *New in version 0.5.*
    :::

- ### make_setup_state(`app, options, first_registration=False`)

    Creates an instance of `BlueprintSetupState()` object that is later passed to the register callback functions. Subclasses can override this to return a subclass of the setup state.

    *Parameters*:

    - `app (Flask)` –

    - `options (dict)` –

    - `first_registration (bool)` –

    *Return type*: `BlueprintSetupState`

- ### open_resource(`resource, mode='rb'`)

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

- ### patch(`rule, **options`)

    Shortcut for `route()` with `methods=["PATCH"]`.

    ::: details Changelog
    *New in version 2.0.*
    :::

    *Parameters*:

    - `rule (str)` –

    - `options (Any)` –

    *Return type*: `Callable[[T_route], T_route]`

- ### post(`rule, **options`)

    Shortcut for `route()` with `methods=["POST"]`.

    ::: details Changelog
    *New in version 2.0.*
    :::

    *Parameters*:

    - rule (str) –

    - options (Any) –

    *Return type*: `Callable[[T_route], T_route]`

- ### put(`rule, **options`)

    Shortcut for `route()` with `methods=["PUT"]`.

    ::: details Changelog
    *New in version 2.0.*
    :::

    *Parameters*:

    - `rule (str)` –

    - `options (Any)` –

    *Return type*: `Callable[[T_route], T_route]`

- ### record(`func`)

    Registers a function that is called when the blueprint is registered on the application. This function is called with the state as argument as returned by the `make_setup_state()` method.

    *Parameters*:

    - `func (Callable)` –

    *Return type*: `None`

- ### record_once(`func`)

    Works like `record()` but wraps the function in another function that will ensure the function is only called once. If the blueprint is registered a second time on the application, the function passed is not called.

    *Parameters*:

    - `func (Callable)` –

    *Return type*: `None`

- ### register(`app, options`)

    Called by `Flask.register_blueprint()` to register all views and callbacks registered on the blueprint with the application. Creates a `BlueprintSetupState` and calls each `record()` callback with it.

    *Parameters*:

    - `app (Flask)` – The application this blueprint is being registered with.

    - `options (dict)` – Keyword arguments forwarded from register_blueprint().

    *Return type*: `None`

    *Changed in version 2.3*: Nested blueprints now correctly apply subdomains.

    ::: details Changelog
    *Changed in version 2.1*: Registering the same blueprint with the same name multiple times is an error.

    *Changed in version 2.0.1*: Nested blueprints are registered with their dotted name. This allows different blueprints with the same name to be nested at different locations.

    *Changed in version 2.0.1*: The `name` option can be used to change the (pre-dotted) name the blueprint is registered with. This allows the same blueprint to be registered multiple times with unique names for `url_for`.
    :::

- ### register_blueprint(`blueprint, **options`)

    Register a Blueprint on this blueprint. Keyword arguments passed to this method will override the defaults set on the blueprint.

    ::: details Changelog
    *Changed in version 2.0.1*: The `name` option can be used to change the (pre-dotted) name the blueprint is registered with. This allows the same blueprint to be registered multiple times with unique names for `url_for`.
    :::

    *Parameters*:

    - `blueprint (Blueprint)` –

    - `options (Any)` –

    *Return type*: `None`

- ### register_error_handler(`code_or_exception, f`)

    Alternative error attach function to the `errorhandler()` decorator that is more straightforward to use for non decorator usage.

    ::: details Changelog
    *New in version 0.7.*
    :::

    *Parameters*:

    - `code_or_exception (type[Exception] | int)` –

    - `f (ft.ErrorHandlerCallable)` –

    *Return type*: `None`

- ### root_path

    Absolute path to the package on the filesystem. Used to look up resources contained in the package.

- ### route(`rule, **options`)

    Decorate a view function to register it with the given URL rule and options. Calls `add_url_rule()`, which has more details about the implementation.

    ```python
    @app.route("/")
    def index():
        return "Hello, World!"
    ```

    See [URL Route Registrations](/python/flask/api_reference/url_route#url-route-registrations).

    The endpoint name for the route defaults to the name of the view function if the `endpoint` parameter isn’t passed.

    The `methods` parameter defaults to `["GET"]`. `HEAD` and `OPTIONS` are added automatically.

    *Parameters*:

    - rule (str) – The URL rule string.

    - options (Any) – Extra options passed to the `Rule` object.

    *Return type*: `Callable[[T_route], T_route]`

- ### send_static_file(`filename`)

    The view function used to serve files from `static_folder`. A route is automatically registered for this view at `static_url_path` if `static_folder` is set.

    ::: details Changelog
    *New in version 0.5.*
    :::

    *Parameters*:

    - `filename (str)` –

    *Return type*: `Response`

- ### `property` static_folder: `str | None`

    The absolute path to the configured static folder. `None` if no static folder is set.

- ### `property` static_url_path: `str | None`

    The URL prefix that the static route will be accessible from.

    If it was not configured during init, it is derived from `static_folder`.

- ### teardown_app_request(`f`)

    Like `teardown_request()`, but after every request, not only those handled by the blueprint. Equivalent to `Flask.teardown_request()`.

    *Parameters*:

    - `f (T_teardown)` –

    *Return type*: `T_teardown`

- ### teardown_request(`f`)

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

- ### teardown_request_funcs: `dict[ft.AppOrBlueprintKey, list[ft.TeardownCallable]]`

    A data structure of functions to call at the end of each request even if an exception is raised, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

    To register a function, use the `teardown_request()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### template_context_processors: `dict[ft.AppOrBlueprintKey, list[ft.TemplateContextProcessorCallable]]`

    A data structure of functions to call to pass extra context values when rendering templates, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

    To register a function, use the `context_processor()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### template_folder

    The path to the templates folder, relative to `root_path`, to add to the template loader. `None` if templates should not be added.

- ### url_default_functions: `dict[ft.AppOrBlueprintKey, list[ft.URLDefaultCallable]]`

    A data structure of functions to call to modify the keyword arguments when generating URLs, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

    To register a function, use the `url_defaults()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.

- ### url_defaults(`f`)

    Callback function for URL defaults for all view functions of the application. It’s called with the endpoint and values and should update the values passed in place.

    This is available on both app and blueprint objects. When used on an app, this is called for every request. When used on a blueprint, this is called for requests that the blueprint handles. To register with a blueprint and affect every request, use `Blueprint.app_url_defaults()`.

    *Parameters*:

    - `f (T_url_defaults)` –

    *Return type*: `T_url_defaults`

- ### url_value_preprocessor(`f`)

    Register a URL value preprocessor function for all view functions in the application. These functions will be called before the `before_request()` functions.

    The function can modify the values captured from the matched url before they are passed to the view. For example, this can be used to pop a common language code value and place it in g rather than pass it to every view.

    The function is passed the endpoint name and values dict. The return value is ignored.

    This is available on both app and blueprint objects. When used on an app, this is called for every request. When used on a blueprint, this is called for requests that the blueprint handles. To register with a blueprint and affect every request, use `Blueprint.app_url_value_preprocessor()`.

    *Parameters*:

    - `f (T_url_value_preprocessor)` –

    *Return type*: `T_url_value_preprocessor`

- ### url_value_preprocessors: `dict[ft.AppOrBlueprintKey, list[ft.URLValuePreprocessorCallable]]`

    A data structure of functions to call to modify the keyword arguments passed to the view function, in the format `{scope: [functions]}`. The `scope` key is the name of a blueprint the functions are active for, or `None` for all requests.

    To register a function, use the `url_value_preprocessor()` decorator.

    This data structure is internal. It should not be modified directly and its format may change at any time.