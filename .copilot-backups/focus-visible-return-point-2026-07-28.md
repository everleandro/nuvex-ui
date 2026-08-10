# Return point before focus-visible experiment

Created: 2026-07-28

## Worktree snapshot

```text
 M playground/src/SwitchView.vue
 M playground/src/router.js
 M src/components/form/switch/style.scss
 M src/style/main.scss
?? playground/src/TabView.vue
```

## File: src/style/main.scss

```scss
@use "animations";
@use "reset.scss";
@use "transitions.scss";
@use "typography.scss";
@use "~/public/styles/_mixins.scss" as *;

.v-ripple-element {
  position: relative;
  overflow: hidden;
  cursor: pointer;

  .v-ripple {
    border-radius: 50%;
    opacity: 0.7;
    position: absolute;
    transform: scale(0);
    animation: v-ripple linear;
  }
}

.interactive-element {
  --interactive-element-local-state-focus: var(--e-interactive-state-focus, 0.12);
  --interactive-element-local-state-hover: var(--e-interactive-state-hover, 0.08);
  --interactive-element-local-state-active: var(--e-interactive-state-active, 0.12);
  --interactive-element-local-tonal-opacity: var(--e-interactive-tonal-opacity, 0.08);

  @include button-before($interactive: true,
    $hover-opacity: var(--interactive-element-local-state-hover),
    $focus-opacity: var(--interactive-element-local-state-focus),
    $active-opacity: var(--interactive-element-local-state-active));

  &::before {
    z-index: 0;
  }

  .v-ripple {
    z-index: 0;
  }

  &--tonal {
    &::before {
      opacity: var(--interactive-element-local-tonal-opacity);
    }
  }
}

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}

.flex-wrap {
  flex-wrap: wrap;
}

.outlined {
  border: thin solid rgba(0, 0, 0, 0.12);
}

.e-overlay {
  z-index: 3;
  align-items: center;
  border-radius: inherit;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;

  &--active {
    background-color: rgba(0, 0, 0, 0.4);
    pointer-events: auto;
  }

  &--inactive {
    background-color: transparent;
  }
}

.e-progress-circular {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}

.e-progress-circular--indeterminate>svg {
  -webkit-animation: progress-circular-rotate 1.4s linear infinite;
  animation: progress-circular-rotate 1.4s linear infinite;
  transform-origin: center center;
  transition: all 0.2s ease-in-out;
}

.e-progress-circular>svg {
  width: 100%;
  height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.e-progress-circular--indeterminate .e-progress-circular__overlay {
  -webkit-animation: progress-circular-dash 1.4s ease-in-out infinite;
  animation: progress-circular-dash 1.4s ease-in-out infinite;
  stroke-linecap: round;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0px;
}
```

## File: src/components/list/style.scss

