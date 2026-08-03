<template>
    <EApp>
        <EBar app clipped fixed outlined>
            <EButton :icon="iconFactory.menu" aria-label="Toggle navigation" @click="drawerModel = !drawerModel" />
            <div class="playground-brand">
                <p class="playground-brand__kicker">Nuvex UI</p>
                <h1 class="playground-brand__title">Playground</h1>
            </div>
            <ESpacer />
            <EButton
                :icon="iconFactory.themeDarkLight"
                :aria-label="themeToggleLabel"
                :title="themeToggleLabel"
                @click="toggleTheme"
            />
        </EBar>

        <EDrawer v-model="drawerModel" nav>
            <EList v-model:group="openGroups" inset dense>
                <EListGroup v-for="group in navigationGroups" :key="group.id" :value="group.id">
                    <template #activator="{ attrs }">
                        <EListItem v-bind="attrs" :title="group.title" />
                    </template>
                    <EListItem
                        v-for="item in group.children"
                        :key="item.id"
                        :title="item.title"
                        :to="item.to"
                        active-color="primary"
                    />
                </EListGroup>
            </EList>
        </EDrawer>

        <EMain>
            <EContainer class="playground-container p-4" :max-width="pageMaxWidth">
                <router-view />
            </EContainer>
        </EMain>
    </EApp>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "../../src";
import { findOpenGroupIdsByPath, navigationGroups } from "./navigation";
import iconFactory from "./icons.ts";
const route = useRoute();
const drawerModel = ref(true);
const openGroups = ref(findOpenGroupIdsByPath(route.path));

const { currentTheme, toggleTheme } = useTheme();
const pageMaxWidth = computed(() => route.name === "components-schedule" ? "1400px" : "980px");

const themeToggleLabel = computed(() =>
    currentTheme.value === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
);

watch(
    () => route.path,
    (path) => {
        openGroups.value = findOpenGroupIdsByPath(path);
    },
    { immediate: true },
);
</script>

<style scoped>
.playground-brand {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.playground-brand__kicker {
    margin: 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
}

.playground-brand__title {
    margin: 0;
    font-size: 1rem;
    line-height: 1.1;
}

.playground-container {
    width: 100%;
}
</style>
