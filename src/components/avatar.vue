<template>
    <div class="e-avatar__wrapper">
        <div :class="avatarClass">
            <slot>
                <img v-if="hasImage" :src="src" alt="avatar" />
                <span v-else-if="hasName" class="e-avatar__initials"> {{ initials }}</span>
                <EIcon v-else :icon="resolvedIcon"></EIcon>
            </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElevationProps, IconPath, SizeProps } from '@/types';
import EIcon from '@/components/icon/index.vue'
import iconFactory from '@/utils/icons'

export interface Props extends ElevationProps, SizeProps {
    color?: string
    icon?: string | IconPath | IconPath[]
    src?: string,
    name?: string
}

const props = withDefaults(defineProps<Props>(), { size: 'default' })

const avatarClass = computed(() => {
    const classes: string[] = ['e-avatar__container']
    props.color && classes.push(`${props.color}--text`)
    props.elevation && classes.push(`e-elevation--${props.elevation}`)
    classes.push(`e-avatar__container--size-${props.size}`)
    return classes
})

const hasName = computed(() => typeof props.name === 'string' && props.name.trim().length > 0)
const initials = computed(() => {
    if (!hasName.value) return ''
    return props.name!
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
})

const hasImage = computed(() => typeof props.src === 'string' && props.src.trim().length > 0)

const resolvedIcon = computed(() => props.icon || iconFactory.person)

</script>

<style lang="scss">
@use '~/public/styles/_mixins.scss' as *;

.e-avatar {
    &__container {
        --avatar-size: var(--e-avatar-size-default, 46px);

        flex: none;
        align-items: center;
        display: inline-flex;
        justify-content: center;
        line-height: normal;
        overflow: hidden;
        position: relative;
        text-align: center;
        transition: .2s cubic-bezier(.4, 0, .2, 1);
        transition-property: width, height;
        vertical-align: middle;
        border-radius: 50%;
        width: var(--avatar-size);
        height: var(--avatar-size);
        @include button-before();

        &--size-x-small {
            --avatar-size: var(--e-avatar-size-x-small, 30px);
        }

        &--size-small {
            --avatar-size: var(--e-avatar-size-small, 38px);
        }

        &--size-default {
            --avatar-size: var(--e-avatar-size-default, 46px);
        }

        &--size-large {
            --avatar-size: var(--e-avatar-size-large, 54px);
        }

        &--size-x-large {
            --avatar-size: var(--e-avatar-size-x-large, 62px);
        }

        .e-icon {
            --e-icon-size-default: calc(var(--avatar-size) * 0.6);
        }

        &::before {
            opacity: .1;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }


    }

    &__initials {
        font-size: calc(var(--avatar-size) * 0.4);
        font-weight: 500;
    }
}
</style>
