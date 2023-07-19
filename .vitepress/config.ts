import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en',
  title: "G-Tester",
  description: "让测试变得自动化、智能化",
  head: [
    [
      'link',
      { rel: 'icon', href: '/favicon.ico' }
    ]
  ],
  
  cleanUrls: true,

  locales: {
    root: { label: '简体中文'},
    en: { label: 'English', link: '' }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",

    nav: [
      {
        text: 'Python',
        items: [
          { text: '文档', link: '/python/doc/get_started', activeMatch: '/python/doc/'},
          {
            text: '测试自动化',
            items: [
              { text: 'pytest', link: '/python/pytest/get_started', activeMatch: '/python/pytest'},
              { text: 'selenium', link: '...' },
              { text: 'requests', link: '...' }
            ]
          },
          {
            text: 'Web框架',
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
          { text: '文档', link: '/golang/doc/get_started', activeMatch: '/golang/doc/'},
          {
            text: 'Web框架',
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
            text: '传统框架',
            items: [
              { text: 'layui', link: '/layui/get_started', activeMatch: '/html/layui/'},
              { text: 'Item B', link: '...' }
            ]
          },
          {
            text: '新型框架',
            items: [
              { text: 'vue3', link: '/vue3/index', activeMatch: '/html/vue3/' },
              { text: 'vitepress', link: '...' }
            ]
          }
        ]
      },
    ],

    outline: { level: [2, 3],label: '当前页' },

    returnToTopLabel: "回到顶部",

    darkModeSwitchLabel: "外观",

    sidebarMenuLabel: "菜单",

    docFooter: { prev: "上一页", next: "下一页" },

    footer: {
      message: '通过MIT许可发布。',
      copyright: 'Copyright © 2023-至今 G-Tester'
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
      provider: 'local',
      options: {
        locales: {
          root: { //这里是个大坑，zh是不生效的，改为root即可
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                displayDetails: "显示详细列表",
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: "关闭"
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/huohuoren4/docs.git' }
    ]
  }
})

