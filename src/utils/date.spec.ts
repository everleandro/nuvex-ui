import { describe, expect, it } from "vitest";

import UtilDate from "./date";
import {
  getDefaultLocaleCode,
  Lng,
  registerLocales,
  setDefaultLocaleCode,
} from "../locales";

describe("UtilDate locale behavior", () => {
  it("uses the configured default locale when no locale is passed", () => {
    const previousDefault = getDefaultLocaleCode();
    setDefaultLocaleCode("es");

    const date = new UtilDate(new Date(2026, 0, 5));

    expect(date.weekdayName).toBe("lunes");
    expect(date.monthName).toBe("enero");

    setDefaultLocaleCode(previousDefault);
  });

  it("preserves locale after add/set operations", () => {
    const date = new UtilDate(new Date(2026, 0, 5), "fr");
    const frLocale = new Lng("fr");

    const shifted = date.add(1, "days").set(6, "months");

    expect(shifted.weekdayName).toBe(frLocale.currentLng.weekdays[shifted.date.getDay()]);
    expect(shifted.monthName).toBe(frLocale.currentLng.months[shifted.date.getMonth()]);
  });

  it("falls back to a base locale for regional locale codes", () => {
    const previousDefault = getDefaultLocaleCode();
    setDefaultLocaleCode("en");

    const resolved = setDefaultLocaleCode("es-MX");
    expect(resolved).toBe("es");

    const date = new UtilDate(new Date(2026, 0, 6));
    expect(date.weekdayName).toBe("martes");

    setDefaultLocaleCode(previousDefault);
  });

  it("resolves locale defaults after runtime locale registration", () => {
    const previousDefault = getDefaultLocaleCode();
    registerLocales({
      "en-gb": {
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthsShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        weekdays: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        weekdaysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        start: 1,
        schedule: {
          toolbar: {
            view: "View",
            day: "Day",
            week: "Week",
            resource: "Resource",
            space: "Space",
            today: "Today",
            previousPeriod: "Previous period",
            nextPeriod: "Next period",
            previousResourcePage: "Previous resource page",
            nextResourcePage: "Next resource page",
            backToWeek: "Back to week",
            resourcePage: "Page {page} of {total}",
          },
        },
      },
    });

    const resolved = setDefaultLocaleCode("en-GB");
    expect(resolved).toBe("en-gb");

    const date = new UtilDate(new Date(2026, 0, 7));
    expect(date.weekdayName).toBe("Wednesday");

    setDefaultLocaleCode(previousDefault);
  });

  it("moves to January at startOfYear", () => {
    const date = new UtilDate(new Date(2026, 7, 20), "en");

    const start = date.startOfYear();

    expect(start.date.getMonth()).toBe(0);
    expect(start.date.getDate()).toBe(1);
  });

  it("creates an inclusive date range array", () => {
    const date = new UtilDate(new Date(2026, 0, 1), "en");

    const result = date.createDateArray("2026-01-01", "2026-01-03");

    expect(result).toHaveLength(3);
    expect(result[0].toISOString().slice(0, 10)).toBe("2026-01-01");
    expect(result[1].toISOString().slice(0, 10)).toBe("2026-01-02");
    expect(result[2].toISOString().slice(0, 10)).toBe("2026-01-03");
  });

  it("returns an empty array when range is invalid", () => {
    const date = new UtilDate(new Date(2026, 0, 1), "en");

    expect(date.createDateArray("invalid", "2026-01-03")).toEqual([]);
    expect(date.createDateArray("2026-01-03", "2026-01-01")).toEqual([]);
  });

  it("formats repeated tokens globally", () => {
    const date = new UtilDate(new Date(2026, 0, 5, 9, 4), "en");

    const result = date.format("year-YYYY/year-YYYY month-MM month-MM hour-hh:minutes-mm");

    expect(result).toBe("2026/2026 01 01 09:04");
  });

  it("respects token precedence for long and short month/day tokens", () => {
    const date = new UtilDate(new Date(2026, 0, 5), "en");
    const enLocale = new Lng("en");

    const result = date.format("month-mmmm month-mmm month-M month-MM week-dddd week-ddd week-dd");

    expect(result).toBe(
      `${enLocale.currentLng.months[0]} ${enLocale.currentLng.monthsShort[0]} 1 01 ${enLocale.currentLng.weekdays[1]} ${enLocale.currentLng.weekdaysShort[1]} ${enLocale.currentLng.weekdaysMin[1]}`
    );
  });
});
