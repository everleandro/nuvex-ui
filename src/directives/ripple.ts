interface El extends HTMLElement {
  __rippleHandler__?: (e: MouseEvent) => void;
  __rippleKeyboardHandler__?: (e: KeyboardEvent) => void;
  __rippleEventName__?: RipplePointerEvent;
}

type RipplePointerEvent = "pointerdown" | "mousedown" | "click";

export interface RippleBinding {
  color?: string;
  event?: RipplePointerEvent;
  center?: boolean;
  disabled?: boolean;
  keyboard?: boolean;
  interactive?: boolean;
  ignore?: string;
}

const isIgnoredTarget = (
  el: El,
  event: Event,
  binding?: Record<"value", RippleBinding>
) => {
  const selector = binding?.value?.ignore;
  const target = event.target;

  if (!selector || !(target instanceof Element) || target === el) return false;

  const ignoredTarget = target.closest(selector);
  return !!ignoredTarget && ignoredTarget !== el && el.contains(ignoredTarget);
};

const ensureRippleClasses = (
  el: El,
  binding?: Record<"value", RippleBinding>
) => {
  const rippleEnabled = binding?.value?.disabled !== true;
  const interactive = rippleEnabled && binding?.value?.interactive !== false;

  if (rippleEnabled && !el.classList.contains("v-ripple-element")) {
    el.classList.add("v-ripple-element");
  } else if (!rippleEnabled) {
    el.classList.remove("v-ripple-element");
  }

  if (interactive && !el.classList.contains("interactive-element")) {
    el.classList.add("interactive-element");
  } else if (!interactive) {
    el.classList.remove("interactive-element");
  }
};

const createRipple = (
  el: El,
  binding?: Record<"value", RippleBinding>,
  position?: { x: number; y: number },
  centered = false
) => {
  const __ANIMATION_DURATION__ = "0.5s";

  if (binding?.value?.disabled) return;

  ensureRippleClasses(el, binding);

  const circle = document.createElement("span");
  el.appendChild(circle);

  const rect = el.getBoundingClientRect();
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  const color = binding?.value?.color || getComputedStyle(el).color;
  const background = color || "rgb(255, 255, 255)";
  const center = centered || !!binding?.value?.center;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.backgroundColor = background;
  circle.style.animation = `v-ripple ${__ANIMATION_DURATION__} linear`;
  circle.style.position = "absolute";
  circle.style.borderRadius = "50%";
  circle.style.pointerEvents = "none";
  circle.style.left = center
    ? `${(rect.width - diameter) / 2}px`
    : `${(position?.x || rect.width / 2) - rect.left - radius}px`;
  circle.style.top = center
    ? `${(rect.height - diameter) / 2}px`
    : `${(position?.y || rect.height / 2) - rect.top - radius}px`;
  circle.classList.add("v-ripple");

  setTimeout(() => {
    if (circle.parentElement) circle.parentElement.removeChild(circle);
  }, parseFloat(__ANIMATION_DURATION__) * 1000);
};

const createRippleHandler = (
  el: El,
  binding?: Record<"value", RippleBinding>
) => {
  return (e: MouseEvent) => {
    if (isIgnoredTarget(el, e, binding)) return;
    createRipple(el, binding, { x: e.clientX, y: e.clientY });
  };
};

const createRippleKeyboardHandler = (
  el: El,
  binding?: Record<"value", RippleBinding>
) => {
  return (e: KeyboardEvent) => {
    if (binding?.value?.disabled || e.repeat) return;
    if (isIgnoredTarget(el, e, binding)) return;
    if (e.key !== " " && e.key !== "Enter") return;

    createRipple(el, binding, undefined, true);
  };
};

const removeRippleListeners = (el: El) => {
  if (el.__rippleHandler__ && el.__rippleEventName__) {
    el.removeEventListener(el.__rippleEventName__, el.__rippleHandler__);
  }

  if (el.__rippleKeyboardHandler__) {
    el.removeEventListener("keydown", el.__rippleKeyboardHandler__);
  }

  delete el.__rippleHandler__;
  delete el.__rippleKeyboardHandler__;
  delete el.__rippleEventName__;
};

const addRippleListeners = (el: El, binding?: Record<"value", RippleBinding>) => {
  if (binding?.value?.disabled) return;

  const eventName = binding?.value?.event || "pointerdown";
  el.__rippleHandler__ = createRippleHandler(el, binding);
  el.__rippleEventName__ = eventName;
  el.addEventListener(eventName, el.__rippleHandler__);

  if (binding?.value?.keyboard !== false) {
    el.__rippleKeyboardHandler__ = createRippleKeyboardHandler(el, binding);
    el.addEventListener("keydown", el.__rippleKeyboardHandler__);
  }
};

export const ripple = {
  mounted(el: El, binding?: Record<"value", RippleBinding>) {
    ensureRippleClasses(el, binding);

    addRippleListeners(el, binding);
  },

  updated(el: El, binding?: Record<"value", RippleBinding>) {
    ensureRippleClasses(el, binding);
    removeRippleListeners(el);
    addRippleListeners(el, binding);
  },

  unmounted(el: El) {
    removeRippleListeners(el);
  },
};

export default ripple;
