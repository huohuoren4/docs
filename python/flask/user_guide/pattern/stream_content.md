# Streaming Contents

Sometimes you want to send an enormous amount of data to the client, much more than you want to keep in memory. When you are generating the data on the fly though, how do you send that back to the client without the roundtrip to the filesystem?

The answer is by using generators and direct responses.

## Basic Usage

This is a basic view function that generates a lot of CSV data on the fly. The trick is to have an inner function that uses a generator to generate data and to then invoke that function and pass it to a response object:

```python
@app.route('/large.csv')
def generate_large_csv():
    def generate():
        for row in iter_all_rows():
            yield f"{','.join(row)}\n"
    return generate(), {"Content-Type": "text/csv"}
```

Each `yield` expression is directly sent to the browser. Note though that some WSGI middlewares might break streaming, so be careful there in debug environments with profilers and other things you might have enabled.

## Streaming from Templates

The `Jinja2` template engine supports rendering a template piece by piece, returning an iterator of strings. Flask provides the [stream_template()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_template) and [stream_template_string()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_template_string) functions to make this easier to use.

```python
from flask import stream_template

@app.get("/timeline")
def timeline():
    return stream_template("timeline.html")
```

The parts yielded by the render stream tend to match statement blocks in the template.

## Streaming with Context

The [request](https://flask.palletsprojects.com/en/2.3.x/api/#flask.request) will not be active while the generator is running, because the view has already returned at that point. If you try to access `request`, you’ll get a `RuntimeError`.

If your generator function relies on data in `request`, use the [stream_with_context()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_with_context) wrapper. This will keep the request context active during the generator.

```python
from flask import stream_with_context, request
from markupsafe import escape

@app.route('/stream')
def streamed_response():
    def generate():
        yield '<p>Hello '
        yield escape(request.args['name'])
        yield '!</p>'
    return stream_with_context(generate())
```

It can also be used as a decorator.

```python
@stream_with_context
def generate():
    ...

return generate()
```

The [stream_template()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_template) and [stream_template_string()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_template_string) functions automatically use [stream_with_context()](https://flask.palletsprojects.com/en/2.3.x/api/#flask.stream_with_context) if a request is active.