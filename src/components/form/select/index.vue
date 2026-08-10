<template>
  <EField ref="field" v-bind="resolvedFieldProps" :class="selectClass">
    <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}"></slot>
    </template>

    <template #append-inner>
      <div v-if="!empty && clearable" class="e-select__clear">
        <buttonClear :show="true" @clear="clear" />
      </div>
      <slot name="append-inner"></slot>
      <div class="e-select__indicator" aria-hidden="true">
        <EIcon :icon="arrowDown || icon.arrowDown" class="flip-icon" />
      </div>
    </template>

    <template #default="{
      inputId,
      detailsId,
      slotClass,
      fieldIdBase,
      handleBlur,
      handleFocus,
      hasError,
      isDisabled,
      color,
      frameEl,
    }">
      <div v-if="prefix" class="e-select__prefix e-field__prefix" aria-hidden="true">
        {{ prefix }}
      </div>

      <div ref="selectionsEl" :class="['e-select__selections', slotClass]" @mousedown="handleSelectInteractionIntent">
        <div v-if="showPlaceholderSelection" class="e-select__selection" :style="selectionStyle">
          <div class="e-select__selection-content">
            <span class="e-select__selection-placeholder">
              {{ props.placeholder }}
            </span>
          </div>
        </div>

        <template v-else-if="multiple">
          <template v-if="shouldRenderMultipleSelections">
            <div v-for="(itemValue, index) in selectedItems" :key="index" class="e-select__selection"
              :style="selectionStyle">
              <div class="e-select__selection-content">
                <slot name="selection" :selection="selectionItem(itemValue)" :attrs="selectionAttrs(itemValue)">
                  <EChip v-if="chip" v-bind="selectionAttrs(itemValue)" :color="color" closable>
                    {{ selectedText(itemValue) }}
                  </EChip>
                </slot>
              </div>
            </div>
          </template>

          <div v-else class="e-select__selection e-select__selection--text" :style="selectionStyle">
            <div class="e-select__selection-content">
              <span class="e-select__selection-text" :title="multipleSelectedText">
                {{ multipleSelectedText }}
              </span>
            </div>
          </div>
        </template>

        <div v-else-if="!empty" class="e-select__selection" :style="selectionStyle">
          <div class="e-select__selection-content">
            <slot name="selection" :selection="selectionItem()" :attrs="selectionAttrs()">
              <EChip v-if="chip" v-bind="selectionAttrs()" :color="color" :closable="chipClosable">
                {{ selectedText() }}
              </EChip>
              <span v-else>{{ selectedText() }}</span>
            </slot>
          </div>
        </div>

        <input ref="input" :value="searchValue" :id="inputId" :readonly="inputReadonly" :disabled="isDisabled"
          :data-field-id-base="fieldIdBase" class="e-select__input input--text" type="text" role="combobox"
          :aria-autocomplete="props.autocomplete ? 'list' : 'none'" :aria-controls="getListboxId(fieldIdBase)"
          :aria-expanded="isMenuOpen" :aria-invalid="hasError" :aria-describedby="detailsId" :aria-disabled="isDisabled"
            :aria-readonly="inputReadonly" :placeholder="props.placeholder" autocomplete="off"
          @mousedown="handleSelectInteractionIntent" @blur="(event) => handleInputBlur(event, handleBlur)"
          @focus="(event) => handleInputFocus(event, handleFocus)" @input="handleInput" @keydown="handleInputKeydown" />
      </div>

      <div v-if="suffix" class="e-select__suffix e-field__suffix" aria-hidden="true">
        {{ suffix }}
      </div>

      <EProgressLinear v-if="loading" :color="color" :indeterminate="loading" height="3" />

      <EMenu :activator="frameEl" v-model="isMenuOpen" full-width hold-focus check-offset
        :color="props.menuColor ?? color" :close-on-content-click="false" aria-haspopup="listbox"
        :aria-controls="getListboxId(fieldIdBase)" content-role="presentation">
        <div v-focus-outside="{ handler: handleMenuFocusOutside, include: frameEl, enabled: isMenuOpen }"
          class="e-select__menu">
          <e-list :id="getListboxId(fieldIdBase)" role="listbox" :model-value="listModel" :aria-label="listAriaLabel"
            @update:modelValue="handleListModelValueChange" @keydown="handleMenuKeydown">
            <template v-for="(item, index) in items">
              <slot name="item" :attrs="slotItemAttrs(item, index, fieldIdBase)" :item="item">
                <e-list-item v-bind="slotItemAttrs(item, index, fieldIdBase)" active-class="e-list-item--active"
                  :isActive="active(item)" :key="index" :value="getListItemValue(item)">
                  {{ getItemText(item) }}
                </e-list-item>
              </slot>
            </template>
          </e-list>
        </div>
      </EMenu>
    </template>
  </EField>
