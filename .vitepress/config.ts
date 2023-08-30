import { defineConfig } from 'vitepress'

var chinese_website = 'https://huohuoren4.github.io/docs/'
var github_website = 'https://github.com/huohuoren4/docs'
var edit_link = github_website + '/tree/main/:path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en',
  title: "G-Tester",
  description: "Make Testing Automated And Intelligent",
  head: [
    [
      'link',
      { rel: 'icon', href: '/favicon.ico' }
    ]
  ],
  
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,


  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文', link: chinese_website },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",

    editLink: {
      pattern: edit_link,
      text: 'Edit this page on GitHub'
    },

    nav: [
      { text: 'Notice 📢', 
        items: [
          {text: 'Plan 🟡', link: '/plan'},
          {text: 'Message 🔔', link: '...'},
        ]
      },
      {
        text: 'Python',
        items: [
          {
            text: 'Offical Resource',
            items: [
              {text: 'doc', link: 'https://docs.python.org/3.7/'},
            ]
          },
          {
            text: 'Test Automatic',
            items: [
              { text: 'pytest 🟢', link: '/python/pytest/home', activeMatch: '/python/pytest'},
              { text: 'allure 🟡', link: '/python/allure/get_start', activeMatch: '/python/allure'},
              { text: 'pluggy', link: 'https://pluggy.readthedocs.io/en/'},
              { text: 'pytest-xdist', link: 'https://pytest-xdist.readthedocs.io/en/'},
              { text: 'selenium', link: 'https://www.selenium.dev/documentation/' },
              { text: 'requests', link: 'https://requests.readthedocs.io/' },
              { text: 'paramiko', link: 'https://requests.readthedocs.io/' },
            ]
          },
          {
            text: 'Test Intelligence',
            items: [
              { text: 'pytorch', link: 'https://pytorch.org/tutorials/'},
            ]
          },
          {
            text: 'Awesome Flask',
            items: [
              { text: 'flask 🟡', link: '/python/flask/home', activeMatch: "/python/flask/"},
              { text: 'click', link: 'https://click.palletsprojects.com/en/'},
              { text: 'werkzeug', link: 'https://werkzeug.palletsprojects.com/en/'},
              { text: 'flask-restful', link: 'https://flask-restful.readthedocs.io/en/'},
              { text: 'flask-admin', link: 'https://flask-admin.readthedocs.io/en/'},
              { text: 'celery', link: 'https://docs.celeryq.dev/en/stable/'},
            ]
          },
        ]
      },
      {
        text: 'Golang',
        items: [
          {
            text: 'Offical Resource',
            items: [
              { text: 'doc', link: 'https://golang.google.cn/doc/'},
            ]
          },
          {
            text: 'Web Framework',
            items: [
              { text: 'gin', link: 'https://gin-gonic.com/docs/'},
            ]
          },
          {
            text: 'Container Ecosystem',
            items: [
              { text: 'docker', link: 'https://docs.docker.com/'},
              { text: 'kubernetes', link: 'https://kubernetes.io/docs/home/'},
            ]
          }
        ]
      },
      {
        text: 'Vue',
        items: [
          {
            text: 'Offical Resource',
            items: [
              { text: 'doc', link: 'https://vuejs.org/'},
            ]
          },
          {
            text: 'Awesome Vue',
            items: [
              { text: 'vite', link: 'https://vitejs.dev/'},
              { text: 'vitepress', link: 'https://vitepress.dev/' },
              { text: 'element plus', link: 'https://element-plus.org/en-US/' }
            ]
          },
        ]
      },
      {
        text: 'Resources',
        items: [
          { text: 'Team', link: '...'},
          { text: 'Releases', link: '...'},
          { text: 'Contribution', link: github_website + '/issues' },
          { text: 'Help Us Translate😄', link: github_website},
        ]
      },
    ],

    outline: { level: "deep" },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present G-Tester'
    },

    sidebar: {
      "/python/pytest/": [
        { text: 'Pytest v7.4.0',
          items: [
            { text: 'Home', link: '/python/pytest/home' },
            { text: 'Get Started', link: '/python/pytest/get_started' },
            { text: 'How-to guides', 
              collapsed: true,
              items: [
                  { text: 'How to invoke pytest', link: '/python/pytest/how_to_guides/invoke_pytest' },
                  { text: 'How to write and report assertions in tests', link: '/python/pytest/how_to_guides/assert' },
                  { text: 'How to use fixtures', link: '/python/pytest/how_to_guides/fixture' },
                  { text: 'How to mark test functions with attributes', link: '/python/pytest/how_to_guides/mark' },
                  { text: 'How to parametrize fixtures and test functions', link: '/python/pytest/how_to_guides/params_fixture' },
                  { text: 'How to use temporary directories and files in tests', link: '/python/pytest/how_to_guides/temp' },
                  { text: 'How to monkeypatch/mock modules and environments', link: '/python/pytest/how_to_guides/mock' },
                  { text: 'How to run doctests', link: '/python/pytest/how_to_guides/doctest' },
                  { text: 'How to re-run failed tests and maintain state between test runs', link: '/python/pytest/how_to_guides/re_run' },
                  { text: 'How to manage logging', link: '/python/pytest/how_to_guides/logging' },
                  { text: 'How to capture stdout/stderr output', link: '/python/pytest/how_to_guides/output' },
                  { text: 'How to capture warnings', link: '/python/pytest/how_to_guides/warning' },
                  { text: 'How to use skip and xfail to deal with tests that cannot succeed', link: '/python/pytest/how_to_guides/skip_xfail' },
                  { text: 'How to install and use plugins', link: '/python/pytest/how_to_guides/use_plugin' },
                  { text: 'Writing plugins', link: '/python/pytest/how_to_guides/write_plugin' },
                  { text: 'Writing hook functions', link: '/python/pytest/how_to_guides/hook_func' },
                  { text: 'How to use pytest with an existing test suite', link: '/python/pytest/how_to_guides/test_suite' },
                  { text: 'How to use unittest-based tests with pytest', link: '/python/pytest/how_to_guides/unittest' },
                  { text: 'How to run tests written for nose', link: '/python/pytest/how_to_guides/nose_test' },
                  { text: 'How to implement xunit-style set-up', link: '/python/pytest/how_to_guides/xunit' },
                  { text: 'How to set up bash completion', link: '/python/pytest/how_to_guides/bash_completion' },
                ] 
            },
            { text: 'Reference guides', 
              collapsed: true,
              items: [
                  { text: 'Fixtures reference', link: '/python/pytest/reference_guides/fixture_reference' },
                  { text: 'Plugin List', link: '/python/pytest/reference_guides/plugin_list' },
                  { text: 'Configuration', link: '/python/pytest/reference_guides/configuration' },
                  { text: 'API Reference', 
                    collapsed: true,
                    items: [
                      { text: 'Constants', link: '/python/pytest/reference_guides/api_reference/constants' },
                      { text: 'Functions', link: '/python/pytest/reference_guides/api_reference/functions' },
                      { text: 'Marks', link: '/python/pytest/reference_guides/api_reference/marks' },
                      { text: 'Fixtures', link: '/python/pytest/reference_guides/api_reference/fixtures' },
                      { text: 'Hooks', link: '/python/pytest/reference_guides/api_reference/hooks' },
                      { text: 'Collection tree objects', link: '/python/pytest/reference_guides/api_reference/collection' },
                      { text: 'Objects', link: '/python/pytest/reference_guides/api_reference/objects' },
                      { text: 'Global Variables', link: '/python/pytest/reference_guides/api_reference/global_variables' },
                      { text: 'Environment Variables', link: '/python/pytest/reference_guides/api_reference/env_variables' },
                      { text: 'Exceptions', link: '/python/pytest/reference_guides/api_reference/exceptions' },
                      { text: 'Warnings', link: '/python/pytest/reference_guides/api_reference/warnings' },
                      { text: 'Configuration Options', link: '/python/pytest/reference_guides/api_reference/config_options' },
                      { text: 'Command-line Flags', link: '/python/pytest/reference_guides/api_reference/cmd_flags' },
                    ] 
                  },
                ] 
            },
            { text: 'Explanation', 
              collapsed: true,
              items: [
                  { text: 'Anatomy of a test', link: '/python/pytest/explanation/anatomy' },
                  { text: 'About fixtures', link: '/python/pytest/explanation/about_fixture' },
                  { text: 'Good Integration Practices', link: '/python/pytest/explanation/integration_practice' },
                  { text: 'Flaky tests', link: '/python/pytest/explanation/flaky_test' },
                  { text: 'pytest import mechanisms ', link: '/python/pytest/explanation/import_mechanism' }
                ] 
            },
            { text: 'Further topics', 
              collapsed: true,
              items: [
                  { text: 'Examples and customization tricks', 
                    collapsed: true,
                    items: [
                      {text: 'Overview', link: '/python/pytest/further_topics/example_trick/content' },
                      {text: 'Demo of Python failure reports with pytest', link: '/python/pytest/further_topics/example_trick/failure_report' },
                      {text: 'Basic patterns and examples', link: '/python/pytest/further_topics/example_trick/basic_pattern' },
                      {text: 'Parametrizing tests', link: '/python/pytest/further_topics/example_trick/parametrize' },
                      {text: 'Working with custom markers', link: '/python/pytest/further_topics/example_trick/custom_mark' },
                      {text: 'A session-fixture which can look at all collected tests', link: '/python/pytest/further_topics/example_trick/session_fixture' },
                      {text: 'Changing standard (Python) test discovery', link: '/python/pytest/further_topics/example_trick/test_discovery' },
                      {text: 'Working with non-python tests', link: '/python/pytest/further_topics/example_trick/work' },
                    ] 
                  },
                  { text: 'Backwards Compatibility Policy', link: '/python/pytest/further_topics/compatibility' },
                  { text: 'Deprecations and Removals', link: '/python/pytest/further_topics/deprecation' },
                  { text: 'Contribution getting started', link: '/python/pytest/further_topics/contribution' },
                  { text: 'Development Guide', link: '/python/pytest/further_topics/development_guide' },
                  { text: 'Sponsor', link: '/python/pytest/further_topics/sponsor' },
                  { text: 'pytest for enterprise', link: '/python/pytest/further_topics/enterprise' },
                  { text: 'License', link: '/python/pytest/further_topics/license' },
                  { text: 'Contact channels', link: '/python/pytest/further_topics/contact' },
                  { text: 'History', link: '/python/pytest/further_topics/history' },
                  { text: 'Historical Notes', link: '/python/pytest/further_topics/historical_note' },
                  { text: 'Talks and Tutorials', link: '/python/pytest/further_topics/talk_tutorial' },
                  { text: 'Release announcements', link: '/python/pytest/further_topics/announcement' }
                ] 
            }
          ]
        }
      ],
      "/python/allure/": [
        { 
          text: 'Allure v2.23.1',
          items: [
            { text: 'Get started', link: '/python/allure/get_start' },
            { text: 'Language support', link: '/python/allure/language' },
            { text: 'Report and plugin', link: '/python/allure/report' },
          ]
        },
      ],
      "/python/flask/": [
        {
          text: 'Flask v2.3.2',
          items: [
            { text: 'Home', link: '/python/flask/home' },
            { text: 'User Guide', 
              collapsed: true,
              items: [
                  { text: 'Installation', link: '/python/flask/user_guide/install' },
                  { text: 'Quickstart', link: '/python/flask/user_guide/quickstart' },
                  { text: 'Tutorial', 
                    collapsed: true,
                    items: [
                      { text: 'Overview', link: '/python/flask/user_guide/tutorial/introduction' },
                      { text: 'Project Layout', link: '/python/flask/user_guide/tutorial/project_layout' },
                      { text: 'Application Setup', link: '/python/flask/user_guide/tutorial/app_setup' },
                      { text: 'Define and Access the Database', link: '/python/flask/user_guide/tutorial/database' },
                      { text: 'Blueprints and Views', link: '/python/flask/user_guide/tutorial/blueprint_view' },
                      { text: 'Templates', link: '/python/flask/user_guide/tutorial/template' },
                      { text: 'Static Files', link: '/python/flask/user_guide/tutorial/static_file' },
                      { text: 'Blog Blueprint', link: '/python/flask/user_guide/tutorial/blog_blueprint' },
                      { text: 'Make the Project Installable', link: '/python/flask/user_guide/tutorial/project_install' },
                      { text: 'Test Coverage', link: '/python/flask/user_guide/tutorial/test_coverage' },
                      { text: 'Deploy to Production', link: '/python/flask/user_guide/tutorial/deploy' },
                      { text: 'Keep Developing', link: '/python/flask/user_guide/tutorial/develop' },
                    ]
                  },
                  { text: 'Templates', link: '/python/flask/user_guide/template' },
                  { text: 'Testing Flask Applications', link: '/python/flask/user_guide/application' },
                  { text: 'Handling Application Errors', link: '/python/flask/user_guide/handle_error' },
                  { text: 'Debugging Application Errors', link: '/python/flask/user_guide/debug_error' },
                  { text: 'Logging', link: '/python/flask/user_guide/logging' },
                  { text: 'Configuration Handling', link: '/python/flask/user_guide/configuration' },
                  { text: 'Signals', link: '/python/flask/user_guide/signal' },
                  { text: 'Class-based Views', link: '/python/flask/user_guide/view' },
                  { text: 'Application Structure and Lifecycle', link: '/python/flask/user_guide/app_structure' },
                  { text: 'The Application Context', link: '/python/flask/user_guide/app_context' },
                  { text: 'The Request Context', link: '/python/flask/user_guide/request_context' },
                  { text: 'Modular Applications with Blueprints', link: '/python/flask/user_guide/blueprint' },
                  { text: 'Extensions', link: '/python/flask/user_guide/extension' },
                  { text: 'Command Line Interface', link: '/python/flask/user_guide/cmd_interface' },
                  { text: 'Development Server', link: '/python/flask/user_guide/develop_server' },
                  { text: 'Working with the Shell', link: '/python/flask/user_guide/shell' },
                  { text: 'Patterns for Flask', 
                    collapsed: true,
                    items: [
                      { text: 'Overview', link: '/python/flask/user_guide/pattern/index.md' },
                      { text: 'Large Applications as Packages', link: '/python/flask/user_guide/pattern/large_app' },
                      { text: 'Application Factories', link: '/python/flask/user_guide/pattern/app_factories' },
                      { text: 'Application Dispatching', link: '/python/flask/user_guide/pattern/app_dispatch' },
                      { text: 'Using URL Processors', link: '/python/flask/user_guide/pattern/use_url' },
                      { text: 'Using SQLite 3 with Flask', link: '/python/flask/user_guide/pattern/sqlite3' },
                      { text: 'SQLAlchemy in Flask', link: '/python/flask/user_guide/pattern/sqlalchemy' },
                      { text: 'Uploading Files', link: '/python/flask/user_guide/pattern/upload_file' },
                      { text: 'Caching', link: '/python/flask/user_guide/pattern/caching' },
                      { text: 'View Decorators', link: '/python/flask/user_guide/pattern/view_decorator' },
                      { text: 'Form Validation with WTForms', link: '/python/flask/user_guide/pattern/wtform' },
                      { text: 'Template Inheritance', link: '/python/flask/user_guide/pattern/template_inheritance' },
                      { text: 'Message Flashing', link: '/python/flask/user_guide/pattern/flash' },
                      { text: 'JavaScript, fetch, and JSON', link: '/python/flask/user_guide/pattern/javascript' },
                      { text: 'Lazily Loading Views', link: '/python/flask/user_guide/pattern/load_view' },
                      { text: 'MongoDB with MongoEngine', link: '/python/flask/user_guide/pattern/mongdb' },
                      { text: 'Adding a favicon', link: '/python/flask/user_guide/pattern/favicon' },
                      { text: 'Streaming Contents', link: '/python/flask/user_guide/pattern/stream_content' },
                      { text: 'Deferred Request Callbacks', link: '/python/flask/user_guide/pattern/request_callback' },
                      { text: 'Adding HTTP Method Overrides', link: '/python/flask/user_guide/pattern/add_http' },
                      { text: 'Request Content Checksums', link: '/python/flask/user_guide/pattern/checksum' },
                      { text: 'Background Tasks with Celery', link: '/python/flask/user_guide/pattern/celery' },
                      { text: 'Subclassing Flask', link: '/python/flask/user_guide/pattern/subclass_flask' },
                      { text: 'Single-Page Applications', link: '/python/flask/user_guide/pattern/single_page' },
                    ]
                  },
                  { text: 'Security Considerations', link: '/python/flask/user_guide/security' },
                  { text: 'Deploying to Production', link: '/python/flask/user_guide/deploy' },
                  { text: 'Using async and await', link: '/python/flask/user_guide/async' },
                ] 
            },
            { text: 'API Reference', 
              collapsed: true,
              items: [
                  { text: 'Application Object', link: '/python/flask/api_reference/app_obj' },
                  { text: 'Blueprint Objects', link: '/python/flask/api_reference/blueprint_obj' },
                  { text: 'Incoming Request Data', link: '/python/flask/api_reference/request_data' },
                  { text: 'Response Objects', link: '/python/flask/api_reference/response_obj' },
                  { text: 'Sessions', link: '/python/flask/api_reference/session' },
                  { text: 'Session Interface', link: '/python/flask/api_reference/session_interface' },
                  { text: 'Test Client', link: '/python/flask/api_reference/test_client' },
                  { text: 'Test CLI Runner', link: '/python/flask/api_reference/test_cli' },
                  { text: 'Application Globals', link: '/python/flask/api_reference/app_global' },
                  { text: 'Useful Functions and Classes', link: '/python/flask/api_reference/function_class' },
                  { text: 'Message Flashing', link: '/python/flask/api_reference/message_flash' },
                  { text: 'JSON Support', link: '/python/flask/api_reference/json_support' },
                  { text: 'Template Rendering', link: '/python/flask/api_reference/template_render' },
                  { text: 'Configuration', link: '/python/flask/api_reference/config' },
                  { text: 'Stream Helpers', link: '/python/flask/api_reference/stream_help' },
                  { text: 'Useful Internals', link: '/python/flask/api_reference/useful_internal' },
                  { text: 'Signals', link: '/python/flask/api_reference/signal' },
                  { text: 'Class-Based Views', link: '/python/flask/api_reference/view' },
                  { text: 'URL Route Registrations', link: '/python/flask/api_reference/url_route' },
                  { text: 'View Function Options', link: '/python/flask/api_reference/view_function' },
                  { text: 'Command Line Interface', link: '/python/flask/api_reference/cmd_line' },
                ] 
            },
            { text: 'Additional Notes', 
              collapsed: true,
              items: [
                  { text: 'Design Decisions in Flask', link: '/python/flask/additional_note/design_decision' },
                  { text: 'Flask Extension Development', link: '/python/flask/additional_note/flask_extension' },
                  { text: 'How to contribute to Flask', link: '/python/flask/additional_note/contribute' },
                  { text: 'BSD-3-Clause License', link: '/python/flask/additional_note/license' },
                  { text: 'Changes', link: '/python/flask/additional_note/change' },
                ] 
            },
          ]
        }
      ],
    },
    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: github_website }
    ]
  }
})

