# Message Flashing {#message-flashing}

## flask.flash(`message, category='message'`)

Flashes a message to the next request. In order to remove the flashed message from the session and to display it to the user, the template has to call `get_flashed_messages()`.

::: details Changelog
*Changed in version 0.3*: category parameter added.
:::

*Parameters*:

- `message (str)` – the message to be flashed.

- `category (str)` – the category for the message. The following values are recommended: `'message'` for any kind of message, `'error'` for errors, `'info'` for information messages and `'warning'` for warnings. However any kind of string can be used as category.

*Return type*: `None`

## flask.get_flashed_messages(`with_categories=False, category_filter=()`)

Pulls all flashed messages from the session and returns them. Further calls in the same request to the function will return the same messages. By default just the messages are returned, but when `with_categories` is set to `True`, the return value will be a list of tuples in the form `(category, message)` instead.

Filter the flashed messages to one or more categories by providing those categories in `category_filter`. This allows rendering categories in separate html blocks. The `with_categories` and `category_filter` arguments are distinct:

`with_categories` controls whether categories are returned with message text (`True` gives a tuple, where `False` gives just the message text).

`category_filter` filters the messages down to only those matching the provided categories.

See [Message Flashing](/python/flask/user_guide/pattern/flash#message-flashing) for examples.

::: details Changelog
*Changed in version 0.9*: `category_filter` parameter added.

*Changed in version 0.3*: `with_categories` parameter added.
:::

*Parameters*:

- `with_categories (bool)` – set to True to also receive categories.

- `category_filter (Iterable[str])` – filter of categories to limit return values. Only categories in the list will be returned.

*Return type*: `list[str] | list[tuple[str, str]]`