</template>

<script lang="ts">
export default { name: "Select" };
</script>
<script lang="ts" setup>
import type {
  SelectEmits,
  SelectItemObject,
  SelectItemType,
  SelectModelValue,
  SelectProps,
} from "@/types";
import { focusOutside } from "@/directives";
import icon from "@/utils/icons";
import { getNextTabbable, getPrevTabbable } from "@/utils/field";
import { useUtils } from "@/composables/utils";
import { useFieldIntegration } from "@/composables/field-integration";

import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import ButtonClear from "@/components/form/button-clear/index.vue";
import EChip from "@/components/chip/index.vue";
import EField from "@/components/form/field/index.vue";
import EList from "@/components/list/index.vue";
import EListItem from "@/components/list/item.vue";
import EMenu from "@/components/menu/index.vue";
import EProgressLinear from "@/components/progress/linear.vue";
import EIcon from "@/components/icon/index.vue";

// Local directives.
const vFocusOutside = { ...focusOutside };

// Component contract.
const emit = defineEmits<SelectEmits>();

const props = withDefaults(defineProps<SelectProps>(), {
  itemText: "text",
  itemValue: "value",
  inputAlign: "start",
  tonal: true,
});

const slots = useSlots();

// Shared field integration.
const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<SelectModelValue>(props, slots, {
  omitSlots: ["append-inner", "default"],
});

// Local reactive state.
const { isObject } = useUtils();
const input = ref<HTMLInputElement | null>(null);
const selectionsEl = ref<HTMLElement | null>(null);
const isMenuOpen = ref<boolean>(false);
const selectionCache = ref<Record<string, SelectItemType>>({});
const selectedChipIndex = ref<number>(-1);
const pendingOpenAfterLoading = ref<boolean>(false);
const SELECTION_CONTENT_HEIGHT_VAR = "--e-select-selection-content-height";
let selectionResizeObserver: ResizeObserver | undefined;

// Two-way bindings.
const searchValue = computed<string | number>({
  get: () => props.search ?? "",
  set: (value) => {
    clearSelectedChip();
    emit("update:search", value);
  },
});

const modelValue = computed<SelectModelValue | undefined>({
  get: () => props.modelValue as SelectModelValue | undefined,
  set: (value) => {
    emit("update:modelValue", value as SelectModelValue);
  },
});

const resolvedFieldProps = computed(() => ({
  ...fieldProps.value,
  focusWithin: isMenuOpen.value,
}));

// Item normalization helpers.
const isItemObject = (value: unknown): value is SelectItemObject => isObject(value);

const isListItemValue = (value: unknown): value is string | number => {
  return typeof value === "string" || typeof value === "number";
};

