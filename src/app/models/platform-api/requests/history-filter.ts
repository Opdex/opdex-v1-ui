export enum HistoryInterval {
  Hourly = 'OneHour',
  Daily = 'OneDay'
}

export class HistoryFilter {
  interval?: HistoryInterval;
  startDateTime: Date;
  endDateTime: Date;
  limit: number;
  direction: string;
  cursor?: string;

  constructor(startDateTime: Date = HistoryFilter.historicalDate(HistoryFilter.startOfDay(new Date()), 365),
              endDateTime: Date = HistoryFilter.endOfDay(new Date()),
              interval: HistoryInterval = HistoryInterval.Daily,
              limit = 750,
              direction = 'ASC') {
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.interval = interval;
    this.limit = limit;
    this.direction = direction;
  }

  buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    query = this.addToQuery(query, 'startDateTime', this.startDateTime.toISOString());
    query = this.addToQuery(query, 'endDateTime', this.endDateTime.toISOString());
    query = this.addToQuery(query, 'interval', this.interval);
    query = this.addToQuery(query, 'limit', this.limit);
    query = this.addToQuery(query, 'direction', this.direction);

    return query
  }

  refresh() {
    if (this.endDateTime < new Date()) {
      const daysDifference = this.daysDifference();
      this.endDateTime = HistoryFilter.endOfDay(new Date());
      this.startDateTime = HistoryFilter.startOfDay(HistoryFilter.historicalDate(new Date(), daysDifference));
    }
  }

  static historicalDate(date: Date, daysAgo: number) {
    const historicalDate = date.getTime() - (1000 * 60 * 60 * 24 * daysAgo);
    return new Date(historicalDate);
  }

  static startOfDay(date: Date): Date {
    date.setUTCHours(0,0,0,0);
    return date;
  }

  static endOfDay(date: Date): Date {
    date.setUTCHours(23,59,59,999);
    return date;
  }

  daysDifference(): number {
    return Math.floor((this.endDateTime.getTime() - this.startDateTime.getTime()) / 1000 / 60 / 60 / 24);
  }

  private addToQuery(query: string, key: string, value: string | number): string {
    if (!!value === false) return query;

    const leading = query.length > 0 ? '&' : '?';

    return `${query}${leading}${key}=${value}`;
  }
}
