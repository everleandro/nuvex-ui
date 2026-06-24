export const navigationGroups = [
  {
    id: "getting-started",
    title: "Getting Started",
    children: [
      {
        id: "playground-getting-started",
        title: "Playground Base",
        to: "/playground/getting-started",
      },
    ],
  },
  {
    id: "components",
    title: "Components",
    children: [
      {
        id: "components-button",
        title: "Button",
        to: "/components/button",
      },
      {
        id: "components-textfield",
        title: "Text Field",
        to: "/components/text-field",
      },
      {
        id: "components-select",
        title: "Select",
        to: "/components/select",
      },
      {
        id: "components-checkbox",
        title: "Checkbox",
        to: "/components/checkbox",
      },
      {
        id: "components-form",
        title: "Form",
        to: "/components/form",
      },
      {
        id: "components-radio",
        title: "Radio",
        to: "/components/radio",
      },
      {
        id: "components-switch",
        title: "Switch",
        to: "/components/switch",
      },
      {
        id: "components-card",
        title: "Card",
        to: "/components/card",
      },
      {
        id: "components-list",
        title: "List",
        to: "/components/list",
      },
      {
        id: "components-tab",
        title: "Tab",
        to: "/components/tab",
      },
      {
        id: "components-dialog",
        title: "Dialog",
        to: "/components/dialog",
      },
      {
        id: "components-progress",
        title: "Progress",
        to: "/components/progress",
      },
      {
        id: "components-expansion-panels",
        title: "Expansion Panels",
        to: "/components/expansion-panels",
      },
      {
        id: "components-date-picker",
        title: "Date Picker",
        to: "/components/date-picker",
      },
      {
        id: "components-time-picker",
        title: "Time Picker",
        to: "/components/time-picker",
      },
      {
        id: "components-schedule",
        title: "Schedule",
        to: "/components/schedule",
      },
    ],
  },
  {
    id: "foundation",
    title: "Foundation",
    children: [
      {
        id: "foundation-theming",
        title: "Theming",
        to: "/foundation/theming",
      },
      {
        id: "foundation-utilities",
        title: "Utilities",
        to: "/foundation/utilities",
      },
    ],
  },
];

const navigationItems = navigationGroups.flatMap((group) =>
  group.children.map((item) => ({
    group,
    item,
  })),
);

export const findNavigationItemByPath = (path) => {
  return navigationItems.find(({ item }) => item.to === path);
};

export const findOpenGroupIdsByPath = (path) => {
  const resolved = findNavigationItemByPath(path);
  return resolved ? [resolved.group.id] : [];
};
