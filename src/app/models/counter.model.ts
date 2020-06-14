export class Counter {
  static fromJson({ id, title, count, creation, lastUpdate }) {
    return new Counter(id, title, count, new Date(creation), new Date(lastUpdate))
  }
  
  constructor(
    public id: number,
    public title: string,
    public count: number,
    public creation: Date,
    public lastUpdate: Date
  ) {}

  copy() {
    return new Counter(this.id, this.title, this.count, this.creation, this.lastUpdate)
  }

  toString = `[Counter #${this.id}: ${this.title} => ${this.count}]` 
}
