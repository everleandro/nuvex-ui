<template>
    <ul
        ref="listNode"
        :class="listCLass"
        :style="listStyle"
        :role="listRole"
        :aria-disabled="props.disabled || undefined"
        :aria-orientation="listOrientation"
        :aria-multiselectable="isMultiselectable || undefined"
    >
        <slot />
    </ul>
</template>
  
<script lang="ts" setup>
import { computed, inject, nextTick, provide, ref, useAttrs } from 'vue'
import { useResolvedColor } from '@/composables/color'
import { EListInjection, ElevationProps, ListFocusMoveDirection, ListModelProp, SizeProps } from '@/types'
import { LIST_KEY } from './constants';

type ListValue = string | number | undefined | null

export interface Props extends ElevationProps, SizeProps {
    disabled?: boolean
    outlined?: boolean
    dense?: boolean
    inset?: boolean
    color?: string
    group?: ListModelProp,
    modelValue?: ListModelProp
}
const props = defineProps<Props>()
const attrs = useAttrs()
const parentList = inject<Partial<EListInjection> | undefined>(LIST_KEY, undefined)
const listNode = ref<HTMLElement | null>(null)
const focusedItemId = ref<string | null>(null)
const internalGroup = ref<ListModelProp>([])

const emit = defineEmits<{
    (e: 'update:modelValue', value: ListModelProp): void
    (e: 'update:group', value: ListModelProp): void
}>()

const modelValue = computed<ListModelProp>({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value)
    }
})

const isGroupControlled = computed((): boolean => props.group !== undefined)

const group = computed<ListModelProp>({
    get: () => isGroupControlled.value ? props.group : internalGroup.value,
    set: (value) => {
        if (isGroupControlled.value) {
            emit('update:group', value)
            return
        }

        internalGroup.value = value
    }
})

const booleanClassKeys = ['disabled', 'dense', 'outlined', 'inset'] as const

const explicitRole = computed((): string | undefined => {
    return typeof attrs.role === 'string' ? attrs.role : undefined
})

const isListbox = computed((): boolean => {
    if (explicitRole.value) return explicitRole.value === 'listbox'
    return props.modelValue !== undefined
})

const isMultiselectable = computed((): boolean => {
    return isListbox.value && Array.isArray(props.modelValue)
})

const listRole = computed((): string | undefined => {
    if (explicitRole.value) return explicitRole.value
    return isListbox.value ? 'listbox' : undefined
})

const listOrientation = computed((): 'vertical' | undefined => {
    return listRole.value === 'listbox' ? 'vertical' : undefined
})

const listCLass = computed((): Array<string> => {
    const classes = ['e-list']
    props.elevation && classes.push(`e-elevation--${props.elevation}`)

    booleanClassKeys.forEach((key) => {
        if (props[key]) {
            classes.push(`e-list--${key}`)
        }
    })

    return classes;

})

const { resolvedColor, colorStyles: listStyle } = useResolvedColor({
    color: computed(() => props.color),
    inheritedColor: computed(() => parentList?.color?.value),
    colorVar: '--e-list-color',
    contrastVar: '--e-list-contrast',
})

const changeModelValue = (value: ListValue): void => {
    let result: ListModelProp = value
    if (Array.isArray(modelValue.value)) {
        if (modelValue.value.includes(value as string | number)) {
            result = modelValue.value.filter((v) => v !== value)    
        } else {
            result = [...modelValue.value, value as string | number]
        }
    } else {
        result = value === modelValue.value ? undefined : value
    }

    modelValue.value = result
}

const changeGroupValue = (value: ListModelProp): void => {
    let result = value
    if (Array.isArray(group.value)) {
        if (group.value.includes(value as string | number)) {
            result = group.value.filter((v) => v !== value)
        } else {
            result = [...group.value, value as string | number]
        }

    } else {
        result = value === group.value ? undefined : value
    }
    group.value = result
}

