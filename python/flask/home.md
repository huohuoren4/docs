# Flask

::: tip Tip
*flask version*: `2.3.2`. Only the lastest version is maintained.

*offical doc*: [Flask](https://flask.palletsprojects.com/)
:::

Welcome to Flask’s documentation. Get started with Installation and then get an overview with the [Quickstart](https://flask.palletsprojects.com/en/2.3.x/quickstart/). There is also a more detailed [Tutorial](https://flask.palletsprojects.com/en/2.3.x/tutorial/) that shows how to create a small but complete application with Flask. Common patterns are described in the [Patterns for Flask](https://flask.palletsprojects.com/en/2.3.x/patterns/) section. The rest of the docs describe each component of Flask in detail, with a full reference in the [API](https://flask.palletsprojects.com/en/2.3.x/api/) section.

Flask depends on the [Werkzeug](https://werkzeug.palletsprojects.com/) WSGI toolkit, the [Jinja](https://jinja.palletsprojects.com/) template engine, and the [Click](https://click.palletsprojects.com/) CLI toolkit. Be sure to check their documentation as well as Flask’s when looking for information.

## User's Guide

Flask provides configuration and conventions, with sensible defaults, to get started. This section of the documentation explains the different parts of the Flask framework and how they can be used, customized, and extended. Beyond Flask itself, look for community-maintained extensions to add even more functionality.

- [Installation](https://flask.palletsprojects.com/en/2.3.x/installation/)

    - [Python Version](https://flask.palletsprojects.com/en/2.3.x/installation/#python-version)
    - [Dependencies](https://flask.palletsprojects.com/en/2.3.x/installation/#dependencies)
    - [Virtual environments](https://flask.palletsprojects.com/en/2.3.x/installation/#virtual-environments)
    - [Install Flask](https://flask.palletsprojects.com/en/2.3.x/installation/#install-flask)

- [Quickstart](https://flask.palletsprojects.com/en/2.3.x/quickstart/)

    - [A Minimal Application](https://flask.palletsprojects.com/en/2.3.x/quickstart/#a-minimal-application)
    - [Debug Mode](https://flask.palletsprojects.com/en/2.3.x/quickstart/#debug-mode)
    - [HTML Escaping](https://flask.palletsprojects.com/en/2.3.x/quickstart/#html-escaping)
    - [Routing](https://flask.palletsprojects.com/en/2.3.x/quickstart/#routing)
    - [Static Files](https://flask.palletsprojects.com/en/2.3.x/quickstart/#static-files)
    - [Rendering Templates](https://flask.palletsprojects.com/en/2.3.x/quickstart/#rendering-templates)
    - [Accessing Request Data](https://flask.palletsprojects.com/en/2.3.x/quickstart/#accessing-request-data)
    - [Redirects and Errors](https://flask.palletsprojects.com/en/2.3.x/quickstart/#redirects-and-errors)
    - [About Responses](https://flask.palletsprojects.com/en/2.3.x/quickstart/#about-responses)
    - [Sessions](https://flask.palletsprojects.com/en/2.3.x/quickstart/#sessions)
    - [Message Flashing](https://flask.palletsprojects.com/en/2.3.x/quickstart/#message-flashing)
    - [Logging](https://flask.palletsprojects.com/en/2.3.x/quickstart/#logging)
    - [Hooking in WSGI Middleware](https://flask.palletsprojects.com/en/2.3.x/quickstart/#hooking-in-wsgi-middleware)
    - [Using Flask Extensions](https://flask.palletsprojects.com/en/2.3.x/quickstart/#using-flask-extensions)
    - [Deploying to a Web Server](https://flask.palletsprojects.com/en/2.3.x/quickstart/#deploying-to-a-web-server)

- [Tutorial](https://flask.palletsprojects.com/en/2.3.x/tutorial/)

    - [Project Layout](https://flask.palletsprojects.com/en/2.3.x/tutorial/layout/)
    - [Application Setup](https://flask.palletsprojects.com/en/2.3.x/tutorial/factory/)
    - [Define and Access the Database](https://flask.palletsprojects.com/en/2.3.x/tutorial/database/)
    - [Blueprints and Views](https://flask.palletsprojects.com/en/2.3.x/tutorial/views/)
    - [Templates](https://flask.palletsprojects.com/en/2.3.x/tutorial/templates/)
    - [Static Files](https://flask.palletsprojects.com/en/2.3.x/tutorial/static/)
    - [Blog Blueprint](https://flask.palletsprojects.com/en/2.3.x/tutorial/blog/)
    - [Make the Project Installable](https://flask.palletsprojects.com/en/2.3.x/tutorial/install/)
    - [Test Coverage](https://flask.palletsprojects.com/en/2.3.x/tutorial/tests/)
    - [Deploy to Production](https://flask.palletsprojects.com/en/2.3.x/tutorial/deploy/)
    - [Keep Developing!](https://flask.palletsprojects.com/en/2.3.x/tutorial/next/)

- [Templates](https://flask.palletsprojects.com/en/2.3.x/templating/)

    - [Jinja Setup](https://flask.palletsprojects.com/en/2.3.x/templating/#jinja-setup)
    - [Standard Context](https://flask.palletsprojects.com/en/2.3.x/templating/#standard-context)
    - [Controlling Autoescaping](https://flask.palletsprojects.com/en/2.3.x/templating/#controlling-autoescaping)
    - [Registering Filters](https://flask.palletsprojects.com/en/2.3.x/templating/#registering-filters)
    - [Context Processors](https://flask.palletsprojects.com/en/2.3.x/templating/#context-processors)
    - [Streaming](https://flask.palletsprojects.com/en/2.3.x/templating/#streaming)

- [Testing Flask Applications](https://flask.palletsprojects.com/en/2.3.x/testing/)

    - [Identifying Tests](https://flask.palletsprojects.com/en/2.3.x/testing/#identifying-tests)
    - [Fixtures](https://flask.palletsprojects.com/en/2.3.x/testing/#fixtures)
    - [Sending Requests with the Test Client](https://flask.palletsprojects.com/en/2.3.x/testing/#sending-requests-with-the-test-client)
    - [Following Redirects](https://flask.palletsprojects.com/en/2.3.x/testing/#following-redirects)
    - [Accessing and Modifying the Session](https://flask.palletsprojects.com/en/2.3.x/testing/#accessing-and-modifying-the-session)
    - [Running Commands with the CLI Runner](https://flask.palletsprojects.com/en/2.3.x/testing/#running-commands-with-the-cli-runner)
    - [Tests that depend on an Active Context](https://flask.palletsprojects.com/en/2.3.x/testing/#tests-that-depend-on-an-active-context)

- [Handling Application Errors](https://flask.palletsprojects.com/en/2.3.x/errorhandling/)

    - [Error Logging Tools](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#error-logging-tools)
    - [Error Handlers](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#error-handlers)
    - [Custom Error Pages](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#custom-error-pages)
    - [Blueprint Error Handlers](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#blueprint-error-handlers)
    - [Returning API Errors as JSON](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#returning-api-errors-as-json)
    - [Logging](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#logging)
    - [Debugging](https://flask.palletsprojects.com/en/2.3.x/errorhandling/#debugging)

- [Debugging Application Errors](https://flask.palletsprojects.com/en/2.3.x/debugging/)

    - [In Production](https://flask.palletsprojects.com/en/2.3.x/debugging/#in-production)
    - [The Built-In Debugger](https://flask.palletsprojects.com/en/2.3.x/debugging/#the-built-in-debugger)
    - [External Debuggers](https://flask.palletsprojects.com/en/2.3.x/debugging/#external-debuggers)

- [Logging](https://flask.palletsprojects.com/en/2.3.x/logging/)

    - [Basic Configuration](https://flask.palletsprojects.com/en/2.3.x/logging/#basic-configuration)
    - [Email Errors to Admins](https://flask.palletsprojects.com/en/2.3.x/logging/#email-errors-to-admins)
    - [Injecting Request Information](https://flask.palletsprojects.com/en/2.3.x/logging/#injecting-request-information)
    - [Other Libraries](https://flask.palletsprojects.com/en/2.3.x/logging/#other-libraries)

- [Configuration Handling](https://flask.palletsprojects.com/en/2.3.x/config/)

    - [Configuration Basics](https://flask.palletsprojects.com/en/2.3.x/config/#configuration-basics)
    - [Debug Mode](https://flask.palletsprojects.com/en/2.3.x/config/#debug-mode)
    - [Builtin Configuration Values](https://flask.palletsprojects.com/en/2.3.x/config/#builtin-configuration-values)
    - [Configuring from Python Files](https://flask.palletsprojects.com/en/2.3.x/config/#configuring-from-python-files)
    - [Configuring from Data Files](https://flask.palletsprojects.com/en/2.3.x/config/#configuring-from-data-files)
    - [Configuring from Environment Variables](https://flask.palletsprojects.com/en/2.3.x/config/#configuring-from-environment-variables)
    - [Configuration Best Practices](https://flask.palletsprojects.com/en/2.3.x/config/#configuration-best-practices)
    - [Development / Production](https://flask.palletsprojects.com/en/2.3.x/config/#development-production)
    - [Instance Folders](https://flask.palletsprojects.com/en/2.3.x/config/#instance-folders)

- [Signals](https://flask.palletsprojects.com/en/2.3.x/signals/)

    - [Core Signals](https://flask.palletsprojects.com/en/2.3.x/signals/#core-signals)
    - [Subscribing to Signals](https://flask.palletsprojects.com/en/2.3.x/signals/#subscribing-to-signals)
    - [Creating Signals](https://flask.palletsprojects.com/en/2.3.x/signals/#creating-signals)
    - [Sending Signals](https://flask.palletsprojects.com/en/2.3.x/signals/#sending-signals)
    - [Signals and Flask’s Request Context](https://flask.palletsprojects.com/en/2.3.x/signals/#signals-and-flask-s-request-context)
    - [Decorator Based Signal Subscriptions](https://flask.palletsprojects.com/en/2.3.x/signals/#decorator-based-signal-subscriptions)

- [Class-based Views](https://flask.palletsprojects.com/en/2.3.x/views/)

    - [Basic Reusable View](https://flask.palletsprojects.com/en/2.3.x/views/#basic-reusable-view)
    - [URL Variables](https://flask.palletsprojects.com/en/2.3.x/views/#url-variables)
    - [View Lifetime and self](https://flask.palletsprojects.com/en/2.3.x/views/#view-lifetime-and-self)
    - [View Decorators](https://flask.palletsprojects.com/en/2.3.x/views/#view-decorators)
    - [Method Hints](https://flask.palletsprojects.com/en/2.3.x/views/#method-hints)
    - [Method Dispatching and APIs](https://flask.palletsprojects.com/en/2.3.x/views/#method-dispatching-and-apis)

- [Application Structure and Lifecycle](https://flask.palletsprojects.com/en/2.3.x/lifecycle/)

    - [Application Setup](https://flask.palletsprojects.com/en/2.3.x/lifecycle/#application-setup)
    - [Serving the Application](https://flask.palletsprojects.com/en/2.3.x/lifecycle/#serving-the-application)
    - [How a Request is Handled](https://flask.palletsprojects.com/en/2.3.x/lifecycle/#how-a-request-is-handled)

- [The Application Context](https://flask.palletsprojects.com/en/2.3.x/appcontext/)

    - [Purpose of the Context](https://flask.palletsprojects.com/en/2.3.x/appcontext/#purpose-of-the-context)
    - [Lifetime of the Context](https://flask.palletsprojects.com/en/2.3.x/appcontext/#lifetime-of-the-context)
    - [Manually Push a Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#manually-push-a-context)
    - [Storing Data](https://flask.palletsprojects.com/en/2.3.x/appcontext/#storing-data)
    - [Events and Signals](https://flask.palletsprojects.com/en/2.3.x/appcontext/#events-and-signals)

- [The Request Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/)

    - [Purpose of the Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#purpose-of-the-context)
    - [Lifetime of the Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#lifetime-of-the-context)
    - [Manually Push a Context](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#manually-push-a-context)
    - [How the Context Works](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#how-the-context-works)
    - [Callbacks and Errors](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#callbacks-and-errors)
    - [Notes On Proxies](https://flask.palletsprojects.com/en/2.3.x/reqcontext/#notes-on-proxies)

- [Modular Applications with Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/)

    - [Why Blueprints?](https://flask.palletsprojects.com/en/2.3.x/blueprints/#why-blueprints)
    - [The Concept of Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/#the-concept-of-blueprints)
    - [My First Blueprint](https://flask.palletsprojects.com/en/2.3.x/blueprints/#my-first-blueprint)
    - [Registering Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/#registering-blueprints)
    - [Nesting Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/#nesting-blueprints)
    - [Blueprint Resources](https://flask.palletsprojects.com/en/2.3.x/blueprints/#blueprint-resources)
    - [Building URLs](https://flask.palletsprojects.com/en/2.3.x/blueprints/#building-urls)
    - [Blueprint Error Handlers](https://flask.palletsprojects.com/en/2.3.x/blueprints/#blueprint-error-handlers)

- [Extensions](https://flask.palletsprojects.com/en/2.3.x/extensions/)

    - [Finding Extensions](https://flask.palletsprojects.com/en/2.3.x/extensions/#finding-extensions)
    - [Using Extensions](https://flask.palletsprojects.com/en/2.3.x/extensions/#using-extensions)
    - [Building Extensions](https://flask.palletsprojects.com/en/2.3.x/extensions/#building-extensions)

- [Command Line Interface](https://flask.palletsprojects.com/en/2.3.x/cli/)

    - [Application Discovery](https://flask.palletsprojects.com/en/2.3.x/cli/#application-discovery)
    - [Run the Development Server](https://flask.palletsprojects.com/en/2.3.x/cli/#run-the-development-server)
    - [Open a Shell](https://flask.palletsprojects.com/en/2.3.x/cli/#open-a-shell)
    - [Environment Variables From dotenv](https://flask.palletsprojects.com/en/2.3.x/cli/#environment-variables-from-dotenv)
    - [Environment Variables From virtualenv](https://flask.palletsprojects.com/en/2.3.x/cli/#environment-variables-from-virtualenv)
    - [Custom Commands](https://flask.palletsprojects.com/en/2.3.x/cli/#custom-commands)
    - [Plugins](https://flask.palletsprojects.com/en/2.3.x/cli/#plugins)
    - [Custom Scripts](https://flask.palletsprojects.com/en/2.3.x/cli/#custom-scripts)
    - [PyCharm Integration](https://flask.palletsprojects.com/en/2.3.x/cli/#pycharm-integration)

- [Development Server](https://flask.palletsprojects.com/en/2.3.x/server/)

    - [Command Line](https://flask.palletsprojects.com/en/2.3.x/server/#command-line)
    - [In Code](https://flask.palletsprojects.com/en/2.3.x/server/#in-code)

- [Working with the Shell](https://flask.palletsprojects.com/en/2.3.x/shell/)

    - [Command Line Interface](https://flask.palletsprojects.com/en/2.3.x/shell/#command-line-interface)
    - [Creating a Request Context](https://flask.palletsprojects.com/en/2.3.x/shell/#creating-a-request-context)
    - [Firing Before/After Request](https://flask.palletsprojects.com/en/2.3.x/shell/#firing-before-after-request)
    - [Further Improving the Shell Experience](https://flask.palletsprojects.com/en/2.3.x/shell/#further-improving-the-shell-experience)

- [Patterns for Flask](https://flask.palletsprojects.com/en/2.3.x/patterns/)

    - [Large Applications as Packages](https://flask.palletsprojects.com/en/2.3.x/patterns/packages/)
    - [Application Factories](https://flask.palletsprojects.com/en/2.3.x/patterns/appfactories/)
    - [Application Dispatching](https://flask.palletsprojects.com/en/2.3.x/patterns/appdispatch/)
    - [Using URL Processors](https://flask.palletsprojects.com/en/2.3.x/patterns/urlprocessors/)
    - [Using SQLite 3 with Flask](https://flask.palletsprojects.com/en/2.3.x/patterns/sqlite3/)
    - [SQLAlchemy in Flask](https://flask.palletsprojects.com/en/2.3.x/patterns/sqlalchemy/)
    - [Uploading Files](https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads/)
    - [Caching](https://flask.palletsprojects.com/en/2.3.x/patterns/caching/)
    - [View Decorators](https://flask.palletsprojects.com/en/2.3.x/patterns/viewdecorators/)
    - [Form Validation with WTForms](https://flask.palletsprojects.com/en/2.3.x/patterns/wtforms/)
    - [Template Inheritance](https://flask.palletsprojects.com/en/2.3.x/patterns/templateinheritance/)
    - [Message Flashing](https://flask.palletsprojects.com/en/2.3.x/patterns/flashing/)
    - [JavaScript, fetch, and JSON](https://flask.palletsprojects.com/en/2.3.x/patterns/javascript/)
    - [Lazily Loading Views](https://flask.palletsprojects.com/en/2.3.x/patterns/lazyloading/)
    - [MongoDB with MongoEngine](https://flask.palletsprojects.com/en/2.3.x/patterns/mongoengine/)
    - [Adding a favicon](https://flask.palletsprojects.com/en/2.3.x/patterns/favicon/)
    - [Streaming Contents](https://flask.palletsprojects.com/en/2.3.x/patterns/streaming/)
    - [Deferred Request Callbacks](https://flask.palletsprojects.com/en/2.3.x/patterns/deferredcallbacks/)
    - [Adding HTTP Method Overrides](https://flask.palletsprojects.com/en/2.3.x/patterns/methodoverrides/)
    - [Request Content Checksums](https://flask.palletsprojects.com/en/2.3.x/patterns/requestchecksum/)
    - [Background Tasks with Celery](https://flask.palletsprojects.com/en/2.3.x/patterns/celery/)
    - [Subclassing Flask](https://flask.palletsprojects.com/en/2.3.x/patterns/subclassing/)
    - [Single-Page Applications](https://flask.palletsprojects.com/en/2.3.x/patterns/singlepageapplications/)

- [Security Considerations](https://flask.palletsprojects.com/en/2.3.x/security/)

    - [Cross-Site Scripting (XSS)](https://flask.palletsprojects.com/en/2.3.x/security/#cross-site-scripting-xss)
    - [Cross-Site Request Forgery (CSRF)](https://flask.palletsprojects.com/en/2.3.x/security/#cross-site-request-forgery-csrf)
    - [JSON Security](https://flask.palletsprojects.com/en/2.3.x/security/#json-security)
    - [Security Headers](https://flask.palletsprojects.com/en/2.3.x/security/#security-headers)
    - [Copy/Paste to Terminal](https://flask.palletsprojects.com/en/2.3.x/security/#copy-paste-to-terminal)

- [Deploying to Production](https://flask.palletsprojects.com/en/2.3.x/deploying/)

    - [Self-Hosted Options](https://flask.palletsprojects.com/en/2.3.x/deploying/#self-hosted-options)
    - [Hosting Platforms](https://flask.palletsprojects.com/en/2.3.x/deploying/#hosting-platforms)

- [Using async and await](https://flask.palletsprojects.com/en/2.3.x/async-await/)

    - [Performance](https://flask.palletsprojects.com/en/2.3.x/async-await/#performance)
    - [Background tasks](https://flask.palletsprojects.com/en/2.3.x/async-await/#background-tasks)
    - [When to use Quart instead](https://flask.palletsprojects.com/en/2.3.x/async-await/#when-to-use-quart-instead)
    - [Extensions](https://flask.palletsprojects.com/en/2.3.x/async-await/#extensions)
    - [Other event loops](https://flask.palletsprojects.com/en/2.3.x/async-await/#other-event-loops)

## API Reference

If you are looking for information on a specific function, class or method, this part of the documentation is for you.

- API

    - Application Object
    - Blueprint Objects
    - Incoming Request Data
    - Response Objects
    - Sessions
    - Session Interface
    - Test Client
    - Test CLI Runner
    - Application Globals
    - Useful Functions and Classes
    - Message Flashing
    - JSON Support
    - Template Rendering
    - Configuration
    - Stream Helpers
    - Useful Internals
    - Signals
    - Class-Based Views
    - URL Route Registrations
    - View Function Options
    - Command Line Interface

## Additional Notes

- Design Decisions in Flask

    - The Explicit Application Object
    - The Routing System
    - One Template Engine
    - What does “micro” mean?
    - Thread Locals
    - Async/await and ASGI support
    - What Flask is, What Flask is Not

- Flask Extension Development

    - Naming
    - The Extension Class and Initialization
    - Adding Behavior
    - Configuration Techniques
    - Data During a Request
    - Views and Models
    - Recommended Extension Guidelines

- How to contribute to Flask

    - Support questions
    - Reporting issues
    - Submitting patches
    - BSD-3-Clause License

- Changes
