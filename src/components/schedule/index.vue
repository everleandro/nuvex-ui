<template>
    <div :class="scheduleContainerClass">
        <div v-if="hasToolbarSlot" class="e-schedule__toolbar-slot">
            <slot name="toolbar" v-bind="toolbarSlotProps" />
            <EProgressLinear v-show="loading" :color="color" indeterminate height="4" />
        </div>
        <transition name="fade" mode="out-in">
            <div :key="`${computedView}:${computedScale ?? 'none'}`" :class="scheduleClass" :style="scheduleStyle"
                role="region" aria-label="Schedule" :aria-busy="loading ? 'true' : 'false'">
                <div class="e-schedule__header-strip">
                    <div class="e-schedule__header-spacer col-hour-info">
                        <div class="e-schedule__header-content e-schedule__header-content--actions">
                            <span v-if="showBackToWeekAction && !hasToolbarSlot" class="action-container">
                                <button v-ripple class="e-btn e-schedule__action-button" type="button"
                                    :aria-label="scheduleToolbarLabels.backToWeek"
                                    :title="scheduleToolbarLabels.backToWeek" @click="returnToWeekView">
                                    <EIcon :icon="icon.arrowLeft" />
                                </button>
                            </span>
                            <span v-else-if="showPaginationActions && !hasToolbarSlot" class="action-container">
                                <button v-ripple class="e-btn e-schedule__action-button" type="button"
                                    :aria-label="scheduleToolbarLabels.previousResourcePage"
                                    :title="scheduleToolbarLabels.previousResourcePage"
                                    @click="changeResourcePage('-')">
                                    <EIcon :icon="icon.arrowLeft" />
                                </button>
                                <button v-ripple class="e-btn e-schedule__action-button" type="button"
                                    :aria-label="scheduleToolbarLabels.nextResourcePage"
                                    :title="scheduleToolbarLabels.nextResourcePage" @click="changeResourcePage('+')">
                                    <EIcon :icon="icon.arrowRight" />
                                </button>
                            </span>
                        </div>
                        <EProgressLinear v-show="loading && !hasToolbarSlot" indeterminate height="4" />
                    </div>
                    <div class="e-schedule__header-viewport">
                        <transition :name="local.globalContentAnimation" mode="out-in">
                            <div :key="`${resourceViewKey}:header`" class="e-schedule__header-track">
                                <div v-for="data in visibleHeaderLabels" :key="`header-${colKey(data)}`"
                                    class="e-schedule__header-column">
                                    <div class="e-schedule__header-content">
                                        <EButton v-if="isResourceView" class="e-schedule-btn--space" :color="color" text
                                            :aria-label="resourceHeaderAriaLabel(data)"
                                            @click="handleHeaderLabelClick(data.date, data.entityId)">
                                            {{ data.label }}
                                        </EButton>
                                        <span v-else>
                                            <span data-day-of-week="true"> {{ data.dayOfWeek }}</span>
                                            <EButton v-if="isWeekScale" class="e-schedule-btn--day" :color="color"
                                                :text="!data.today" :aria-current="data.today ? 'date' : undefined"
                                                :aria-label="calendarHeaderAriaLabel(data)"
                                                @click="handleHeaderLabelClick(data.date)">
                                                {{ data.dayOfMonth }}
                                            </EButton>
                                            <span v-else class="e-schedule__day-chip"
                                                :aria-current="data.today ? 'date' : undefined">
                                                {{ data.dayOfMonth }}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="e-schedule__content">
                    <div class="e-schedule__hours-column col-hour-info">
                        <div v-for="(hour, hourIndex) in hourList" :key="hourIndex"
                            class="e-schedule__hour e-schedule__cell">
                            <span>
                                <span class="hour-label e-vue-input--text">{{ hour }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="e-schedule__viewport">
                        <transition :name="local.globalContentAnimation" mode="out-in">
                            <div :key="resourceViewKey" class="e-schedule__body">
                                <div v-for="(data, colIndex) in visibleHeaderLabels" :key="colKey(data)"
                                    class="e-schedule__column">
                                    <div v-for="(hour, hourIndex) in hourList" :key="hourIndex"
                                        class="e-schedule__event-cell e-schedule__cell">
                                        <div v-if="hasEvent(getVisibleEventPoint(hourIndex, colIndex))"
                                            :class="eventWrapperClass"
                                            :style="eventStyle(getVisibleEventPoint(hourIndex, colIndex))">
                                            <slot name="event"
                                                :event="getEvent(getVisibleEventPoint(hourIndex, colIndex))">
                                                <button v-ripple type="button"
                                                    :aria-label="eventAriaLabel(getEvent(getVisibleEventPoint(hourIndex, colIndex)))"
                                                    :class="eventClass()"
                                                    @click="handleEventClick(getEvent(getVisibleEventPoint(hourIndex, colIndex)), $event)">
                                                    <span class="event-name">{{
                                                        getEvent(getVisibleEventPoint(hourIndex, colIndex)).name
                                                        }}</span>
                                                    <span class="event-subtitle">{{
                                                        getEvent(getVisibleEventPoint(hourIndex, colIndex)).subtitle
                                                        }}</span>
                                                    <span class="event-footer">{{
                                                        getEvent(getVisibleEventPoint(hourIndex, colIndex)).footer
                                                        }}</span>
                                                </button>
                                            </slot>
                                        </div>
                                        <slot v-else name="empty-slot"
                                            :data="getEmptySlotData(getVisibleEmptyPoint(hourIndex, colIndex))">
                                            <button v-ripple type="button"
                                                :aria-label="emptySlotAriaLabel(getEmptySlotData(getVisibleEmptyPoint(hourIndex, colIndex)))"
                                                :class="[
                                                    'v-ripple-element',
                                                    'e-schedule__empty-slot',
                                                    'e-btn',
                                                    'e-btn--text'
                                                ]"
                                                @click="emptySlotClickHandler(getVisibleEmptyPoint(hourIndex, colIndex), $event)"></button>
                                        </slot>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { CalendarScale, ScheduleView } from "@/types";
