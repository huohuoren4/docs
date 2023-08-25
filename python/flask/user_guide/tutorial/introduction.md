# Tutorial {#tutorial}

Contents:

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

This tutorial will walk you through creating a basic blog application called Flaskr. Users will be able to register, log in, create posts, and edit or delete their own posts. You will be able to package and install the application on other computers.

![index_page](/flask/ndex_page.png)

It’s assumed that you’re already familiar with Python. The [official tutorial](https://docs.python.org/3/tutorial/) in the Python docs is a great way to learn or review first.

While it’s designed to give a good starting point, the tutorial doesn’t cover all of Flask’s features. Check out the [Quickstart](/python/flask/user_guide/quickstart#quickstart) for an overview of what Flask can do, then dive into the docs to find out more. The tutorial only uses what’s provided by Flask and Python. In another project, you might decide to use [Extensions](/python/flask/user_guide/extension#extensions) or other libraries to make some tasks simpler.

![login_page](/flask/login_page.png)

Flask is flexible. It doesn’t require you to use any particular project or code layout. However, when first starting, it’s helpful to use a more structured approach. This means that the tutorial will require a bit of boilerplate up front, but it’s done to avoid many common pitfalls that new developers encounter, and it creates a project that’s easy to expand on. Once you become more comfortable with Flask, you can step out of this structure and take full advantage of Flask’s flexibility.

![edit_page](/flask/edit_page.png)

[The tutorial project is available as an example in the Flask repository](https://github.com/pallets/flask/tree/main/examples/tutorial), if you want to compare your project with the final product as you follow the tutorial.

Continue to [Project Layout](/python/flask/user_guide/tutorial/project_layout#project-layout).
