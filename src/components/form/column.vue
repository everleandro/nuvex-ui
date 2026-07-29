<template>
    <div :class="rootClass">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref, watch } from "vue"
import { FORM_KEY } from "@/components/form/constants"
import { useGridCol } from "@/composables/grid-col"
import type { ColProps, FormInjection, FormTableChild } from "@/types"

const props = defineProps<ColProps>()
const instance = getCurrentInstance()

if (!instance) {
    throw new Error("EFormColumn must be used within setup().")
}

const form = inject<FormInjection | undefined>(FORM_KEY, undefined)
const tableClasses = ref<Array<string>>([])

const { gridColClass } = useGridCol(props)

const getGridColConfiguration = (): Pick<FormTableChild, "cols" | "xs" | "sm" | "md" | "lg" | "xl"> => ({
    cols: props.cols,
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
})

const setTableClasses = (value: Array<string>): void => {
    tableClasses.value = [...value]
}

const rootClass = computed(() => [
    ...tableClasses.value,
    ...gridColClass.value,
])

watch(
    () => [props.cols, props.xs, props.sm, props.md, props.lg, props.xl] as const,
    () => {
        form?.updateTableChild?.({ uid: instance.uid, ...getGridColConfiguration() })
    },
)

onMounted(() => {
    form?.bindTableChild?.({
        uid: instance.uid,
        setTableClasses,
        ...getGridColConfiguration(),
    })
})

onUnmounted(() => {
    form?.unbindTableChild?.(instance.uid)
})
</script>