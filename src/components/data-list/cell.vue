<template>
    <div :class="cellClass">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { DataCellProps } from "@/types";

const props = withDefaults(defineProps<DataCellProps>(), {
    align: "start",
});

const cellClass = computed((): string[] => ["e-data-cell", `e-data-cell--align-${props.align}`]);
</script>
