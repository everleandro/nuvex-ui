<template>
    <component ref="node" v-ripple="rippleBinding" :is="tagResult" :active-class="activeClass" v-bind="liBindingOptions"
        :class="listItemCLass" :style="mergedListItemStyle" @click="handleItemClick" @focus="handleItemFocus"
        @keydown="handleItemKeydown" @keyup="handleItemKeyup">
        <div v-if="hasPrepend" :class="prependClass">
            <slot name="prepend">
                <EIcon v-if="prependIcon" :icon="prependIcon"></EIcon>
                <EAvatar v-else-if="hasPrependAvatar" v-bind="prependAvatarProps"></EAvatar>
            </slot>
        </div>
        <div class="e-list-item__content">
            <span v-if="title" :id="titleId" class="e-list-item-title">{{ title }}</span>
            <span v-if="subtitle" :id="subtitleId" class="e-list-item-subtitle">{{ subtitle }}</span>
            <slot></slot>
        </div>
        <div v-if="hasAppend" :class="appendClass">
            <slot name="append">
                <EIcon v-if="appendIcon" :icon="appendIcon"></EIcon>
                <EAvatar v-else-if="hasAppendAvatar" v-bind="appendAvatarProps"></EAvatar>
            </slot>
        </div>
    </component>
</template>

<script lang="ts" setup>
import { EListGroupInjection, IconPath, EListInjection, Size, SizeProps } from '@/types'
import { useResolvedColor } from '@/composables/color'
import EIcon from '@/components/icon/index.vue';
import { ripple } from '@/directives'
import EAvatar, { Props as AvatarProps } from '@/components/avatar.vue';
import { computed, useAttrs, useSlots, inject, ref, useId, onBeforeUnmount, onMounted } from 'vue';
import { LIST_GROUP_KEY, LIST_KEY } from './constants';

const vRipple = { ...ripple }

export interface Props extends SizeProps {
    clickable?: boolean
    disabled?: boolean
    ripple?: boolean
    prependIcon?: string | IconPath | Array<IconPath>
    appendIcon?: string | IconPath | Array<IconPath>
    prependAvatar?: string
    prependAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    appendAvatar?: string
    appendAvatarProps?: Partial<Omit<AvatarProps, 'src'>>
    isActive?: boolean
    activeClass?: string
    title?: string
    subtitle?: string
    tag?: string
    color?: string
    activeColor?: string
    value?: string | number | undefined
}

const props = withDefaults(defineProps<Props>(), {
    clickable: undefined,
    ripple: true,
    isActive: undefined,
    activeClass: 'e-list-item--active',
})
const slots = useSlots()
const attrs = useAttrs()
const parentList = inject<Partial<EListInjection> | undefined>(LIST_KEY, undefined);
const parentGroup = inject<EListGroupInjection | undefined>(LIST_GROUP_KEY, undefined);
const node = ref<HTMLElement | null>(null)
const rawId = useId()

const itemId = computed((): string => {
    const attrId = attrs.id
    return typeof attrId === 'string' && attrId.length > 0 ? attrId : `e-list-item-${rawId}`
})

const titleId = computed((): string => `${itemId.value}-title`)

const subtitleId = computed((): string => `${itemId.value}-subtitle`)

const isDisabled = computed((): boolean => {
    return !!props.disabled || !!parentList?.disabled?.value
})

const isLinkItem = computed((): boolean => !!attrs.to)

const isGroupActivator = computed((): boolean => {
    return attrs['data-list-group-activator'] === true || attrs['data-list-group-activator'] === 'true'
})

const groupPath = computed((): string | undefined => {
    const value = attrs['data-list-group-path']
    return typeof value === 'string' && value.length > 0 ? value : undefined
})

const parentGroupPath = computed((): string | undefined => {
    const attrValue = attrs['data-list-group-parent-path']

    if (typeof attrValue === 'string') {
        return attrValue.length > 0 ? attrValue : undefined
    }

    return parentGroup?.path.value
})

