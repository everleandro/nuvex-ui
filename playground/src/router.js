import { createRouter, createWebHistory } from "vue-router";
import PlaygroundPage from "./PlaygroundPage.vue";
import ExpansionPanelsView from "./ExpansionPanelsView.vue";
import AvatarView from "./AvatarView.vue";
import ButtonView from "./ButtonView.vue";
import ButtonGroupView from "./ButtonGroupView.vue";
import CardView from "./CardView.vue";
import BarView from "./BarView.vue";
import DrawerView from "./DrawerView.vue";
import GridView from "./GridView.vue";
import IconView from "./IconView.vue";
import FormView from "./FormView.vue";
import SelectView from "./SelectView.vue";
import TextfieldView from "./TextfieldView.vue";
import TextareaView from "./TextareaView.vue";
import CheckboxView from "./CheckboxView.vue";
import RadioView from "./RadioView.vue";
import FieldAlignmentMigrationView from "./FieldAlignmentMigrationView.vue";
import SwitchView from "./SwitchView.vue";
import TabView from "./TabView.vue";
import DatePickerView from "./DatePickerView.vue";
import ListView from "./ListView.vue";
import ScheduleView from "./ScheduleView.vue";
import { navigationGroups } from "./navigation";

const routeComponentById = {
  "components-avatar": AvatarView,
  "components-button": ButtonView,
  "components-button-group": ButtonGroupView,
  "components-card": CardView,
  "components-bar": BarView,
  "components-drawer": DrawerView,
  "components-grid": GridView,
  "components-icon": IconView,
  "components-form": FormView,
  "components-select": SelectView,
  "components-textfield": TextfieldView,
  "components-textarea": TextareaView,
  "components-checkbox": CheckboxView,
  "components-radio": RadioView,
  "components-field-alignment": FieldAlignmentMigrationView,
  "components-switch": SwitchView,
  "components-tab": TabView,
  "components-date-picker": DatePickerView,
  "components-list": ListView,
  "components-schedule": ScheduleView,
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
