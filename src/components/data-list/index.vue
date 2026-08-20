<template>
    <div :class="listClass" role="list" :style="listStyle" :aria-label="props.ariaLabel">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed, provide } from "vue";
import { getBooleanClasses } from "@/composables/utils";
import type { DataListProps, DataRowElevation } from "@/types";
import { DATA_LIST_ROW_ELEVATION_KEY, DATA_LIST_ROW_OUTLINED_KEY } from "./constants";

const props = withDefaults(defineProps<DataListProps>(), {
    rowOutlined: undefined,
    rowElevation: undefined,
});

const booleanClassKeys = ["outlined", "divided"] as const;

const gridTemplateColumns = computed((): string | undefined => {
    if (typeof props.columns === "number") {
        return `repeat(${Math.max(1, Math.trunc(props.columns))}, minmax(0, 1fr))`;
    }

    if (Array.isArray(props.columns) && props.columns.length) {
        return props.columns.join(" ");
    }

    return undefined;
});

// El template vive en el contenedor y baja por herencia de custom property,
// asi header y filas comparten exactamente la misma definicion de columnas.
const listStyle = computed((): Record<string, string> => {
    if (!gridTemplateColumns.value) {
        return {};
    }

    return { "--e-data-list-columns": gridTemplateColumns.value };
});

const listClass = computed((): string[] => {
    const classes = ["e-data-list", ...getBooleanClasses(props, booleanClassKeys, "e-data-list")];

    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`);
    }

    return classes;
});

// En modo divided las filas se aplanan por defecto: el separador reemplaza a la sombra.
const rowElevation = computed((): DataRowElevation | undefined => {
    return props.rowElevation ?? (props.divided ? "none" : undefined);
});

provide(DATA_LIST_ROW_ELEVATION_KEY, rowElevation);
provide(DATA_LIST_ROW_OUTLINED_KEY, computed(() => props.rowOutlined));
</script>

<style lang="scss" src="./style.scss"></style>
