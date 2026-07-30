import { computed, reactive } from "vue";

type OverlayEntry = {
  id: string;
  dismissible: boolean;
  lockScroll: boolean;
  autoFocus: boolean;
  restoreFocus: boolean;
  contentElement?: HTMLElement | null;
  onOutsideClick?: () => void;
  onEscape?: () => void;
};

type OverlayFocusRuntime = {
  previousFocusedElement: HTMLElement | null;
};

type OverlayRuntime = {
  element: HTMLDivElement;
  clickHandler: () => void;
  closeTimer: ReturnType<typeof setTimeout> | null;
};

type OpenOverlayOptions = {
  id: string;
  dismissible?: boolean;
  lockScroll?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  contentElement?: HTMLElement | null;
  onOutsideClick?: () => void;
  onEscape?: () => void;
};

const state = reactive({
  stack: [] as OverlayEntry[],
});

const isOverlayActive = computed(() => state.stack.length > 0);

let hasEscapeListener = false;
const overlayRuntimeById = new Map<string, OverlayRuntime>();
const overlayFocusRuntimeById = new Map<string, OverlayFocusRuntime>();
const OVERLAY_BASE_Z_INDEX = 20;
const OVERLAY_TRANSITION_MS = 300;

const getFocusableElement = (target?: HTMLElement | null): HTMLElement | null => {
  if (!target || !target.isConnected) return null;
  if (target instanceof HTMLButtonElement && target.disabled) return null;
  return typeof target.focus === "function" ? target : null;
};

const scheduleFocus = (target?: HTMLElement | null): void => {
  const focusTarget = getFocusableElement(target);
  if (!focusTarget || typeof window === "undefined") return;

  window.setTimeout(() => {
    getFocusableElement(focusTarget)?.focus();
  }, 0);
};

const getOverlayZIndex = (id: string): number | null => {
  const index = state.stack.findIndex((entry) => entry.id === id);
  if (index < 0) return null;
  return OVERLAY_BASE_Z_INDEX + index * 2;
};

const getStackZIndex = (id: string, offset = 0): number | null => {
  const overlayZIndex = getOverlayZIndex(id);
  if (overlayZIndex === null) return null;
  return overlayZIndex + offset;
};

const syncBodyScroll = (): void => {
  if (typeof document === "undefined") return;

  const shouldLockScroll = state.stack.some((entry) => entry.lockScroll);
  document.body.style.overflow = shouldLockScroll ? "hidden" : "";
};

const getActiveOverlay = (): OverlayEntry | undefined =>
  state.stack[state.stack.length - 1];

const focusActiveOverlay = (): void => {
  const activeOverlay = getActiveOverlay();
  if (!activeOverlay || !activeOverlay.autoFocus) return;

  scheduleFocus(activeOverlay.contentElement);
};

const restoreOverlayFocus = (id: string): void => {
  const activeOverlay = getActiveOverlay();
  if (activeOverlay?.autoFocus && activeOverlay.contentElement) {
    scheduleFocus(activeOverlay.contentElement);
    return;
  }

  const runtime = overlayFocusRuntimeById.get(id);
  if (!runtime) return;

  scheduleFocus(runtime.previousFocusedElement);
};

const destroyOverlayRuntime = (id: string): void => {
  const runtime = overlayRuntimeById.get(id);
  if (!runtime) return;

  if (runtime.closeTimer) {
    clearTimeout(runtime.closeTimer);
  }

  runtime.element.removeEventListener("click", runtime.clickHandler);
  runtime.element.remove();
  overlayRuntimeById.delete(id);
};

const scheduleOverlayDestroy = (id: string): void => {
  const runtime = overlayRuntimeById.get(id);
  if (!runtime) return;

  runtime.element.className = "e-overlay e-overlay--inactive";

  if (runtime.closeTimer) {
    clearTimeout(runtime.closeTimer);
  }

  runtime.closeTimer = setTimeout(() => {
    destroyOverlayRuntime(id);
  }, OVERLAY_TRANSITION_MS);
};

