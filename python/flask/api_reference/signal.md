# Signals {#signals}

Signals are provided by the Blinker library. See [Signals](/python/flask/user_guide/signal#signals) for an introduction.

## flask.template_rendered

This signal is sent when a template was successfully rendered. The signal is invoked with the instance of the template as `template` and the context as dictionary (named `context`).

Example subscriber:

```python
def log_template_renders(sender, template, context, **extra):
    sender.logger.debug('Rendering template "%s" with context %s',
                        template.name or 'string template',
                        context)

from flask import template_rendered
template_rendered.connect(log_template_renders, app)
```

## flask.before_render_template

This signal is sent before template rendering process. The signal is invoked with the instance of the template as `template` and the context as dictionary (named `context`).

Example subscriber:

```python
def log_template_renders(sender, template, context, **extra):
    sender.logger.debug('Rendering template "%s" with context %s',
                        template.name or 'string template',
                        context)

from flask import before_render_template
before_render_template.connect(log_template_renders, app)
```

## flask.request_started

This signal is sent when the request context is set up, before any request processing happens. Because the request context is already bound, the subscriber can access the request with the standard global proxies such as `request`.

Example subscriber:

```python
def log_request(sender, **extra):
    sender.logger.debug('Request context is set up')

from flask import request_started
request_started.connect(log_request, app)
```

## flask.request_finished

This signal is sent right before the response is sent to the client. It is passed the response to be sent named `response`.

Example subscriber:

```python
def log_response(sender, response, **extra):
    sender.logger.debug('Request context is about to close down. '
                        'Response: %s', response)

from flask import request_finished
request_finished.connect(log_response, app)
```

## flask.got_request_exception

This signal is sent when an unhandled exception happens during request processing, including when debugging. The exception is passed to the subscriber as `exception`.

This signal is not sent for `HTTPException`, or other exceptions that have error handlers registered, unless the exception was raised from an error handler.

This example shows how to do some extra logging if a theoretical `SecurityException` was raised:

```python
from flask import got_request_exception

def log_security_exception(sender, exception, **extra):
    if not isinstance(exception, SecurityException):
        return

    security_logger.exception(
        f"SecurityException at {request.url!r}",
        exc_info=exception,
    )

got_request_exception.connect(log_security_exception, app)
```

## flask.request_tearing_down

This signal is sent when the request is tearing down. This is always called, even if an exception is caused. Currently functions listening to this signal are called after the regular teardown handlers, but this is not something you can rely on.

Example subscriber:

```python
def close_db_connection(sender, **extra):
    session.close()

from flask import request_tearing_down
request_tearing_down.connect(close_db_connection, app)
```

As of Flask 0.9, this will also be passed an exc keyword argument that has a reference to the exception that caused the teardown if there was one.

## flask.appcontext_tearing_down

This signal is sent when the app context is tearing down. This is always called, even if an exception is caused. Currently functions listening to this signal are called after the regular teardown handlers, but this is not something you can rely on.

Example subscriber:

```python
def close_db_connection(sender, **extra):
    session.close()

from flask import appcontext_tearing_down
appcontext_tearing_down.connect(close_db_connection, app)
```

This will also be passed an exc keyword argument that has a reference to the exception that caused the teardown if there was one.

## flask.appcontext_pushed

This signal is sent when an application context is pushed. The sender is the application. This is usually useful for unittests in order to temporarily hook in information. For instance it can be used to set a resource early onto the g object.

Example usage:

```python
from contextlib import contextmanager
from flask import appcontext_pushed

@contextmanager
def user_set(app, user):
    def handler(sender, **kwargs):
        g.user = user
    with appcontext_pushed.connected_to(handler, app):
        yield
And in the testcode:

def test_user_me(self):
    with user_set(app, 'john'):
        c = app.test_client()
        resp = c.get('/users/me')
        assert resp.data == 'username=john'
```

::: details Changelog
*New in version 0.10.*
:::

## flask.appcontext_popped

This signal is sent when an application context is popped. The sender is the application. This usually falls in line with the `appcontext_tearing_down` signal.

::: details Changelog
*New in version 0.10.*
:::

## flask.message_flashed

This signal is sent when the application is flashing a message. The messages is sent as message keyword argument and the category as category.

Example subscriber:

```python
recorded = []
def record(sender, message, category, **extra):
    recorded.append((message, category))

from flask import message_flashed
message_flashed.connect(record, app)
```

::: details Changelog
*New in version 0.10.*
:::

## signals.signals_available

*Deprecated since version 2.3*: Will be removed in `Flask 2.4`. Signals are always available