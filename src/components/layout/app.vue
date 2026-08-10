<template>
    <div class="e-app" :id="appId">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { provideLayout } from '@/composables'
import { useId } from 'vue'
const appId = useId()

provideLayout()
</script>

<style lang="scss">
.e-app {
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    flex-direction: column;
    max-width: 100%;
    position: relative;
}
</style>
