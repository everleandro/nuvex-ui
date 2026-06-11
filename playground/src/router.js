import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import CardView from './CardView.vue';
import CheckboxView from './CheckboxView.vue';
import DatePickerView from './DatePickerView.vue';
import FormView from './FormView.vue';
import MenuView from './MenuView.vue';
import PaletteView from './PaletteView.vue';
import ProgressView from './ProgressView.vue';
import RadioView from './RadioView.vue';
import ScheduleView from './ScheduleView.vue';
import TabView from './TabView.vue';
import TextareaView from './TextareaView.vue';
import TimePickerView from './TimePickerView.vue';

const routes = [
  { path: '/', component: App },
  { path: '/card', component: CardView },
  { path: '/date-picker', component: DatePickerView },
  { path: '/form', component: FormView },
  { path: '/textarea', component: TextareaView },
  { path: '/time-picker', component: TimePickerView },
  { path: '/progress', component: ProgressView },
  { path: '/radio', component: RadioView },
  { path: '/checkbox', component: CheckboxView },
  { path: '/schedule', component: ScheduleView },
  { path: '/tab', component: TabView },
  { path: '/menu', component: MenuView },
  { path: '/palette', component: PaletteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
