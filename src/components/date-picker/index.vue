<template>
  <div :class="pickerClass" :style="pickerStyle">
    <div v-if="!noTitle" class="e-picker__title">
      <div class="e-date-picker-title">
        <slot name="title">
          <div class="e-picker__title__btn e-date-picker-title__year"
            @click="changeViewMode(store.viewTypeOptions.year)">
            {{ currentYear }}
          </div>
          <div class="e-picker__title__btn e-date-picker-title__date e-picker__title__btn--active">
            <transition :name="store.pickerTransition">
              <div v-html="formattedHeaderDate" :key="formattedHeaderKey"></div>
            </transition>
          </div>
        </slot>
      </div>
    </div>
    <div class="e-picker__body">
      <div aria-live="polite" aria-atomic="true" class="e-picker__live-region">
        {{ liveAnnouncement }}
      </div>
      <div>
        <div class="e-date-picker-header">
          <slot name="header" :prev="prevButtonAction" :next="nextButtonAction" :change-view-mode="changeViewMode"
            :page-date="store.pageDate">
            <EButton :icon="iconPrev || icon.arrowLeft" text :aria-label="prevButtonLabel" :disabled="prevDisabled"
              :aria-disabled="prevDisabled" @click="prevButtonAction()" />

            <div class="e-date-picker-header__value">
              <transition :name="store.headerContentAnimation">
                <div :key="headerValueKey">
                  <EButton type="button" text :aria-label="headerButtonLabel" block @click="changeViewMode()">
                    {{ formattedSubheader() }}
                  </EButton>
                </div>
              </transition>
            </div>

            <EButton :icon="iconNext || icon.arrowRight" text :aria-label="nextButtonLabel" :disabled="nextDisabled"
              :aria-disabled="nextDisabled" @click="nextButtonAction()" />
          </slot>
        </div>

        <div :class="gridContainerClass">
          <transition :name="store.gridContentAnimation" mode="out-in">
            <div v-if="viewComputed === store.viewTypeOptions.day" :key="keyMonth" class="date-view" role="grid"
              :aria-label="formattedSubheader()" @keydown="handleDayGridKeydown">
              <div class="grid-header" role="row">
                <span v-for="weekDay in daysOfWeek" :key="weekDay" role="columnheader" :aria-label="weekDay"
                  class="grid-header__cell">
                  {{ weekDay }}
                </span>
              </div>
              <div class="grid-body">
                <span v-for="day in [
                  ...visiblePrevMonthDays,
                  ...days,
                  ...visibleNextMonthDays,
                ]" :key="day.timestamp" role="gridcell" :aria-selected="day.isSelected"
                  :aria-current="day.isToday ? 'date' : undefined" class="grid-body__cell__cell">
                  <DatePickerGridButton v-bind="dayGridButtonProps(day)" :button-class="dayClasses(day)"
                    @click="selectDate(day)">
                    {{ day.date }}
                  </DatePickerGridButton>
                </span>
              </div>
            </div>

            <div v-else-if="viewComputed === store.viewTypeOptions.month" :key="keyYear" class="month-view" role="grid"
              :aria-label="formattedSubheader()" @keydown="handleMonthGridKeydown">
              <div class="grid-body">
                <span v-for="month in months" :key="month.timestamp" role="gridcell" :aria-selected="month.isSelected"
                  :aria-current="month.isCurrent ? 'date' : undefined" class="grid-body__cell__cell">
                  <DatePickerGridButton v-bind="selectableGridButtonProps(
                    month.isSelected,
                    month.isDisabled,
                    month.isCurrent,
                  )" :button-class="monthClasses(month)" @click="selectMonth(month)">
                    {{ month.month }}
                  </DatePickerGridButton>
                </span>
              </div>
            </div>

            <div v-else :key="keyYearPage" class="year-view" role="grid" :aria-label="formattedSubheader()"
              @keydown="handleYearGridKeydown">
              <div class="grid-body">
                <span v-for="year in years" :key="year.timestamp" role="gridcell" :aria-selected="year.isSelected"
                  :aria-current="year.isCurrent ? 'date' : undefined" class="grid-body__cell__cell">
                  <DatePickerGridButton v-bind="selectableGridButtonProps(
                    year.isSelected,
                    year.isDisabled,
                    year.isCurrent,
                  )" :button-class="yearClasses(year)" @click="selectYear(year)">
                    {{ year.year }}
                  </DatePickerGridButton>
                </span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import EButton from "@/components/button/index.vue";
