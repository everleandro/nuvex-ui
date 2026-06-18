<template>
    <i v-if="mounted" ref="iconElement" v-cloak aria-hidden="true" :class="iconClass" :style="iconStyle">
        <span v-if="stateLayer" class="e-icon__state-layer" aria-hidden="true"></span>
        <slot>
            <svg v-if="isPath" xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" role="img" aria-hidden="true"
                class="e-icon__svg">
                <path v-for="(line, i) in paths" v-bind="(bindPathAttributes(line) as Object)" :key="i"></path>
            </svg>
        </slot>
    </i>
</template>
<script lang="ts">
export default {
    name: 'e-icon',
}
</script>
<script lang="ts" setup>
import type { IconPath, IconProps } from '@/types';
import { useResolvedColor } from '@/composables/color'
import { getColorCssValue } from '@/utils/style'
import { ComputedRef, computed, ref, useAttrs, onMounted } from 'vue';
import { getBooleanClasses, useUtils } from "@/composables/utils"
const { isObject } = useUtils()
const mounted = ref(false)

const attrs = useAttrs()

const props = withDefaults(defineProps<IconProps>(), { viewBox: '0 0 24 24' })

const booleanClassKeys = ['disabled', 'stateLayer'] as const
const defaultIconClass = 'icon'
const defaultIconPrefix = 'icon-'

const resolvedRootConfig = computed(() => {
    if (typeof window === 'undefined') {
        return {
            iconClass: defaultIconClass,
            iconPrefix: defaultIconPrefix,
        }
    }

    const rootVar = window.getComputedStyle(document.documentElement)

    return {
        iconClass: rootVar.getPropertyValue('--e-icon-class').trim() || defaultIconClass,
        iconPrefix: rootVar.getPropertyValue('--e-icon-prefix').trim() || defaultIconPrefix,
    }
})

const resolvedPrefix = computed(() => {
    return (props.prefix || props.preffix || resolvedRootConfig.value.iconPrefix).trim()
})

const resolvedStringIcon = computed(() => {
    return typeof props.icon === 'string' ? props.icon.trim() : ''
})

const isPath = computed(() => {
    return typeof props.icon !== 'string'
})

const paths = computed((): Array<IconPath> => {
    if (!isPath.value) {
        return []
    } else if (isObject(props.icon)) {
        return [props.icon as IconPath]
    } else return props.icon as Array<IconPath>
})

const iconElement = ref(null)

const bindPathAttributes = (
    path: IconPath
): Object => {
    const d = typeof path === 'string' ? path : path?.d;
    const result: Record<string, unknown> = { d }

    if (typeof path === 'object' && path?.class) {
        result.class = path.class
    }

    if (typeof path === 'object' && path?.fill) {
        const resolvedFill = getColorCssValue(path.fill) || path.fill
        result.style = { fill: resolvedFill }
    }

    return result
}

const { colorStyles: iconStyle } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-icon-color',
})

const stateLayer = computed(() => props.stateLayer)

const iconClass: ComputedRef<Array<string>> = computed((): Array<string> => {
    const defaultClass = attrs.class ? `${attrs.class}` : ''
    let classes = ['e-icon', resolvedRootConfig.value.iconClass];

    defaultClass && classes.push(defaultClass)

    if (props.size) {
        classes.push(`e-icon--size-${props.size}`)
    }

    !isPath.value && resolvedStringIcon.value && classes.push(`${resolvedPrefix.value}${resolvedStringIcon.value}`);

    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-icon'))

    return classes
})

onMounted(() => {
    mounted.value = true;
});

</script>
<style lang="scss" src="./style.scss"></style>