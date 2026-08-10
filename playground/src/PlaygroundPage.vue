<template>
  <section class="playground-page">
    <header>
      <p class="playground-page__eyebrow">{{ currentGroupTitle }}</p>
      <h2 class="playground-page__title">{{ currentTitle }}</h2>
    </header>

    <div class="playground-page__card">
      <p>
        Base inicial creada. Aqui se construira este playground desde cero usando la estructura de navegacion
        de la doc.
      </p>
      <p>
        Ruta actual: <strong>{{ route.path }}</strong>
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { findNavigationItemByPath } from "./navigation";

const route = useRoute();

const navigationItem = computed(() => findNavigationItemByPath(route.path));

const currentTitle = computed(() => {
  return navigationItem.value?.item.title || "Playground";
});

const currentGroupTitle = computed(() => {
  return navigationItem.value?.group.title || "Base";
});
</script>

<style scoped>
.playground-page {
  display: grid;
  gap: 16px;
}

.playground-page__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.72;
}

.playground-page__title {
  margin: 4px 0 0;
}

.playground-page__card {
  padding: 16px;
  border-radius: 12px;
}
</style>
