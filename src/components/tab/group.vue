<template>
    <div :class="tabGroupClass" tabindex="-1" role="tablist" :aria-orientation="props.vertical ? 'vertical' : 'horizontal'">
        <div class="e-slide-group__container e-tabs__container">
            <div ref="contentRef" class="e-slide-group__content e-tabs__content">
                <slot></slot>
                <div
                    v-if="props.track"
                    :class="['e-tabs__track', { 'e-tabs__track--vertical': props.vertical }]"
                ></div>
                <div
                    :class="['e-tabs__indicator', { 'e-tabs__indicator--vertical': props.vertical }]"
                    :style="indicatorStyle"
                ></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" >
export default { name: 'tabGroup' }
export interface TabGroup {
    changeValue: (value: number | string) => void
    modelValue: ComputedRef<string | number | undefined>
    color: ComputedRef<string | undefined>
    inactiveColor: ComputedRef<string | undefined>
    vertical: ComputedRef<boolean>
    name: ComputedRef<string | undefined>
}
</script>
<script lang="ts" setup>
import { ComputedRef, computed, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, reactive, ref, watch } from 'vue';

export interface Props {
    modelValue?: string | number,
    color?: string,
    inactiveColor?: string,
    track?: boolean,
    vertical?: boolean,
    grow?: boolean,
    tabAlign?: string,
    name?: string
}
const props = withDefaults(defineProps<Props>(), { track: false, tabAlign: 'center', direction: 'horizontal' })
const emit = defineEmits<{ (e: 'update:modelValue', value: number | string): void }>()
const contentRef = ref<HTMLElement | null>(null)

const indicator = reactive<{
    offset: number,
    size: number,
    color: string,
    visible: boolean
}>({
    offset: 0,
    size: 0,
    color: 'currentColor',
    visible: false,
})

const changeValue = (value: string | number): void => emit('update:modelValue', value)
const tabGroupClass = computed(() => {
    const classes = ['e-slide-group e-tabs e-tabs--density-default']
    if (props.vertical) classes.push('e-slide-group--vertical e-tabs--vertical')
    if (props.grow) classes.push('e-slide-group--grow')
    if (props.track) classes.push('e-tabs--with-track')
    classes.push(`e-tabs--align-tabs-${props.tabAlign}`)
    return classes;
})

const indicatorStyle = computed(() => {
    const baseStyle: Record<string, string> = {
        opacity: indicator.visible ? '1' : '0',
        '--e-tabs-indicator-color': indicator.color,
    }

    if (props.vertical) {
        baseStyle.height = `${indicator.size}px`
        baseStyle.width = '2px'
        baseStyle.transform = `translateY(${indicator.offset}px)`
        return baseStyle
    }

    baseStyle.width = `${indicator.size}px`
    baseStyle.height = '2px'
    baseStyle.transform = `translateX(${indicator.offset}px)`
    return baseStyle
})

const updateIndicator = (): void => {
    const contentElement = contentRef.value
    if (!contentElement) {
        indicator.visible = false
        return
    }

    const tabElements = Array.from(contentElement.querySelectorAll<HTMLElement>('.e-tab'))
    if (!tabElements.length) {
        indicator.visible = false
        return
    }

    const modelValue = props.modelValue
    let activeTab = modelValue !== undefined
        ? tabElements.find((tabElement) => tabElement.dataset.value === String(modelValue))
        : undefined

    if (!activeTab) {
        activeTab = tabElements.find((tabElement) => tabElement.classList.contains('e-tab--selected'))
    }

    if (!activeTab) {
        indicator.visible = false
        return
    }

    const contentRect = contentElement.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    indicator.offset = props.vertical
        ? tabRect.top - contentRect.top
        : tabRect.left - contentRect.left
    indicator.size = props.vertical ? tabRect.height : tabRect.width
    indicator.color = getComputedStyle(activeTab).color
    indicator.visible = true
}

const scheduleIndicatorUpdate = (): void => {
    void nextTick(() => {
        updateIndicator()
    })
}

watch(() => props.modelValue, () => {
    scheduleIndicatorUpdate()
})

watch(() => props.vertical, () => {
    scheduleIndicatorUpdate()
})

watch(() => props.grow, () => {
    scheduleIndicatorUpdate()
})

watch(() => props.tabAlign, () => {
    scheduleIndicatorUpdate()
})

onMounted(() => {
    scheduleIndicatorUpdate()
    window.addEventListener('resize', scheduleIndicatorUpdate)
})

onUpdated(() => {
    scheduleIndicatorUpdate()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', scheduleIndicatorUpdate)
})

provide("TabGroup", {
    changeValue,
    modelValue: computed(() => props.modelValue),
    color: computed(() => props.color),
    inactiveColor: computed(() => props.inactiveColor),
    vertical: computed(() => Boolean(props.vertical)),
    name: computed(() => props.name)
});

</script>