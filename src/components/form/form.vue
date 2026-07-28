<template>
    <form ref="form" :class="mergedClass" :style="mergedStyle" v-on:submit="submit">
        <slot></slot>
    </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "EForm"
})
</script>

<script lang="ts" setup>
import { FORM_KEY } from '@/components/form/constants';
import { useGridRow } from '@/composables/grid-row';
import type { Breakpoint, ColProps, EField, ElevationProps, FieldConfiguration, FieldLabelBehavior, RowProps } from '@/types';
import { getColorContrastCssValue, getColorCssValue, normalizeCssSize } from '@/utils/style';
import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue';

export interface Props extends RowProps, ElevationProps {
    modelValue?: boolean | undefined
    lazy?: boolean
    focusFirstInvalid?: boolean
    validateOnSubmit?: boolean
    outlined?: boolean
    disabled?: boolean
    readonly?: boolean
    labelBehavior?: FieldLabelBehavior
    labelMinWidth?: string | number
    retainColor?: boolean
    fieldColor?: string
    color?: string
    table?: boolean
    tableLineColor?: string
    tableCellBackgroundColor?: string
    tableFieldColor?: string
    tableLineOpacity?: string | number
}

const props = withDefaults(defineProps<Props>(), { modelValue: undefined })
const form = ref<HTMLFormElement | null>(null)

const { gridRowClass, gridRowStyle } = useGridRow(props)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: SubmitEvent): void
    (e: 'submit-invalid', value: SubmitEvent): void
}>()

const state = reactive({
    fieldsChild: new Array<Partial<EField>>(),
    fieldsChildError: new Array<boolean>(),
});
const activeBreakpoint = ref<Breakpoint>('xs')

const breakpointOrder: Array<Breakpoint> = ['xs', 'sm', 'md', 'lg', 'xl']

const effectiveConfiguration = computed<FieldConfiguration>(() => {
    const configuration: FieldConfiguration = {
        retainColor: Boolean(props.retainColor),
        dense: Boolean(props.dense),
        disabled: Boolean(props.disabled),
        readonly: Boolean(props.readonly),
        outlined: Boolean(props.outlined),
        labelBehavior: props.labelBehavior,
    }

    const labelMinWidth = normalizeCssSize(props.labelMinWidth)

    if (labelMinWidth) {
        configuration.labelStyle = { minWidth: labelMinWidth }
    }

    const resolvedFieldColor = props.fieldColor || props.color

    if (resolvedFieldColor) {
        configuration.color = resolvedFieldColor
    }

    return configuration
})

const formClass = computed(() => {
    const result: Array<string> = ['e-form']
    props.outlined && result.push('e-form--outlined')
    props.disabled && result.push('e-form--disabled')
    props.readonly && result.push('e-form--readonly')
    props.table && result.push('e-form--table')
    props.tableLineColor && result.push('e-form--table--has-line-color')
    props.elevation && result.push(`e-elevation--${props.elevation}`)
    return result
})

const formStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}

    if (!props.table) {
        return result
    }

    const legacyTableLineColor = !props.tableLineColor && !props.fieldColor ? props.color : undefined
    const resolvedTableLineColor = props.tableLineColor || legacyTableLineColor
    const resolvedTableCellBackgroundColor = props.tableCellBackgroundColor || props.tableFieldColor

    const resolvedLineColor = getColorCssValue(resolvedTableLineColor)
    const resolvedCellBackgroundColor = getColorCssValue(resolvedTableCellBackgroundColor)
    const resolvedLegacyContrastCellBackgroundColor = getColorContrastCssValue(legacyTableLineColor, {
        fallbackContrast: 'var(--e-color-surface-base, white)',
    })
    const resolvedLineOpacity = props.tableLineOpacity

    if (resolvedLineColor) {
        result['--e-form-table-line-color'] = resolvedLineColor
    }

    const resolvedFieldBackgroundColor = resolvedCellBackgroundColor ?? resolvedLegacyContrastCellBackgroundColor

    if (resolvedFieldBackgroundColor) {
        result['--e-form-table-field-bg'] = resolvedFieldBackgroundColor
    }

    if (resolvedLineOpacity !== undefined && resolvedLineOpacity !== null && resolvedLineOpacity !== '') {
        result['--e-form-table-line-opacity'] = String(resolvedLineOpacity)
    }

    return result
})

const effectiveGridRowStyle = computed<Record<string, string>>(() => {
    const result = { ...gridRowStyle.value }

    if (props.table && !result['--e-grid-gap']) {
        result['--e-grid-gap'] = '1px'
    }

    return result
})

const mergedClass = computed<Array<string>>(() => [
    ...formClass.value,
    ...gridRowClass.value,
])

const mergedStyle = computed<Record<string, string>>(() => ({
    ...formStyle.value,
    ...effectiveGridRowStyle.value,
}))

const getComputedNumericCssVar = (name: string, fallback: number): number => {
    if (typeof window === 'undefined') return fallback

    const styles = getComputedStyle(document.documentElement)
    const value = Number.parseInt(styles.getPropertyValue(name), 10)
    return Number.isFinite(value) ? value : fallback
}

const updateActiveBreakpoint = (): void => {
    if (typeof window === 'undefined') return

    const sm = getComputedNumericCssVar('--e-grid-breakpoint-sm', 600)
    const md = getComputedNumericCssVar('--e-grid-breakpoint-md', 960)
    const lg = getComputedNumericCssVar('--e-grid-breakpoint-lg', 1264)
    const xl = getComputedNumericCssVar('--e-grid-breakpoint-xl', 1904)
    const width = window.innerWidth

    if (width >= xl) {
        activeBreakpoint.value = 'xl'
        return
    }

    if (width >= lg) {
        activeBreakpoint.value = 'lg'
        return
    }

    if (width >= md) {
        activeBreakpoint.value = 'md'
        return
    }

    if (width >= sm) {
        activeBreakpoint.value = 'sm'
        return
    }

    activeBreakpoint.value = 'xs'
}

