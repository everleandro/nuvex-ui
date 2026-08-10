<template>
    <div class="e-window">
        <div ref="container" class="e-window__container">
            <transition-group :name="transitionName" tag="div" class="e-window__track">
                <slot></slot>
            </transition-group>
        </div>
    </div>
</template>
<script lang="ts" >
export default { name: 'EWindow' }
export interface EWindow {
    modelValue: ComputedRef<string | number | undefined>
    name: ComputedRef<string | undefined>
}
</script>
<script lang="ts" setup>
import { ComputedRef, computed, provide, ref, watch } from 'vue';

export interface Props {
    modelValue?: string | number,
    name?: string
}
const transitionName = ref('tab-transition')
const container = ref<HTMLDivElement | null>(null)

const props = defineProps<Props>()

watch(() => props.modelValue, (value) => {
    setTransitionName(value);
})

const emit = defineEmits<{ (e: 'update:modelValue', value: number | string): void }>()

const changeValue = (value: string | number): void => {
    emit('update:modelValue', value)
}

const setTransitionName = (value: string | number | undefined) => {
    if (value !== undefined && value !== null) {
        const el = container.value
        if (!el) {
            return
        }

        const nodeList = Array.from(el.querySelectorAll<HTMLElement>('.e-window__item, .e-window-item'))
        const active = nodeList.find((node) => node.classList.contains('e-window__item--active') || node.classList.contains('e-window-item--active'))
        const to = nodeList.find((node) => node.dataset.value === String(value))

        if (!to) {
            return
        }

        const activeIndex = active ? nodeList.indexOf(active) : -1
        const toIndex = nodeList.indexOf(to)

        if (activeIndex < 0 || toIndex < 0) {
            transitionName.value = 'tab-transition'
            return
        }

        transitionName.value = toIndex >= activeIndex ? 'tab-transition' : 'tab-reverse-transition'
    }
}

provide("EWindow", {
    changeValue,
    modelValue: computed(() => props.modelValue),
    name: computed(() => props.name)
});
</script>
<style lang="scss" src="./style.scss"></style>