import { getDefaultLocaleCode, Lng, suportedLng } from "../locales/index";
export default class UtilDate {
  date: Date;
  lng: Lng;

  constructor(
    date: string | number | Date = new Date(),
    lng: suportedLng = getDefaultLocaleCode()
  ) {
    this.date = new Date(date);
    this.lng = new Lng(lng);
  }

  private toInteger(value: number | string, fallback = 0): number {
    const parsed = Number.parseInt(`${value}`, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  /**
   * Keep historical mutable behavior (many call sites rely on side effects)
   * while still returning a new UtilDate for chain-style usage.
   */
  private mutateDate(mutator: (date: Date) => void): UtilDate {
    const nextDate = new Date(this.date);
    mutator(nextDate);
    this.date = nextDate;
    return new UtilDate(nextDate, this.lng.selectedLng);
  }

  private addHours(h: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setHours(date.getHours() + this.toInteger(h));
    });
  }

  private setHours(h: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setHours(this.toInteger(h));
    });
  }

  private addMinutes(minutes: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setMinutes(date.getMinutes() + this.toInteger(minutes));
    });
  }

  private setMinutes(minutes: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setMinutes(this.toInteger(minutes));
    });
  }

  private addSeconds(seconds: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setSeconds(date.getSeconds() + this.toInteger(seconds));
    });
  }

  private setSeconds(seconds: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setSeconds(this.toInteger(seconds));
    });
  }

  private setMonth(month: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setMonth(this.toInteger(month));
    });
  }

  private addMonths(month: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setMonth(date.getMonth() + this.toInteger(month));
    });
  }

  private addDays(days: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setDate(date.getDate() + this.toInteger(days));
    });
  }

  private setDays(days: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setDate(this.toInteger(days));
    });
  }

  private setYears(year: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setFullYear(this.toInteger(year));
    });
  }

  private addYears(years: number | string): UtilDate {
    return this.mutateDate((date) => {
      date.setFullYear(date.getFullYear() + this.toInteger(years));
    });
  }

  setTime(hours = 0, minutes = 0, seconds = 0): UtilDate {
    return this.setHours(hours).setMinutes(minutes).setSeconds(seconds);
  }
  setLng(lng: suportedLng) {
    this.lng = new Lng(lng);
    return new UtilDate(this.date, lng);
  }

  startOfMonth(): UtilDate {
    return new UtilDate(this.date, this.lng.selectedLng).set(1, "days");
  }

  endOfMonth(): UtilDate {
    const newDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    );
    return new UtilDate(newDate, this.lng.selectedLng);
  }

  startOfYear(): UtilDate {
    return this.mutateDate((date) => {
      date.setMonth(0, 1);
    });
  }

  add(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    switch (key) {
      case "seconds":
        return this.addSeconds(amount);
      case "minutes":
        return this.addMinutes(amount);
      case "hours":
        return this.addHours(amount);
      case "days":
        return this.addDays(amount);
      case "months":
        return this.addMonths(amount);
      case "years":
        return this.addYears(amount);
      default:
        return this;
    }
  }

  subtract(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    const value = parseInt(`${amount}`, 10);
    const negativeAmount = value >= 0 ? value * -1 : value;
    switch (key) {
      case "seconds":
        return this.addSeconds(negativeAmount);
      case "minutes":
        return this.addMinutes(negativeAmount);
      case "hours":
        return this.addHours(negativeAmount);
      case "days":
        return this.addDays(negativeAmount);
      case "months":
        return this.addMonths(negativeAmount);
      case "years":
        return this.addYears(negativeAmount);
      default:
        return this;
    }
  }

  set(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    let result;
    switch (key) {
      case "seconds":
        result = this.setSeconds(amount);
        break;
      case "minutes":
        result = this.setMinutes(amount);
        break;
      case "hours":
        result = this.setHours(amount);
        break;
      case "days":
        result = this.setDays(amount);
        break;
      case "months":
        result = this.setMonth(amount);
        break;
      case "years":
        result = this.setYears(amount);
        break;
      default:
        result = this;
        break;
    }
    return result.setLng(this.lng.selectedLng);
  }

  isValidDate(date: Date): boolean {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
      return false;
    }
    return !isNaN(date.getTime());
  }

  get weekdayName(): string {
    return this.lng.currentLng.weekdays[this.date.getDay()];
  }

  get weekdayShortName(): string {
    return this.lng.currentLng.weekdaysShort[this.date.getDay()];
  }

  get weekdaysMinName(): string {
    return this.lng.currentLng.weekdaysMin[this.date.getDay()];
  }

  get monthName(): string {
    return this.lng.currentLng.months[this.date.getMonth()];
  }

  get monthshortName(): string {
    return this.lng.currentLng.monthsShort[this.date.getMonth()];
  }

  get daysInMonth() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }

  get nthSuffix(): string {
    switch (this.date.getDate()) {
      case 1:
      case 21:
      case 31:
        return "st";
      case 2:
      case 22:
        return "nd";
      case 3:
      case 23:
        return "rd";
      default:
        return "th";
    }
  }

  format(format: string) {
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hours = this.date.getHours();
    const minutes = this.date.getMinutes();

    const tokenValues: Record<string, string> = {
      "week-dddd": this.weekdayName,
      "week-ddd": this.weekdayShortName,
      "week-dd": this.weekdaysMinName,
      "month-DD": ("0" + day).slice(-2),
      "month-D": `${day}`,
      "hour-hh": ("0" + hours).slice(-2),
      "hour-h": `${hours}`,
      "minutes-mm": ("0" + minutes).slice(-2),
      "minutes-m": `${minutes}`,
      "year-YYYY": `${year}`,
      "year-YY": String(year).slice(2),
      "month-mmmm": this.monthName,
      "month-mmm": this.monthshortName,
      "month-MM": ("0" + month).slice(-2),
      "month-M": `${month}`,
      "nth-su": this.nthSuffix,
    };

    const orderedTokens = Object.keys(tokenValues).sort(
      (left, right) => right.length - left.length
    );
    const tokenPattern = new RegExp(orderedTokens.join("|"), "g");

    return format.replace(tokenPattern, (token) => tokenValues[token] ?? token);
  }

  createDateArray(start: Date | string, end: Date | string): Array<Date> {
    const dates: Array<Date> = [];
    let localStart = new Date(start);
    const localEnd = new Date(end);

    if (!this.isValidDate(localStart) || !this.isValidDate(localEnd) || localStart > localEnd) {
      return dates;
    }

    while (localStart <= localEnd) {
      dates.push(new Date(localStart));
      localStart = new Date(localStart.setDate(localStart.getDate() + 1));
    }

    return dates;
  }
}
