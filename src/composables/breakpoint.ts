export type breakpointKey = "xs" | "sm" | "md" | "lg" | "xl";
import { ref, reactive, onMounted, onUnmounted } from "vue";
export default function () {
  const viewport = reactive({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });
  const xs = ref(0);
  const sm = ref(0);
  const md = ref(0);
  const lg = ref(0);
  const xl = ref(0);
  /** `false` mientras no haya DOM: SSR y primer render de hidratacion. */
  const resolved = ref(false);
  let timer = 0;

  onMounted(() => {
    if (typeof window === "undefined") return;

    readBreakpoints();
    // Primera medicion sincrona: se aplica antes del primer paint, sin esperar el debounce.
    applyViewport();
    window.addEventListener("resize", observeBreakpoint);
  });

  onUnmounted(() => {
    if (typeof window === "undefined") return;

    clearPendingObservation();
    window.removeEventListener("resize", observeBreakpoint);
  });

  const integerFromKeys = (keys: string[], fallback: number): number => {
    const styles = getComputedStyle(document.documentElement);

    for (const key of keys) {
      const value = parseInt(styles.getPropertyValue(key), 10);
      if (!Number.isNaN(value)) {
        return value;
      }
    }

    return fallback;
  };

  const readBreakpoints = (): void => {
    xs.value = integerFromKeys(["--e-grid-breakpoint-xs", "--xs"], 0);
    sm.value = integerFromKeys(["--e-grid-breakpoint-sm", "--sm"], 600);
    md.value = integerFromKeys(["--e-grid-breakpoint-md", "--md"], 960);
    lg.value = integerFromKeys(["--e-grid-breakpoint-lg", "--lg"], 1264);
    xl.value = integerFromKeys(["--e-grid-breakpoint-xl", "--xl"], 1920);
  };

  const applyViewport = (): void => {
    const windowWidth = window.innerWidth || 0;
    viewport.xs = windowWidth <= sm.value;
    viewport.sm = windowWidth > sm.value && windowWidth <= md.value;
    viewport.md = windowWidth > md.value && windowWidth <= lg.value;
    viewport.lg = windowWidth > lg.value && windowWidth <= xl.value;
    viewport.xl = windowWidth > xl.value;
    resolved.value = true;
  };

  const clearPendingObservation = (): void => {
    if (!timer) return;

    window.clearTimeout(timer);
    timer = 0;
  };

  const observeBreakpoint = (): void => {
    clearPendingObservation();
    timer = window.setTimeout(applyViewport, 300);
  };

  return { viewport, resolved };
}
