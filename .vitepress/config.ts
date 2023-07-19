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

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文 (待完成)', link: '' },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",

    nav: [
      {
        text: 'Python',
        items: [
          { text: 'doc', link: '/python/doc/get_started', activeMatch: '/python/doc/'},
          {
            text: 'Test Automatic',
            items: [
              { text: 'pytest', link: '/python/pytest/get_started', activeMatch: '/python/pytest'},
              { text: 'selenium', link: '...' },
              { text: 'requests', link: '...' }
            ]
          },
          {
            text: 'Web Framework',
            items: [
              { text: 'flask', link: '/python/flask/index', activeMatch: '/python/flask/' },
              { text: 'sql', link: '...' }
            ]
          }
        ]
      },
      {
        text: 'Golang',
        items: [
          { text: 'doc', link: '/golang/doc/get_started', activeMatch: '/golang/doc/'},
          {
            text: 'Web Framework',
            items: [
              { text: 'gin', link: '/golang/gin/get_started', activeMatch: '/golang/gin/'}
            ]
          }
        ]
      },
      {
        text: 'Html',
        items: [
          {
            text: 'Traditional Framework',
            items: [
              { text: 'layui', link: '/layui/get_started', activeMatch: '/html/layui/'},
              { text: 'Item B', link: '...' }
            ]
          },
          {
            text: 'Awesome Framework',
            items: [
              { text: 'vue3', link: '/vue3/index', activeMatch: '/html/vue3/' },
              { text: 'vitepress', link: '...' }
            ]
          }
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
        { text: 'Pytest',
          items: [
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
                  { text: 'How to invoke pytest', link: '/python/pytest/invoke_pytest' },
                ] 
            },
            { text: 'Explanation', 
              collapsed: true,
              items: [
                  { text: 'How to invoke pytest', link: '/python/pytest/invoke_pytest' },
                ] 
            },
            { text: 'Further topics', 
              collapsed: true,
              items: [
                  { text: 'How to invoke pytest', link: '/python/pytest/invoke_pytest' },
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