const getFormGridCols = (): number => {
    if (typeof window === 'undefined') return 12

    const target = form.value || document.documentElement
    const value = Number.parseInt(getComputedStyle(target).getPropertyValue('--e-grid-cols'), 10)
    return Number.isFinite(value) && value > 0 ? value : 12
}

const normalizeSpan = (value: ColProps['cols'], totalCols: number): number => {
    if (value === 'auto') return totalCols

    const parsed = Number.parseInt(`${value ?? ''}`, 10)

    if (!Number.isFinite(parsed) || parsed <= 0) return totalCols

    return Math.min(parsed, totalCols)
}

const resolveSpanForBreakpoint = (field: Partial<EField>, breakpoint: Breakpoint, totalCols: number): number => {
    const activeIndex = breakpointOrder.indexOf(breakpoint)

    for (let index = activeIndex; index >= 0; index -= 1) {
        const key = breakpointOrder[index]
        const value = field[key]

        if (value !== undefined && value !== null) {
            return normalizeSpan(value, totalCols)
        }
    }

    return normalizeSpan(field.cols, totalCols)
}

const syncTableClasses = (): void => {
    if (!props.table) {
        state.fieldsChild.forEach((field) => field.setTableClasses?.([]))
        return
    }

    const totalCols = getFormGridCols()
    let row = 1
    let col = 1

    const layout = state.fieldsChild.map((field) => {
        const span = resolveSpanForBreakpoint(field, activeBreakpoint.value, totalCols)

        if ((col + span - 1) > totalCols) {
            row += 1
            col = 1
        }

        const currentField = {
            field,
            row,
            colStart: col,
            colEnd: col + span - 1,
        }

        col += span

        return currentField
    })

    const lastRow = layout.at(-1)?.row || 1

    layout.forEach(({ field, row: fieldRow, colStart, colEnd }) => {
        const classes = ['e-form__child']
        const firstRow = fieldRow === 1
        const lastRowField = fieldRow === lastRow
        const firstCol = colStart === 1
        const lastCol = colEnd === totalCols

        firstRow && classes.push('e-form__child--first-row')
        lastRowField && classes.push('e-form__child--last-row')
        firstCol && classes.push('e-form__child--first-col')
        lastCol && classes.push('e-form__child--last-col')

        if (firstRow && firstCol) classes.push('e-form__child--top-left')
        if (firstRow && lastCol) classes.push('e-form__child--top-right')
        if (lastRowField && firstCol) classes.push('e-form__child--bottom-left')
        if (lastRowField && lastCol) classes.push('e-form__child--bottom-right')

        field.setTableClasses?.(classes)
    })
}

watch(() => state.fieldsChildError, (val: Array<boolean>) => {
    const valid = !val.find((e) => !!e)
    changeValue(valid)
}, { deep: true })

const submit = async (event: Event): Promise<void> => {
    event.preventDefault()

    if (props.validateOnSubmit) {
        const valid = await validate()

        if (!valid) {
            emit('submit-invalid', event as SubmitEvent)
            return
        }
    }

    emit('submit', event as SubmitEvent)
}

const bindField = (component: Partial<EField>) => {
    state.fieldsChild.push(component);
    state.fieldsChildError.push(Boolean(component.hasError));
    component.setConfiguration?.(effectiveConfiguration.value);
    syncTableClasses()
}

const unbindField = (uid: number) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === uid);
    if (index > -1) {
        state.fieldsChild.splice(index, 1);
        state.fieldsChildError.splice(index, 1);
        syncTableClasses()
    }
}

const updateField = (component: Partial<EField>) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === component.uid);
    if (index > -1) {
        Object.assign(state.fieldsChild[index], component)

        if (component.hasError !== undefined) {
            state.fieldsChildError.splice(index, 1, Boolean(component.hasError))
        }

        syncTableClasses()
    }
}

provide(FORM_KEY, {
    bindField,
    unbindField,
    updateField
});

const changeValue = (value: boolean): void => {
    emit('update:modelValue', value)
}

const reset = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.reset?.();
    });
}

const resetValidation = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.resetValidation?.();
    });
}

const setConfiguration = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.setConfiguration?.(effectiveConfiguration.value);
    });
}

watch(effectiveConfiguration, () => setConfiguration(), { deep: true, immediate: true })
watch(() => props.table, () => syncTableClasses(), { immediate: true })
watch(activeBreakpoint, () => syncTableClasses())

onMounted(() => {
    updateActiveBreakpoint()
    syncTableClasses()

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateActiveBreakpoint)
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateActiveBreakpoint)
    }
})

const getFirstInvalidField = (): Partial<EField> | undefined => {
    const invalidIndex = state.fieldsChildError.findIndex(Boolean)
    return invalidIndex >= 0 ? state.fieldsChild[invalidIndex] : undefined
}

const validate = async (): Promise<boolean> => {
    let valid = true;
    state.fieldsChild.forEach((vueComponent) => {
        if (!vueComponent.validate?.()) {
            //form is not valid if almost one field is invalid 
            valid = false
        }
    });
    await nextTick()

    if (!valid && props.focusFirstInvalid) {
        getFirstInvalidField()?.focus?.()
    }

    return valid
}

defineExpose({ validate, reset, resetValidation })

</script>
<style lang="scss" src="./style.scss"></style>