import { useResolvedColor } from "@/composables/color";
import { getDefaultLocaleCode, Lng as Lnguage } from "@/locales/index";
import type { ContainerMenuInterface, DialogInterface } from "@/types";
import {
  datePickerViewType,
} from "@/types/date-picker";
import type {
  DatePickerProps,
  DatesConfiguration,
  Day,
  Month,
  Year,
} from "@/types/date-picker";
import DatePickerGridButton from "./grid-button.vue";

import UtilDate from "@/utils/date";
import icon from "@/utils/icons";

import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

// State and setup
const liveAnnouncement = ref("");

// Navigation state
const nextDisabled = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.day)
    return nextMonthDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.month)
    return nextYearDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.year)
    return nextYearPageDisabled.value;
  return false;
});

const prevDisabled = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.day)
    return previousMonthDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.month)
    return previousYearDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.year)
    return previousYearPageDisabled.value;
  return false;
});

const dialog = inject<DialogInterface | undefined>("EDialog", undefined);
const menuContainer = inject<ContainerMenuInterface | undefined>(
  "EMenuContainer",
  undefined,
);

const props = withDefaults(defineProps<DatePickerProps>(), {
  gridButtonElevation: undefined,
  lng: getDefaultLocaleCode(),
  disabled: undefined,
  highlighted: undefined,
  view: undefined,
  noTitle: false,
  weekStart: 1,
});

const store = reactive({
  pageDate: new Date(),
  localView: datePickerViewType.day,
  selectedDate: new UtilDate(new Date(), props.lng),
  headerContentAnimation: "tab-transition",
  gridContentAnimation: "tab-transition",
  viewTypeOptions: datePickerViewType,
  pickerTransition: "picker-transition",
  valueTimestamp: new Date().getTime(),
});

const keyMonth = computed(() => {
  return store.pageDate.getFullYear() + "-" + store.pageDate.getMonth();
});

const keyYear = computed(() => {
  return store.pageDate.getFullYear();
});

const keyYearPage = computed(() => {
  return Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12;
});

const emit = defineEmits<{
  (e: "update:view", value: datePickerViewType): void;
  (e: "update:modelValue", value: Date | string): void;
  (e: "click:day", value: Day): void;
}>();

const viewComputed = computed((): datePickerViewType => {
  if (props.onlyYear) {
    return datePickerViewType.year;
  } else if (props.onlyMonth) {
    return store.localView === datePickerViewType.day
      ? datePickerViewType.month
      : store.localView;
  }
  return props.view !== undefined ? props.view : store.localView;
});

const changeView = (value: datePickerViewType) => {
  store.localView = value;
  emit("update:view", value);
};

const setViewTransition = (targetView: datePickerViewType): void => {
  const currentView = viewComputed.value;

  if (currentView === targetView) {
    return;
  }

  const isDrillingDown = targetView < currentView;

  store.gridContentAnimation = isDrillingDown
    ? "picker-view-forward-transition"
    : "picker-view-reverse-transition";
  store.headerContentAnimation = "picker-fade-transition";
};

const changeValue = (value: UtilDate) => {
  updatePageConfiguration(value);
  if (props.closeOnChange) {
    dialog?.close(true);
    menuContainer?.closeMenu();
  }
  emit("update:modelValue", value.date);
};

const computedValue = computed(() => {
  return new UtilDate(props.modelValue);
});

