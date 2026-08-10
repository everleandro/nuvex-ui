import { ComputedRef } from "vue";
import { Size } from "./size";

export type ListModelProp =
  | Array<string | number>
  | string
  | number
  | undefined
  | null;

export type ListFocusMoveDirection = "next" | "previous" | "first" | "last";
export type ListGroupedFocusDirection = "in" | "out";

export type ListGroupValue = string | number;

export interface EListInjection {
  changeModelValue: (value: number | string | undefined | null) => void;
  changeGroupValue: (value: number | string | undefined | null) => void;
  modelValue: ComputedRef<ListModelProp>;
  group: ComputedRef<ListModelProp>;
  color: ComputedRef<string | undefined>;
  activeColor: ComputedRef<string | undefined>;
  size: ComputedRef<Size | undefined>;
  disabled: ComputedRef<boolean>;
  isListbox: ComputedRef<boolean>;
  focusedItemId: ComputedRef<string | null>;
  setFocusedItem: (value: string | null) => void;
  moveFocus: (currentId: string, direction: ListFocusMoveDirection) => void;
  navigateGroupedFocus: (options: {
    currentId: string;
    direction: ListGroupedFocusDirection;
    isGroupActivator?: boolean;
    isExpanded?: boolean;
    groupPath?: string;
    parentGroupPath?: string;
  }) => void;
  syncFocusableItem: (candidateId?: string) => void;
}

export interface EListGroupInjection {
  level: ComputedRef<number>;
  path: ComputedRef<string>;
}
