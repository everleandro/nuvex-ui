<template>
    <section class="avatar-page">
        <header class="avatar-page__header">
            <p class="avatar-page__eyebrow">Components</p>
            <h2 class="avatar-page__title">Avatar Playground</h2>
            <p class="avatar-page__lead">
                Casos para validar imagenes, fallback iconografico, tamanos, color, elevacion y contenido personalizado.
            </p>
        </header>
        <EAvatar name="ever santiesteban" :size="size"
            :color="color" :elevation="elevation" />

        <article class="avatar-demo">
            <div>
                <h3>Usage</h3>
                <p class="avatar-demo__caption">Ajusta las props principales y compara imagen con fallback.</p>
            </div>

            <div class="avatar-demo__columns">
                <div class="avatar-preview">
                    <EAvatar :src="showImage ? primaryAvatar?.avatarSrc : undefined" :icon="iconFactory.account"
                        :size="size" :color="color" :elevation="elevation" />
                    <div class="avatar-preview__identity">
                        <strong>{{ primaryAvatar?.name }}</strong>
                        <span>{{ showImage ? "Image source" : "Icon fallback" }}</span>
                    </div>
                </div>

                <EForm class="avatar-controls">
                    <ESelect v-model="size" md="6" :items="sizes" label="Size" />
                    <ESelect v-model="color" md="6" :items="colors" label="Color" clearable />
                    <ESelect v-model="elevation" md="6" :items="elevations" label="Elevation" clearable />
                    <ECheckbox v-model="showImage" md="6" label="Use image" />
                </EForm>
            </div>
        </article>

        <article class="avatar-demo">
            <div>
                <h3>Integration with EBar</h3>
                <p class="avatar-demo__caption">Avatar de cuenta combinado con identidad y una accion secundaria dentro
                    de una barra.</p>
            </div>

            <div class="avatar-bar-surface">
                <EBar outlined color="surface-raised">
                    <div class="avatar-bar-profile">
                        <EAvatar :src="primaryAvatar?.avatarSrc" />
                        <div class="avatar-bar-profile__identity">
                            <strong>{{ primaryAvatar?.name }}</strong>
                            <span>carlos@nuvex.dev</span>
                        </div>
                    </div>
                    <ESpacer />
                    <EButton :icon="iconFactory.dotsMenu" text size="small" aria-label="Open account actions"
                        @click="barActionCount++" />
                </EBar>
            </div>
            <p class="avatar-demo__state">Account actions: {{ barActionCount }}</p>
        </article>

        <article class="avatar-demo">
            <div>
                <h3>Sizes</h3>
                <p class="avatar-demo__caption">Escala completa de presets con imagen y dimensiones controladas por
                    tokens.</p>
            </div>

            <div class="avatar-scale">
                <div v-for="avatarSize in sizes" :key="avatarSize" class="avatar-sample">
                    <div class="avatar-sample__stage">
                        <EAvatar :src="secondaryAvatar?.avatarSrc" :size="avatarSize" />
                    </div>
                    <span>{{ avatarSize }}</span>
                </div>
            </div>
        </article>

        <article class="avatar-demo">
            <div>
                <h3>Fallbacks and color</h3>
                <p class="avatar-demo__caption">Sin una fuente valida, el avatar usa el icono indicado o el fallback
                    person.</p>
            </div>

            <div class="avatar-row">
                <div class="avatar-example">
                    <EAvatar size="large" color="primary" />
                    <span>Default</span>
                </div>
                <div class="avatar-example">
                    <EAvatar :icon="iconFactory.account" size="large" color="secondary" />
                    <span>Account</span>
                </div>
                <div class="avatar-example">
                    <EAvatar :icon="iconFactory.cog" size="large" color="success" elevation="sm" />
                    <span>Elevated</span>
                </div>
            </div>
        </article>

        <article class="avatar-demo">
            <div>
                <h3>Custom content</h3>
                <p class="avatar-demo__caption">El slot default reemplaza imagen e icono para representar iniciales u
                    otro contenido.</p>
            </div>

            <div class="avatar-row">
                <div v-for="person in initials" :key="person.label" class="avatar-example">
                    <EAvatar :color="person.color" size="large" elevation="xs">
                        <span class="avatar-initials">{{ person.label }}</span>
                    </EAvatar>
                    <span>{{ person.name }}</span>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";