const updatePageConfiguration = (utilDate: UtilDate): void => {
  store.selectedDate = utilDate;
  store.pageDate = utilDate.date;
  store.valueTimestamp = utilDate.date.getTime();
};

const formatComparableDate = (date: Date) => {
  return new UtilDate(date).format("year-YYYY-month-MM-month-DD");
};

const isSameCalendarDate = (left: Date, right: Date) => {
  return left.toDateString() === right.toDateString();
};

const isSameMonth = (left: Date, right: Date) => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
};

const isSameYear = (left: Date, right: Date) => {
  return left.getFullYear() === right.getFullYear();
};

const visiblePrevMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const length = amountVisibleDaysOfPrevMonth.value;
  const result: Day[] = new Array(length);

  for (let i = 1; i <= length; i++) {
    result[length - i] = {
      ...dayObject(utilDate.subtract(1, "days").date, true),
      isAdjacentMonth: true,
    };
  }
  return result;
});

watch(
  () => props.modelValue,
  (value: string | number | Date | undefined) => {
    updatePageConfiguration(new UtilDate(value));
  },
);

watch(
  () => props.view,
  (value: datePickerViewType | undefined) => {
    if (value) changeView(value);
  },
);

const amountVisibleDaysOfPrevMonth = computed((): number => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const day_number = utilDate.date.getDay();
  const rest = day_number - props.weekStart;
  return rest >= 0 ? rest : 7 + rest;
});
const dayObject = (
  date: Date,
  forceDisabled: boolean | undefined = undefined,
): Day => {
  return {
    date: date.getDate(),
    timestamp: date.getTime(),
    isSelected: isSelectedDate(date),
    isDisabled:
      forceDisabled != undefined ? forceDisabled : isDisabledDate(date),
    isHighlighted: isHighlightedDate(date),
    isHighlightStart: isHighlightStart(date),
    isHighlightEnd: isHighlightEnd(date),
    isToday: date.toDateString() === new Date().toDateString(),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
    isSaturday: date.getDay() === 6,
    isSunday: date.getDay() === 0,
  };
};
const isSelectedDate = (date: Date): boolean => {
  if (!store.selectedDate) {
    return false;
  }
  return isSameCalendarDate(store.selectedDate.date, date);
};
const isDisabledDate = (date: Date): boolean => {
  return getDateConfiguration(date, props.disabled);
};

const matchesConfiguredDate = (
  date: Date,
  configObject: DatesConfiguration,
) => {
  return configObject.dates?.some((configuredDate) => {
    return isSameCalendarDate(date, configuredDate);
  }) ?? false;
};

const matchesConfiguredBounds = (
  date: Date,
  configObject: DatesConfiguration,
) => {
  if (!configObject.from || !configObject.to) {
    return false;
  }

  return (
    (date > configObject.from && date < configObject.to) ||
    formatComparableDate(date) === formatComparableDate(configObject.from) ||
    formatComparableDate(date) === formatComparableDate(configObject.to)
  );
};

const matchesConfiguredRange = (
  date: Date,
  configObject: DatesConfiguration,
) => {
  return configObject.ranges?.some((range) => {
    return Boolean(range.from && range.to && date < range.to && date > range.from);
  }) ?? false;
};

const getDateConfiguration = (
  date: Date,
  configObject: DatesConfiguration | undefined,
): boolean => {
  if (typeof configObject === "undefined") {
    return false;
  }

  return (
    matchesConfiguredDate(date, configObject) ||
    matchesConfiguredBounds(date, configObject) ||
    matchesConfiguredRange(date, configObject) ||
    (configObject.days?.includes(date.getDay()) ?? false) ||
    (configObject.daysOfMonth?.includes(date.getDate()) ?? false) ||
    (typeof configObject.customPredictor === "function" &&
      configObject.customPredictor(date))
  );
};

const isHighlightedDate = (date: Date): boolean => {
  if (isDisabledDate(date)) {
    return false;
  }

  return getDateConfiguration(date, props.highlighted);
};

