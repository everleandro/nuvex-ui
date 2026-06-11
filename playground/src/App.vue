<template>
  <div class="playground-list">
    <section class="block">
      <h2>List Playground</h2>

      <div class="list-demo-grid">
        <div class="list-demo-card">
          <h3>Single selection with avatars</h3>
          <p class="playground-note">
            Current value: {{ selectedListItem ?? "none" }}
          </p>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :append-avatar="avatarOne"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-avatar="avatarOne"
            />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Single selection with icons</h3>
          <p class="playground-note">
            Current value: {{ selectedListItem ?? "none" }}
          </p>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="small">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>

          <EList v-model="selectedListItem" color="primary" elevation="sm" size="x-large">
            <EListItem
              v-for="item in singleSelectItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Keyboard navigation</h3>
          <p class="playground-note">
            Usa Tab para entrar, ArrowUp y ArrowDown para mover el foco, Home y End para saltar,
            y Enter o Space para seleccionar. Valor actual: {{ keyboardNavigationValue ?? "none" }}
          </p>

          <EList v-model="keyboardNavigationValue" color="success" outlined>
            <EListItem
              v-for="item in keyboardNavigationItems"
              :key="item.value"
              :value="item.value"
              :title="item.title"
              :subtitle="item.subtitle"
              :prepend-icon="item.icon"
            />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Nested groups</h3>
          <p class="playground-note">
            Rutas abiertas: {{ nestedGroupModel.length ? nestedGroupModel.join(", ") : "none" }}
          </p>

          <EList v-model:group="nestedGroupModel" color="primary" outlined>
            <EListGroup value="components">
              <template #activator="{ attrs }">
                <EListItem v-bind="attrs" title="Components" subtitle="Nivel raiz" />
              </template>

              <EListItem title="Button" subtitle="Componente base" :prepend-icon="iconFactory.arrowRight" />

              <EListGroup value="navigation">
                <template #activator="{ attrs }">
                  <EListItem v-bind="attrs" title="Navigation" subtitle="Segundo nivel" />
                </template>

                <EListItem title="List" subtitle="Item hijo visible al expandir" :prepend-icon="iconFactory.arrowRight" />

                <EListGroup value="advanced">
                  <template #activator="{ attrs }">
                    <EListItem v-bind="attrs" title="Advanced" subtitle="Tercer nivel" />
                  </template>

                  <EListItem title="Nested keyboard" subtitle="Valida la ruta components/navigation/advanced" :prepend-icon="iconFactory.clear" />
                </EListGroup>
              </EListGroup>
            </EListGroup>

            <EListGroup value="guides">
              <template #activator="{ attrs }">
                <EListItem v-bind="attrs" title="Guides" subtitle="Otra rama del arbol" />
              </template>

              <EListItem title="Getting started" subtitle="Ruta guides" :prepend-icon="iconFactory.arrowLeft" />
            </EListGroup>
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Multiple selection + sizes</h3>
          <p class="playground-note">
            Selected: {{ multiSelectItemsValue.length ? multiSelectItemsValue.join(", ") : "none" }}
          </p>

          <EList v-model="multiSelectItemsValue" color="secondary" dense elevation="sm">
            <EListItem value="xs" title="xSmall item" subtitle="Compact utility action" size="x-small" :prepend-icon="iconFactory.clear" />
            <EListItem value="sm" title="Small item" subtitle="Secondary quick action" size="small" :prepend-icon="iconFactory.arrowLeft" />
            <EListItem value="lg" title="Large item" subtitle="Primary highlighted action" size="large" :prepend-avatar="avatarOne" />
            <EListItem value="xl" title="xLarge item" subtitle="Prominent rich option" size="x-large" :append-avatar="avatarTwo" />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Content variants</h3>
          <EList color="warning" dense>
            <EListItem title="Status" subtitle="Prepend icon + append icon" :prepend-icon="iconFactory.arrowLeft" :append-icon="iconFactory.clear" />
            <EListItem title="Profile" subtitle="Avatar-driven item" :prepend-avatar="avatarOne" />
            <EListItem title="Media" subtitle="Append avatar example" :append-avatar="avatarTwo" />
          </EList>
        </div>

        <div class="list-demo-card">
          <h3>Append Layout Inspection</h3>
          <p class="playground-note">
            Casos minimos para inspeccionar el grid del item con append y con prepend + append.
          </p>

          <EList color="primary" outlined>
            <EListItem
              title="Append avatar only"
              subtitle="Debe renderizar content + gap + avatar"
              :append-avatar="avatarTwo"
            />
            <EListItem
              title="Prepend icon + append avatar"
              subtitle="Debe renderizar prepend + content + append sin columna implicita"
              :prepend-icon="iconFactory.arrowLeft"
              :append-avatar="avatarTwo"
            />
            <EListItem
              title="Prepend avatar + append icon"
              subtitle="Valida el caso inverso con ambos affixes"
              :prepend-avatar="avatarOne"
              :append-icon="iconFactory.clear"
            />
          </EList>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EList from "../../src/components/list/index.vue";
import EListGroup from "../../src/components/list/group.vue";
import EListItem from "../../src/components/list/item.vue";
import iconFactory from "../../src/utils/icons";

const selectedListItem = ref("inbox");
const keyboardNavigationValue = ref("focus");
const nestedGroupModel = ref(["components", "components/navigation"]);
const multiSelectItemsValue = ref(["sm", "xl"]);

const avatarOne = "https://i.pravatar.cc/64?img=12";
const avatarTwo = "https://i.pravatar.cc/64?img=32";

const singleSelectItems = [
  {
    value: "inbox",
    title: "Inbox",
    subtitle: "14 unread messages",
    icon: iconFactory.arrowRight,
  },
  {
    value: "drafts",
    title: "Drafts",
    subtitle: "3 items pending review",
    icon: iconFactory.arrowLeft,
  },
  {
    value: "archive",
    title: "Archive",
    subtitle: "Everything shipped this week",
    icon: iconFactory.clear,
  },
];

const keyboardNavigationItems = [
  {
    value: "focus",
    title: "Focus entry",
    subtitle: "Primer item para entrar al roving tabindex",
    icon: iconFactory.arrowRight,
  },
  {
    value: "browse",
    title: "Browse with arrows",
    subtitle: "Mueve el foco con ArrowUp y ArrowDown",
    icon: iconFactory.arrowLeft,
  },
  {
    value: "jump",
    title: "Home and End",
    subtitle: "Salta al inicio o al final sin salir de la lista",
    icon: iconFactory.clear,
  },
  {
    value: "select",
    title: "Confirm selection",
    subtitle: "Activa este item con Enter o Space",
    icon: iconFactory.arrowRight,
  },
];
</script>

<style scoped>
.playground-list {
  padding: 24px;
}

.block {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.block h2 {
  color: #333;
  margin-top: 0;
}

.block h3 {
  margin: 0 0 12px;
  color: #4a5568;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.playground-note {
  margin: 20px 0 0;
  color: #4a5568;
  font-size: 14px;
}

.list-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.list-demo-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

:global(:root) {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}
</style>
