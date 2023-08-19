# URL Route Registrations

Generally there are three ways to define rules for the routing system:

1. You can use the `flask.Flask.route()` decorator.

2. You can use the `flask.Flask.add_url_rule()` function.

3. You can directly access the underlying `Werkzeug` routing system which is exposed as `flask.Flask.url_map`.

Variable parts in the route can be specified with angular brackets (`/user/<username>`). By default a variable part in the URL accepts any string without a slash however a different converter can be specified as well by using `<converter:name>`.

Variable parts are passed to the view function as keyword arguments.

The following converters are available:

| `string` | accepts any text without a slash (the default) |
|--------|------------------------------------------------|
| `int`    | accepts integers                               |
| `float`  | like `int` but for floating point values              |
| `path`   | like the default but also accepts slashes      |
| `any`    | matches one of the items provided              |
| `uuid`   | accepts `UUID` strings                           |


Custom converters can be defined using `flask.Flask.url_map`.

Here are some examples:

```python
@app.route('/')
def index():
    pass

@app.route('/<username>')
def show_user(username):
    pass

@app.route('/post/<int:post_id>')
def show_post(post_id):
    pass
```

An important detail to keep in mind is how Flask deals with trailing slashes. The idea is to keep each URL unique so the following rules apply:

1. If a rule ends with a slash and is requested without a slash by the user, the user is automatically redirected to the same page with a trailing slash attached.

2. If a rule does not end with a trailing slash and the user requests the page with a trailing slash, a 404 not found is raised.

This is consistent with how web servers deal with static files. This also makes it possible to use relative link targets safely.

You can also define multiple rules for the same function. They have to be unique however. Defaults can also be specified. Here for example is a definition for a URL that accepts an optional page:

```python
@app.route('/users/', defaults={'page': 1})
@app.route('/users/page/<int:page>')
def show_users(page):
    pass
```

This specifies that `/users/` will be the URL for page one and `/users/page/N` will be the URL for page N.

If a URL contains a default value, it will be redirected to its simpler form with a `301` redirect. In the above example, `/users/page/1` will be redirected to `/users/`. If your route handles `GET` and `POST` requests, make sure the default route only handles `GET`, as redirects can’t preserve form data.

```python
@app.route('/region/', defaults={'id': 1})
@app.route('/region/<int:id>', methods=['GET', 'POST'])
def region(id):
   pass
```

Here are the parameters that `route()` and `add_url_rule()` accept. The only difference is that with the route parameter the view function is defined with the decorator instead of the view_func parameter.

| `rule`      | the URL rule as string|
|-----------|---------------|
| `endpoint`  | the endpoint for the registered URL rule. Flask itself assumes that the name of the view function is the name of the endpoint if not explicitly stated. |
| `view_func` | the function to call when serving a request to the provided endpoint. If this is not provided one can specify the function later by storing it in the `view_functions` dictionary with the endpoint as key. |
| `defaults`  | A dictionary with defaults for this rule. See the example above for how defaults work.|
| `subdomain` | specifies the rule for the subdomain in case subdomain matching is in use. If not specified the default subdomain is assumed. |
| `**options` | the options to be forwarded to the underlying `Rule` object. A change to `Werkzeug` is handling of method options. methods is a list of methods this rule should be limited to (`GET`, `POST` etc.). By default a rule just listens for `GET` (and implicitly `HEAD`). Starting with `Flask 0.6`, `OPTIONS` is implicitly added and handled by the standard request handling. They have to be specified as keyword arguments. |