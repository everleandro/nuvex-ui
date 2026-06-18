<template>
    <div :class="cardClass" :style="cardStyle">
        <div class="e-card__main">
            <div v-if="hasHeader" class="e-card__header">
                <span v-if="prependAvatar" class="e-card__prepend">
                    <EAvatar v-bind="resolvedPrependAvatarProps"/>
                </span>

                <span v-else-if="prependIcon" class="e-card__prepend">
                    <EIcon v-bind="resolvedPrependIconProps"/>
                </span>

                <div class="e-card__headline">
                    <p v-if="title" class="e-card__title">{{ title }}</p>
                    <p v-if="subtitle" class="e-card__subtitle">{{ subtitle }}</p>
                </div>
            </div>

            <slot> </slot>
        </div>

        <div v-if="hasFooter" class="e-card__footer">
            <slot name="footer"> </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import EAvatar, { Props as AvatarProps } from '@/components/avatar.vue';
import EIcon from '@/components/icon/index.vue';
import { ElevationProps, IconPath, IconProps } from '@/types';
import { useResolvedColor } from '@/composables/color';
import { getBooleanClasses, normalizeDimension } from '@/composables/utils';

export interface Props extends ElevationProps {
    height?: string
    color?: string
    outlined?: boolean
    depressed?: boolean
    title?: string
    subtitle?: string
    prependAvatar?: string
    prependAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    prependIcon?: Array<IconPath> | IconPath | string
    prependIconProps?: Partial<Omit<IconProps, 'icon'>>
}
const props = defineProps<Props>()
const slots = useSlots()

const booleanClassKeys = ['outlined', 'depressed'] as const

const title = computed(() => {
    if (!props.title) {
        return ''
    }

    return props.title.trim()
})

const subtitle = computed(() => {
    if (!props.subtitle) {
        return ''
    }

    return props.subtitle.trim()
})

const prependAvatar = computed(() => props.prependAvatar)
const prependAvatarProps = computed(() => props.prependAvatarProps)
const prependIcon = computed(() => props.prependIcon)
const prependIconProps = computed(() => props.prependIconProps)

const resolvedPrependAvatarProps = computed(() => {
    return {
        ...(prependAvatarProps.value || {}),
        src: prependAvatar.value,
    }
})

const resolvedPrependIconProps = computed(() => {
    return {
        stateLayer: true,
        ...(prependIconProps.value || {}),
        icon: prependIcon.value,
    }
})
const hasHeader = computed(() => !!title.value || !!subtitle.value || !!prependAvatar.value || !!prependIcon.value)
const hasFooter = computed(() => !!slots.footer)

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--card-bg',
    contrastVar: '--card-text',
})

const cardClass = computed(() => {
    const classes: string[] = ['e-card']

    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-card'))

    props.elevation && classes.push(`e-elevation--${props.elevation}`)

    return classes
})

const cardStyle = computed((): Record<string, string> => {
    const result: Record<string, string> = { ...colorStyles.value }
    const height = normalizeDimension(props.height)

    if (height) {
        result.height = height
    }

    return result;
})

</script>
<style lang="scss" src="./style.scss"></style>