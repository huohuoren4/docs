---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "G-Tester"
  text: "Make Testing Automated And Intelligent"
  image:
    src: /G-Tester001.png
    alt: G-Tester
  actions:
    - theme: brand
      text: plan
      link: /plan
    - theme: alt
      text: pytest
      link: /python/pytest/home
    - theme: alt
      text: view in github
      link: https://github.com/huohuoren4/docs.git

features:
  - icon: 🍔
    title: Pytest
    details: Pytest is a mature full-featured Python testing tool that helps you write better programs.
  - icon: 🧶
    title: Flask
    details: Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy.
  - icon: 🍜
    title: Allure
    details: Allure Framework is a set of adaptors and examples for Allure Report, a flexible, lightweight multi-language test reporting tool.  
---
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(40px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>
