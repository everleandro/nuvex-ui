<template>
    <main class="e-main" :data-layout="true" :style="mainLayoutStyle">
        <div class="e-main__wrapper">
            <slot />
        </div>
    </main>
</template>
  
<script setup lang="ts" >
import { useLayout } from '@/composables'

const { mainLayoutStyle } = useLayout()

</script>

<style lang="scss">
@use '~/public/styles/_mixins.scss' as *;

.e-main {
    --main-local-bg: var(--e-main-bg, var(--e-color-surface-canvas, var(--e-color-surface-0, transparent)));
    --main-local-color: var(--e-main-color, var(--e-contrast-surface-canvas, var(--e-contrast-surface-0, inherit)));
    max-width: 100%;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex: 1 0 auto;
    max-width: 100%;
    background-color: var(--main-local-bg);
    color: var(--main-local-color);


    &__wrapper {
        flex: 1 1 auto;
        max-width: 100%;
        position: relative;
        box-sizing: border-box;
    }
}
</style>
