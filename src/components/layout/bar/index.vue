<template>
    <header ref="el" :class="barClass" :style="mergedStyle" :data-layout="app" :data-clipped="clipped">
        <div class="e-bar__content">
            <slot></slot>
        </div>
        <div v-if="slots.append" class="e-bar__append">
            <slot name="append"></slot>
        </div>
    </header>
</template>
<script lang="ts" setup>
import { ComputedRef, Ref, computed, onMounted, onBeforeUnmount, onUnmounted, ref, watch, useSlots, nextTick } from 'vue'
import { BarProps } from '@/types'
import { useLayout, useResolvedColor } from '@/composables'
import { normalizeCssSize } from '@/utils/style'

let el: Ref<HTMLHeadElement | null> = ref(null)
let resizeObserver: ResizeObserver | null = null
let hasRegisteredAppBar = false
const slots = useSlots()
const props = defineProps<BarProps>()
const { setAppBarLayout, resetAppBarLayout, barLayoutStyle } = useLayout()

const booleanClassKeys = ['dense', 'fixed', 'clipped', 'depressed', 'app', 'absolute', 'outlined'] as const

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-bar-bg',
    contrastVar: '--e-bar-color',
})

const computedHeight = computed(() => {
    return normalizeCssSize(props.height) || (props.dense ? '48px' : '64px')
})

// Parsed once as a pixel estimate: used before the bar exists in the DOM (SSR
// and first client render) so EMain/EContainer don't start at 0 and jump.
const estimatedHeight = computed(() => Number.parseFloat(computedHeight.value) || 0)

const barClass: ComputedRef<Array<string>> = computed((): Array<string> => {
    const classes = ['e-bar']

    booleanClassKeys.forEach((key) => {
        if (props[key]) {
            classes.push(`e-bar--${key}`)
        }
    })

    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`)
    }

    return classes
})

const style = computed((): Record<string, string> => {
    const result: Record<string, string> = { ...colorStyles.value }

    if (props.height) {
        return {
            ...result,
            height: computedHeight.value
        }
    }

    return result;

})

const mergedStyle = computed((): Record<string, string> => {
    if (!props.app) {
        return { ...style.value }
    }

    return {
        ...barLayoutStyle.value,
        ...style.value,
    }
})

const startResizeObserver = (): void => {
    if (!props.app || !el.value || resizeObserver) return

    resizeObserver = new ResizeObserver(() => {
        refreshLayoutStyle()
    })

    resizeObserver.observe(el.value)
}

const stopResizeObserver = (): void => {
    if (resizeObserver && el.value) {
        resizeObserver.unobserve(el.value)
        resizeObserver.disconnect()
        resizeObserver = null
    }
}

const syncLayoutTracking = (): void => {
    if (!props.app) {
        stopResizeObserver()

        if (hasRegisteredAppBar) {
            resetAppBarLayout()
            hasRegisteredAppBar = false
        }

        return
    }

    startResizeObserver()
    refreshLayoutStyle()
}

const refreshLayoutStyle = (): void => {
    if (!props.app) return

    // Real DOM measurement once mounted; falls back to the CSS estimate
    // beforehand (SSR, or before this component has rendered its element).
    const height = el.value ? el.value.getBoundingClientRect().height : estimatedHeight.value

    setAppBarLayout({
        enabled: !!props.app,
        app: !!props.app,
        height,
        clipped: !!props.clipped,
        absolute: !!props.absolute,
        fixed: !!props.fixed,
    })

    hasRegisteredAppBar = true
}

// immediate: registers the estimated height during setup (SSR + pre-mount)
// so layout padding is correct before the bar ever reaches the real DOM.
watch(() => [props.clipped, props.fixed, props.absolute, props.app, props.dense, computedHeight.value], () => {
    refreshLayoutStyle()

    nextTick(() => {
        syncLayoutTracking()
    })
}, { immediate: true });

onMounted(() => {
    syncLayoutTracking()
})

onBeforeUnmount(() => {
    stopResizeObserver()
})

onUnmounted(() => {
    if (hasRegisteredAppBar) {
        resetAppBarLayout()
        hasRegisteredAppBar = false
    }
})

</script>
<style lang="scss" src="./style.scss"></style>