```scss
@use '~/public/styles/_mixins.scss' as *;

$list-item-sizes: x-small, small, default, large, x-large;
$list-item-affix-types: icon, avatar, slot;

@mixin list-item-size-variables($size-name) {
  --list-item-padding-inline: var(--e-list-item-padding-inline-#{$size-name});
  --list-item-font-size: var(--e-list-item-font-size-#{$size-name});
  --list-item-title-font-size: var(--e-list-item-title-font-size-#{$size-name});
  --list-item-title-line-height: var(--e-list-item-title-line-height-#{$size-name});
  --list-item-subtitle-font-size: var(--e-list-item-subtitle-font-size-#{$size-name});
  --list-item-subtitle-line-height: var(--e-list-item-subtitle-line-height-#{$size-name});
  --list-item-content-padding-block: var(--e-list-item-content-padding-block-#{$size-name});
  --list-item-affix-gap: var(--e-list-item-affix-gap-#{$size-name});
  --list-item-affix-width: var(--e-list-item-affix-width-#{$size-name});
  --list-item-affix-slot-min-width: var(--e-list-item-affix-slot-min-width-#{$size-name}, var(--e-list-item-affix-width-#{$size-name}));
  --list-item-height: var(--e-list-item-height-#{$size-name});
  --list-item-icon-size: var(--e-list-item-icon-size-#{$size-name});
}

@mixin list-item-affix-single($side) {
  @each $type in $list-item-affix-types {
    &.e-list-item--has-#{$side}-#{$type} {
      @content;
    }
  }
}

@mixin list-item-affix-both {
  @each $prepend-type in $list-item-affix-types {
    @each $append-type in $list-item-affix-types {
      &.e-list-item--has-prepend-#{$prepend-type}.e-list-item--has-append-#{$append-type} {
        @content;
      }
    }
  }
}

.e-list {
  --list-item-border-radius: 0;
  color: var(--e-list-color, inherit);
  font-family: var(--e-typography-family-base, var(--e-root-font-family, inherit));
  display: block;
  padding: 8px 0;
  position: static;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  --before-opacity: var(--e-list-item-state-active, var(--e-interactive-state-active, 0.12));
  border-radius: var(--e-list-border-radius, var(--e-border-radius-root, 4px));
  overflow: hidden;

  &-group {
    --group-indent-step: calc(var(--e-space-base, 4px) * 4);
    flex: 0 1 auto;
    position: relative;
    max-width: 100%;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

    &__content {
      --list-item-nested-offset: calc((var(--list-group-level, 0) + 1) * var(--group-indent-step));
    }

    &:not(:last-child):not(:only-child) {
      margin-bottom: var(--e-space-base, 4px);
    }

    [data-activator-node="true"][aria-expanded="true"] .e-list-item__append i.e-icon {
      transform: rotate(180deg);
    }
  }

  &--outlined {
    border: 1px solid var(--e-color-border);
  }

  &--inset {
    padding-inline: 8px;
    --list-item-border-radius: var(--e-list-item-border-radius, var(--e-border-radius-root));
  }

  &-item {
    --list-item-local-state-hover: var(--e-list-item-state-hover, var(--e-interactive-state-hover, 0.08));
    --list-item-local-state-focus: var(--e-list-item-state-focus, var(--e-interactive-state-focus, 0.18));
    --list-item-local-state-active: var(--e-list-item-state-active, var(--e-interactive-state-active, 0.12));
    --interactive-element-local-state-hover: var(--list-item-local-state-hover);
    --interactive-element-local-state-focus: var(--list-item-local-state-focus);
    --interactive-element-local-state-active: var(--list-item-local-state-active);
    --padding-inline: var(--list-item-padding-inline, var(--e-list-padding-inline, calc(var(--e-space-base, 4px) * 4)));
    --list-item-affix-size: var(--list-item-affix-width, calc(var(--list-item-height, var(--e-list-item-height-default, 3rem)) - (var(--e-space-base, 4px) * 2)));
    border-radius: var(--list-item-border-radius, 4px);
    --list-item-media-size: var(--list-item-affix-size);
    align-items: center;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    column-gap: var(--list-item-affix-gap, var(--padding-inline));
    letter-spacing: normal;
    min-height: var(--list-item-height, 48px);
    outline: none;
    position: relative;
    text-decoration: none;
    color: var(--e-list-color, currentColor);
    font-family: inherit;
    padding-inline-start: calc(var(--padding-inline) + var(--list-item-nested-offset, 0px));
    padding-inline-end: var(--padding-inline);

    &__append,
    &__prepend {
      align-items: center;
      align-self: stretch;
      aspect-ratio: 1 / 1;
      display: inline-flex;
      flex: none;
      justify-content: center;
      width: var(--list-item-affix-size);
      min-width: var(--list-item-affix-size);

      .e-avatar__container {
        --avatar-size: var(--list-item-media-size);
      }

      .e-icon {
        --e-icon-size-x-small: var(--list-item-icon-size);
        --e-icon-size-small: var(--list-item-icon-size);
        --e-icon-size-default: var(--list-item-icon-size);
        --e-icon-size-large: var(--list-item-icon-size);
        --e-icon-size-x-large: var(--list-item-icon-size);
      }

      &--slot {
        --list-item-affix-size: auto;
        aspect-ratio: auto;
        min-width: var(--list-item-affix-slot-min-width, var(--list-item-affix-width, 22px));
        width: auto;
      }
    }

    &:hover:before {
      --before-opacity: var(--list-item-local-state-hover);
    }

    &:active:before {
      --before-opacity: var(--list-item-local-state-active);
    }

    &:focus:before {
      --before-opacity: var(--list-item-local-state-focus);
    }

    &:focus-visible {
      outline: 2px solid var(--e-list-item-focus-ring-color, currentColor);
      outline-offset: -2px;
    }

    &--active,
    &.router-link-active,
    &.router-link-exact-active {
      color: inherit;
    }

    &-subtitle,
    &-title {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: none;
    }

    &-title {
      hyphens: auto;
      white-space: nowrap;
      word-break: normal;
      word-wrap: break-word;
      font-family: inherit;
      font-size: var(--list-item-title-font-size, var(--list-item-font-size));
      font-weight: var(--e-typography-title-font-weight-sm, var(--list-item-title-font-weight, 400));
      line-height: var(--list-item-title-line-height, 1.5rem);
    }

    &-subtitle {
      word-break: break-all;
      font-family: inherit;
      font-size: var(--list-item-subtitle-font-size, 0.875rem);
      font-weight: var(--e-typography-body-font-weight-sm, var(--list-item-subtitle-font-weight, 400));
      line-height: var(--list-item-subtitle-line-height, 1rem);
      opacity: 0.6;
    }

    @include button-before();

    &.interactive-element--active,
    &--active,
    &.e-list-item-active,
    &.router-link-active,
    &.router-link-exact-active {
      color: var(--e-list-active-color, var(--e-list-color, currentColor));
    }

    &.interactive-element--active:before,
    &.interactive-element--active:hover:before,
    &.interactive-element--active:focus:before,
    &--active:before,
    &.e-list-item-active:before,
    &.e-list-item-active:hover:before,
    &.e-list-item-active:focus:before,
    &.router-link-active:before,
    &.router-link-active:hover:before,
    &.router-link-exact-active:before,
    &.router-link-exact-active:hover:before,
    &--active:hover:before,
    &.router-link-active:focus:before,
    &.router-link-exact-active:focus:before {
      opacity: var(--list-item-local-state-active);
    }

    &__content {
      grid-column: 1;
      align-self: center;
      flex: 1 1;
      overflow: hidden;
      padding: var(--list-item-content-padding-block, 12px) 0;
      font-size: var(--list-item-font-size);
    }

    @include list-item-affix-single(prepend) {
      grid-template-columns: var(--list-item-affix-size) minmax(0, 1fr);

      .e-list-item__content {
        grid-column: 2;
      }
    }

    @include list-item-affix-single(append) {
      grid-template-columns: minmax(0, 1fr) var(--list-item-affix-size);

      .e-list-item__content {
        grid-column: 1;
      }

      .e-list-item__append {
        grid-column: 2;
      }
    }

    @include list-item-affix-both {
      grid-template-columns: var(--list-item-affix-size) minmax(0, 1fr) var(--list-item-affix-size);

      .e-list-item__content {
        grid-column: 2;
      }

      .e-list-item__append {
        grid-column: 3;
      }
    }

    @include list-item-affix-single(prepend) {
      .e-list-item__prepend {
        grid-column: 1;
      }
    }

    @include list-item-affix-single(append) {
      .e-list-item__append {
        grid-column: 2;
      }
    }

    &--clickeable {
      cursor: pointer;

      &:hover,
      &:focus {
        &:not(.e-list-item--active) {
          &:not(.e-list-item--disabled) {
            color: inherit;
          }
        }

        &:before {
          opacity: var(--before-opacity);
        }
      }

      @include prefix(user-select, none);
    }

    &--disabled {
      cursor: default;
      opacity: 0.56;
      pointer-events: none;
    }

    @each $size-name in $list-item-sizes {
      &--size-#{$size-name} {
        @include list-item-size-variables($size-name);
      }
    }

    &:not(:last-child) {
      margin-bottom: var(--e-space-base, 4px);
    }

  }

  &--dense {
    .e-list-item {
      min-height: var(--e-list-item-dense-height, 40px);
      --list-item-content-padding-block: var(--e-list-item-dense-content-padding-block, 0.375rem);
      --list-item-affix-gap: var(--e-list-item-dense-affix-gap, 0.5rem);
      --list-item-title-line-height: var(--e-list-item-dense-title-line-height, 1.125rem);
      --list-item-subtitle-font-size: var(--e-list-item-dense-subtitle-font-size, 0.75rem);
      --list-item-subtitle-line-height: var(--e-list-item-dense-subtitle-line-height, 0.875rem);
      --list-item-icon-size: var(--e-list-item-dense-icon-size, 20px);
    }
  }

}
```