import type { ElevationLevel, ElevationProps, ScheduleEvent, ScheduleSpace, Point, ScheduleSlotEvent, ScheduleToolbarSlotProps } from "@/types";
import { ripple } from "@/directives";
import { getDefaultLocaleCode, Lng as Lnguage, suportedLng } from '@/locales/index';
import EProgressLinear from '@/components/progress/linear.vue';
import { useResolvedColor } from '@/composables/color';
import { getColorContrastCssValue, getColorCssValue, normalizeCssSize } from '@/utils/style';
const vRipple = { ...ripple };
import UtilDate from '@/utils/date';
import icon from '@/utils/icons';

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import { computed, nextTick, onMounted, reactive, useSlots, watch } from "vue";


type ScheduleEventElevation = ElevationLevel | 'none';

export interface Props extends ElevationProps {
    lng?: suportedLng; color?: string; stickyTopHeader?: string | number; loading?: boolean; resourceColumns?: string | number;
    rowHeight?: string | number; step?: number; start?: number; events?: ScheduleEvent[];
    end?: number; spaces?: ScheduleSpace[]; selectedSpace?: ScheduleSpace; modelValue: Date; view?: ScheduleView; scale?: CalendarScale;
    eventElevation?: ScheduleEventElevation;
}
const props = withDefaults(defineProps<Props>(),
    {
        lng: getDefaultLocaleCode(), color: 'primary', rowHeight: '97',
        eventElevation: 'md',
        step: 60 * 60, start: 0, events: () => [], stickyTopHeader: 0,
        end: 60 * 60 * 24, spaces: () => []
    })

const local = reactive({
    view: ScheduleView.Calendar as ScheduleView,
    scale: CalendarScale.Day as CalendarScale,
    resourcePage: 0,
    pendingContentAnimation: null as string | null,
    drilledDownFromWeek: false,
    selectedSpace: <ScheduleSpace | undefined>undefined,
    events: new Array<Array<ScheduleEvent>>(),
    globalContentAnimation: 'tab-transition'
})

const slots = useSlots()

const scheduleClass = computed(() => {
    const classes = ['e-schedule']
    isCalendarView.value && classes.push('e-schedule--calendar')
    isDayScale.value && classes.push('e-schedule--calendar-day')
    isResourceView.value && classes.push('e-schedule--resource')
    if (props.stickyTopHeader) classes.push('e-schedule--header-sticky')
    if (props.loading) classes.push('e-schedule--loading')
    return classes
})

