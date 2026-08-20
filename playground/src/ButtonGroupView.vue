<template>
    <section class="button-group-page">
        <header class="button-group-page__header">
            <p class="button-group-page__eyebrow">Components</p>
            <h2 class="button-group-page__title">Button Group Examples</h2>
            <p class="button-group-page__lead">
                EButtonGroup es un contenedor puramente presentacional: agrupa botones, unifica el radio y
                elimina las sombras individuales. La logica de seleccion vive fuera del componente.
            </p>
        </header>

        <article class="button-group-demo">
            <h3>Base</h3>
            <p class="button-group-demo__caption">Grupo horizontal por defecto: radio unificado y bordes internos a 0.</p>

            <div class="button-group-row">
                <EButtonGroup>
                    <EButton color="primary">Uno</EButton>
                    <EButton color="primary">Dos</EButton>
                    <EButton color="primary">Tres</EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Divided</h3>
            <p class="button-group-demo__caption">
                La prop `divided` inserta un separador de 1px que funciona con cualquier variante de boton.
            </p>

            <div class="button-group-row">
                <EButtonGroup divided>
                    <EButton color="primary">Solid</EButton>
                    <EButton color="primary">Solid</EButton>
                    <EButton color="primary">Solid</EButton>
                </EButtonGroup>

                <EButtonGroup divided>
                    <EButton outlined color="primary">Outlined</EButton>
                    <EButton outlined color="primary">Outlined</EButton>
                    <EButton outlined color="primary">Outlined</EButton>
                </EButtonGroup>

                <EButtonGroup divided>
                    <EButton tonal color="primary">Tonal</EButton>
                    <EButton tonal color="primary">Tonal</EButton>
                    <EButton tonal color="primary">Tonal</EButton>
                </EButtonGroup>

                <EButtonGroup divided>
                    <EButton text>Text</EButton>
                    <EButton text>Text</EButton>
                    <EButton text>Text</EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Seleccion controlada</h3>
            <p class="button-group-demo__caption">
                El estado se maneja fuera: el grupo solo aporta el estilo. Valor actual:
                <strong>{{ statusFilter }}</strong>
            </p>

            <div class="button-group-row">
                <EButtonGroup divided role="radiogroup" aria-label="Filtro de estado">
                    <EButton v-for="option in statusOptions" :key="option.value"
                        :color="statusFilter === option.value ? 'primary' : 'secondary'"
                        :aria-pressed="statusFilter === option.value" @click="statusFilter = option.value">
                        {{ option.label }}
                    </EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Toolbar de iconos</h3>
            <p class="button-group-demo__caption">Grupos icon-only con `role="toolbar"`, incluyendo estados disabled.</p>

            <div class="button-group-row">
                <EButtonGroup divided role="toolbar" aria-label="Acciones de edicion">
                    <EButton :icon="iconFactory.pencil" aria-label="Editar" color="secondary" />
                    <EButton :icon="iconFactory.contentCopy" aria-label="Duplicar" color="secondary" />
                    <EButton :icon="iconFactory.trash" aria-label="Eliminar" color="secondary" />
                    <EButton :icon="iconFactory.send" aria-label="Enviar" color="secondary" disabled />
                </EButtonGroup>

                <EButtonGroup divided role="toolbar" aria-label="Paginacion">
                    <EButton :icon="iconFactory.arrowLeft" aria-label="Anterior" color="primary" />
                    <EButton :icon="iconFactory.arrowRight" aria-label="Siguiente" color="primary" />
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Rounded</h3>
            <p class="button-group-demo__caption">La prop `rounded` aplica el radio tipo pill al contenedor completo.</p>

            <div class="button-group-row">
                <EButtonGroup rounded divided>
                    <EButton color="primary">Dia</EButton>
                    <EButton color="primary">Semana</EButton>
                    <EButton color="primary">Mes</EButton>
                </EButtonGroup>

                <EButtonGroup rounded divided>
                    <EButton outlined color="primary" :prepend-icon="iconFactory.calendar">Agenda</EButton>
                    <EButton outlined color="primary" :prepend-icon="iconFactory.history">Historial</EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Vertical</h3>
            <p class="button-group-demo__caption">Con `vertical` el grupo apila los botones en columna.</p>

            <div class="button-group-row">
                <EButtonGroup vertical divided aria-label="Acciones verticales">
                    <EButton color="secondary" :prepend-icon="iconFactory.account">Perfil</EButton>
                    <EButton color="secondary" :prepend-icon="iconFactory.cog">Ajustes</EButton>
                    <EButton color="secondary" :prepend-icon="iconFactory.email">Mensajes</EButton>
                </EButtonGroup>

                <EButtonGroup vertical divided>
                    <EButton :icon="iconFactory.heart" aria-label="Favorito" color="primary" />
                    <EButton :icon="iconFactory.dotsMenu" aria-label="Mas opciones" color="primary" />
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Block</h3>
            <p class="button-group-demo__caption">
                Con `block` el grupo ocupa el ancho disponible y reparte los botones en partes iguales.
            </p>

            <div class="button-group-stack">
                <EButtonGroup block divided>
                    <EButton color="primary">Aceptar</EButton>
                    <EButton color="secondary">Posponer</EButton>
                    <EButton color="error">Rechazar</EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Sizes y elevacion</h3>
            <p class="button-group-demo__caption">
                El tamano se define en cada boton; la elevacion la asume el grupo con `elevation`.
            </p>

            <div class="button-group-row button-group-row--align-end">
                <EButtonGroup v-for="size in sizes" :key="size" divided elevation="sm">
                    <EButton :size="size" color="primary">{{ size }}</EButton>
                    <EButton :size="size" color="primary">{{ size }}</EButton>
                </EButtonGroup>
            </div>

            <div class="button-group-row">
                <EButtonGroup v-for="level in elevations" :key="level" divided :elevation="level">
                    <EButton color="secondary">{{ level }}</EButton>
                    <EButton color="secondary">{{ level }}</EButton>
                </EButtonGroup>
            </div>
        </article>

        <article class="button-group-demo">
            <h3>Tokens</h3>
            <p class="button-group-demo__caption">
                Personalizacion via CSS vars: `--e-btn-group-divider-color`, `--e-btn-group-divider-width` y
                `--e-btn-group-border-radius`.
            </p>

            <div class="button-group-row">
                <EButtonGroup divided class="button-group-custom">
                    <EButton color="primary">Custom</EButton>
                    <EButton color="primary">Divider</EButton>
                    <EButton color="primary">Radius</EButton>
                </EButtonGroup>
            </div>
        </article>
    </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";

const sizes = ["x-small", "small", "default", "large"];
const elevations = ["xs", "sm", "md", "lg"];

const statusOptions = [
    { label: "Todos", value: "all" },
    { label: "Pendiente", value: "pending" },
    { label: "Aprobado", value: "approved" },
    { label: "Rechazado", value: "rejected" },
];

const statusFilter = ref("all");
</script>

<style scoped>
.button-group-page {
    display: grid;
    gap: 20px;
}

.button-group-page__header {
    display: grid;
    gap: 6px;
}

.button-group-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.button-group-page__title {
    margin: 0;
}

.button-group-page__lead {
    margin: 0;
    opacity: 0.84;
}

.button-group-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.button-group-demo h3 {
    margin: 0;
}

.button-group-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.button-group-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
}

.button-group-row--align-end {
    align-items: flex-end;
}

.button-group-stack {
    display: grid;
    gap: 12px;
}

.button-group-custom {
    --e-btn-group-divider-color: #ffffff;
    --e-btn-group-divider-width: 3px;
    --e-btn-group-border-radius: 16px;
}
</style>
