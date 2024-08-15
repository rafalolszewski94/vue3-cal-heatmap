---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vue 3 Calendar Heatmap"
  text: ""
  tagline: A lightweight calendar heatmap Vue 3 component built on SVG, inspired by julienr114's vue-calendar-heatmap ans github's contribution calendar graph
  actions:
    - theme: brand
      text: Getting started
      link: /guide
---

<script setup>
import Demo from './components/Demo.vue'
import Links from './components/Links.vue'
</script>

<Links style="margin-bottom:40px;"/>

<Demo :initial-round="2"/>
