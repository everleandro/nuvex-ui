<template>
    <div :class="cardClass" :style="cardStyle">
        <div :class="mainClass">
            <div v-if="hasMainPrepend" :class="mainPrependClass">
                <EAvatar v-if="prependAvatar" v-bind="resolvedPrependAvatarProps" />

                <EIcon v-else-if="prependIcon" v-bind="resolvedPrependIconProps" />
            </div>

            <div v-if="hasHeader" class="e-card__header">
                <span v-if="prependHeaderAvatar" class="e-card__prepend">
                    <EAvatar v-bind="resolvedPrependHeaderAvatarProps" />
                </span>

                <span v-else-if="prependHeaderIcon" class="e-card__prepend">
                    <EIcon v-bind="resolvedPrependHeaderIconProps" />
                </span>

                <div class="e-card__headline">
                    <p v-if="title" class="title e-card__title">{{ title }}</p>
                    <p v-if="subtitle" class="subtitle e-card__subtitle">{{ subtitle }}</p>
                </div>

                <span v-if="appendHeaderAvatar" class="e-card__append">
                    <EAvatar v-bind="resolvedAppendHeaderAvatarProps" />
                </span>

                <span v-else-if="appendHeaderIcon" class="e-card__append">
                    <EIcon v-bind="resolvedAppendHeaderIconProps" />
                </span>
            </div>

            <p v-if="description" class="type-body e-card__description">{{ description }}</p>

            <div class="e-card__body type-body">
                <slot> </slot>
            </div>

            <div v-if="hasMainAppend" :class="mainAppendClass">
                <EAvatar v-if="appendAvatar" v-bind="resolvedAppendAvatarProps" />

                <EIcon v-else-if="appendIcon" v-bind="resolvedAppendIconProps" />
            </div>
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
    tonal?: boolean
    title?: string
    subtitle?: string
    description?: string
    prependVerticalAlign?: CardVerticalAlign
    prependAvatar?: string
    prependAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    prependIcon?: Array<IconPath> | IconPath | string
    prependIconProps?: Partial<Omit<IconProps, 'icon'>>
    prependHeaderAvatar?: string
    prependHeaderAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    prependHeaderIcon?: Array<IconPath> | IconPath | string
    prependHeaderIconProps?: Partial<Omit<IconProps, 'icon'>>
    appendAvatar?: string
    appendAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    appendIcon?: Array<IconPath> | IconPath | string
    appendIconProps?: Partial<Omit<IconProps, 'icon'>>
    appendVerticalAlign?: CardVerticalAlign
    appendHeaderAvatar?: string
    appendHeaderAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    appendHeaderIcon?: Array<IconPath> | IconPath | string
    appendHeaderIconProps?: Partial<Omit<IconProps, 'icon'>>
}

type CardVerticalAlign = 'start' | 'center' | 'end' | 'stretch'

const props = defineProps<Props>()
const slots = useSlots()

const booleanClassKeys = ['outlined', 'depressed', 'tonal'] as const

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

const description = computed(() => {
    if (!props.description) {
        return ''
    }

    return props.description.trim()
})

const allowedVerticalAlignments: CardVerticalAlign[] = ['start', 'center', 'end', 'stretch']

const resolveVerticalAlign = (value?: string): CardVerticalAlign => {
    if (value && allowedVerticalAlignments.includes(value as CardVerticalAlign)) {
        return value as CardVerticalAlign
    }

    return 'start'
}

const prependAvatar = computed(() => props.prependAvatar)
const prependAvatarProps = computed(() => props.prependAvatarProps)
const prependIcon = computed(() => props.prependIcon)
const prependIconProps = computed(() => props.prependIconProps)
const prependVerticalAlign = computed(() => resolveVerticalAlign(props.prependVerticalAlign))
const prependHeaderAvatar = computed(() => props.prependHeaderAvatar)
const prependHeaderAvatarProps = computed(() => props.prependHeaderAvatarProps)
const prependHeaderIcon = computed(() => props.prependHeaderIcon)
const prependHeaderIconProps = computed(() => props.prependHeaderIconProps)
const appendAvatar = computed(() => props.appendAvatar)
const appendAvatarProps = computed(() => props.appendAvatarProps)
const appendIcon = computed(() => props.appendIcon)
const appendIconProps = computed(() => props.appendIconProps)
const appendVerticalAlign = computed(() => resolveVerticalAlign(props.appendVerticalAlign))
const appendHeaderAvatar = computed(() => props.appendHeaderAvatar)
const appendHeaderAvatarProps = computed(() => props.appendHeaderAvatarProps)
const appendHeaderIcon = computed(() => props.appendHeaderIcon)
const appendHeaderIconProps = computed(() => props.appendHeaderIconProps)

const resolvedPrependAvatarProps = computed(() => {
    return {
        ...(prependAvatarProps.value || {}),
        src: prependAvatar.value,
    }
})

const resolvedPrependIconProps = computed(() => {
    return {
        ...(prependIconProps.value || {}),
        icon: prependIcon.value,
    }
})

const resolvedPrependHeaderAvatarProps = computed(() => {
    return {
        ...(prependHeaderAvatarProps.value || {}),
        src: prependHeaderAvatar.value,
    }
})

const resolvedPrependHeaderIconProps = computed(() => {
    return {
        ...(prependHeaderIconProps.value || {}),
        icon: prependHeaderIcon.value,
    }
})

const resolvedAppendAvatarProps = computed(() => {
    return {
        ...(appendAvatarProps.value || {}),
        src: appendAvatar.value,
    }
})

const resolvedAppendIconProps = computed(() => {
    return {
        ...(appendIconProps.value || {}),
        icon: appendIcon.value,
    }
})

const resolvedAppendHeaderAvatarProps = computed(() => {
    return {
        ...(appendHeaderAvatarProps.value || {}),
        src: appendHeaderAvatar.value,
    }
})

const resolvedAppendHeaderIconProps = computed(() => {
    return {
        ...(appendHeaderIconProps.value || {}),
        icon: appendHeaderIcon.value,
    }
})

const hasMainPrepend = computed(() => !!prependAvatar.value || !!prependIcon.value)
const hasMainAppend = computed(() => !!appendAvatar.value || !!appendIcon.value)
const hasHeader = computed(() => {
    return !!title.value
        || !!subtitle.value
        || !!prependHeaderAvatar.value
        || !!prependHeaderIcon.value
        || !!appendHeaderAvatar.value
        || !!appendHeaderIcon.value
})
const hasFooter = computed(() => !!slots.footer)

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--card-color',
    contrastVar: '--card-contrast-color',
})

const mainClass = computed(() => {
    return {
        'e-card__main': true,
        'e-card__main--has-prepend': hasMainPrepend.value,
        'e-card__main--has-append': hasMainAppend.value,
    }
})

const mainPrependClass = computed(() => {
    return [
        'e-card__prepend',
        `e-card__prepend-${prependVerticalAlign.value}`,
    ]
})

const mainAppendClass = computed(() => {
    return [
        'e-card__append',
        `e-card__append-${appendVerticalAlign.value}`,
    ]
})

const cardClass = computed(() => {
    const classes: string[] = ['e-card']

    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-card'))

    if (props.elevation && !props.tonal) {
        classes.push(`e-elevation--${props.elevation}`)
    }

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