import type { ElevationLevel } from "./elevation";

/**
 * Column definition shared by EDataList, EDataHeader and EDataRow.
 * A number generates equal columns, an array is used as-is.
 */
export type DataListColumns = number | string[];

/** `none` permite aplanar una fila que hereda elevacion del contenedor. */
export type DataRowElevation = ElevationLevel | "none";

export interface DataListProps {
  /**
   * Number of equal columns or an explicit list of `grid-template-columns` tracks.
   */
  columns?: DataListColumns;
  outlined?: boolean;
  elevation?: ElevationLevel;
  divided?: boolean;
  rowElevation?: DataRowElevation;
  rowOutlined?: boolean;
  ariaLabel?: string;
}

export interface DataRowProps {
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  elevation?: DataRowElevation;
}

export interface DataHeaderProps {
  sticky?: boolean;
}

export type DataCellAlign = "start" | "center" | "end";

export interface DataCellProps {
  align?: DataCellAlign;
}