const isHighlightStart = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.from instanceof Date &&
    isSameCalendarDate(props.highlighted.from, date)
  );
};

const isHighlightEnd = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.to instanceof Date &&
    isSameCalendarDate(props.highlighted.to, date)
  );
};

onMounted(() => {
  store.pageDate = props.modelValue ? new Date(props.modelValue) : new Date();
  store.selectedDate = new UtilDate(props.modelValue);
});

const visibleNextMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).endOfMonth();
  const daysInMonth = utilDate.daysInMonth;

  const amountDaysInLastRow =
    (daysInMonth + amountVisibleDaysOfPrevMonth.value) % 7;
  const length = amountDaysInLastRow > 0 ? 7 - amountDaysInLastRow : 0;
  const result: Array<Day> = [];

  for (let i = 1; i <= length; i++) {
    result.push({
      ...dayObject(utilDate.add(1, "days").date, true),
      isAdjacentMonth: true,
    });
  }
  return result;
});

const pickerClass = computed(() => {
  const classes = ["e-picker", "e-picker--date"];

  if (props.landscape) {
    classes.push("e-picker--landscape");
  }
  if (props.noTitle) {
    classes.push("e-picker--no-title");
  }

  if (props.elevation) {
    classes.push(`e-elevation--${props.elevation}`);
  }

  return classes;
});

const { colorStyles: pickerColorStyles } = useResolvedColor({
  color: computed(() => props.color),
  colorVar: "--e-date-picker-color",
  contrastVar: "--e-date-picker-contrast-color",
});

const pickerStyle = computed((): Record<string, string> => ({
  ...pickerColorStyles.value,
}));

const gridContainerClass = computed((): Record<string, boolean> => {
  return {
    "e-date-picker-grid": true,
    "e-date-picker-grid--date":
      viewComputed.value === store.viewTypeOptions.day,
    "e-date-picker-grid--month":
      viewComputed.value === store.viewTypeOptions.month,
  };
});

const days = computed((): Array<Day> => {
  const days: Array<Day> = [];
  const utilDateObject = new UtilDate(store.pageDate).set(1, "days");
  const daysInMonth = utilDateObject.daysInMonth;

  for (let i = 0; i < daysInMonth; i++) {
    days.push(dayObject(utilDateObject.date));
    utilDateObject.add(1, "days");
  }

  return days;
});

const months = computed((): Array<Month> => {
  const months: Array<Month> = [];
  let utilDate = new UtilDate(store.pageDate).set(0, "months").startOfYear();

  for (let i = 0; i < 12; i++) {
    months.push({
      month: utilDate.monthshortName,
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedMonth(utilDate.date),
      isCurrent: isCurrentMonth(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date),
    });
    utilDate.add(1, "months");
  }

  return months;
});

const years = computed((): Array<Year> => {
  const years: Array<Year> = [];
  const yearStart = Math.floor(store.pageDate.getFullYear() / 12) * 12;
  let utilDate = new UtilDate().set(yearStart, "years").startOfYear();

  for (let i = 0; i < 12; i++) {
    years.push({
      year: utilDate.date.getFullYear(),
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedYear(utilDate.date),
      isCurrent: isCurrentYear(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date),
    });
    utilDate.add(1, "years");
  }

  return years;
});

const isSelectedMonth = (date: Date): boolean => {
  return !!store.selectedDate && isSameMonth(store.selectedDate.date, date);
};

const isSelectedYear = (date: Date): boolean => {
  return !!store.selectedDate && isSameYear(store.selectedDate.date, date);
};

const isCurrentMonth = (date: Date): boolean => {
  return isSameMonth(new Date(), date);
};

const isCurrentYear = (date: Date): boolean => {
  return isSameYear(new Date(), date);
};

