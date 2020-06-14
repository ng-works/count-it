import { Counter } from './counter.model'

export class Category {
  static fromJson({ id, title, counters }) {
    return new Category(id, title, counters.map((it: any) => Counter.fromJson(it)))
  }
  
  constructor(
    public id: number,
    public title: string,
    public counters: Counter[] = []
  ) {}

  copy() {
    return new Category(this.id, this.title, this.counters)
  }

  toString = `[Category #${this.id}: ${this.title}]` 
}
