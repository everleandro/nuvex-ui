<template>
    <div :class="rowClass" :role="rowRole" :tabindex="tabIndex" :aria-pressed="ariaPressed"
        :aria-disabled="props.disabled || undefined" @click="handleClick" @keydown="handleKeydown"
        @keyup="handleKeyup">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed, inject, type ComputedRef } from "vue";import { getBooleanClasses } from "@/composables/utils";
import type { DataRowElevation, DataRowProps } from "@/types";
import { DATA_LIST_ROW_ELEVATION_KEY, DATA_LIST_ROW_OUTLINED_KEY } from "./constants";

const props = withDefaults(defineProps<DataRowProps>(), {
    // `undefined` distingue "sin definir" de "apagado": sin esto Vue castea el boolean a false.
    outlined: undefined,
    elevation: undefined,
});

const emit = defineEmits<{
    (e: "click:row", event: MouseEvent | KeyboardEvent): void;
}>();

const listRowElevation = inject<ComputedRef<DataRowElevation | undefined> | undefined>(
    DATA_LIST_ROW_ELEVATION_KEY,
    undefined,
);
const listRowOutlined = inject<ComputedRef<boolean | undefined> | undefined>(
    DATA_LIST_ROW_OUTLINED_KEY,
    undefined,
);

const booleanClassKeys = ["clickable", "selected", "disabled"] as const;

// La prop propia gana sobre lo heredado del contenedor; `undefined` significa "sin definir".
const elevation = computed((): DataRowElevation => {
    return props.elevation ?? listRowElevation?.value ?? "sm";
});

const isOutlined = computed((): boolean => {
    return props.outlined ?? listRowOutlined?.value ?? false;
});

const isInteractive = computed((): boolean => Boolean(props.clickable) && !props.disabled);

const rowClass = computed((): string[] => {
    const classes = ["e-data-row", ...getBooleanClasses(props, booleanClassKeys, "e-data-row")];

    if (isOutlined.value) {
        classes.push("e-data-row--outlined");
    }

    if (elevation.value !== "none") {
        classes.push(`e-elevation--${elevation.value}`);
    }

    return classes;
});

const rowRole = computed((): string => (props.clickable ? "button" : "listitem"));
const tabIndex = computed((): number | undefined => {
    if (!props.clickable) return undefined;
    return props.disabled ? -1 : 0;
});
const ariaPressed = computed((): boolean | undefined => {
    return props.clickable ? Boolean(props.selected) : undefined;
});

const interactiveDescendantSelector = [
    "button",
    "a",
    "input",
    "select",
    "textarea",
    "summary",
    '[role="button"]',
    '[role="link"]',
    '[contenteditable="true"]',
].join(",");

// Los clicks nacidos de un control dentro de una celda no activan la fila.
const isFromInteractiveDescendant = (event: Event): boolean => {
    const target = event.target;
    const rowElement = event.currentTarget;

    if (!(target instanceof Element) || !(rowElement instanceof Element) || target === rowElement) {
        return false;
    }

    const interactiveTarget = target.closest(interactiveDescendantSelector);
    return Boolean(interactiveTarget) && interactiveTarget !== rowElement;
};

const handleClick = (event: MouseEvent): void => {
    if (!isInteractive.value || isFromInteractiveDescendant(event)) return;

    emit("click:row", event);
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (!isInteractive.value || isFromInteractiveDescendant(event)) return;

    if (event.key === "Enter") {
        event.preventDefault();
        emit("click:row", event);
        return;
    }

    if (event.key === " ") {
        event.preventDefault();
    }
};

const handleKeyup = (event: KeyboardEvent): void => {
    if (!isInteractive.value || isFromInteractiveDescendant(event)) return;

    if (event.key === " ") {
        event.preventDefault();
        emit("click:row", event);
    }
};
</script>