const isDisabledMonth = (date: Date): boolean => {
  let disabled = false;

  if (typeof props.disabled === "undefined") {
    return false;
  }

  if (typeof props.disabled?.to !== "undefined" && props.disabled.to) {
    if (
      (date.getMonth() < props.disabled.to.getMonth() &&
        date.getFullYear() <= props.disabled.to.getFullYear()) ||
      date.getFullYear() < props.disabled.to.getFullYear()
    ) {
      disabled = true;
    }
  }

  if (typeof props.disabled?.from !== "undefined" && props.disabled.from) {
    if (
      (date.getMonth() > props.disabled.from.getMonth() &&
        date.getFullYear() >= props.disabled.from.getFullYear()) ||
      date.getFullYear() > props.disabled.from.getFullYear()
    ) {
      disabled = true;
    }
  }

  return disabled;
};

const changeViewMode = (viewMode?: datePickerViewType): void => {
  if (!props.onlyYear) {
    if (viewMode !== undefined) {
      setViewTransition(viewMode);
      changeView(viewMode);
      return;
    }

    let result = store.viewTypeOptions.month;

    if (viewComputed.value === store.viewTypeOptions.month) {
      result = store.viewTypeOptions.year;
    }

    setViewTransition(result);
    changeView(result);
  }
};

const t = (): Lnguage => {
  return new Lnguage(props.lng, props.weekStart);
};

const daysOfWeek = computed((): Array<string> => {
  return t().weekdaysMin;
});

const currentYear = computed(() => {
  return store.pageDate.getFullYear();
});

const formattedHeaderDate = computed((): string => {
  if (!store.selectedDate) {
    return "&nbsp;";
  }
  return store.selectedDate
    .setLng(props.lng)
    .format("week-ddd, month-mmm month-D");
});

const formattedHeaderKey = computed((): number => {
  return store.selectedDate?.date.getTime() || 1;
});

const formattedSubheader = (): string => {
  const utilDate = new UtilDate(store.pageDate, props.lng);
  switch (viewComputed.value) {
    case store.viewTypeOptions.day:
      return utilDate.format("month-mmmm year-YYYY");
    case store.viewTypeOptions.month:
      return utilDate.format("year-YYYY");
    case store.viewTypeOptions.year:
      const year = Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12;
      return `${year} - ${year + 12}`;
  }
  return ``;
};

const prevButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.month:
      return "Previous year";
    case datePickerViewType.year:
      return "Previous 12 years";
    default:
      return "Previous month";
  }
});

const nextButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.month:
      return "Next year";
    case datePickerViewType.year:
      return "Next 12 years";
    default:
      return "Next month";
  }
});

const headerButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.day:
      return `View months — ${formattedSubheader()}`;
    case datePickerViewType.month:
      return `View years — ${formattedSubheader()}`;
    default:
      return formattedSubheader();
  }
});

const selectableStateClasses = (
  prefix: "e-picker-month" | "e-picker-year",
  isSelected: boolean,
  isDisabled: boolean,
  isCurrent: boolean,
): Record<string, boolean> => {
  const isDefaultState = !isSelected && !isCurrent;

  return {
    [prefix]: true,
    [`${prefix}--default`]: isDefaultState,
    [`${prefix}--disabled`]: isDisabled,
    [`${prefix}--current`]: isCurrent,
    [`${prefix}--selected`]: isSelected,
  };
};

const dayClasses = (day: Day): Record<string, boolean> => {
  const isDefaultState = !day.isSelected && !day.isToday && !day.isHighlighted;
  const prefix = "e-picker-day";

  return {
    [`${prefix}`]: true,
    [`${prefix}--default`]: isDefaultState,
    [`${prefix}--disabled`]: day.isDisabled,
    [`${prefix}--highlighted`]: day.isHighlighted,
    [`${prefix}--highlight-start`]: day.isHighlightStart,
    [`${prefix}--highlight-end`]: day.isHighlightEnd,
    [`${prefix}--today`]: day.isToday,
    [`${prefix}--selected`]: day.isSelected,
    [`${prefix}--weekend`]: day.isWeekend,
    [`${prefix}--sat`]: day.isSaturday,
    [`${prefix}--sun`]: day.isSunday,
    [`${prefix}--adjacent-month`]: !!day.isAdjacentMonth,
  };
};

