<template>
    <section class="data-list-page">
        <header class="data-list-page__header">
            <p class="data-list-page__eyebrow">Components</p>
            <h2 class="data-list-page__title">Data List Examples</h2>
            <p class="data-list-page__lead">
                EDataList es una primitiva de layout: define las columnas una sola vez y todas las filas quedan
                alineadas, con libertad total dentro de cada celda.
            </p>
        </header>

        <article class="data-list-demo">
            <h3>Basico</h3>
            <p class="data-list-demo__caption">Encabezado y filas compartiendo la misma definicion de columnas.</p>

            <EDataList :columns="4" aria-label="Facturas recientes">
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                    <EDataCell align="end">Actualizado</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                    <EDataCell align="end">{{ invoice.updatedAt }}</EDataCell>
                </EDataRow>
            </EDataList>
        </article>

        <article class="data-list-demo">
            <h3>Columnas dinamicas</h3>
            <p class="data-list-demo__caption">
                Con un numero se genera `repeat(n, minmax(0, 1fr))`. Columnas actuales:
                <strong>{{ dynamicColumns }}</strong>
            </p>

            <EButtonGroup divided>
                <EButton v-for="count in [2, 3, 4, 6]" :key="count"
                    :color="dynamicColumns === count ? 'primary' : 'secondary'" @click="dynamicColumns = count">
                    {{ count }}
                </EButton>
            </EButtonGroup>

            <EDataList :columns="dynamicColumns">
                <EDataHeader>
                    <EDataCell v-for="column in dynamicColumns" :key="column">Col {{ column }}</EDataCell>
                </EDataHeader>

                <EDataRow v-for="row in 3" :key="row">
                    <EDataCell v-for="column in dynamicColumns" :key="column">
                        {{ row }}-{{ column }}
                    </EDataCell>
                </EDataRow>
            </EDataList>
        </article>

        <article class="data-list-demo">
            <h3>Anchos personalizados</h3>
            <p class="data-list-demo__caption">
                Un arreglo se usa tal cual como `grid-template-columns`, ideal para una columna de acciones fija.
            </p>

            <EDataList :columns="customColumns">
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                    <EDataCell align="end">Acciones</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                    <EDataCell align="end">
                        <EButton text :icon="iconFactory.dotsMenu" aria-label="Acciones" />
                    </EDataCell>
                </EDataRow>
            </EDataList>
        </article>

        <article class="data-list-demo">
            <h3>Contenido enriquecido</h3>
            <p class="data-list-demo__caption">
                Avatares, chips, progreso y botones conviven sin romper la alineacion de columnas.
            </p>

            <EDataList :columns="richColumns">
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell>Cobrado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                    <EDataCell align="end">Acciones</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>
                        <EAvatar size="small">{{ invoice.customer.slice(0, 2) }}</EAvatar>

                        <div class="data-list-customer">
                            <strong>{{ invoice.customer }}</strong>
                            <small>{{ invoice.reference }}</small>
                        </div>
                    </EDataCell>

                    <EDataCell>
                        <EChip :color="statusColor[invoice.status]">{{ invoice.status }}</EChip>
                    </EDataCell>

                    <EDataCell>
                        <div class="data-list-progress">
                            <EProgressLinear :value="invoice.progress" color="primary" />
                        </div>
                    </EDataCell>

                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>

                    <EDataCell align="end">
                        <EButton text :icon="iconFactory.pencil" aria-label="Editar" />
                        <EButton text :icon="iconFactory.trash" aria-label="Eliminar" />
                    </EDataCell>
                </EDataRow>
            </EDataList>
        </article>

        <article class="data-list-demo">
            <h3>Filas clickeables y seleccion</h3>
            <p class="data-list-demo__caption">
                Enter y Espacio activan la fila. El boton de la ultima celda no propaga `click:row`.
                Seleccion actual: <strong>{{ selectedId || 'ninguna' }}</strong>
            </p>

            <EDataList :columns="customColumns" aria-label="Facturas seleccionables">
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                    <EDataCell align="end">Acciones</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id" clickable
                    :selected="selectedId === invoice.id" :disabled="invoice.status === 'Cancelado'"
                    @click:row="selectedId = invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                    <EDataCell align="end">
                        <EButton text :icon="iconFactory.externalLink" aria-label="Abrir" @click="openInvoice(invoice)" />
                    </EDataCell>
                </EDataRow>
            </EDataList>

            <p class="data-list-demo__caption">Ultima accion: {{ lastAction }}</p>
        </article>

        <article class="data-list-demo">
            <h3>Presets visuales</h3>
            <p class="data-list-demo__caption">
                El default es elevated (`e-elevation--sm`, sin borde). El contenedor propaga `rowElevation` y
                `rowOutlined`, y cualquier fila puede sobreescribirlos con su propia prop.
            </p>

            <h4 class="data-list-demo__subtitle">Cards con borde</h4>
            <EDataList :columns="3" row-outlined row-elevation="none">
                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                </EDataRow>
            </EDataList>

            <h4 class="data-list-demo__subtitle">Panel tipo tabla (`outlined` + `divided`)</h4>
            <EDataList :columns="3" outlined divided>
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                </EDataRow>
            </EDataList>

            <h4 class="data-list-demo__subtitle">Caja elevada del contenedor</h4>
            <EDataList :columns="3" elevation="md" divided>
                <EDataHeader>
                    <EDataCell>Cliente</EDataCell>
                    <EDataCell>Estado</EDataCell>
                    <EDataCell align="end">Monto</EDataCell>
                </EDataHeader>

                <EDataRow v-for="invoice in invoices" :key="invoice.id">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                </EDataRow>
            </EDataList>

            <h4 class="data-list-demo__subtitle">Una fila rompe la herencia</h4>
            <EDataList :columns="3" row-elevation="none" row-outlined>
                <EDataRow v-for="invoice in invoices" :key="invoice.id"
                    :elevation="invoice.id === 'INV-3021' ? 'lg' : undefined"
                    :outlined="invoice.id === 'INV-3021' ? false : undefined">
                    <EDataCell>{{ invoice.customer }}</EDataCell>
                    <EDataCell>{{ invoice.status }}</EDataCell>
                    <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                </EDataRow>
            </EDataList>
        </article>

        <article class="data-list-demo">
            <h3>Header sticky</h3>
            <p class="data-list-demo__caption">Con scroll vertical el encabezado permanece visible.</p>

            <div class="data-list-scroll">
                <EDataList :columns="3">
                    <EDataHeader sticky>
                        <EDataCell>Cliente</EDataCell>
                        <EDataCell>Estado</EDataCell>
                        <EDataCell align="end">Monto</EDataCell>
                    </EDataHeader>

                    <EDataRow v-for="invoice in longInvoices" :key="invoice.id">
                        <EDataCell>{{ invoice.customer }}</EDataCell>
                        <EDataCell>{{ invoice.status }}</EDataCell>
                        <EDataCell align="end">{{ invoice.amount }}</EDataCell>
                    </EDataRow>
                </EDataList>
            </div>
        </article>
    </section>
