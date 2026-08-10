<template>
  <section class="list-page">
    <header class="list-page__header">
      <p class="list-page__eyebrow">Components</p>
      <h2 class="list-page__title">List Playground</h2>
      <p class="list-page__lead">
        Casos para validar seleccion, contenido, variantes, enlaces, grupos, slots y navegacion por teclado.
      </p>
    </header>

    <article class="list-demo">
      <h3>Usage</h3>
      <p class="list-demo__caption">Ajusta las props compartidas y valida la seleccion activa.</p>

      <div class="list-demo__columns">
        <div>
          <EList v-model="selectedValue" :outlined="listOptions.outlined" :inset="listOptions.inset"
            :disabled="listOptions.disabled" :size="size" :color="color" :active-color="activeColor">
            <EListItem value="inbox" title="Inbox" subtitle="12 unread messages"
              :prepend-avatar="teamAvatar?.avatarSrc" />
            <EListItem value="drafts" title="Drafts" subtitle="3 items pending review"
              :prepend-icon="iconFactory.pencil" />
            <EListItem value="archive" title="Archive" subtitle="Completed conversations"
              :prepend-icon="iconFactory.layersOutline" />
          </EList>
          <p class="list-demo__state">Selected value: {{ selectedValue }}</p>
        </div>

        <EForm class="list-demo__controls">
          <ESelect v-model="color" md="6" :items="colors" label="Color" clearable />
          <ESelect v-model="activeColor" md="6" :items="colors" label="Active color" clearable />
          <ESelect v-model="size" md="6" :items="sizes" label="Size" />
          <ECheckbox v-model="listOptions.outlined" md="6" label="Outlined" />
          <ECheckbox v-model="listOptions.inset" md="6" label="Inset" />
          <ECheckbox v-model="listOptions.disabled" md="6" label="Disabled" />
        </EForm>
      </div>
    </article>

    <article class="list-demo">
      <h3>Item content</h3>
      <p class="list-demo__caption">Titulos, subtitulos, iconos, avatares y contenido final alineado.</p>

      <EList outlined inset class="list-demo__list">
        <EListItem :prepend-icon="iconFactory.account" title="Profile"
          subtitle="Account details and preferences" />
        <EListItem :prepend-avatar="teamAvatar?.avatarSrc" title="Design team"
          subtitle="8 active collaborators" />
        <EListItem :prepend-icon="iconFactory.cog" :append-icon="iconFactory.arrowRight" title="Notifications"
          subtitle="Email and push settings" />
      </EList>
    </article>

    <article class="list-demo">
      <h3>Visual variants</h3>
      <p class="list-demo__caption">Compara superficie, densidad y tamanos heredados.</p>

      <div class="list-demo__grid">
        <EList>
          <EListItem title="Default" subtitle="Default spacing and surface" />
        </EList>
        <EList outlined inset elevation="sm" size="large">
          <EListItem title="Outlined and inset" subtitle="Large inherited size" />
        </EList>
        <EList dense size="small">
          <EListItem title="Dense" subtitle="Compact vertical rhythm" />
        </EList>
      </div>
    </article>

    <article class="list-demo">
      <h3>Selection and states</h3>
      <p class="list-demo__caption">Modelo escalar para seleccion simple y arreglo para seleccion multiple.</p>

      <div class="list-demo__grid">
        <div>
          <h4>Single selection</h4>
          <EList v-model="singleSelection" active-color="primary" outlined inset>
            <EListItem value="available" title="Available" />
            <EListItem value="disabled" title="Disabled item" disabled />
          </EList>
          <p class="list-demo__state">{{ singleSelection }}</p>
        </div>
        <div>
          <h4>Multiple selection</h4>
          <EList v-model="multipleSelection" active-color="secondary" outlined inset>
            <EListItem value="inbox" title="Inbox" />
            <EListItem value="drafts" title="Drafts" />
            <EListItem value="archive" title="Archive" />
          </EList>
          <p class="list-demo__state">{{ multipleSelection.join(", ") }}</p>
        </div>
      </div>
    </article>

    <article class="list-demo">
      <h3>Navigation links</h3>
      <p class="list-demo__caption">Items integrados con Vue Router y estado activo de ruta.</p>

      <EList inset active-color="primary" class="list-demo__list">
        <EListItem :prepend-icon="iconFactory.home" to="/playground/getting-started" title="Playground overview" />
        <EListItem :prepend-icon="iconFactory.navigation" to="/components/list" title="List playground" />
        <EListItem :prepend-icon="iconFactory.components" to="/components/button" title="Button playground" />
      </EList>
    </article>

    <article class="list-demo">
      <h3>Groups and nesting</h3>
      <p class="list-demo__caption">Grupos controlados con rutas jerarquicas estables.</p>

      <EList v-model:group="openGroups" outlined inset active-color="primary" class="list-demo__list">
        <EListGroup value="components">
          <template #activator="{ attrs }">
            <EListItem v-bind="attrs" title="Components" />
          </template>
          <EListGroup value="navigation">
            <template #activator="{ attrs }">
              <EListItem v-bind="attrs" title="Navigation" />
            </template>
            <EListItem title="List" />
            <EListItem title="Tabs" />
          </EListGroup>
          <EListItem title="Settings" />
        </EListGroup>
      </EList>
    </article>

    <article class="list-demo">
      <h3>Slots and composition</h3>
      <p class="list-demo__caption">La fila es informativa y la accion append mantiene una interaccion independiente.</p>

      <EList outlined inset class="list-demo__list">
        <EListItem :clickable="false" title="Jordan Lee" subtitle="Product designer">
          <template #prepend>
            <EAvatar :src="memberAvatar?.avatarSrc" />
          </template>
          <template #append>
            <EButton :icon="iconFactory.dotsMenu" text size="small" aria-label="More actions"
              @click="appendActionCount++" />
          </template>
        </EListItem>
      </EList>
      <p class="list-demo__state">Append actions: {{ appendActionCount }}</p>
    </article>

    <article class="list-demo">
      <h3>Accessibility and keyboard</h3>
      <p class="list-demo__caption">Usa Arrow Up, Arrow Down, Home, End, Enter y Space desde un item enfocado.</p>

      <EList v-model="keyboardSelection" active-color="primary" outlined inset aria-label="Message folders"
        class="list-demo__list">
        <EListItem value="inbox" title="Inbox" subtitle="12 unread messages" />
        <EListItem value="drafts" title="Drafts" subtitle="3 items pending review" />
        <EListItem value="archive" title="Archive" subtitle="Completed conversations" />
      </EList>
      <p class="list-demo__state">Keyboard selection: {{ keyboardSelection }}</p>
    </article>
  </section>
