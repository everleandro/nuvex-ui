<template>
    <slot name="activator" :attrs="activatorAttrs">
        <EButton v-bind="buttonProps" :class="['e-tab',
            { 'e-slide-group-item--active e-tab--selected': active }]" role="tab" :aria-selected="active"
            :id="tabId" :aria-controls="panelId" :tabindex="active ? 0 : -1" :value="value" :data-value="value"
            @click="changeGroupValue" @keydown="handleTabNavigation" :icon="icon">
            <slot></slot>
        </EButton>
    </slot>
</template>
<script lang="ts" setup>
import { computed, inject, useAttrs } from "vue";
import { TabGroup } from "./group.vue"
import EButton from "@/components/button/index.vue";
import { ButtonProps } from "@/components/button/index.vue";
export interface Props extends ButtonProps {
    value: string | number
}
const attrs = useAttrs();
const props = withDefaults(defineProps<Props>(), {
    ripple: true,
    text: true,
});
const Group = inject<Partial<TabGroup> | undefined>("TabGroup", undefined);

const emit = defineEmits<{
    (e: 'click', value: Event): void
}>()

const active = computed(() => Group?.modelValue?.value === props.value && props.value !== undefined)
const tabId = computed(() => Group?.name?.value ? `${Group.name.value}-tab-${String(props.value)}` : undefined)
const panelId = computed(() => Group?.name?.value ? `${Group.name.value}-panel-${String(props.value)}` : undefined)

const changeGroupValue = (evt: Event): void => {
    Group?.changeValue?.(props.value)
    emit('click', evt)
}

const handleTabNavigation = (evt: KeyboardEvent): void => {
    const key = evt.key
    const isVertical = Boolean(Group?.vertical?.value)
    const previousKey = isVertical ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const managedKeys = [previousKey, nextKey, 'Home', 'End']

    if (!managedKeys.includes(key)) {
        return
    }

    const currentTab = evt.currentTarget as HTMLElement | null
    const tabContainer = currentTab?.closest('.e-tabs__content')
    if (!currentTab || !tabContainer) {
        return
    }

    const tabs = Array.from(tabContainer.querySelectorAll<HTMLElement>('.e-tab'))
    if (!tabs.length) {
        return
    }

    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < 0) {
        return
    }

    evt.preventDefault()

    let targetIndex = currentIndex
    if (key === previousKey) {
        targetIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (key === nextKey) {
        targetIndex = (currentIndex + 1) % tabs.length
    } else if (key === 'Home') {
        targetIndex = 0
    } else if (key === 'End') {
        targetIndex = tabs.length - 1
    }

    const targetTab = tabs[targetIndex]
    targetTab.click()
    targetTab.focus()
}

const color = computed((): string | undefined => {
    if (props.value === undefined)
        return props.color ?? Group?.color?.value
    return active.value ? (props.color ?? Group?.color?.value) : Group?.inactiveColor?.value
})
const buttonProps = computed((): Partial<ButtonProps> => {
    const propsResult: ButtonProps = {
        ...props,
        ...attrs,
        color: color.value,
        text: props.text,
        ripple: props.ripple,
    }
    return propsResult;
})
const activatorAttrs = (evt: Event) => {
    const attrs: Record<string, any> = {}
    attrs['onClick'] = () => changeGroupValue(evt)
    return attrs;
}

</script>
<style lang="scss" src="./style.scss"></style>