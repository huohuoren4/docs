# Patterns for Flask {#patterns-for-flask}

Certain features and interactions are common enough that you will find them in most web applications. For example, many applications use a relational database and user authentication. They will open a database connection at the beginning of the request and get the information for the logged in user. At the end of the request, the database connection is closed.

These types of patterns may be a bit outside the scope of Flask itself, but Flask makes it easy to implement them. Some common patterns are collected in the following pages.

- [Large Applications as Packages](/python/flask/user_guide/pattern/large_app#large-applications-as-packages)

    - [Simple Packages](/python/flask/user_guide/pattern/large_app#simple-packages)
    - [Working with Blueprints](/python/flask/user_guide/pattern/large_app#working-with-blueprints)

- [Application Factories](/python/flask/user_guide/pattern/app_factories#application-factories)

    - [Basic Factories](/python/flask/user_guide/pattern/app_factories#basic-factories)
    - [Factories & Extensions](/python/flask/user_guide/pattern/app_factories#factories-extensions)
    - [Using Applications](/python/flask/user_guide/pattern/app_factories#using-applications)
    - [Factory Improvements](/python/flask/user_guide/pattern/app_factories#factory-improvements)

- [Application Dispatching](/python/flask/user_guide/pattern/app_dispatch#application-dispatching)

    - [Working with this Document](/python/flask/user_guide/pattern/app_dispatch#working-with-this-document)
    - [Combining Applications](/python/flask/user_guide/pattern/app_dispatch#combining-applications)
    - [Dispatch by Subdomain](/python/flask/user_guide/pattern/app_dispatch#dispatch-by-subdomain)
    - [Dispatch by Path](/python/flask/user_guide/pattern/app_dispatch#dispatch-by-path)

- [Using URL Processors](/python/flask/user_guide/pattern/use_url#using-url-processors)

    - [Internationalized Application URLs](/python/flask/user_guide/pattern/use_url#internationalized-application-urls)
    - [Internationalized Blueprint URLs](/python/flask/user_guide/pattern/use_url#internationalized-blueprint-urls)

- [Using SQLite 3 with Flask](/python/flask/user_guide/pattern/sqlite3#using-sqlite-3-with-flask)

    - [Connect on Demand](/python/flask/user_guide/pattern/sqlite3#connect-on-demand)
    - [Easy Querying](/python/flask/user_guide/pattern/sqlite3#easy-querying)
    - [Initial Schemas](/python/flask/user_guide/pattern/sqlite3#initial-schemas)

- [SQLAlchemy in Flask](/python/flask/user_guide/pattern/sqlalchemy#sqlalchemy-in-flask)

    - [Flask-SQLAlchemy Extension](/python/flask/user_guide/pattern/sqlalchemy#flask-sqlalchemy-extension)
    - [Declarative](/python/flask/user_guide/pattern/sqlalchemy#declarative)
    - [Manual Object Relational Mapping](/python/flask/user_guide/pattern/sqlalchemy#manual-object-relational-mapping)
    - [SQL Abstraction Layer](/python/flask/user_guide/pattern/sqlalchemy#sql-abstraction-layer)

- [Uploading Files](/python/flask/user_guide/pattern/upload_file#uploading-files)

    - [A Gentle Introduction](/python/flask/user_guide/pattern/upload_file#a-gentle-introduction)
    - [Improving Uploads](/python/flask/user_guide/pattern/upload_file#improving-uploads)
    - [Upload Progress Bars](/python/flask/user_guide/pattern/upload_file#upload-progress-bars)
    - [An Easier Solution](/python/flask/user_guide/pattern/upload_file#an-easier-solution)

- [Caching](/python/flask/user_guide/pattern/caching#caching)

- [View Decorators](/python/flask/user_guide/pattern/view_decorator#view-decorators)

    - [Login Required Decorator](/python/flask/user_guide/pattern/view_decorator#login-required-decorator)
    - [Caching Decorator](/python/flask/user_guide/pattern/view_decorator#caching-decorator)
    - [Templating Decorator](/python/flask/user_guide/pattern/view_decorator#templating-decorator)
    - [Endpoint Decorator](/python/flask/user_guide/pattern/view_decorator#endpoint-decorator)

- [Form Validation with WTForms](/python/flask/user_guide/pattern/wtform#form-validation-with-wtforms)

    - [The Forms](/python/flask/user_guide/pattern/wtform#the-forms)
    - [In the View](/python/flask/user_guide/pattern/wtform#in-the-view)
    - [Forms in Templates](/python/flask/user_guide/pattern/wtform#forms-in-templates)

- [Template Inheritance](/python/flask/user_guide/pattern/template_inheritance#template-inheritance)

    - [Base Template](/python/flask/user_guide/pattern/template_inheritance#base-template)
    - [Child Template](/python/flask/user_guide/pattern/template_inheritance#child-template)

- [Message Flashing](/python/flask/user_guide/pattern/flash#message-flashing)

    - [Simple Flashing](/python/flask/user_guide/pattern/flash#simple-flashing)
    - [Flashing With Categories](/python/flask/user_guide/pattern/flash#flashing-with-categories)
    - [Filtering Flash Messages](/python/flask/user_guide/pattern/flash#filtering-flash-messages)

- [JavaScript, fetch, and JSON](/python/flask/user_guide/pattern/javascript#javascript-fetch-and-json)

    - [Rendering Templates](/python/flask/user_guide/pattern/javascript#rendering-templates)
    - [Generating URLs](/python/flask/user_guide/pattern/javascript#generating-urls)
    - [Making a Request with fetch](/python/flask/user_guide/pattern/javascript#making-a-request-with-fetch)
    - [Following Redirects](/python/flask/user_guide/pattern/javascript#following-redirects)
    - [Replacing Content](/python/flask/user_guide/pattern/javascript#replacing-content)
    - [Return JSON from Views](/python/flask/user_guide/pattern/javascript#return-json-from-views)
    - [Receiving JSON in Views](/python/flask/user_guide/pattern/javascript#receiving-json-in-views)

- [Lazily Loading Views](/python/flask/user_guide/pattern/load_view#lazily-loading-views)

    - [Converting to Centralized URL Map](/python/flask/user_guide/pattern/load_view#converting-to-centralized-url-map)
    - [Loading Late](/python/flask/user_guide/pattern/load_view#loading-late)

- [MongoDB with MongoEngine](/python/flask/user_guide/pattern/mongdb#mongodb-with-mongoengine)

    - [Configuration](/python/flask/user_guide/pattern/mongdb#configuration)
    - [Mapping Documents](/python/flask/user_guide/pattern/mongdb#mapping-documents)
    - [Creating Data](/python/flask/user_guide/pattern/mongdb#creating-data)
    - [Queries](/python/flask/user_guide/pattern/mongdb#queries)
    - [Documentation](/python/flask/user_guide/pattern/mongdb#documentation)

- [Adding a favicon](/python/flask/user_guide/pattern/favicon#adding-a-favicon)

    - [See also](/python/flask/user_guide/pattern/favicon#see-also)

- [Streaming Contents](/python/flask/user_guide/pattern/stream_content#streaming-contents)

    - [Basic Usage](/python/flask/user_guide/pattern/stream_content#basic-usage)
    - [Streaming from Templates](/python/flask/user_guide/pattern/stream_content#streaming-from-templates)
    - [Streaming with Context](/python/flask/user_guide/pattern/stream_content#streaming-with-context)

- [Deferred Request Callbacks](/python/flask/user_guide/pattern/request_callback#deferred-request-callbacks)

- [Adding HTTP Method Overrides](/python/flask/user_guide/pattern/add_http#adding-http-method-overrides)

- [Request Content Checksums](/python/flask/user_guide/pattern/checksum#request-content-checksums)

- [Background Tasks with Celery](/python/flask/user_guide/pattern/celery#background-tasks-with-celery)

    - [Install](/python/flask/user_guide/pattern/celery#install)
    - [Integrate Celery with Flask](/python/flask/user_guide/pattern/celery#integrate-celery-with-flask)
    - [Application Factory](/python/flask/user_guide/pattern/celery#application-factory)
    - [Defining Tasks](/python/flask/user_guide/pattern/celery#defining-tasks)
    - [Calling Tasks](/python/flask/user_guide/pattern/celery#calling-tasks)
    - [Getting Results](/python/flask/user_guide/pattern/celery#getting-results)
    - [Passing Data to Tasks](/python/flask/user_guide/pattern/celery#passing-data-to-tasks)

- [Subclassing Flask](/python/flask/user_guide/pattern/subclass_flask#subclassing-flask)

- [Single-Page Applications](/python/flask/user_guide/pattern/single_page#single-page-applications)