<template>
    <section class="icon-page">
        <header class="icon-page__header">
            <p class="icon-page__eyebrow">Components</p>
            <h2 class="icon-page__title">Icon Examples</h2>
            <p class="icon-page__lead">
                Casos para revisar iconos por paths SVG del framework y estrategias de icon fonts con distintas convenciones de clase.
            </p>
        </header>

        <article class="icon-demo">
            <h3>Framework SVG registry</h3>
            <p class="icon-demo__caption">
                Usa el registro base de paths del framework desde <code>src/utils/icons.ts</code>.
            </p>

            <div class="icon-grid">
                <div v-for="item in frameworkIcons" :key="item.name" class="icon-tile">
                    <EIcon :icon="item.icon" size="large" color="primary" />
                    <span class="icon-tile__label">{{ item.name }}</span>
                </div>
            </div>
        </article>

        <article class="icon-demo">
            <h3>Default icon font fallback</h3>
            <p class="icon-demo__caption">
                Sin configuracion adicional, <code>EIcon</code> usa <code>icon</code> y <code>icon-{name}</code>.
            </p>

            <div class="icon-grid icon-grid--font">
                <div v-for="item in fallbackFontIcons" :key="item" class="icon-tile">
                    <EIcon :icon="item" size="large" />
                    <span class="icon-tile__label">icon-{{ item }}</span>
                </div>
            </div>
        </article>

        <article class="icon-demo">
            <h3>MDI style with prefix</h3>
            <p class="icon-demo__caption">
                Ejemplo de una fuente que solo necesita clase base mas prefijo. Aqui la configuracion vive en un scope local.
            </p>

            <IconFontScope :options="mdiIconFont">
                <div class="icon-grid icon-grid--font">
                    <div v-for="item in mdiIcons" :key="item" class="icon-tile">
                        <EIcon :icon="item" size="large" />
                        <span class="icon-tile__label">mdi-{{ item }}</span>
                    </div>
                </div>
            </IconFontScope>
        </article>

        <article class="icon-demo">
            <h3>Font Awesome style with resolveClass</h3>
            <p class="icon-demo__caption">
                Ejemplo de una fuente que necesita multiples clases finales. Se resuelve con <code>iconFont.resolveClass</code>.
            </p>

            <IconFontScope :options="fontAwesomeIconFont">
                <div class="icon-grid icon-grid--font">
                    <div v-for="item in fontAwesomeIcons" :key="item.name" class="icon-tile">
                        <EIcon :icon="item.name" size="large" />
                        <span class="icon-tile__label">{{ item.label }}</span>
                    </div>
                </div>
            </IconFontScope>
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, provide, useSlots, type PropType } from 'vue';

import {
    iconFontInjectionKey,
    normalizeIconFontOptions,
} from '../../src/components/icon/config';
import frameworkIconFactory from '../../src/utils/icons';
import type { IconFontOptions } from '../../src/types';

const IconFontScope = defineComponent({
    name: 'IconFontScope',
    props: {
        options: {
            type: Object as PropType<IconFontOptions>,
            required: true,
        },
    },
    setup(props) {
        provide(iconFontInjectionKey, normalizeIconFontOptions(props.options));

        const slots = useSlots();

        return () => h('div', { class: 'icon-font-scope' }, slots.default?.());
    },
});

const frameworkIcons = computed(() => {
    return [
        { name: 'arrowLeft', icon: frameworkIconFactory.arrowLeft },
        { name: 'menu', icon: frameworkIconFactory.menu },
        { name: 'person', icon: frameworkIconFactory.person },
        { name: 'clear', icon: frameworkIconFactory.clear },
        { name: 'calendar', icon: frameworkIconFactory.calendar },
    ];
});

const fallbackFontIcons = ['home', 'settings', 'search', 'mail'];

const mdiIconFont: IconFontOptions = {
    baseClass: 'mdi',
    prefix: 'mdi-',
};

const mdiIcons = ['home', 'account', 'calendar', 'cog'];

const fontAwesomeIconFont: IconFontOptions = {
    baseClass: 'fa',
    resolveClass: (name) => ['fa-solid', `fa-${name}`],
};

const fontAwesomeIcons = [
    { name: 'house', label: 'fa-solid fa-house' },
    { name: 'user', label: 'fa-solid fa-user' },
    { name: 'calendar', label: 'fa-solid fa-calendar' },
    { name: 'gear', label: 'fa-solid fa-gear' },
];
</script>

<style scoped>
.icon-page {
    display: grid;
    gap: 20px;
}

.icon-page__header {
    display: grid;
    gap: 6px;
}

.icon-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.icon-page__title {
    margin: 0;
}

.icon-page__lead {
    margin: 0;
    opacity: 0.84;
}

.icon-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.icon-demo h3 {
    margin: 0;
}

.icon-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.icon-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.icon-grid--font :deep(.e-icon) {
    min-width: 32px;
    min-height: 32px;
}

.icon-grid--font :deep(.icon),
.icon-grid--font :deep(.mdi),
.icon-grid--font :deep(.fa) {
    border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, currentColor 6%, transparent);
}

.icon-grid--font :deep(.icon::before),
.icon-grid--font :deep(.mdi::before),
.icon-grid--font :deep(.fa::before) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    line-height: 1;
}

.icon-grid--font :deep(.icon-home::before) {
    content: '\2302';
}

.icon-grid--font :deep(.icon-settings::before) {
    content: '\2699';
}

.icon-grid--font :deep(.icon-search::before) {
    content: '\2315';
}

.icon-grid--font :deep(.icon-mail::before) {
    content: '\2709';
}

.icon-grid--font :deep(.mdi-home::before) {
    content: '\2302';
}

.icon-grid--font :deep(.mdi-account::before) {
    content: '\25cf';
}

.icon-grid--font :deep(.mdi-calendar::before) {
    content: '\25a6';
}

.icon-grid--font :deep(.mdi-cog::before) {
    content: '\2699';
}

.icon-grid--font :deep(.fa-house::before) {
    content: '\2302';
}

.icon-grid--font :deep(.fa-user::before) {
    content: '\25cf';
}

.icon-grid--font :deep(.fa-calendar::before) {
    content: '\25a6';
}

.icon-grid--font :deep(.fa-gear::before) {
    content: '\2699';
}

.icon-tile {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 14px 12px;
    border-radius: 12px;
    background: color-mix(in srgb, currentColor 3%, transparent);
}

.icon-tile__label {
    font-size: 13px;
    text-align: center;
    opacity: 0.8;
    word-break: break-word;
}
</style>