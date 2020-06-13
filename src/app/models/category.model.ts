export class CategoryModel {
  static fromJson({ id, title }) {
    return new CategoryModel(id, title)
  }
  
  constructor(
    public id: number,
    public title: string
  ) {}

  copy() {
    return new CategoryModel(this.id, this.title)
  }

  toString = `[Category #${this.id}: ${this.title}]` 
}
