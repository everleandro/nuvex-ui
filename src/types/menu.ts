import { Ref } from "vue";

export interface ContainerMenuInterface {
  openMenu: () => void;
  closeMenu: () => void;
  destroyComponent: () => void;
  opened: Ref<boolean>;
  setConfiguration: (configuration: Record<string, any>) => void;
}

export interface Menu {
  closeMenu: () => void;
  openMenu: () => void;
  opened: Ref<boolean>;
}

export type MenuTypeTarget =
  | HTMLElement
  | string
  | Ref<HTMLElement | null | undefined>
  | undefined
  | null;
