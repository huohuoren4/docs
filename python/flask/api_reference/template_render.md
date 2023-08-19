# Template Rendering

## flask.render_template(`template_name_or_list, **context`)

Render a template by name with the given context.

*Parameters*:

- `template_name_or_list (str | Template | list[str | jinja2.environment.Template])` – The name of the template to render. If a list is given, the first name to exist will be rendered.

- `context (Any)` – The variables to make available in the template.

*Return type*: `str`

## flask.render_template_string(`source, **context`)

Render a template from the given source string with the given context.

*Parameters*:

- `source (str)` – The source code of the template to render.

- `context (Any)` – The variables to make available in the template.

*Return type*: `str`

## flask.stream_template(`template_name_or_list, **context`)

Render a template by name with the given context as a stream. This returns an iterator of strings, which can be used as a streaming response from a view.

*Parameters*:

- `template_name_or_list (str | Template | list[str | jinja2.environment.Template])` – The name of the template to render. If a list is given, the first name to exist will be rendered.

- `context (Any)` – The variables to make available in the template.

*Return type*: `Iterator[str]`

::: details Changelog
*New in version 2.2.*
:::

## flask.stream_template_string(`source, **context`)

Render a template from the given source string with the given context as a stream. This returns an iterator of strings, which can be used as a streaming response from a view.

*Parameters*:

- `source (str)` – The source code of the template to render.

- `context (Any)` – The variables to make available in the template.

*Return type*: `Iterator[str]`

::: details Changelog
*New in version 2.2.*
:::

## flask.get_template_attribute(`template_name, attribute`)

Loads a macro (or variable) a template exports. This can be used to invoke a macro from within Python code. If you for example have a template named `_cider.html` with the following contents:

```html
{% macro hello(name) %}Hello {{ name }}!{% endmacro %}
```

You can access this from Python code like this:

```python
hello = get_template_attribute('_cider.html', 'hello')
return hello('World')
```

::: details Changelog
*New in version 0.2.*
:::

*Parameters*:

- `template_name (str)` – the name of the template

- `attribute (str)` – the name of the variable of macro to access

*Return type*: `Any`