const isExpandedGroupActivator = computed((): boolean => {
    return attrs['aria-expanded'] === true || attrs['aria-expanded'] === 'true'
})

const routeItemValue = computed((): string | number | undefined => {
    const target = attrs.to

    if (typeof target === 'string' || typeof target === 'number') {
        return target
    }

    if (!target || typeof target !== 'object') {
        return undefined
    }

    if ('path' in target && typeof target.path === 'string') {
        return target.path
    }

    if ('name' in target && (typeof target.name === 'string' || typeof target.name === 'number')) {
        return target.name
    }

    return undefined
})

const isNativeListItem = computed((): boolean => tagResult.value === 'li')

const isListboxItem = computed((): boolean => !!parentList?.isListbox?.value)

const hasInteractiveIntent = computed((): boolean => {
    if (isGroupActivator.value) return true
    if (props.clickable !== undefined) return props.clickable

    return isLinkItem.value || typeof parentList !== 'undefined'
})

const resolvedClickable = computed((): boolean => {
    return hasInteractiveIntent.value && !isDisabled.value
})

const isSelectable = computed((): boolean => {
    return resolvedClickable.value && isListboxItem.value && !isLinkItem.value && !isGroupActivator.value
})

const interactiveDescendantSelector = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    'summary',
    '[role="button"]',
    '[role="link"]',
    '[contenteditable="true"]',
    '[data-list-item-action]',
].join(',')

const isFromInteractiveDescendant = (evt: Event): boolean => {
    const target = evt.target
    const itemElement = evt.currentTarget
    if (!(target instanceof Element) || !(itemElement instanceof Element) || target === itemElement) return false

    const interactiveTarget = target.closest(interactiveDescendantSelector)
    return !!interactiveTarget && interactiveTarget !== itemElement && itemElement.contains(interactiveTarget)
}

const rippleBinding = computed(() => ({
    disabled: !props.ripple || !resolvedClickable.value,
    interactive: resolvedClickable.value,
    ignore: interactiveDescendantSelector,
}))

const currentTabIndex = computed((): number | undefined => {
    if (!hasInteractiveIntent.value) return undefined
    if (isDisabled.value) return -1

    const focusedId = parentList?.focusedItemId?.value

    if (!focusedId) return 0

    return focusedId === itemId.value ? 0 : -1
})

const itemValue = computed((): string | number => {
    return props.value ?? routeItemValue.value ?? rawId
})

const active = computed((): boolean => {
    if (typeof props.isActive !== "undefined") return props.isActive

    if (typeof parentList !== "undefined") {
        const modelValue = parentList?.modelValue?.value

        if (Array.isArray(modelValue)) {
            return modelValue.includes(itemValue.value)
        } else {
            return modelValue === itemValue.value
        }
    }
    return false
})

const emit = defineEmits<{
    (e: 'click:item', value: MouseEvent | KeyboardEvent): void
}>()

const liBindingOptions = computed((): Record<string, any> => {
    const options: Record<string, any> = {}
    options.id = itemId.value
    options['data-e-list-item'] = hasInteractiveIntent.value ? 'true' : undefined
    options['data-list-group-parent-path'] = parentGroupPath.value

    if (props.title) {
        options['aria-labelledby'] = titleId.value
    }

    if (props.subtitle) {
        options['aria-describedby'] = subtitleId.value
    }

    if (isDisabled.value) {
        options['aria-disabled'] = true
    }

    if (hasInteractiveIntent.value) {
        if (typeof currentTabIndex.value !== 'undefined') {
            options['tabindex'] = currentTabIndex.value
        }

        if (isListboxItem.value) {
            options['role'] = 'option'
            options['aria-selected'] = active.value
        } else if (isNativeListItem.value) {
            options['role'] = 'button'
            options['aria-pressed'] = active.value
        }
    }

    return options
})
const availableRootClasses = {
    disabled: "e-list-item--disabled",
    clickeable: "e-list-item--clickeable",
    root: "e-list-item",
    ripple: "v-ripple-element",
    interactiveActive: "interactive-element--active",
    active: "e-list-item--active",
};

