export class DataPage<T> {
  values: T[]; // page of values returned by the database
  lastKey: T | null;
  hasMorePages: boolean; // Indicates whether there are more pages of data available to be retrieved

  constructor(values: T[], lastKey: T | null) {
    this.values = values;
    this.lastKey = lastKey;
    this.hasMorePages = lastKey !== undefined;
  }
}
