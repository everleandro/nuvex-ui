import { createRouter, createWebHistory } from "vue-router";
import PlaygroundPage from "./PlaygroundPage.vue";
import ExpansionPanelsView from "./ExpansionPanelsView.vue";
import ButtonView from "./ButtonView.vue";
import BarView from "./BarView.vue";
import FormView from "./FormView.vue";
import { navigationGroups } from "./navigation";

const routeComponentById = {
  "components-button": ButtonView,
  "components-bar": BarView,
  "components-form": FormView,
  "components-expansion-panels": ExpansionPanelsView,
};

const navigationItems = navigationGroups.flatMap((group) =>
  group.children.map((item) => ({
    groupTitle: group.title,
    item,
  })),
);

const firstItem = navigationItems[0]?.item;

const routes = [
  {
    path: "/",
    redirect: firstItem?.to || "/playground/getting-started",
  },
  ...navigationItems.map(({ groupTitle, item }) => ({
    path: item.to,
    name: item.id,
    component: routeComponentById[item.id] || PlaygroundPage,
    meta: {
      title: item.title,
      groupTitle,
    },
  })),
  {
    path: "/:pathMatch(.*)*",
    redirect: firstItem?.to || "/playground/getting-started",
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