const scheduleContainerClass = computed(() => {
    const classes = ['e-schedule-container']

    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`)
    }
    if (!hasToolbarSlot.value) {
        classes.push('e-schedule-container--without-toolbar')
    }

    return classes
})

const eventWrapperClass = computed(() => {
    const classes = ['e-schedule__event']

    if (props.eventElevation && props.eventElevation !== 'none') {
        classes.push(`e-elevation--${props.eventElevation}`)
    }

    return classes
})

const colKey = (data: any) => {
    return isResourceView.value ? data.entityId : data.dayOfWeek + '-' + data.dayOfMonth
}

const computedView = computed((): ScheduleView => {
    return props.view != undefined ? props.view : local.view;
})

const computedScale = computed((): CalendarScale => {
    return props.scale != undefined ? props.scale : local.scale;
})

const isCalendarView = computed(() => computedView.value === ScheduleView.Calendar)
const isResourceView = computed(() => computedView.value === ScheduleView.Resource)
const isDayScale = computed(() => isCalendarView.value && computedScale.value === CalendarScale.Day)
const isWeekScale = computed(() => isCalendarView.value && computedScale.value === CalendarScale.Week)
const showBackToWeekAction = computed(() => isDayScale.value && local.drilledDownFromWeek)
const showPaginationActions = computed(() => isResourceView.value && headerChunks.value.length > 1)
const hasToolbarSlot = computed(() => Boolean(slots.toolbar))
const localeInstance = computed(() => new Lnguage(props.lng, 1))
const scheduleToolbarLabels = computed(() => localeInstance.value.currentLng.schedule.toolbar)

const emit = defineEmits<{
    (e: 'update:modelValue', value: Date): void,
    (e: 'update:view', value: ScheduleView): void,
    (e: 'update:scale', value: CalendarScale): void,
    (e: 'click:header', value: { view: ScheduleView, scale?: CalendarScale, date: Date, entityId?: number | string }): void,
    (e: 'click:empty-slot', value: { data: ScheduleSlotEvent, nativeEvent: MouseEvent }): void,
    (e: 'click:event', value: { data: ScheduleEvent, nativeEvent: MouseEvent }): void,
    (e: 'update:selected-space', value: ScheduleSpace | undefined): void,
}>()

const changeValue = (value: Date): void => {
    emit('update:modelValue', value)
}

const normalizeDateValue = (value: Date | string): Date | null => {
    const nextValue = value instanceof Date ? new Date(value) : new Date(value)
    return Number.isNaN(nextValue.getTime()) ? null : nextValue
}

const setDate = (value: Date | string): void => {
    const nextValue = normalizeDateValue(value)
    if (!nextValue) return
    changeValue(nextValue)
}

const changeResourcePage = (sign: '+' | '-') => {
    const lastPage = headerChunks.value.length - 1
    local.globalContentAnimation = sign === '+' ? 'tab-transition' : 'tab-reverse-transition'
    let nextPage = local.resourcePage + parseInt(`${sign}1`)
    if (nextPage < 0) nextPage = lastPage
    if (nextPage > lastPage) nextPage = 0
    local.resourcePage = nextPage
}

const changeView = (value: ScheduleView) => {
    local.view = value;
    emit('update:view', value);
}

const changeScale = (value: CalendarScale) => {
    local.scale = value;
    emit('update:scale', value);
}

const computedSelectedSpace = computed((): ScheduleSpace | undefined => {
    return props.selectedSpace != undefined ? props.selectedSpace : local.selectedSpace;
})

const resolvedSelectedSpace = computed((): ScheduleSpace | undefined => {
    return computedSelectedSpace.value ?? props.spaces[0]
})

const changeSelectedSpace = (value: ScheduleSpace | undefined) => {
    local.selectedSpace = value;
    emit('update:selected-space', value);
}

const shiftDateByDays = (days: number): void => {
    const nextValue = new Date(props.modelValue)
    nextValue.setDate(nextValue.getDate() + days)
    changeValue(nextValue)
}

const goToToday = (): void => {
    changeValue(new UtilDate(new Date()).setTime(0, 0, 0).date)
}

const goToPreviousPeriod = (): void => {
    shiftDateByDays(isWeekScale.value ? -7 : -1)
}

const goToNextPeriod = (): void => {
    shiftDateByDays(isWeekScale.value ? 7 : 1)
}

const goToPreviousResourcePage = (): void => {
    changeResourcePage('-')
}

const goToNextResourcePage = (): void => {
    changeResourcePage('+')
}

const formatScheduleTime = (value: Date | string): string => {
    return new UtilDate(value).format('hour-hh:minutes-mm')
}

const eventAriaLabel = (event: ScheduleEvent): string => {
    const footer = event.footer ? `, ${String(event.footer)}` : ''
    return `${event.name}, ${formatScheduleTime(event.start)} to ${formatScheduleTime(event.end)}${footer}`
}

const emptySlotAriaLabel = (slot: ScheduleSlotEvent): string => {
    return `Create event for ${String(slot.entityId ?? 'schedule')} from ${formatScheduleTime(slot.start)} to ${formatScheduleTime(slot.end)}`
}

const resourceHeaderAriaLabel = (data: { label: string }) => {
    return `Select resource column ${data.label}`
}

const calendarHeaderAriaLabel = (data: { dayOfWeek: string; dayOfMonth: string | number }) => {
    return isWeekScale.value ? `Open ${data.dayOfWeek} ${data.dayOfMonth}` : `${data.dayOfWeek} ${data.dayOfMonth}`
}

const consumePendingAnimation = (fallback = '') => {
    const animation = local.pendingContentAnimation ?? fallback
    local.pendingContentAnimation = null
    return animation
}

watch(() => props.selectedSpace, () => setLocalEvents())
watch(() => props.modelValue, (value, oldValue) => {
    const reverse = new UtilDate(value).date > new UtilDate(oldValue).date
    if (local.pendingContentAnimation !== null)
        local.globalContentAnimation = consumePendingAnimation()
    else
        local.globalContentAnimation = reverse ? 'tab-transition' : 'tab-reverse-transition'
    setLocalEvents()
})
watch(computedView, (newValue: ScheduleView, oldValue: ScheduleView) => {
    if (oldValue !== newValue) {
        local.globalContentAnimation = consumePendingAnimation()
        local.resourcePage = 0
        if (newValue !== ScheduleView.Calendar) local.drilledDownFromWeek = false
        setLocalEvents()
    }
})
watch(computedScale, (newValue: CalendarScale, oldValue: CalendarScale) => {
    if (oldValue !== newValue) {
        local.globalContentAnimation = consumePendingAnimation()
        local.resourcePage = 0
        if (newValue !== CalendarScale.Day) local.drilledDownFromWeek = false
        setLocalEvents()
    }
})
watch(() => props.resourceColumns, () => {
    local.resourcePage = 0
})

watch(() => props.events, () => setLocalEvents(), { deep: true })

const setLocalEvents = (): void => {

    const result: Array<Array<ScheduleEvent>> = [];
    const dateFrom = new UtilDate(props.modelValue).setTime(0, 0, 0).date;
    const dateTo = new UtilDate(props.modelValue)
        .setTime(23, 59, 59)
        .add(6, 'days').date;

    let events = props.events.filter(
        ({ start }: ScheduleEvent) => new UtilDate(start).date > dateFrom && new UtilDate(start).date < dateTo
    );

    if (isDayScale.value) {
        events = events.filter(
            ({ start, entityId }: ScheduleEvent) => (new UtilDate(start).date.getDay() == dateFrom.getDay()) && (entityId === resolvedSelectedSpace.value?.id)

        );
    } else if (isResourceView.value) {
        events = events.filter(
            ({ start }: ScheduleEvent) => new UtilDate(start).date.getDay() == dateFrom.getDay()
        );
    } else if (isWeekScale.value) {
        events = events.filter(
            ({ entityId }: ScheduleEvent) => entityId === resolvedSelectedSpace.value?.id
        );
    }

    events.forEach((event: ScheduleEvent) => {
        const day = props.modelValue.getDay();
        event.subtitle ??= new UtilDate(event.start).format('hour-hh:minutes-mm') + ' - ' + new UtilDate(event.end).format('hour-hh:minutes-mm');
        let y = -1;
        if (isDayScale.value) y = 0;
        else if (isResourceView.value) {
            y = props.spaces.findIndex(({ id }) => id == event.entityId);
        } else if (isWeekScale.value) {
            y = new UtilDate(event.start).date.getDay();
            y = y < day ? 7 - day + y : y - day;
        }
        if (y !== -1) {
            const timePassed = secondsByDate(new UtilDate(event.start).date);
            const x = Math.floor(timePassed / props.step);

            if (result[x]) {
                result[x][y] = event;
            } else {
                result[x] = [];
                result[x][y] = event;
            }
        }
    });

    local.events = result;
}

const secondsByDate = (date: Date): number => date.getSeconds() + date.getMinutes() * 60 + date.getHours() * 60 * 60 - props.start

const toPointIndex = (value: string | number): number => Number(value)

const currentResourceColumnOffset = computed(() => {
    if (!isResourceView.value || !props.resourceColumns) return 0
    return local.resourcePage * parseInt(`${props.resourceColumns}`, 10)
})

const resourcePageCount = computed(() => Math.max(headerChunks.value.length, 1))

const toolbarSlotProps = computed<ScheduleToolbarSlotProps>(() => ({
    date: new Date(props.modelValue),
    locale: props.lng,
    color: props.color,
    view: computedView.value,
    scale: computedScale.value,
    selectedSpace: computedSelectedSpace.value,
    spaces: props.spaces,
    labels: scheduleToolbarLabels.value,
    canReturnToWeek: showBackToWeekAction.value,
    canPaginateResources: showPaginationActions.value,
    resourcePage: local.resourcePage,
    resourcePageCount: resourcePageCount.value,
    setDate,
    setView: changeView,
    setScale: changeScale,
    setSelectedSpace: changeSelectedSpace,
    goToToday,
    goToPreviousPeriod,
    goToNextPeriod,
    returnToWeekView,
    goToPreviousResourcePage,
    goToNextResourcePage,
}))

const getVisibleEventPoint = (
    hourIndex: string | number,
    colIndex: string | number,
): Point => ({ x: toPointIndex(hourIndex), y: toPointIndex(colIndex) + currentResourceColumnOffset.value })

const getVisibleEmptyPoint = (hourIndex: string | number, colIndex: string | number): Point => ({
    x: toPointIndex(hourIndex),
    y: toPointIndex(colIndex) + currentResourceColumnOffset.value,
})

const getEvent = ({ x, y }: Point) => local.events[x][y]

const getEmptySlotData = ({ x, y }: Point): ScheduleSlotEvent => {
    const timestamp = props.start + x * props.step;

    const startHours: number = Math.floor(timestamp / 60 / 60);
    const startMinutes: number = Math.floor(timestamp / 60) - startHours * 60;

    const endHours: number = Math.floor((timestamp + props.step) / 60 / 60);
    const endMinutes: number =
        Math.floor((timestamp + props.step) / 60) - endHours * 60;
    const selectedDate: Date = isDayScale.value || isResourceView.value
        ? props.modelValue
        : new UtilDate(props.modelValue).add(y, 'days').date;

    const start = new UtilDate(selectedDate)
        .set(startHours, 'hours')
        .set(startMinutes, 'minutes').date;
    const end = new UtilDate(selectedDate)
        .set(endHours, 'hours')
        .set(endMinutes, 'minutes').date;

    const space: ScheduleSpace = isResourceView.value
        ? props.spaces[y]
        : (resolvedSelectedSpace.value as ScheduleSpace);
    return {
        entityId: space?.id,
        start,
        end,
        color: 'primary',
        name: ""
    };
}

const emptySlotClickHandler = (point: Point, nativeEvent: MouseEvent): void => {
    emit('click:empty-slot', { data: getEmptySlotData(point), nativeEvent });
}

const eventStyle = (point: Point): Record<string, string> => {
    const { start, end, color } = getEvent(point);
    const from = secondsByDate(new UtilDate(start).date);
    const to = secondsByDate(new UtilDate(end).date);
    const displacement = ((to - from) / props.step)
    const height = rowHeightNumber.value * (displacement == 0 ? 0 : displacement);
    const fillPercent = (from % props.step) / props.step;
    const top = rowHeightNumber.value * fillPercent - 1;
    const backgroundColor = getColorCssValue(color);
    const contrastColor = getColorContrastCssValue(color);

    return {
        height: `${height}px`,
        top: `${top}px`,
        marginTop: '0',
        ...(backgroundColor ? { '--schedule-local-event-bg': backgroundColor } : {}),
        ...(contrastColor ? { '--schedule-local-event-color': contrastColor } : {}),
    };
}

const handleEventClick = (event: ScheduleEvent, nativeEvent: MouseEvent): void => {
    emit('click:event', { data: event, nativeEvent });
}


const hasEvent = ({ x, y }: Point): boolean => {
    return !!local.events?.[x]?.[y];
}

const eventClass = (): string => {
    return 'e-schedule__event-container';
}


const handleHeaderLabelClick = (date: Date, entityId?: number | string): void => {
    if (isWeekScale.value) {
        local.drilledDownFromWeek = true
        local.pendingContentAnimation = ''
        nextTick(() => {
            date && changeValue(date as Date)
            changeScale(CalendarScale.Day);
        })
    } else if (isResourceView.value) {
        const space = props.spaces.find(({ id }) => id == entityId);
        changeSelectedSpace(space)
        local.pendingContentAnimation = ''
        changeView(ScheduleView.Calendar)
    }
    emit('click:header', { view: computedView.value, scale: isCalendarView.value ? computedScale.value : undefined, entityId, date })
}

const returnToWeekView = (): void => {
    local.drilledDownFromWeek = false
    local.pendingContentAnimation = 'tab-reverse-transition'
    changeScale(CalendarScale.Week)
}

onMounted(() => {
    setLocalEvents();
})

const t = (): Lnguage => {
    return localeInstance.value;
}

const normalizedRowHeight = computed(() => normalizeCssSize(props.rowHeight) || '97px')
const normalizedStickyTopHeader = computed(() => normalizeCssSize(props.stickyTopHeader) || '0px')
const rowHeightNumber = computed(() => {
    const parsed = Number.parseFloat(normalizedRowHeight.value)
    return Number.isNaN(parsed) ? 97 : parsed
})

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-schedule-color',
    contrastVar: "--e-schedule-contrast-color",
})

const scheduleStyle = computed((): Record<string, string> => ({
    ...colorStyles.value,
    '--row-height': normalizedRowHeight.value,
    '--header-sticky-top': normalizedStickyTopHeader.value,
}))

const hourList = computed((): Array<string> => {
    const result: Array<string> = [];
    let incompleteList = true;
    let count = 0;
    while (incompleteList) {
        const timestamp = props.start + count++ * props.step;
        let hours: string | number = Math.floor(timestamp / 60 / 60);
        let minutes: string | number = Math.floor(timestamp / 60) - hours * 60;
        minutes = minutes || '00';
        hours = hours <= 9 ? `0${hours}` : hours;
        result.push(`${hours}:${minutes}`);
        incompleteList = timestamp < props.end;
    }
    return result;
})

const headerLabels = computed((): Array<Record<string, any>> => {
    const day = props.modelValue.getDay();
    let dayList: Array<string> = [];
    if (isDayScale.value) {
        dayList = [t().currentLng.weekdaysShort[day]];
    } else if (isWeekScale.value) {
        dayList = t().sliceLangList(t().currentLng.weekdaysShort, day);
    } else if (isResourceView.value) {
        return props.spaces.map(({ label, id }) => ({ label, entityId: id, date: new Date(props.modelValue) }));
    }

    return dayList.map((d, i) => {
        const date: Date = new Date(
            new Date(props.modelValue).setDate(props.modelValue.getDate() + i)
        );
        const today = date.toDateString() === new Date().toDateString()
        return { dayOfWeek: d, dayOfMonth: date.getDate(), today, date }
    });

})
const chunk = (array: Array<Record<string, any>>) => {
    if (isResourceView.value && props.resourceColumns) {
        const result = new Array(), length = array.length, size = parseInt(`${props.resourceColumns}`, 10);
        for (let i = 0; i < length; i += size)
            result.push(array.slice(i, i + size));
        return result;
    } else {
        return [array]
    }
}

const headerChunks = computed(() => chunk(headerLabels.value))

const visibleHeaderLabels = computed(() => headerChunks.value[local.resourcePage] ?? headerChunks.value[0] ?? [])

const resourceViewKey = computed(() => {
    const dateKey = new UtilDate(props.modelValue).setTime(0, 0, 0).date.toISOString()
    const labelsKey = visibleHeaderLabels.value.map(colKey).join('|')
    return `${computedView.value}:${computedScale.value}:${dateKey}:${local.resourcePage}:${labelsKey}`
})

watch(headerChunks, (chunks) => {
    const lastPage = chunks.length - 1
    if (local.resourcePage > lastPage) {
        local.resourcePage = Math.max(lastPage, 0)
    }
}, { immediate: true })


</script>
<style lang="scss" src="./style.scss"></style>