const getConfiguredItemValue = (
  item: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined => {
  if (!isItemObject(item)) return item as SelectItemType | undefined;
  return item[props.itemValue] as SelectItemType | undefined;
};

const resolveItemValue = (
  item: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined => {
  return getConfiguredItemValue(item) ?? (item as SelectItemType | undefined);
};

const getItemText = (item: SelectItemType | undefined): string => {
  if (!isItemObject(item)) {
    return item == null ? "" : String(item);
  }

  const result = item[props.itemText];
  return result == null ? "" : String(result);
};

const getListItemValue = (item: SelectItemType): string | number | undefined => {
  const value = resolveItemValue(item);
  return isListItemValue(value) ? value : undefined;
};

const getListboxId = (fieldIdBase: string): string => `${fieldIdBase}-listbox`;
const getOptionId = (fieldIdBase: string, index: number): string => `${fieldIdBase}-option-${index}`;

const areSameItems = (left: SelectItemType, right: SelectItemType): boolean => {
  return JSON.stringify(left) === JSON.stringify(right);
};

function resolveComparableValue(
  item: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined {
  return props.returnObject
    ? getConfiguredItemValue(item)
    : resolveItemValue(item);
}

function getSelectionCacheKey(
  item: SelectItemType | SelectModelValue | undefined,
): string | null {
  const comparableValue = resolveComparableValue(item);

  if (comparableValue === undefined) return null;
  if (comparableValue === null) return "null";

  return isItemObject(comparableValue)
    ? `object:${JSON.stringify(comparableValue)}`
    : `${typeof comparableValue}:${String(comparableValue)}`;
}

// Derived selection state.
const selectedItems = computed<Array<SelectItemType>>(() => {
  return props.multiple
    ? (modelValue.value as Array<SelectItemType>) || []
    : [];
});

const multipleListModel = computed<Array<string | number>>(() => {
  return selectedItems.value
    .map((item) => getListItemValue(item))
    .filter(isListItemValue);
});

const listModel = computed<Array<string | number> | string | number | undefined>(() => {
  if (props.multiple) {
    return multipleListModel.value;
  }

  if (empty.value) {
    return undefined;
  }

  return getListItemValue(selectionItem());
});

const empty = computed((): boolean => {
  if (props.multiple) {
    return (modelValue.value as Array<SelectItemType>)?.length === 0;
  }

  return (
    modelValue.value === undefined ||
    modelValue.value === null ||
    modelValue.value === ""
  );
});

const inputReadonly = computed((): boolean => {
  if (!props.autocomplete) return true;
  if (!props.multiple) return !empty.value;
  return false;
});

const showPlaceholderSelection = computed((): boolean => {
  return empty.value && !props.autocomplete && Boolean(props.placeholder);
});

const listAriaLabel = computed((): string | undefined => {
  const value = props.label ?? props.placeholder;
  return value == null ? undefined : String(value);
});

const selectClass = computed(() => {
  const result = ["e-select"];

  if (isMenuOpen.value) result.push("e-select--open");
  if (props.multiple) result.push("e-select--multiple");
  if (props.chip) result.push("e-select--chip");
  if (props.autocomplete) result.push("e-select--autocomplete");
  if (props.loading) result.push("e-select--loading");

  return result;
});

const hasSelectionSlot = computed(() => Boolean(slots.selection));
const shouldRenderMultipleSelections = computed((): boolean => {
  return props.multiple && (props.chip || hasSelectionSlot.value);
});

const selectionStyle = computed((): Record<string, string> => {
  return { textAlign: props.inputAlign };
});

const isSearchEmpty = computed((): boolean => {
  return `${searchValue.value ?? ""}`.length === 0;
});
const currentFieldIdBase = computed((): string => input.value?.dataset.fieldIdBase ?? "");

const getSelectRootElement = (): HTMLElement | null => {
  return input.value?.closest(".e-select") as HTMLElement | null;
};

const setSelectionHeightVar = (value: number): void => {
  const root = getSelectRootElement();

  if (!root) return;

  if (value > 0) {
    root.style.setProperty(SELECTION_CONTENT_HEIGHT_VAR, `${value}px`);
  } else {
    root.style.removeProperty(SELECTION_CONTENT_HEIGHT_VAR);
  }
};

const getSelectionContentElements = (): Array<HTMLElement> => {
  if (!selectionsEl.value) return [];

  return Array.from(
    selectionsEl.value.querySelectorAll<HTMLElement>(".e-select__selection-content"),
  );
};

const measureSelectionContentHeight = (): number => {
  const elements = getSelectionContentElements();
  if (!elements.length) return 0;

  return elements.reduce((maxHeight, element) => {
    const rect = element.getBoundingClientRect();
    const nextHeight = Number.isFinite(rect.height) ? rect.height : 0;

    return Math.max(maxHeight, nextHeight);
  }, 0);
};

const syncSelectionContentHeight = (): void => {
  if (!hasSelectionSlot.value || empty.value) {
    setSelectionHeightVar(0);
    return;
  }

  setSelectionHeightVar(measureSelectionContentHeight());
};

const bindSelectionContentMeasurement = (): void => {
  selectionResizeObserver?.disconnect();

  if (!hasSelectionSlot.value || typeof ResizeObserver === "undefined") {
    syncSelectionContentHeight();
    return;
  }

  const elements = getSelectionContentElements();
  if (!elements.length) {
    syncSelectionContentHeight();
    return;
  }

  selectionResizeObserver = new ResizeObserver(() => {
    syncSelectionContentHeight();
  });

  elements.forEach((element) => {
    selectionResizeObserver?.observe(element);
  });

  syncSelectionContentHeight();
};

// Selection lookup and matching.
const syncSelectionCache = (items: Array<SelectItemType>): void => {
  const nextCache = { ...selectionCache.value };

  items.forEach((item) => {
    const cacheKey = getSelectionCacheKey(item);

    if (cacheKey) {
      nextCache[cacheKey] = item;
    }
  });

  selectionCache.value = nextCache;
};

syncSelectionCache(props.items);

const getEmittedItemValue = (item: SelectItemType): SelectItemType => {
  if (props.returnObject || !isItemObject(item)) return item;
  return getConfiguredItemValue(item) as SelectItemType;
};

const isSameSelectionValue = (
  left: SelectItemType | SelectModelValue | undefined,
  right: SelectItemType | SelectModelValue | undefined,
): boolean => {
  if (isItemObject(left) || isItemObject(right)) {
    if (props.returnObject && isItemObject(left) && isItemObject(right)) {
      return areSameItems(left, right);
    }

    return resolveComparableValue(left) === resolveComparableValue(right);
  }

  return left === right;
};

const findSelectedIndex = (
  items: Array<SelectItemType>,
  item: SelectItemType,
): number => {
  return items.findIndex((candidate) => isSameSelectionValue(candidate, item));
};

const active = (item: SelectItemType): boolean => {
  if (props.multiple) {
    return findSelectedIndex(selectedItems.value, item) !== -1;
  }

  return isSameSelectionValue(item, modelValue.value);
};

const findSelectedItem = (
  value: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined => {
  if (props.returnObject) {
    const comparableValue = resolveComparableValue(value);
    return props.items.find(
      (candidate) => resolveComparableValue(candidate) === comparableValue,
    );
  }

  const hasObjectBackedItems = isItemObject(props.items[0]);

  if (hasObjectBackedItems) {
    return props.items.find(
      (candidate) => resolveComparableValue(candidate) == value,
    );
  }

  return props.items.find((candidate) => candidate === value);
};

const selectionItem = (value?: SelectItemType): SelectItemType => {
  const selectionValue = value === undefined ? modelValue.value : value;
  const matchedItem = findSelectedItem(selectionValue);

  if (matchedItem !== undefined) {
    return matchedItem;
  }

  const cacheKey = getSelectionCacheKey(selectionValue);
  const cachedItem = cacheKey ? selectionCache.value[cacheKey] : undefined;

  if (cachedItem !== undefined) {
    return cachedItem;
  }

  if (selectionValue !== undefined && selectionValue !== null) {
    return selectionValue as SelectItemType;
  }

  return {};
};

const selectedText = (itemValue?: SelectItemType): string => {
  if (empty.value) {
    return "";
  }

  return getItemText(selectionItem(itemValue));
};

const multipleSelectedText = computed((): string => {
  return selectedItems.value
    .map((itemValue) => selectedText(itemValue))
    .filter((value) => value.length > 0)
    .join(", ");
});

// Menu state and navigation.
const getInitialHighlightedOptionIndex = (): number => {
  if (props.items.length === 0) return -1;

  const selectedIndex = props.items.findIndex((item) => active(item));
  return selectedIndex >= 0 ? selectedIndex : 0;
};

const openMenu = (): void => {
  isMenuOpen.value = true;
};

const closeMenu = (): void => {
  isMenuOpen.value = false;
};

const focusInput = (): void => {
  input.value?.focus();
};

const getTabNavigationAnchor = (): HTMLElement | null => {
  return input.value?.closest(".e-field") ?? null;
};

const canOpenMenu = (): boolean => {
  if (isMenuOpen.value) return false;
  if (props.disabled) return false;
  if (props.readonly) return false;
  if (props.loading) return true;
  return props.items.length > 0;
};

const isInputFocused = (): boolean => {
  return document.activeElement === input.value;
};

const handleSelectInteractionIntent = (): void => {
  pendingOpenAfterLoading.value = true;
};

const tryOpenMenuAfterLoading = (): void => {
  if (!pendingOpenAfterLoading.value) return;
  if (props.loading) return;
  if (isMenuOpen.value) {
    pendingOpenAfterLoading.value = false;
    return;
  }
  if (props.disabled || props.readonly) {
    pendingOpenAfterLoading.value = false;
    return;
  }
  if (props.items.length === 0) return;
  if (!isInputFocused()) return;

  openMenu();
  pendingOpenAfterLoading.value = false;
};

const getOptionElement = (index: number): HTMLElement | null => {
  if (index < 0 || !currentFieldIdBase.value) return null;

  return document.getElementById(getOptionId(currentFieldIdBase.value, index));
};

const focusHighlightedOption = async (): Promise<void> => {
  const optionIndex = getInitialHighlightedOptionIndex();

  if (optionIndex < 0) return;

  await nextTick();
  const option = getOptionElement(optionIndex);
  option?.focus();
  option?.scrollIntoView({ block: "nearest" });
};

const openMenuAndFocusList = async (): Promise<void> => {
  if (!isMenuOpen.value) {
    openMenu();
  }

  await focusHighlightedOption();
};

const handleInputFocus = (
  event: FocusEvent,
  handleFieldFocus: (event?: FocusEvent) => void,
): void => {
  clearSelectedChip();
  handleFieldFocus(event);
  emit("focus", event);
};

const handleInputBlur = (
  event: FocusEvent,
  handleFieldBlur: (event?: Event) => void,
): void => {
  clearSelectedChip();
  pendingOpenAfterLoading.value = false;
  handleFieldBlur(event);
  emit("blur", event);
};

const handleInput = (event: Event): void => {
  const nextValue = (event.target as HTMLInputElement | null)?.value || "";

  searchValue.value = nextValue;

  if (nextValue.length > 0 && canOpenMenu()) {
    openMenu();
  }
};

const handleMenuFocusOutside = (): void => {
  closeMenu();
};

const handleMenuClosed = (): void => {
  searchValue.value = "";
};

// Chip navigation.
const clearSelectedChip = (): void => {
  selectedChipIndex.value = -1;
};

const isSelectedChipIndex = (index: number): boolean => {
  return selectedChipIndex.value === index;
};

const selectLastChip = (): boolean => {
  if (
    !props.multiple ||
    !props.chip ||
    !selectedItems.value.length ||
    !isSearchEmpty.value
  ) {
    return false;
  }

  selectedChipIndex.value = selectedItems.value.length - 1;
  return true;
};

const removeSelectedChip = (): boolean => {
  if (
    !props.multiple ||
    selectedChipIndex.value < 0 ||
    selectedChipIndex.value >= selectedItems.value.length
  ) {
    return false;
  }

  toggleSelectedItem(selectedItems.value[selectedChipIndex.value]);
  clearSelectedChip();
  return true;
};

const handleSelectionChipClose = (itemValue: SelectItemType): void => {
  toggleSelectedItem(selectionItem(itemValue));
  focusInput();
};

const handleSingleSelectionChipClose = (): void => {
  modelValue.value = null;
  focusInput();
};

const resolveItemFromListValue = (value: string | number): SelectItemType => {
  const matchedItem = props.items.find((item) => getListItemValue(item) === value);

  if (matchedItem !== undefined) {
    return matchedItem;
  }

  return value as SelectItemType;
};

const resolveEmittedValueFromListValue = (value: string | number): SelectItemType => {
  return getEmittedItemValue(resolveItemFromListValue(value));
};

const handleListModelValueChange = (value: Array<string | number> | string | number | undefined | null): void => {
  clearSelectedChip();

  if (props.autocomplete) {
    searchValue.value = "";
  }

  if (props.multiple) {
    const nextValue = Array.isArray(value)
      ? value.map((itemValue) => resolveEmittedValueFromListValue(itemValue))
      : [];

    modelValue.value = nextValue;
    return;
  }

  if (value === undefined || value === null) {
    modelValue.value = value as SelectModelValue;
    closeMenu();
    focusInput();
    return;
  }

  modelValue.value = resolveEmittedValueFromListValue(value as string | number);
  closeMenu();
  focusInput();
};

const handleMenuKeydown = async (event: KeyboardEvent): Promise<void> => {
  if (event.key === "Tab") {
    const anchor = getTabNavigationAnchor();
    const target = anchor
      ? event.shiftKey
        ? getPrevTabbable(anchor)
        : getNextTabbable(anchor)
      : undefined;

    closeMenu();

    if (!target) return;

    event.preventDefault();
    await nextTick();
    target.focus();
    return;
  }

  if (event.key !== "Escape") return;

  event.preventDefault();
  closeMenu();
  focusInput();
};

// Render attrs.
const selectionAttrs = (item?: SelectItemType) => {
  const chipIndex = item ? findSelectedIndex(selectedItems.value, item) : -1;
  const isActiveChip = chipIndex >= 0 ? isSelectedChipIndex(chipIndex) : undefined;
  const isMultipleSelectionSlot = props.multiple && hasSelectionSlot.value;

  return {
    closable: Boolean(
      (props.chip && (props.chipClosable || props.multiple)) || isMultipleSelectionSlot,
    ),
    clickable: isActiveChip,
    selected: isActiveChip,
    tabindex: -1,
    closeTabindex: -1,
    onMousedown: isActiveChip
      ? (event: MouseEvent) => {
        event.preventDefault();
        focusInput();
      }
      : undefined,
    "onClick:close": item
      ? () => handleSelectionChipClose(item)
      : () => handleSingleSelectionChipClose(),
  } as Record<string, unknown>;
};

const slotItemAttrs = (
  item: SelectItemType,
  index: number,
  fieldIdBase: string,
): Record<string, unknown> => {
  return {
    class: "e-select__option",
    value: getListItemValue(item),
    id: getOptionId(fieldIdBase, index),
    key: index,
  };
};

// Selection mutations.
const toggleSelectedItem = (item: SelectItemType): void => {
  if (props.multiple) {
    const result: Array<SelectItemType> = [...selectedItems.value];
    const index = findSelectedIndex(result, item);
    const value = getEmittedItemValue(item);
    index < 0 ? result.push(value) : result.splice(index, 1);
    modelValue.value = result;
    return;
  }

  modelValue.value = getEmittedItemValue(item);
  closeMenu();
};

// External actions.
const clear = (): void => {
  clearSelectedChip();
  modelValue.value = props.multiple ? [] : undefined;
  searchValue.value = "";
  emit("click:clear");
  focusInput();
};

// Reactive synchronization.
watch(
  () => props.items,
  (items) => {
    syncSelectionCache(items);
    tryOpenMenuAfterLoading();
    void nextTick(() => {
      bindSelectionContentMeasurement();
    });
  },
  { deep: true },
);

watch(
  () => props.loading,
  () => {
    tryOpenMenuAfterLoading();
  },
);

watch(
  () => isMenuOpen.value,
  (value: boolean) => {
    if (!value) {
      handleMenuClosed();
    }
  },
);

watch(selectedItems, (items) => {
  if (items.length === 0) {
    clearSelectedChip();
  } else if (selectedChipIndex.value >= items.length) {
    selectedChipIndex.value = items.length - 1;
  }

  void nextTick(() => {
    bindSelectionContentMeasurement();
  });
});

watch(
  [hasSelectionSlot, empty],
  () => {
    void nextTick(() => {
      bindSelectionContentMeasurement();
    });
  },
  { immediate: true },
);

onMounted(() => {
  void nextTick(() => {
    bindSelectionContentMeasurement();
  });
});

onBeforeUnmount(() => {
  selectionResizeObserver?.disconnect();
  selectionResizeObserver = undefined;
  setSelectionHeightVar(0);
});

// Keyboard interaction.
const handleInputKeydown = async (event: KeyboardEvent): Promise<void> => {
  if (
    event.key === "Backspace" &&
    props.multiple &&
    props.chip &&
    isSearchEmpty.value
  ) {
    event.preventDefault();

    if (selectedChipIndex.value >= 0) {
      removeSelectedChip();
    } else {
      selectLastChip();
    }

    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    clearSelectedChip();

    if (!isMenuOpen.value) {
      if (!canOpenMenu()) return;

      await openMenuAndFocusList();
      return;
    }

    await focusHighlightedOption();
    return;
  }

  if (event.key === "ArrowUp") {
    if (!isMenuOpen.value || props.items.length === 0) return;

    event.preventDefault();
    clearSelectedChip();
    await openMenuAndFocusList();
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    if (event.key === " " && !inputReadonly.value) return;

    if (!isMenuOpen.value) {
      if (!canOpenMenu()) return;

      event.preventDefault();
      clearSelectedChip();
      openMenu();
      return;
    }
  }

  if (event.key === "Enter") {
    if (!isMenuOpen.value) return;

    event.preventDefault();
    await openMenuAndFocusList();
    return;
  }

  if (event.key === "Escape") {
    if (!isMenuOpen.value) return;

    event.preventDefault();
    closeMenu();
  }
};

// Public instance API.
defineExpose({
  focus,
  blur,
  validate: () => field.value?.validate() ?? true,
  reset: () => field.value?.reset(),
  resetValidation: () => field.value?.resetValidation?.(),
  input,
});
</script>
<style lang="scss" src="./style.scss"></style>