</template>

<script setup>
import { ref } from "vue";
import iconFactory from "./icons.ts";
import { useAvatars } from "./useAvatars.js";

const colors = ["primary", "secondary", "success", "warning", "blue"];
const sizes = ["x-small", "small", "default", "large", "x-large"];
const color = ref();
const activeColor = ref();
const size = ref("default");
const selectedValue = ref("inbox");
const singleSelection = ref("available");
const multipleSelection = ref(["inbox", "archive"]);
const keyboardSelection = ref("inbox");
const openGroups = ref(["components", "components/navigation"]);
const appendActionCount = ref(0);
const listOptions = ref({ outlined: true, inset: true, disabled: false });

const { getAvatarByIndex } = useAvatars();
const teamAvatar = getAvatarByIndex(0);
const memberAvatar = getAvatarByIndex(1);
</script>

<style scoped>
.list-page {
  display: grid;
  gap: 20px;
}

.list-page__header {
  display: grid;
  gap: 6px;
}

.list-page__eyebrow,
.list-page__title,
.list-page__lead,
.list-demo h3,
.list-demo h4,
.list-demo__caption,
.list-demo__state {
  margin: 0;
}

.list-page__eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.72;
}

.list-page__lead,
.list-demo__caption,
.list-demo__state {
  opacity: 0.8;
}

.list-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
}

.list-demo__caption,
.list-demo__state {
  font-size: 14px;
}

.list-demo__columns,
.list-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.list-demo__controls {
  align-content: start;
}

.list-demo__list {
  width: min(100%, 560px);
}

@media (max-width: 720px) {
  .list-demo__columns,
  .list-demo__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>