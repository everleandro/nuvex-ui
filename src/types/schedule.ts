export interface ScheduleSpace {
  label: string;
  id: string | number;
}

export interface ScheduleSlotEvent {
  name: string;
  entityId: number | string;
  start: Date | string;
  end: Date | string;
  color: string;
}

export interface ScheduleEvent extends ScheduleSlotEvent {
  footer?: string | number | null;
  subtitle?: string | number | null;
  id: string | number;
}

export interface ScheduleToolbarLabels {
  view: string;
  day: string;
  week: string;
  resource: string;
  space: string;
  today: string;
  previousPeriod: string;
  nextPeriod: string;
  previousResourcePage: string;
  nextResourcePage: string;
  backToWeek: string;
  resourcePage: string;
}

export interface ScheduleToolbarSlotProps {
  date: Date;
  locale: string;
  color?: string;
  view: ScheduleView;
  scale: CalendarScale;
  selectedSpace?: ScheduleSpace;
  spaces: ScheduleSpace[];
  labels: ScheduleToolbarLabels;
  canReturnToWeek: boolean;
  canPaginateResources: boolean;
  resourcePage: number;
  resourcePageCount: number;
  setDate: (value: Date | string) => void;
  setView: (value: ScheduleView) => void;
  setScale: (value: CalendarScale) => void;
  setSelectedSpace: (value: ScheduleSpace | undefined) => void;
  goToToday: () => void;
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
  returnToWeekView: () => void;
  goToPreviousResourcePage: () => void;
  goToNextResourcePage: () => void;
}

export interface Point {
  x: number;
  y: number;
}

export enum ScheduleView {
  Calendar = "calendar",
  Resource = "resource",
}

export enum CalendarScale {
  Day = "day",
  Week = "week",
}
