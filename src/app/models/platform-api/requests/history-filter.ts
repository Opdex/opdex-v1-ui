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

  constructor(startDateTime: Date, endDateTime: Date, interval: HistoryInterval, limit = 750, direction = 'ASC') {
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

  static historicalDate(date: Date, daysAgo: number) {
    const historicalDate = date.getTime() - (1000 * 60 * 60 * 24 * daysAgo);
    return new Date(historicalDate);
  }

  private addToQuery(query: string, key: string, value: string | number): string {
    if (value === null || value === undefined) return query;

    const leading = query.length > 0 ? '&' : '?';

    return `${query}${leading}${key}=${value}`;
  }
}