const monthClasses = (month: Month): Record<string, boolean> => {
  return selectableStateClasses(
    "e-picker-month",
    month.isSelected,
    month.isDisabled,
    month.isCurrent,
  );
};

const yearClasses = (year: Year): Record<string, boolean> => {
  return selectableStateClasses(
    "e-picker-year",
    year.isSelected,
    year.isDisabled,
    year.isCurrent,
  );
};
const gridButtonElevation = computed((): typeof props.gridButtonElevation | "none" => {
  return props.gridButtonElevation ?? "none";
});
const gridButtonHasElevation = computed((): boolean => {
  return !!props.gridButtonElevation;
});

const dayGridButtonProps = (
  day: Day,
): {
  disabled: boolean;
  elevation?: typeof props.gridButtonElevation | "none";
  text?: boolean;
} => {
  if (day.isSelected) {
    return {
      disabled: day.isDisabled,
      elevation: gridButtonElevation.value,
      text: false
    };
  }

  if (day.isToday) {
    return {
      disabled: day.isDisabled,
      elevation: gridButtonElevation.value,
      text: false
    };
  }

  if (day.isHighlighted) {
    return {
      disabled: day.isDisabled,
      elevation: gridButtonElevation.value,
      text: !gridButtonHasElevation.value
    };
  }

  return {
    disabled: day.isDisabled,
    elevation: gridButtonElevation.value,
    text: !gridButtonHasElevation.value,
  };
};

const selectableGridButtonProps = (
  isSelected: boolean,
  isDisabled: boolean,
  isCurrent: boolean,
): {
  disabled: boolean;
  elevation?: typeof props.gridButtonElevation | "none";
  text?: boolean;
} => {
  if (isSelected) {
    return {
      disabled: isDisabled,
      elevation: gridButtonElevation.value,
      text: false
    };
  }

  if (isCurrent) {
    return {
      disabled: isDisabled,
      elevation: gridButtonElevation.value,
      text: !gridButtonHasElevation.value
    };
  }

  return {
    disabled: isDisabled,
    elevation: gridButtonElevation.value,
    text: !gridButtonHasElevation.value,
  };
};

const nextMonth = () => {
  if (!nextMonthDisabled.value) {
    store.headerContentAnimation = "tab-transition";
    store.gridContentAnimation = "tab-transition";
    changeMonth(+1);
  }
};
const previousMonth = () => {
  if (!previousMonthDisabled.value) {
    store.headerContentAnimation = "tab-reverse-transition";
    store.gridContentAnimation = "tab-reverse-transition";
    changeMonth(-1);
  }
};

const nextMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return (
    props.disabled?.from.getMonth() <= store.pageDate.getMonth() &&
    props.disabled?.from.getFullYear() <= store.pageDate.getFullYear()
  );
});

const previousMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return (
    props.disabled.to.getMonth() >= store.pageDate.getMonth() &&
    props.disabled.to.getFullYear() >= store.pageDate.getFullYear()
  );
});

const changeMonth = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, "months").date
      : utilDate.subtract(incrementBy, "months").date;
};

const changeYear = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, "years").date
      : utilDate.subtract(incrementBy, "years").date;
};

const nextButtonAction = (): void => {
  if (viewComputed.value === store.viewTypeOptions.day) {
    nextMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    nextYear();
  } else {
    nextYearPage();
  }
  nextTick(() => {
    liveAnnouncement.value = formattedSubheader();
  });
};
const nextYear = (): void => {
  if (!nextYearDisabled.value) {
    store.headerContentAnimation = "tab-transition";
    store.gridContentAnimation = "tab-transition";
    changeYear(1);
  }
};
const nextYearPage = (): void => {
  if (!nextYearPageDisabled.value) {
    store.headerContentAnimation = "tab-transition";
    store.gridContentAnimation = "tab-transition";
    changeYear(12);
  }
};
const nextYearDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return props.disabled?.from.getFullYear() <= store.pageDate.getFullYear();
});
const nextYearPageDisabled = computed((): boolean => {
  return false;
});
const previousYearPageDisabled = computed((): boolean => {
  return false;
});