const getFocusableItems = (): Array<HTMLElement> => {
    if (!listNode.value) return []

    return Array.from(
        listNode.value.querySelectorAll<HTMLElement>('[data-e-list-item="true"]')
    ).filter((item) => {
        return item.getAttribute('aria-disabled') !== 'true' && item.getClientRects().length > 0
    })
}

const isGroupOpen = (path: string): boolean => {
    if (Array.isArray(group.value)) {
        return group.value.includes(path)
    }

    return group.value === path
}

const setGroupExpanded = (path: string, expanded: boolean): boolean => {
    if (expanded === isGroupOpen(path)) return false

    changeGroupValue(path)
    return true
}

const focusItemByPredicate = (predicate: (item: HTMLElement) => boolean): boolean => {
    const item = getFocusableItems().find(predicate)

    if (!item?.id) return false

    focusedItemId.value = item.id
    item.focus()
    return true
}

const focusGroupActivator = (path: string): boolean => {
    return focusItemByPredicate((item) => {
        return item.dataset.listGroupActivator === 'true' && item.dataset.listGroupPath === path
    })
}

const focusFirstChildInGroup = (path: string): boolean => {
    return focusItemByPredicate((item) => item.dataset.listGroupParentPath === path)
}

const setFocusedItem = (value: string | null): void => {
    focusedItemId.value = value
}

const focusItemAtIndex = (items: Array<HTMLElement>, index: number): void => {
    const item = items[index]
    if (!item?.id) return

    focusedItemId.value = item.id
    item.focus()
}

const moveFocus = (currentId: string, direction: ListFocusMoveDirection): void => {
    const items = getFocusableItems()

    if (items.length === 0) return

    const currentIndex = items.findIndex((item) => item.id === currentId)

    if (direction === 'first') {
        focusItemAtIndex(items, 0)
        return
    }

    if (direction === 'last') {
        focusItemAtIndex(items, items.length - 1)
        return
    }

    if (currentIndex === -1) {
        focusItemAtIndex(items, 0)
        return
    }

    const nextIndex = direction === 'next'
        ? Math.min(currentIndex + 1, items.length - 1)
        : Math.max(currentIndex - 1, 0)

    focusItemAtIndex(items, nextIndex)
}

const navigateGroupedFocus = ({
    direction,
    isGroupActivator,
    isExpanded,
    groupPath,
    parentGroupPath,
}: {
    currentId: string
    direction: 'in' | 'out'
    isGroupActivator?: boolean
    isExpanded?: boolean
    groupPath?: string
    parentGroupPath?: string
}): void => {
    if (direction === 'in') {
        if (!isGroupActivator || !groupPath) return

        if (!isExpanded) {
            const changed = setGroupExpanded(groupPath, true)

            if (changed) {
                void nextTick(() => {
                    focusFirstChildInGroup(groupPath)
                })
                return
            }
        }

        focusFirstChildInGroup(groupPath)
        return
    }

    if (isGroupActivator && groupPath && isExpanded) {
        setGroupExpanded(groupPath, false)
        return
    }

    if (parentGroupPath) {
        focusGroupActivator(parentGroupPath)
    }
}

const syncFocusableItem = (candidateId?: string): void => {
    void nextTick(() => {
        const items = getFocusableItems()

        if (items.length === 0) {
            focusedItemId.value = null
            return
        }

        const activeId = focusedItemId.value
        const hasActiveItem = !!activeId && items.some((item) => item.id === activeId)

        if (hasActiveItem) return

        const candidateIndex = candidateId
            ? items.findIndex((item) => item.id === candidateId)
            : -1

        focusedItemId.value = candidateIndex >= 0 ? items[candidateIndex].id : items[0].id
    })
}

provide(LIST_KEY, {
    changeModelValue,
    changeGroupValue,
    modelValue,
    group,
    color: resolvedColor,
    size: computed(() => props.size),
    disabled: computed(() => !!props.disabled),
    isListbox,
    focusedItemId: computed(() => focusedItemId.value),
    setFocusedItem,
    moveFocus,
    navigateGroupedFocus,
    syncFocusableItem,
});

</script>
<style lang="scss" src="./style.scss"></style>
  