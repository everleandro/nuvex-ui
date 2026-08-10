import type { ElevationLevel } from "./elevation";

export interface BarProps {
  dense?: boolean;
  absolute?: boolean;
  app?: boolean;
  outlined?: boolean;
  elevation?: ElevationLevel;
  height?: string | number;
  fixed?: boolean;
  depressed?: boolean;
  color?: string;
  clipped?: boolean;
}
