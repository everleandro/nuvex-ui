<template>
    <hr role="separator" :aria-orientation="orientation" :class="dividerClass" />
</template>
  
<script lang="ts" setup>
import { computed } from 'vue';

export interface Props {
    vertical?: boolean
}

const props = defineProps<Props>()

const dividerClass = computed(() => {
    const classes = ['e-divider']
    return classes
})
const orientation = computed(() => props.vertical ? 'vertical' : 'horizontal')


</script>
<style lang="scss" >
.e-divider {
    display: block;
    flex: 1 1 0px;
    max-width: 100%;
    height: 0;
    max-height: 0;
    border-style: solid;
    border-width: thin 0 0;
    transition: inherit;
    min-width: 100%;
    margin: 0;
    opacity: 1;
    border-color: var(--e-color-border, rgba(0, 0, 0, 0.12));

    &[aria-orientation='vertical'] {
        align-self: stretch;
        border-style: solid;
        border-width: 0 thin 0 0;
        display: inline-flex;
        height: inherit;
        min-height: 100%;
        max-height: 100%;
        max-width: 0;
        min-width: unset;
        width: 0;
        vertical-align: text-bottom;
        margin: 0 -1px;

        &.e-divider--inset {
            margin-top: 12px;
            margin-bottom: 12px;
        }
    }
}
</style>