const previousYearDisabled = computed(() => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return props.disabled?.to.getFullYear() >= store.pageDate.getFullYear();
});

const previousYear = (): void => {
  if (!previousYearDisabled.value) {
    store.headerContentAnimation = "tab-reverse-transition";
    store.gridContentAnimation = "tab-reverse-transition";
    changeYear(-1);
  }
};

const previousYearPage = (): void => {
  if (!previousYearPageDisabled.value) {
    store.headerContentAnimation = "tab-reverse-transition";
    store.gridContentAnimation = "tab-reverse-transition";
    changeYear(-12);
  }
};
const headerValueKey = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.year) {
    return keyYearPage.value;
  }
  return viewComputed.value == store.viewTypeOptions.day
    ? store.pageDate.getMonth()
    : store.pageDate.getFullYear();
});

const prevButtonAction = (): void => {
  if (viewComputed.value == store.viewTypeOptions.day) {
    previousMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    previousYear();
  } else {
    previousYearPage();
  }
  nextTick(() => {
    liveAnnouncement.value = formattedSubheader();
  });
};

const handleGridKeydown =
  (cols: number) =>
    (e: KeyboardEvent): void => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
        return;
      e.preventDefault();
      const grid = e.currentTarget as HTMLElement;
      const buttons = Array.from(
        grid.querySelectorAll<HTMLButtonElement>(".grid-body button"),
      );
      const isDisabledButton = (button: HTMLButtonElement): boolean => {
        return (
          button.disabled ||
          button.getAttribute("aria-disabled") === "true" ||
          button.classList.contains("e-picker-day--disabled") ||
          button.classList.contains("e-btn--disabled")
        );
      };

      const enabledButtons = buttons.filter(
        (button) => !isDisabledButton(button),
      );
      if (!enabledButtons.length) return;

      const focused = document.activeElement as HTMLButtonElement | null;
      const idx = focused ? buttons.indexOf(focused) : -1;

      if (idx === -1) {
        enabledButtons[0]?.focus();
        return;
      }

      const deltas: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: cols,
        ArrowUp: -cols,
      };
      const step = deltas[e.key] ?? 0;
      let next = idx + step;

      while (next >= 0 && next < buttons.length) {
        const button = buttons[next];
        if (!isDisabledButton(button)) {
          button.focus();
          return;
        }
        next += step;
      }
    };

const handleDayGridKeydown = handleGridKeydown(7);
const handleMonthGridKeydown = handleGridKeydown(3);
const handleYearGridKeydown = handleGridKeydown(3);

const selectDate = (day: Day): void => {
  if (day.isDisabled) {
    emit("click:day", day);
    return;
  }

  const nextDate = new UtilDate(day.timestamp).date;

  const currentDate = computedValue.value.date;
  store.pickerTransition =
    currentDate > nextDate ? "picker-transition-reverse" : "picker-transition";
  changeValue(new UtilDate(day.timestamp));
};

const selectMonth = (month: Month): void => {
  if (!month.isDisabled) {
    if (props.onlyMonth) {
      changeValue(new UtilDate(month.timestamp));
    } else {
      setViewTransition(store.viewTypeOptions.day);
      store.pageDate = new Date(month.timestamp);
      changeView(store.viewTypeOptions.day);
    }
  }
};

const selectYear = (year: Year): void => {
  if (!year.isDisabled) {
    if (props.onlyYear) {
      changeValue(new UtilDate(year.timestamp));
    } else {
      setViewTransition(store.viewTypeOptions.month);
      store.pageDate = new Date(year.timestamp);
      changeView(store.viewTypeOptions.month);
    }
  }
};
</script>
<style lang="scss" src="./style.scss"></style>
