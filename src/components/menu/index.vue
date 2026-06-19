<template>
    <slot name="activator" :attrs="activatorAttrs" :onClick="handleActivatorClick" :onKeydown="handleActivatorKeydown"
        :ref="setActivatorReference" :aria-haspopup="resolvedAriaHaspopup" :aria-expanded="String(opened)" :aria-controls="resolvedAriaControls"
        :aria-disabled="String(Boolean(props.disableMenu))" :openMenu="openMenu" :closeMenu="closeMenu" />

    <Teleport to="body">
        <EMenuContainer v-model="opened" :absolute="props.absolute" :close-on-content-click="props.closeOnContentClick"
            :full-width="props.fullWidth" :hold-focus="props.holdFocus" :check-offset="props.checkOffset"
            :transition="props.transition" :origin="props.origin" :max-width="props.maxWidth" :offset-x="props.offsetX"
            :offset-y="props.offsetY" :width="props.width" :elevation="props.elevation" :color="props.color" :target="currentActivator"
            :data-id="dataId" :content-id="contentId" :content-role="props.contentRole" :forwarded-attrs="attrs">
            <slot />
        </EMenuContainer>
    </Teleport>
</template>

<script lang="ts">
export default {
    name: 'EMenu'
}
</script>
<script lang="ts" setup>
import type { MenuTypeTarget, ElevationProps } from '@/types'
export interface Props extends ElevationProps {
    absolute?: boolean
    ariaControls?: string
    ariaHaspopup?: string
    closeOnContentClick?: boolean
    color?: string
    contentRole?: string
    fullWidth?: boolean
    activator?: MenuTypeTarget
    holdFocus?: boolean
    disableMenu?: boolean
    checkOffset?: boolean
    transition?: string
    origin?: string
    openOnHover?: boolean
    maxWidth?: string | number
    offsetX?: string | number
    offsetY?: string | number
    width?: string | number
    modelValue?: boolean
}

import EMenuContainer from './container.vue'

import { computed, isRef, nextTick, onMounted, onUnmounted, ref, useAttrs, useId, watch } from 'vue'

const id = `e-menu-${useId()}`
const contentId = `${id}-content`
const props = withDefaults(defineProps<Props>(), { origin: 'bottom left', transition: 'fade', offsetX: 0, offsetY: 0, elevation: 'sm' })
const resolvedAriaControls = computed(() => props.ariaControls || contentId)

const resolvedAriaHaspopup = computed(() => props.ariaHaspopup || 'menu')

const MenuReference = ref<HTMLElement | null>(null)
const externalActivator = ref<HTMLElement | null>(null)
const attrs = useAttrs()
const opened = ref(false)
const emit = defineEmits<{
    (e: 'update:modelValue', evt: boolean): void
}>()

onMounted(() => {
    syncActivatorBehavior()
})

onUnmounted(() => {
    removeExternalActivatorListeners()
})

watch(() => props.activator, () => {
    syncActivatorBehavior()
})

watch(opened, (value) => {
    emit('update:modelValue', value)
    updateActivatorAttributes(resolveCurrentActivator())
})

watch(() => props.modelValue, async (value) => {
    if (value === undefined) return

    if (value) {
        await openMenu()
        return
    }

    closeMenu()
})

const setActivatorReference = (value: unknown) => {
    MenuReference.value = resolveActivatorElement(value)
    syncActivatorBehavior()
}

const isHTMLElementValue = (value: unknown): value is HTMLElement => {
    return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement
}

const resolveActivatorElement = (value: unknown): HTMLElement | null => {
    if (isHTMLElementValue(value)) return value
    if (value && typeof value === 'object' && '$el' in (value as Record<string, unknown>)) {
        const element = (value as { $el?: unknown }).$el
        return isHTMLElementValue(element) ? element : null
    }
    return null
}

const updateActivatorAttributes = (target: HTMLElement | null) => {
    if (!target) return
    target.setAttribute('aria-haspopup', resolvedAriaHaspopup.value)
    target.setAttribute('aria-expanded', String(opened.value))
    target.setAttribute('aria-controls', resolvedAriaControls.value)
    target.setAttribute('aria-disabled', String(Boolean(props.disableMenu)))
}

const handleActivatorKeydown = (evt: KeyboardEvent): void => {
    if (props.disableMenu) return

    if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault()
        openMenu(evt)
    }
    if (evt.key === 'ArrowDown') {
        evt.preventDefault()
        openMenu(evt)
    }
}

const handleActivatorClick = (evt?: Event): void => {
    openMenu(evt)
}

const addExternalActivatorListeners = (target: HTMLElement) => {
    target.addEventListener('click', activatorClick)
    target.addEventListener('keydown', activatorKeydown)
    updateActivatorAttributes(target)
}

const removeExternalActivatorListeners = () => {
    if (!externalActivator.value) return
    externalActivator.value.removeEventListener('click', activatorClick)
    externalActivator.value.removeEventListener('keydown', activatorKeydown)
}

const syncActivatorBehavior = async (): Promise<void> => {
    await nextTick()

    removeExternalActivatorListeners()

    const target = resolveCurrentActivator()
    externalActivator.value = props.activator ? target : null

    if (props.activator && target) {
        addExternalActivatorListeners(target)
    } else {
        updateActivatorAttributes(MenuReference.value)
    }
}

const unwrapActivatorTarget = (target: unknown): unknown => {
    if (isRef(target)) {
        return target.value
    }
    return target
}

const resolveCurrentActivator = (): HTMLElement | null => {
    const rawActivator = unwrapActivatorTarget(props.activator)

    if (typeof rawActivator === 'string') {
        const selector = rawActivator.trim()
        if (!selector) {
            return MenuReference.value
        }

        if (typeof document === 'undefined') {
            return null
        }

        try {
            return (document.querySelector(selector) || null) as HTMLElement | null
        } catch {
            return null
        }
    }

    if (isHTMLElementValue(rawActivator)) {
        return rawActivator
    }

    const activatorAsElement = resolveActivatorElement(rawActivator)
    if (activatorAsElement) {
        return activatorAsElement
    }

    return MenuReference.value
}

const currentActivator = computed(() => resolveCurrentActivator())

const activatorAttrs = computed(() => ({
    ref: setActivatorReference,
    onClick: handleActivatorClick,
    onKeydown: handleActivatorKeydown,
    'aria-haspopup': resolvedAriaHaspopup.value,
    'aria-expanded': String(opened.value),
    'aria-controls': resolvedAriaControls.value,
    'aria-disabled': String(Boolean(props.disableMenu)),
}))

const dataId = computed(() => {
    const child = currentActivator.value?.closest('.e-menu-container__wrapper')?.getAttribute('data-id')
    return child ? `${child}--child` : id
})

const openMenu = async (evt?: Event) => {
    evt?.stopPropagation()
    if (!props.disableMenu) {
        await nextTick()
        opened.value = true
    }
}
const closeMenu = () => {
    opened.value = false
}

const activatorClick = (evt: Event): void => {
    evt.stopPropagation();
    if (!props.disableMenu) {
        openMenu();
    }
}

const activatorKeydown = (evt: KeyboardEvent): void => handleActivatorKeydown(evt)

defineExpose({ openMenu, closeMenu })


</script>
<style lang="scss" src="./style.scss"></style>
