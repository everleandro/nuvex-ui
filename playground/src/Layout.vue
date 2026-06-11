<template>
    <main class="playground" :data-theme="theme">
        <header class="playground-header">
            <h1>Playground</h1>
            <button class="theme-toggle" @click="toggleTheme">
                {{ theme === "light" ? "🌙 Dark" : "☀️ Light" }}
            </button>
        </header>
        <nav class="nav">
            <router-link to="/">Inicio</router-link>
            <router-link to="/card">Card</router-link>
            <router-link to="/date-picker">Date Picker</router-link>
            <router-link to="/form">Formulario</router-link>
            <router-link to="/textarea">Textarea</router-link>
            <router-link to="/time-picker">Time Picker</router-link>
            <router-link to="/progress">Progress</router-link>
            <router-link to="/radio">Radios</router-link>
            <router-link to="/checkbox">Checkboxes</router-link>
            <router-link to="/schedule">Schedule</router-link>
            <router-link to="/tab">Tabs</router-link>
            <router-link to="/menu">Menu</router-link>
            <router-link to="/palette">Paleta</router-link>
        </nav>
        <router-view />
    </main>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "../../src/theme";

const { currentTheme, toggleTheme } = useTheme();
const theme = computed(() => currentTheme.value);
</script>

<style scoped>
.playground {
    min-height: 100vh;
    padding: 24px;
    background: linear-gradient(135deg, #f7f9fb, #eef4ff);
    transition: background 0.3s ease;
}

.playground[data-theme="dark"] {
    background: linear-gradient(135deg, #121212, #1e1e1e);
}

.playground-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.playground-header h1 {
    margin: 0;
    color: #333;
}

.playground[data-theme="dark"] .playground-header h1 {
    color: #fafafa;
}

.theme-toggle {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    color: #333;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.playground[data-theme="dark"] .theme-toggle {
    background: #2a2a2a;
    border-color: #444;
    color: #fafafa;
}

.theme-toggle:hover {
    opacity: 0.8;
}

.nav {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
}

.nav a {
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #1f2937;
    text-decoration: none;
    font-weight: 600;
    transition:
        background 0.2s ease,
        color 0.2s ease,
        transform 0.2s ease;
}

.nav a:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.96);
}

.nav a.router-link-active {
    background: #111827;
    color: #f9fafb;
}

.playground[data-theme="dark"] .nav a {
    background: rgba(17, 24, 39, 0.72);
    color: #e5e7eb;
}

.playground[data-theme="dark"] .nav a:hover {
    background: rgba(17, 24, 39, 0.9);
}

.playground[data-theme="dark"] .nav a.router-link-active {
    background: #f9fafb;
    color: #111827;
}

.block {
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transition:
        background,
        box-shadow 0.3s ease;
}

.playground[data-theme="dark"] .block {
    background: #2a2a2a;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
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

.playground[data-theme="dark"] .block h2 {
    color: #fafafa;
}

.playground[data-theme="dark"] .block h3 {
    color: #cbd5e0;
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.playground-note {
    margin: 20px 0 0;
    color: #4a5568;
    font-size: 14px;
}

.playground[data-theme="dark"] .playground-note {
    color: #e2e8f0;
}
</style>
