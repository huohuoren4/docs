import { defineConfig } from 'vitepress'

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

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文', link: 'https://huohuoren4.github.io/docs/' },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",

    nav: [
      { text: 'Plan 🟡', link: '/plan'},
      {
        text: 'Python',
        items: [
          { text: 'doc', link: 'https://docs.python.org/3.7/'},
          {
            text: 'Test Automatic',
            items: [
              { text: 'pytest 🟡', link: '/python/pytest/home', activeMatch: '/python/pytest'},
              { text: 'selenium', link: 'https://www.selenium.dev/documentation/' },
              { text: 'requests', link: 'https://requests.readthedocs.io/' }
            ]
          },
          {
            text: 'Web Framework',
            items: [
              { text: 'flask', link: 'https://flask.palletsprojects.com/'},
            ]
          }
        ]
      },
      {
        text: 'Golang',
        items: [
          { text: 'doc', link: 'https://golang.google.cn/doc/'},
          {
            text: 'Web Framework',
            items: [
              { text: 'gin', link: 'https://gin-gonic.com/docs/'},
              { text: 'gin-vue-admin 🔴', link: '...'},
            ]
          }
        ]
      },
      {
        text: 'Html',
        items: [
          {
            text: 'Vue Framework',
            items: [
              { text: 'vue2', link: 'https://v2.vuejs.org/'},
              { text: 'vue3', link: 'https://vuejs.org/'},
            ]
          },
          {
            text: 'Vue Ecosystem',
            items: [
              { text: 'vite', link: 'https://vitejs.dev/'},
              { text: 'vitepress', link: 'https://vitepress.dev/' }
            ]
          },
        ]
      },
    ],

    outline: { level: [2, 3] },

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
                  { text: 'pytest import mechanisms and sys.path/PYTHONPATH', link: '/python/pytest/explanation/import_mechanism' }
                ] 
            },
            { text: 'Further topics', 
              collapsed: true,
              items: [
                  { text: 'Examples and customization tricks', link: '/python/pytest/further_topics/example_trick' },
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
      "/python/flask/": [
        {
          text: 'Flask',
          items: [
            { text: 'Get Started', link: '/python/flask/index' },
          ]
        }
      ],
    },
    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/huohuoren4/docs.git' }
    ]
  }
})