## File: src/components/tab/style.scss

```scss
.e-tabs {
  display: flex;
  height: var(--e-tabs-height);
  font-family: var(--e-typography-family-base, var(--e-root-font-family, inherit));
  font-size: var(--e-typography-label-font-size-lg, 0.875rem);
  line-height: var(--e-typography-label-line-height-lg, 1.25rem);
  --before-opacity: 0.13;

  &.e-slide-group--vertical {
    height: auto;
    --e-tabs-height: 3rem;
  }

  .e-btn {
    --button-local-text-transform: var(--e-tab-text-transform, var(--e-btn-text-transform, none));
    border-radius: 0;

    &+.e-btn {
      margin: 0;
    }
  }

  &--align-tabs {
    &-start {
      .e-tab {
        justify-content: flex-start;
        text-align: left;
      }
    }

    &-center {
      .e-tab {
        justify-content: center;
        text-align: center;
      }
    }

    &-end {
      .e-tab {
        justify-content: flex-end;
        text-align: right;
      }
    }
  }
}

.e-tab {
  &.e-tab {
    min-width: 5.625rem;
  }

  &.router-link-active:before,
  &.router-link-active:hover:before,
  &--active:hover:before,
  &:focus:before {
    opacity: var(--before-opacity);
  }
}

.e-slide-group {
  display: flex;
  overflow: hidden;

  &--vertical {
    flex-direction: column;

    .e-slide-group {

      &__container,
      &__content {
        flex-direction: column;
      }
    }

    .e-tabs__indicator {
      left: 0;
      top: 0;
      bottom: auto;
      transform: translateY(0);
    }
  }

  &--grow {
    .e-tab {
      flex: 1 1 auto;
    }
  }

  &__container {
    contain: content;
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
  }

  &__content {
    display: flex;
    flex: 1 0 auto;
    position: relative;
    transition: 0.2s all cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;

    &>* {
      white-space: initial;
    }
  }
}

.e-tabs__indicator {
  position: absolute;
  left: 0;
  bottom: 0;
  background: var(--e-tabs-indicator-color, currentColor);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.18s ease;
}

.e-tabs__track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--e-color-border, rgba(0, 0, 0, 0.12));
  pointer-events: none;
}

.e-tabs__track--vertical {
  top: 0;
  right: auto;
  bottom: auto;
  width: 1px;
  height: 100%;
}
```
