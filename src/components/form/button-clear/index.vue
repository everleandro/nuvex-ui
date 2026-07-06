<template>
    <transition name="scale">
        <EButton v-show="show" class="e-field__clear" :icon="iconClear" elevation="none" tonal aria-label="Clear"
            size="x-small" @click.stop.prevent="() => emit('clear')" />
    </transition>
</template>
<script lang="ts" setup>
import { IconPath } from '@/types';
import icon from "@/utils/icons";
import { computed } from "vue";
import EButton from "@/components/button/index.vue";
export interface Props {
    show: boolean;
    icon?: IconPath | Array<IconPath> | string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "clear"): void;
}>();

const iconClear = computed(() => props.icon ?? icon.clear);
</script>
<style lang="scss">
.e-field__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    --btn-height: 1.6rem;

    &::before {
        transition: none;
    }
}
</style>