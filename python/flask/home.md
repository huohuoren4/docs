# Flask {#flask}

::: tip Tip
*flask version*: `2.3.2`. Only the lastest version is maintained.

*offical doc*: [Flask](https://flask.palletsprojects.com/)
:::

Welcome to Flask’s documentation. Get started with Installation and then get an overview with the [Quickstart](/python/flask/user_guide/quickstart#quickstart). There is also a more detailed [Tutorial](/python/flask/user_guide/tutorial/introduction#tutorial) that shows how to create a small but complete application with Flask. Common patterns are described in the [Patterns for Flask](/python/flask/user_guide/pattern/#patterns-for-flask) section. The rest of the docs describe each component of Flask in detail, with a full reference in the [API](/python/flask/api_reference/app_obj#api) section.

Flask depends on the [Werkzeug](https://werkzeug.palletsprojects.com/) WSGI toolkit, the [Jinja](https://jinja.palletsprojects.com/) template engine, and the [Click](https://click.palletsprojects.com/) CLI toolkit. Be sure to check their documentation as well as Flask’s when looking for information.

## User's Guide {#user-s-guide}

Flask provides configuration and conventions, with sensible defaults, to get started. This section of the documentation explains the different parts of the Flask framework and how they can be used, customized, and extended. Beyond Flask itself, look for community-maintained extensions to add even more functionality.

- [Installation](/python/flask/user_guide/install#installation)

    - [Python Version](/python/flask/user_guide/install#python-version)
    - [Dependencies](/python/flask/user_guide/install#dependencies)
    - [Virtual environments](/python/flask/user_guide/install#virtual-environments)
    - [Install Flask](/python/flask/user_guide/install#install-flask)

- [Quickstart](/python/flask/user_guide/quickstart#quickstart)

    - [A Minimal Application](/python/flask/user_guide/quickstart#a-minimal-application)
    - [Debug Mode](/python/flask/user_guide/quickstart#debug-mode)
    - [HTML Escaping](/python/flask/user_guide/quickstart#html-escaping)
    - [Routing](/python/flask/user_guide/quickstart#routing)
    - [Static Files](/python/flask/user_guide/quickstart#static-files)
    - [Rendering Templates](/python/flask/user_guide/quickstart#rendering-templates)
    - [Accessing Request Data](/python/flask/user_guide/quickstart#accessing-request-data)
    - [Redirects and Errors](/python/flask/user_guide/quickstart#redirects-and-errors)
    - [About Responses](/python/flask/user_guide/quickstart#about-responses)
    - [Sessions](/python/flask/user_guide/quickstart#sessions)
    - [Message Flashing](/python/flask/user_guide/quickstart#message-flashing)
    - [Logging](/python/flask/user_guide/quickstart#logging)
    - [Hooking in WSGI Middleware](/python/flask/user_guide/quickstart#hooking-in-wsgi-middleware)
    - [Using Flask Extensions](/python/flask/user_guide/quickstart#using-flask-extensions)
    - [Deploying to a Web Server](/python/flask/user_guide/quickstart#deploying-to-a-web-server)

- [Tutorial](/python/flask/user_guide/tutorial/introduction#tutorial)

    - [Project Layout](/python/flask/user_guide/tutorial/project_layout#project-layout)
    - [Application Setup](/python/flask/user_guide/tutorial/app_setup#application-setup)
    - [Define and Access the Database](/python/flask/user_guide/tutorial/database#define-and-access-the-database)
    - [Blueprints and Views](/python/flask/user_guide/tutorial/blueprint_view#blueprints-and-views)
    - [Templates](/python/flask/user_guide/tutorial/template#templates)
    - [Static Files](/python/flask/user_guide/tutorial/static_file#static-files)
    - [Blog Blueprint](/python/flask/user_guide/tutorial/blog_blueprint#blog-blueprint)
    - [Make the Project Installable](/python/flask/user_guide/tutorial/project_install#make-the-project-installable)
    - [Test Coverage](/python/flask/user_guide/tutorial/test_coverage#test-coverage)
    - [Deploy to Production](/python/flask/user_guide/tutorial/deploy#deploy-to-production)
    - [Keep Developing!](/python/flask/user_guide/tutorial/develop#keep-developing)

- [Templates](/python/flask/user_guide/template#templates)

    - [Jinja Setup](/python/flask/user_guide/template#jinja-setup)
    - [Standard Context](/python/flask/user_guide/template#standard-context)
    - [Controlling Autoescaping](/python/flask/user_guide/template#controlling-autoescaping)
    - [Registering Filters](/python/flask/user_guide/template#registering-filters)
    - [Context Processors](/python/flask/user_guide/template#context-processors)
    - [Streaming](/python/flask/user_guide/template#streaming)

- [Testing Flask Applications](/python/flask/user_guide/application#testing-flask-applications)

    - [Identifying Tests](/python/flask/user_guide/application#identifying-tests)
    - [Fixtures](/python/flask/user_guide/application#fixtures)
    - [Sending Requests with the Test Client](/python/flask/user_guide/application#sending-requests-with-the-test-client)
    - [Following Redirects](/python/flask/user_guide/application#following-redirects)
    - [Accessing and Modifying the Session](/python/flask/user_guide/application#accessing-and-modifying-the-session)
    - [Running Commands with the CLI Runner](/python/flask/user_guide/application#running-commands-with-the-cli-runner)
    - [Tests that depend on an Active Context](/python/flask/user_guide/application#tests-that-depend-on-an-active-context)

- [Handling Application Errors](/python/flask/user_guide/handle_error#handling-application-errors)

    - [Error Logging Tools](/python/flask/user_guide/handle_error#error-logging-tools)
    - [Error Handlers](/python/flask/user_guide/handle_error#error-handlers)
    - [Custom Error Pages](/python/flask/user_guide/handle_error#custom-error-pages)
    - [Blueprint Error Handlers](/python/flask/user_guide/handle_error#blueprint-error-handlers)
    - [Returning API Errors as JSON](/python/flask/user_guide/handle_error#returning-api-errors-as-json)
    - [Logging](/python/flask/user_guide/handle_error#logging)
    - [Debugging](/python/flask/user_guide/handle_error#debugging)

- [Debugging Application Errors](/python/flask/user_guide/debug_error#debugging-application-errors)

    - [In Production](/python/flask/user_guide/debug_error#in-production)
    - [The Built-In Debugger](/python/flask/user_guide/debug_error#the-built-in-debugger)
    - [External Debuggers](/python/flask/user_guide/debug_error#external-debuggers)

- [Logging](/python/flask/user_guide/logging#logging)

    - [Basic Configuration](/python/flask/user_guide/logging#basic-configuration)
    - [Email Errors to Admins](/python/flask/user_guide/logging#email-errors-to-admins)
    - [Injecting Request Information](/python/flask/user_guide/logging#injecting-request-information)
    - [Other Libraries](/python/flask/user_guide/logging#other-libraries)

- [Configuration Handling](/python/flask/user_guide/configuration#configuration-handling)

    - [Configuration Basics](/python/flask/user_guide/configuration#configuration-basics)
    - [Debug Mode](/python/flask/user_guide/configuration#debug-mode)
    - [Builtin Configuration Values](/python/flask/user_guide/configuration#builtin-configuration-values)
    - [Configuring from Python Files](/python/flask/user_guide/configuration#configuring-from-python-files)
    - [Configuring from Data Files](/python/flask/user_guide/configuration#configuring-from-data-files)
    - [Configuring from Environment Variables](/python/flask/user_guide/configuration#configuring-from-environment-variables)
    - [Configuration Best Practices](/python/flask/user_guide/configuration#configuration-best-practices)
    - [Development / Production](/python/flask/user_guide/configuration#development-production)
    - [Instance Folders](/python/flask/user_guide/configuration#instance-folders)

- [Signals](/python/flask/user_guide/signal#signals)

    - [Core Signals](/python/flask/user_guide/signal#core-signals)
    - [Subscribing to Signals](/python/flask/user_guide/signal#subscribing-to-signals)
    - [Creating Signals](/python/flask/user_guide/signal#creating-signals)
    - [Sending Signals](/python/flask/user_guide/signal#sending-signals)
    - [Signals and Flask’s Request Context](/python/flask/user_guide/signal#signals-and-flask-s-request-context)
    - [Decorator Based Signal Subscriptions](/python/flask/user_guide/signal#decorator-based-signal-subscriptions)

- [Class-based Views](/python/flask/user_guide/view#class-based-views)

    - [Basic Reusable View](/python/flask/user_guide/view#basic-reusable-view)
    - [URL Variables](/python/flask/user_guide/view#url-variables)
    - [View Lifetime and self](/python/flask/user_guide/view#view-lifetime-and-self)
    - [View Decorators](/python/flask/user_guide/view#view-decorators)
    - [Method Hints](/python/flask/user_guide/view#method-hints)
    - [Method Dispatching and APIs](/python/flask/user_guide/view#method-dispatching-and-apis)

- [Application Structure and Lifecycle](/python/flask/user_guide/app_structure#application-structure-and-lifecycle)

    - [Application Setup](/python/flask/user_guide/app_structure#application-setup)
    - [Serving the Application](/python/flask/user_guide/app_structure#serving-the-application)
    - [How a Request is Handled](/python/flask/user_guide/app_structure#how-a-request-is-handled)

- [The Application Context](/python/flask/user_guide/app_context#the-application-context)

    - [Purpose of the Context](/python/flask/user_guide/app_context#purpose-of-the-context)
    - [Lifetime of the Context](/python/flask/user_guide/app_context#lifetime-of-the-context)
    - [Manually Push a Context](/python/flask/user_guide/app_context#manually-push-a-context)
    - [Storing Data](/python/flask/user_guide/app_context#storing-data)
    - [Events and Signals](/python/flask/user_guide/app_context#events-and-signals)

- [The Request Context](/python/flask/user_guide/request_context#the-request-context)

    - [Purpose of the Context](/python/flask/user_guide/request_context#purpose-of-the-context)
    - [Lifetime of the Context](/python/flask/user_guide/request_context#lifetime-of-the-context)
    - [Manually Push a Context](/python/flask/user_guide/request_context#manually-push-a-context)
    - [How the Context Works](/python/flask/user_guide/request_context#how-the-context-works)
    - [Callbacks and Errors](/python/flask/user_guide/request_context#callbacks-and-errors)
    - [Notes On Proxies](/python/flask/user_guide/request_context#notes-on-proxies)

- [Modular Applications with Blueprints](/python/flask/user_guide/blueprint#modular-applications-with-blueprints)

    - [Why Blueprints?](/python/flask/user_guide/blueprint#why-blueprints)
    - [The Concept of Blueprints](/python/flask/user_guide/blueprint#the-concept-of-blueprints)
    - [My First Blueprint](/python/flask/user_guide/blueprint#my-first-blueprint)
    - [Registering Blueprints](/python/flask/user_guide/blueprint#registering-blueprints)
    - [Nesting Blueprints](/python/flask/user_guide/blueprint#nesting-blueprints)
    - [Blueprint Resources](/python/flask/user_guide/blueprint#blueprint-resources)
    - [Building URLs](/python/flask/user_guide/blueprint#building-urls)
    - [Blueprint Error Handlers](/python/flask/user_guide/blueprint#blueprint-error-handlers)

- [Extensions](/python/flask/user_guide/extension#extensions)

    - [Finding Extensions](/python/flask/user_guide/extension#finding-extensions)
    - [Using Extensions](/python/flask/user_guide/extension#using-extensions)
    - [Building Extensions](/python/flask/user_guide/extension#building-extensions)

- [Command Line Interface](/python/flask/user_guide/cmd_interface#command-line-interface)

    - [Application Discovery](/python/flask/user_guide/cmd_interface#application-discovery)
    - [Run the Development Server](/python/flask/user_guide/cmd_interface#run-the-development-server)
    - [Open a Shell](/python/flask/user_guide/cmd_interface#open-a-shell)
    - [Environment Variables From dotenv](/python/flask/user_guide/cmd_interface#environment-variables-from-dotenv)
    - [Environment Variables From virtualenv](/python/flask/user_guide/cmd_interface#environment-variables-from-virtualenv)
    - [Custom Commands](/python/flask/user_guide/cmd_interface#custom-commands)
    - [Plugins](/python/flask/user_guide/cmd_interface#plugins)
    - [Custom Scripts](/python/flask/user_guide/cmd_interface#custom-scripts)
    - [PyCharm Integration](/python/flask/user_guide/cmd_interface#pycharm-integration)

- [Development Server](/python/flask/user_guide/develop_server#development-server)

    - [Command Line](/python/flask/user_guide/develop_server#command-line)
    - [In Code](/python/flask/user_guide/develop_server#in-code)

- [Working with the Shell](/python/flask/user_guide/shell#working-with-the-shell)

    - [Command Line Interface](/python/flask/user_guide/shell#command-line-interface)
    - [Creating a Request Context](/python/flask/user_guide/shell#creating-a-request-context)
    - [Firing Before/After Request](/python/flask/user_guide/shell#firing-before-after-request)
    - [Further Improving the Shell Experience](/python/flask/user_guide/shell#further-improving-the-shell-experience)

- [Patterns for Flask](/python/flask/user_guide/pattern/#patterns-for-flask)

    - [Large Applications as Packages](/python/flask/user_guide/pattern/large_app#large-applications-as-packages)
    - [Application Factories](/python/flask/user_guide/pattern/app_factories#application-factories)
    - [Application Dispatching](/python/flask/user_guide/pattern/app_dispatch#application-dispatching)
    - [Using URL Processors](/python/flask/user_guide/pattern/use_url#using-url-processors)
    - [Using SQLite 3 with Flask](/python/flask/user_guide/pattern/sqlite3#using-sqlite-3-with-flask)
    - [SQLAlchemy in Flask](/python/flask/user_guide/pattern/sqlalchemy#sqlalchemy-in-flask)
    - [Uploading Files](/python/flask/user_guide/pattern/upload_file#uploading-files)
    - [Caching](/python/flask/user_guide/pattern/caching#caching)
    - [View Decorators](/python/flask/user_guide/pattern/view_decorator#view-decorators)
    - [Form Validation with WTForms](/python/flask/user_guide/pattern/wtform#form-validation-with-wtforms)
    - [Template Inheritance](/python/flask/user_guide/pattern/template_inheritance#template-inheritance)
    - [Message Flashing](/python/flask/user_guide/pattern/flash#message-flashing)
    - [JavaScript, fetch, and JSON](/python/flask/user_guide/pattern/javascript#javascript-fetch-and-json)
    - [Lazily Loading Views](/python/flask/user_guide/pattern/load_view#lazily-loading-views)
    - [MongoDB with MongoEngine](/python/flask/user_guide/pattern/mongdb#mongodb-with-mongoengine)
    - [Adding a favicon](/python/flask/user_guide/pattern/favicon#adding-a-favicon)
    - [Streaming Contents](/python/flask/user_guide/pattern/stream_content#streaming-contents)
    - [Deferred Request Callbacks](/python/flask/user_guide/pattern/request_callback#deferred-request-callbacks)
    - [Adding HTTP Method Overrides](/python/flask/user_guide/pattern/add_http#adding-http-method-overrides)
    - [Request Content Checksums](/python/flask/user_guide/pattern/checksum#request-content-checksums)
    - [Background Tasks with Celery](/python/flask/user_guide/pattern/celery#background-tasks-with-celery)
    - [Subclassing Flask](/python/flask/user_guide/pattern/subclass_flask#subclassing-flask)
    - [Single-Page Applications](/python/flask/user_guide/pattern/single_page#single-page-applications)

- [Security Considerations](/python/flask/user_guide/security#security-considerations)

    - [Cross-Site Scripting (XSS)](/python/flask/user_guide/security#cross-site-scripting-xss)
    - [Cross-Site Request Forgery (CSRF)](/python/flask/user_guide/security#cross-site-request-forgery-csrf)
    - [JSON Security](/python/flask/user_guide/security#json-security)
    - [Security Headers](/python/flask/user_guide/security#security-headers)
    - [Copy/Paste to Terminal](/python/flask/user_guide/security#copy-paste-to-terminal)

- [Deploying to Production](/python/flask/user_guide/deploy#deploying-to-production)

    - [Self-Hosted Options](/python/flask/user_guide/deploy#self-hosted-options)
    - [Hosting Platforms](/python/flask/user_guide/deploy#hosting-platforms)

- [Using async and await](/python/flask/user_guide/async#using-async-and-await)

    - [Performance](/python/flask/user_guide/async#performance)
    - [Background tasks](/python/flask/user_guide/async#background-tasks)
    - [When to use Quart instead](/python/flask/user_guide/async#when-to-use-quart-instead)
    - [Extensions](/python/flask/user_guide/async#extensions)
    - [Other event loops](/python/flask/user_guide/async#other-event-loops)

## API Reference {#api-reference}

If you are looking for information on a specific function, class or method, this part of the documentation is for you.

- [API](/python/flask/api_reference/app_obj#api)

    - [Application Object](/python/flask/api_reference/app_obj#application-object)
    - [Blueprint Objects](/python/flask/api_reference/blueprint_obj#blueprint-objects)
    - [Incoming Request Data](/python/flask/api_reference/request_data#incoming-request-data)
    - [Response Objects](/python/flask/api_reference/response_obj#response-objects)
    - [Sessions](/python/flask/api_reference/session#session‘？)
    - [Session Interface](/python/flask/api_reference/session_interface#session-interface)
    - [Test Client](/python/flask/api_reference/test_client#test-client)
    - [Test CLI Runner](/python/flask/api_reference/test_cli#test-cli-runner)
    - [Application Globals](/python/flask/api_reference/app_global#application-globals)
    - [Useful Functions and Classes](/python/flask/api_reference/function_class#useful-functions-and-classes)
    - [Message Flashing](/python/flask/api_reference/message_flash#message-flashing)
    - [JSON Support](/python/flask/api_reference/json_support#json-support)
    - [Template Rendering](/python/flask/api_reference/template_render#template-rendering)
    - [Configuration](/python/flask/api_reference/config#configuration)
    - [Stream Helpers](/python/flask/api_reference/stream_help#stream-helpers)
    - [Useful Internals](/python/flask/api_reference/useful_internal#useful-internals)
    - [Signals](/python/flask/api_reference/signal#signals)
    - [Class-Based Views](/python/flask/api_reference/view#class-based-views)
    - [URL Route Registrations](/python/flask/api_reference/url_route#url-route-registrations)
    - [View Function Options](/python/flask/api_reference/view_function#view-function-options)
    - [Command Line Interface](/python/flask/api_reference/cmd_line#command-line-interface)

## Additional Notes {#additional-notes}

- [Design Decisions in Flask](/python/flask/additional_note/design_decision#design-decisions-in-flask)

    - [The Explicit Application Object](/python/flask/additional_note/design_decision#the-explicit-application-object)
    - [The Routing System](/python/flask/additional_note/design_decision#the-routing-system)
    - [One Template Engine](/python/flask/additional_note/design_decision#one-template-engine)
    - [What does “micro” mean?](/python/flask/additional_note/design_decision#what-does-micro-mean)
    - [Thread Locals](/python/flask/additional_note/design_decision#thread-locals)
    - [Async/await and ASGI support](/python/flask/additional_note/design_decision#async-await-and-asgi-support)
    - [What Flask is, What Flask is Not](/python/flask/additional_note/design_decision#what-flask-is-what-flask-is-not)

- [Flask Extension Development](/python/flask/additional_note/flask_extension#flask-extension-development)

    - [Naming](/python/flask/additional_note/flask_extension#naming)
    - [The Extension Class and Initialization](/python/flask/additional_note/flask_extension#the-extension-class-and-initialization)
    - [Adding Behavior](/python/flask/additional_note/flask_extension#adding-behavior)
    - [Configuration Techniques](/python/flask/additional_note/flask_extension#configuration-techniques)
    - [Data During a Request](/python/flask/additional_note/flask_extension#data-during-a-request)
    - [Views and Models](/python/flask/additional_note/flask_extension#views-and-models)
    - [Recommended Extension Guidelines](/python/flask/additional_note/flask_extension#recommended-extension-guidelines)

- [How to contribute to Flask](/python/flask/additional_note/contribute#how-to-contribute-to-flask)

    - [Support questions](/python/flask/additional_note/contribute#support-questions)
    - [Reporting issues](/python/flask/additional_note/contribute#reporting-issues)
    - [Submitting patches](/python/flask/additional_note/contribute#submitting-patches)

- [BSD-3-Clause License](/python/flask/additional_note/license#bsd-3-clause-license)

- [Changes](/python/flask/additional_note/change#changes)
