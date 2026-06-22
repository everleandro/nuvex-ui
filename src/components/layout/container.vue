<template>
  <div class="e-container" id="app">
    <slot />
  </div>
</template>

<style lang="scss">
@use '~/public/styles/_mixins.scss' as *;
.e-container {
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  padding: calc(var(--e-space-base, 4px) * 4);
  box-sizing: border-box;
  max-width: 1185px;

  @include lg {
    max-width: 1185px;
  }

  @include md {
    max-width: 900px;
  }

  &--fluid {
    max-width: 100%;
  }
}
</style>
