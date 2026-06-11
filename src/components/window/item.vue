<template>
    <div
        v-show="active"
        :class="['e-window__item', 'e-window-item', { 'e-window__item--active e-window-item--active': active }]"
        :data-value="value"
        role="tabpanel"
        :id="panelId"
        :aria-labelledby="tabId"
        :aria-hidden="!active"
        :tabindex="active ? 0 : -1"
    >
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { computed, inject } from "vue";
import { EWindow } from "./index.vue"

export interface Props {
    value: string | number
}
const props = defineProps<Props>()
const Group = inject<Partial<EWindow> | undefined>("EWindow", undefined);

const active = computed(() => Group?.modelValue?.value === props.value)
const panelId = computed(() => Group?.name?.value ? `${Group.name.value}-panel-${String(props.value)}` : undefined)
const tabId = computed(() => Group?.name?.value ? `${Group.name.value}-tab-${String(props.value)}` : undefined)
</script>