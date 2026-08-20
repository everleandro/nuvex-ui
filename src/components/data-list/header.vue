<template>
    <div :class="headerClass" role="presentation">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { getBooleanClasses } from "@/composables/utils";
import type { DataHeaderProps } from "@/types";

const props = defineProps<DataHeaderProps>();

const booleanClassKeys = ["sticky"] as const;

const headerClass = computed((): string[] => {
    return ["e-data-header", ...getBooleanClasses(props, booleanClassKeys, "e-data-header")];
});
</script>