</template>

<script setup>
import { computed, ref } from "vue";
import iconFactory from "./icons.ts";

const customColumns = ["minmax(220px, 2fr)", "minmax(100px, 1fr)", "140px", "96px"];
const richColumns = ["minmax(220px, 2fr)", "140px", "minmax(120px, 1fr)", "140px", "112px"];

const statusColor = {
    Activo: "success",
    Pendiente: "warning",
    Cancelado: "error",
};

const invoices = [
    {
        id: "INV-3021",
        customer: "Acme Corp",
        reference: "#INV-3021",
        status: "Activo",
        amount: "$12,450",
        updatedAt: "20 ago 2026",
        progress: 82,
    },
    {
        id: "INV-3022",
        customer: "Globex",
        reference: "#INV-3022",
        status: "Pendiente",
        amount: "$3,100",
        updatedAt: "18 ago 2026",
        progress: 40,
    },
    {
        id: "INV-3023",
        customer: "Initech",
        reference: "#INV-3023",
        status: "Cancelado",
        amount: "$980",
        updatedAt: "11 ago 2026",
        progress: 12,
    },
];

const longInvoices = computed(() =>
    Array.from({ length: 12 }, (_, index) => {
        const base = invoices[index % invoices.length];
        return { ...base, id: `${base.id}-${index}` };
    }),
);

const dynamicColumns = ref(4);
const selectedId = ref("");
const lastAction = ref("ninguna");

const openInvoice = (invoice) => {
    lastAction.value = `abrir ${invoice.id}`;
};
</script>

<style scoped>
.data-list-page {
    display: grid;
    gap: 20px;
}

.data-list-page__header {
    display: grid;
    gap: 6px;
}

.data-list-page__eyebrow {
    margin: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.72;
}

.data-list-page__title {
    margin: 0;
}

.data-list-page__lead {
    margin: 0;
    opacity: 0.84;
}

.data-list-demo {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
}

.data-list-demo h3 {
    margin: 0;
}

.data-list-demo__caption {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.data-list-demo__subtitle {
    margin: 8px 0 0;
    font-size: 14px;
    opacity: 0.72;
}

.data-list-customer {
    display: grid;
    min-width: 0;
}

.data-list-customer small {
    opacity: 0.72;
}

.data-list-progress {
    flex: 1 1 auto;
    min-width: 0;
}

.data-list-scroll {
    max-height: 280px;
    overflow: auto;
}
</style>
