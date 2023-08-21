# Flask

::: tip Tip
flask document version: `2.3.2`. the lastest version is only maintained.
:::

Welcome to Flask’s documentation. Get started with Installation and then get an overview with the Quickstart. There is also a more detailed Tutorial that shows how to create a small but complete application with Flask. Common patterns are described in the Patterns for Flask section. The rest of the docs describe each component of Flask in detail, with a full reference in the API section.

Flask depends on the Werkzeug WSGI toolkit, the Jinja template engine, and the Click CLI toolkit. Be sure to check their documentation as well as Flask’s when looking for information.

## User's Guide

Flask provides configuration and conventions, with sensible defaults, to get started. This section of the documentation explains the different parts of the Flask framework and how they can be used, customized, and extended. Beyond Flask itself, look for community-maintained extensions to add even more functionality.

- Installation

    - Python Version
    - Dependencies
    - Virtual environments
    - Install Flask

- Quickstart

    - A Minimal Application
    - Debug Mode
    - HTML Escaping
    - Routing
    - Static Files
    - Rendering Templates
    - Accessing Request Data
    - Redirects and Errors
    - About Responses
    - Sessions
    - Message Flashing
    - Logging
    - Hooking in WSGI Middleware
    - Using Flask Extensions
    - Deploying to a Web Server

- Tutorial

    - Project Layout
    - Application Setup
    - Define and Access the Database
    - Blueprints and Views
    - Templates
    - Static Files
    - Blog Blueprint
    - Make the Project Installable
    - Test Coverage
    - Deploy to Production
    - Keep Developing!

- Templates

    - Jinja Setup
    - Standard Context
    - Controlling Autoescaping
    - Registering Filters
    - Context Processors
    - Streaming

- Testing Flask Applications

    - Identifying Tests
    - Fixtures
    - Sending Requests with the Test Client
    - Following Redirects
    - Accessing and Modifying the Session
    - Running Commands with the CLI Runner
    - Tests that depend on an Active Context

- Handling Application Errors

    - Error Logging Tools
    - Error Handlers
    - Custom Error Pages
    - Blueprint Error Handlers
    - Returning API Errors as JSON
    - Logging
    - Debugging

- Debugging Application Errors

    - In Production
    - The Built-In Debugger
    - External Debuggers

- Logging

    - Basic Configuration
    - Email Errors to Admins
    - Injecting Request Information
    - Other Libraries

- Configuration Handling

    - Configuration Basics
    - Debug Mode
    - Builtin Configuration Values
    - Configuring from Python Files
    - Configuring from Data Files
    - Configuring from Environment Variables
    - Configuration Best Practices
    - Development / Production
    - Instance Folders

- Signals

    - Core Signals
    - Subscribing to Signals
    - Creating Signals
    - Sending Signals
    - Signals and Flask’s Request Context
    - Decorator Based Signal Subscriptions

- Class-based Views

    - Basic Reusable View
    - URL Variables
    - View Lifetime and self
    - View Decorators
    - Method Hints
    - Method Dispatching and APIs

- Application Structure and Lifecycle

    - Application Setup
    - Serving the Application
    - How a Request is Handled

- The Application Context

    - Purpose of the Context
    - Lifetime of the Context
    - Manually Push a Context
    - Storing Data
    - Events and Signals

- The Request Context

    - Purpose of the Context
    - Lifetime of the Context
    - Manually Push a Context
    - How the Context Works
    - Callbacks and Errors
    - Notes On Proxies

- Modular Applications with Blueprints

    - Why Blueprints?
    - The Concept of Blueprints
    - My First Blueprint
    - Registering Blueprints
    - Nesting Blueprints
    - Blueprint Resources
    - Building URLs
    - Blueprint Error Handlers

- Extensions

    - Finding Extensions
    - Using Extensions
    - Building Extensions

- Command Line Interface

    - Application Discovery
    - Run the Development Server
    - Open a Shell
    - Environment Variables From dotenv
    - Environment Variables From virtualenv
    - Custom Commands
    - Plugins
    - Custom Scripts
    - PyCharm Integration

- Development Server

    - Command Line
    - In Code

- Working with the Shell

    - Command Line Interface
    - Creating a Request Context
    - Firing Before/After Request
    - Further Improving the Shell Experience
    - Patterns for Flask
    - Large Applications as Packages
    - Application Factories
    - Application Dispatching
    - Using URL Processors
    - Using SQLite 3 with Flask
    - SQLAlchemy in Flask
    - Uploading Files
    - Caching
    - View Decorators
    - Form Validation with WTForms
    - Template Inheritance
    - Message Flashing
    - JavaScript, fetch, and JSON
    - Lazily Loading Views
    - MongoDB with MongoEngine
    - Adding a favicon
    - Streaming Contents
    - Deferred Request Callbacks
    - Adding HTTP Method Overrides
    - Request Content Checksums
    - Background Tasks with Celery
    - Subclassing Flask
    - Single-Page Applications

- Security Considerations

    - Cross-Site Scripting (XSS)
    - Cross-Site Request Forgery (CSRF)
    - JSON Security
    - Security Headers
    - Copy/Paste to Terminal

- Deploying to Production

    - Self-Hosted Options
    - Hosting Platforms

- Using async and await

    - Performance
    - Background tasks
    - When to use Quart instead
    - Extensions
    - Other event loops

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
