<template>
    <div :class="groupClass" :role="props.role" :aria-label="props.ariaLabel">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { getBooleanClasses } from "@/composables/utils";
import type { ElevationLevel } from "@/types";

export type ButtonGroupRole = "group" | "toolbar" | "radiogroup";

export interface ButtonGroupProps {
    vertical?: boolean;
    block?: boolean;
    divided?: boolean;
    rounded?: boolean;
    outlined?: boolean;
    elevation?: ElevationLevel;
    role?: ButtonGroupRole;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<ButtonGroupProps>(), {
    role: "group",
});

const booleanClassKeys = ["vertical", "block", "divided", "rounded"] as const;

const groupClass = computed((): string[] => {
    const classes = ["e-btn-group"];

    classes.push(...getBooleanClasses(props, booleanClassKeys, "e-btn-group"));

    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`);
    }

    return classes;
});
</script>

<style lang="scss" src="./group.scss"></style>