const ensureOverlayRuntime = (id: string): OverlayRuntime | null => {
  if (typeof document === "undefined") return null;

  const existingRuntime = overlayRuntimeById.get(id);
  if (existingRuntime) {
    if (existingRuntime.closeTimer) {
      clearTimeout(existingRuntime.closeTimer);
      existingRuntime.closeTimer = null;
    }
    return existingRuntime;
  }

  const element = document.createElement("div");
  element.className = "e-overlay e-overlay--inactive";

  const clickHandler = (): void => {
    const activeOverlay = getActiveOverlay();
    if (!activeOverlay || activeOverlay.id !== id) {
      return;
    }
    activeOverlay.onOutsideClick?.();
  };

  element.addEventListener("click", clickHandler);
  document.body.appendChild(element);

  const runtime: OverlayRuntime = {
    element,
    clickHandler,
    closeTimer: null,
  };

  overlayRuntimeById.set(id, runtime);
  return runtime;
};

const handleEscapeKey = ({ key }: KeyboardEvent): void => {
  if (key !== "Escape") return;

  const activeOverlay = getActiveOverlay();
  if (!activeOverlay) return;

  activeOverlay.onEscape?.();
};

const syncEscapeListener = (): void => {
  if (typeof document === "undefined") return;

  if (isOverlayActive.value && !hasEscapeListener) {
    document.addEventListener("keydown", handleEscapeKey);
    hasEscapeListener = true;
    return;
  }

  if (!isOverlayActive.value && hasEscapeListener) {
    document.removeEventListener("keydown", handleEscapeKey);
    hasEscapeListener = false;
  }
};

const syncOverlayElements = (): void => {
  if (typeof document === "undefined") return;

  syncEscapeListener();
  syncBodyScroll();

  const activeIds = new Set(state.stack.map((entry) => entry.id));

  state.stack.forEach((entry, index) => {
    const runtime = ensureOverlayRuntime(entry.id);
    if (!runtime) return;

    runtime.element.className = "e-overlay e-overlay--active";
    runtime.element.style.zIndex = `${OVERLAY_BASE_Z_INDEX + index * 2}`;
  });

  overlayRuntimeById.forEach((_, id) => {
    if (!activeIds.has(id)) {
      scheduleOverlayDestroy(id);
    }
  });

  focusActiveOverlay();
};

const openOverlay = ({
  id,
  dismissible = true,
  lockScroll = true,
  autoFocus = false,
  restoreFocus = false,
  contentElement,
  onOutsideClick,
  onEscape,
}: OpenOverlayOptions): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  const nextEntry: OverlayEntry = {
    id,
    dismissible,
    lockScroll,
    autoFocus,
    restoreFocus,
    contentElement,
    onOutsideClick,
    onEscape,
  };

  if (currentIndex >= 0) {
    state.stack[currentIndex] = nextEntry;
    syncOverlayElements();
    return;
  }

  if (typeof document !== "undefined") {
    const activeElement = document.activeElement;
    overlayFocusRuntimeById.set(id, {
      previousFocusedElement:
        restoreFocus && activeElement instanceof HTMLElement ? activeElement : null,
    });
  }

  state.stack.push(nextEntry);
  syncOverlayElements();
};

const updateOverlayContentElement = (
  id: string,
  contentElement: HTMLElement | null
): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  if (currentIndex < 0) return;

  state.stack[currentIndex] = {
    ...state.stack[currentIndex],
    contentElement,
  };

  const activeOverlay = getActiveOverlay();
  if (activeOverlay?.id === id && activeOverlay.autoFocus) {
    focusActiveOverlay();
  }
};

const closeOverlay = (id: string): void => {
  const currentIndex = state.stack.findIndex((entry) => entry.id === id);
  if (currentIndex < 0) return;
  const closedOverlay = state.stack[currentIndex];
  const wasActiveOverlay = currentIndex === state.stack.length - 1;
  state.stack.splice(currentIndex, 1);
  syncOverlayElements();

  if (wasActiveOverlay && closedOverlay.restoreFocus) {
    restoreOverlayFocus(id);
  }

  overlayFocusRuntimeById.delete(id);
};

const closeAllOverlays = (): void => {
  const lastOverlay = state.stack[state.stack.length - 1];
  const closedOverlayIds = state.stack.map((entry) => entry.id);
  state.stack.splice(0, state.stack.length);
  syncOverlayElements();

  if (lastOverlay?.restoreFocus) {
    restoreOverlayFocus(lastOverlay.id);
  }

  closedOverlayIds.forEach((id) => overlayFocusRuntimeById.delete(id));
};

export default function useOverlayService() {
  return {
    isOverlayActive,
    getStackZIndex,
    openOverlay,
    updateOverlayContentElement,
    closeOverlay,
    closeAllOverlays,
  };
}
