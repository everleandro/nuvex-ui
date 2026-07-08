<template>
    <div :class="gridColClass">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { useGridCol } from "@/composables/grid-col"
import type { ColProps } from "@/types"

const props = defineProps<ColProps>()
const { gridColClass } = useGridCol(props)
</script>