import { useAvatars } from "./useAvatars.js";

const sizes = ["x-small", "small", "default", "large", "x-large"];
const colors = ["primary", "secondary", "success", "warning", "blue"];
const elevations = ["xs", "sm", "md", "lg", "xl"];
const initials = [
    { label: "AL", name: "Avery Lee", color: "primary" },
    { label: "MC", name: "Morgan Chen", color: "secondary" },
    { label: "JR", name: "Jordan Reed", color: "success" },
];

const size = ref("default");
const color = ref("primary");
const elevation = ref("sm");
const showImage = ref(true);
const barActionCount = ref(0);

const { getAvatarByIndex } = useAvatars();
const primaryAvatar = getAvatarByIndex(0);
const secondaryAvatar = getAvatarByIndex(1);
</script>

<style scoped>
.avatar-page {
    display: grid;
    gap: 20px;
}

.avatar-page__header {
    display: grid;
    gap: 6px;
}

.avatar-page__eyebrow,
.avatar-page__title,
.avatar-page__lead,
.avatar-demo h3,
.avatar-demo__caption {
    margin: 0;
}

.avatar-page__eyebrow {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.avatar-page__lead,
.avatar-demo__caption {
    opacity: 0.8;
}

.avatar-demo {
    display: grid;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
}

.avatar-demo__caption {
    margin-top: 4px;
    font-size: 14px;
}

.avatar-demo__state {
    margin: 0;
    font-size: 13px;
    opacity: 0.72;
}

.avatar-demo__columns {
    display: grid;
    grid-template-columns: minmax(220px, 0.8fr) minmax(320px, 1.2fr);
    gap: 24px;
    align-items: center;
}

.avatar-preview {
    min-height: 156px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 20px;
    border: 1px solid var(--e-color-border);
    border-radius: 8px;
}

.avatar-preview__identity {
    display: grid;
    gap: 4px;
}

.avatar-preview__identity span,
.avatar-sample>span,
.avatar-example>span {
    font-size: 13px;
    opacity: 0.72;
}

.avatar-controls {
    align-items: end;
}

.avatar-bar-surface {
    border: 1px dashed var(--e-color-border, rgba(0, 0, 0, 0.12));
    border-radius: 8px;
    overflow: hidden;
}

.avatar-bar-profile {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-bar-profile__identity {
    min-width: 0;
    display: grid;
    gap: 2px;
}

.avatar-bar-profile__identity strong,
.avatar-bar-profile__identity span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.avatar-bar-profile__identity strong {
    font-size: 14px;
}

.avatar-bar-profile__identity span {
    font-size: 12px;
    opacity: 0.72;
}

.avatar-scale {
    display: grid;
    grid-template-columns: repeat(5, minmax(96px, 1fr));
    gap: 12px;
}

.avatar-sample,
.avatar-example {
    display: grid;
    justify-items: center;
    gap: 10px;
    min-width: 0;
}

.avatar-sample__stage {
    height: 112px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-row {
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    align-items: end;
}

.avatar-initials {
    font-size: 20px;
    font-weight: 700;
}

@media (max-width: 760px) {
    .avatar-demo__columns {
        grid-template-columns: 1fr;
    }

    .avatar-scale {
        grid-template-columns: repeat(2, minmax(104px, 1fr));
    }

    .avatar-preview {
        justify-content: flex-start;
    }

    .avatar-bar-profile__identity span {
        display: none;
    }
}
</style>