const sizeClasses: Record<Size, string> = {
    'x-small': 'e-list-item--size-x-small',
    small: 'e-list-item--size-small',
    default: 'e-list-item--size-default',
    large: 'e-list-item--size-large',
    'x-large': 'e-list-item--size-x-large'
}


const hasPrependIcon = computed((): boolean => !!props.prependIcon)

const hasPrependAvatar = computed((): boolean => {
    return !!props.prependAvatar || !!props.prependAvatarProps
})

const hasPrependSlot = computed((): boolean => {
    return !!slots.prepend && !hasPrependIcon.value && !hasPrependAvatar.value
})

const prependAvatarProps = computed(() => ({
    ...(props.prependAvatarProps || {}),
    ...(props.prependAvatar ? { src: props.prependAvatar } : {}),
}))

const appendAvatarProps = computed(() => ({
    ...(props.appendAvatarProps || {}),
    ...(props.appendAvatar ? { src: props.appendAvatar } : {}),
}))

const hasAppendIcon = computed((): boolean => !!props.appendIcon)

const hasAppendAvatar = computed((): boolean => {
    return !!props.appendAvatar || !!props.appendAvatarProps
})

const hasAppendSlot = computed((): boolean => {
    return !!slots.append && !hasAppendIcon.value && !hasAppendAvatar.value
})

const prependTypeClass = computed((): string | undefined => {
    if (hasPrependIcon.value) return 'e-list-item--has-prepend-icon'
    if (hasPrependAvatar.value) return 'e-list-item--has-prepend-avatar'
    if (hasPrependSlot.value) return 'e-list-item--has-prepend-slot'
    return undefined
})

const appendTypeClass = computed((): string | undefined => {
    if (hasAppendIcon.value) return 'e-list-item--has-append-icon'
    if (hasAppendAvatar.value) return 'e-list-item--has-append-avatar'
    if (hasAppendSlot.value) return 'e-list-item--has-append-slot'
    return undefined
})

const { colorStyles: listItemColorStyle } = useResolvedColor({
    color: computed(() => props.color),
    inheritedColor: computed(() => parentList?.color?.value),
    colorVar: '--e-list-color',
    contrastVar: '--e-list-contrast',
})

const { colorStyles: listItemActiveColorStyle } = useResolvedColor({
    color: computed(() => props.activeColor),
    inheritedColor: computed(() => parentList?.activeColor?.value),
    colorVar: '--e-list-active-color',
})

const mergedListItemStyle = computed((): Record<string, string> => {
    return {
        ...listItemColorStyle.value,
        ...listItemActiveColorStyle.value,
    }
})

const listItemCLass = computed((): Array<unknown> => {
    const classes = [availableRootClasses.root, attrs.class || '']
    const currentSize = props.size || parentList?.size?.value || 'default'

    isDisabled.value && classes.push(availableRootClasses.disabled)
    prependTypeClass.value && classes.push(prependTypeClass.value)
    appendTypeClass.value && classes.push(appendTypeClass.value)
    if (resolvedClickable.value) {
        classes.push([availableRootClasses.clickeable, availableRootClasses.ripple].join(' '))
    }
    if (active.value) {
        classes.push(availableRootClasses.interactiveActive)
        classes.push(props.activeClass || '')
    }

    classes.push(sizeClasses[currentSize])

    return classes;
})

const hasPrepend = computed((): boolean => {
    return !!slots.prepend || hasPrependAvatar.value || !!props.prependIcon;
})

const hasAppend = computed((): boolean => {
    return !!slots.append || hasAppendAvatar.value || !!props.appendIcon;
})

const prependClass = computed((): Array<string> => {
    const classes = ['e-list-item__prepend']

    hasPrependIcon.value && classes.push('e-list-item__prepend--icon')
    hasPrependAvatar.value && classes.push('e-list-item__prepend--avatar')
    hasPrependSlot.value && classes.push('e-list-item__prepend--slot')

    return classes
})

const appendClass = computed((): Array<string> => {
    const classes = ['e-list-item__append']

    hasAppendIcon.value && classes.push('e-list-item__append--icon')
    hasAppendAvatar.value && classes.push('e-list-item__append--avatar')
    hasAppendSlot.value && classes.push('e-list-item__append--slot')

    return classes
})

const tagResult = computed((): string => {
    if (props.tag)
        return props.tag
    return attrs.to && props.clickable !== false ? "router-link" : "li"
});
const isActivator = computed((): boolean => {
    return !!attrs['data-activator-node']
})

const handleItemClick = (evt: MouseEvent | KeyboardEvent): void => {
    if (!resolvedClickable.value || isFromInteractiveDescendant(evt)) return

    emit('click:item', evt)
    parentList?.setFocusedItem?.(itemId.value)
    if (isGroupActivator.value) {
        parentList?.changeGroupValue?.(groupPath.value)
        return
    }
    if (isSelectable.value && !isActivator.value)
        parentList?.changeModelValue?.(itemValue.value)
}

const handleItemFocus = (): void => {
    if (!resolvedClickable.value) return
    parentList?.setFocusedItem?.(itemId.value)
}

const triggerKeyboardSelection = (evt: KeyboardEvent): void => {
    if (isLinkItem.value || evt.repeat) return

    handleItemClick(evt)
}

const handleItemKeydown = (evt: KeyboardEvent): void => {
    if (!resolvedClickable.value || isFromInteractiveDescendant(evt)) return

    if (evt.key === 'ArrowDown') {
        evt.preventDefault()
        parentList?.moveFocus?.(itemId.value, 'next')
        return
    }

    if (evt.key === 'ArrowUp') {
        evt.preventDefault()
        parentList?.moveFocus?.(itemId.value, 'previous')
        return
    }

    if (evt.key === 'Home') {
        evt.preventDefault()
        parentList?.moveFocus?.(itemId.value, 'first')
        return
    }

    if (evt.key === 'End') {
        evt.preventDefault()
        parentList?.moveFocus?.(itemId.value, 'last')
        return
    }

    if (evt.key === 'ArrowRight') {
        evt.preventDefault()
        parentList?.navigateGroupedFocus?.({
            currentId: itemId.value,
            direction: 'in',
            isGroupActivator: isGroupActivator.value,
            isExpanded: isExpandedGroupActivator.value,
            groupPath: groupPath.value,
            parentGroupPath: parentGroupPath.value,
        })
        return
    }

    if (evt.key === 'ArrowLeft') {
        evt.preventDefault()
        parentList?.navigateGroupedFocus?.({
            currentId: itemId.value,
            direction: 'out',
            isGroupActivator: isGroupActivator.value,
            isExpanded: isExpandedGroupActivator.value,
            groupPath: groupPath.value,
            parentGroupPath: parentGroupPath.value,
        })
        return
    }

    if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault()
    }
}

const handleItemKeyup = (evt: KeyboardEvent): void => {
    if (!resolvedClickable.value || isLinkItem.value || isFromInteractiveDescendant(evt)) return
    if (evt.key !== ' ' && evt.key !== 'Enter') return

    evt.preventDefault()
    triggerKeyboardSelection(evt)
}

onMounted(() => {
    if (!hasInteractiveIntent.value) return
    parentList?.syncFocusableItem?.(itemId.value)
})

onBeforeUnmount(() => {
    if (parentList?.focusedItemId?.value !== itemId.value) return
    parentList?.setFocusedItem?.(null)
    parentList?.syncFocusableItem?.()
})
</script>