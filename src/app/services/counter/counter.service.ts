import { Injectable } from '@angular/core';
import { PartialObserver, Subject, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { CategoryModel } from '../../models/category.model'

const STORAGE_KEY = 'count-it:categories'

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private categories: CategoryModel[]
  private categoriesSubject: Subject<CategoryModel[]>

  constructor() {
    this.categoriesSubject = new Subject()

    try {
      this.categories =
        (JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
          .map((it: any) => CategoryModel.fromJson(it))
    } catch {
      this.categories = []
    }
  }

  getCounterCategories(): CategoryModel[] {this.categoriesSubject.subscribe()
    return this.categories
  }

  watchCounterCategories(subscriber: (categories: CategoryModel[]) => void): Subscription {
    const ret = this.categoriesSubject.subscribe(subscriber)
    subscriber(this.categories)
    return ret
  }

  addCounterCategory(categoryName: string) {
    const category = new CategoryModel(
      this.getNewCategoryId(),
      categoryName
    )

    this.categories.push(category)
    this.update()
  }

  renameCounterCategory(categoryId: number, newTitle: string) {
    const index = this.categories.findIndex(it => it.id === categoryId)

    if (index >= 0) {
      this.categories = [...this.categories]
      this.categories[index] = this.categories[index].copy()
      this.categories[index].title = newTitle
      this.update()
    }
  }

  removeCounterCategory(categoryId: number) {
    this.categories = this.categories.filter(it => it.id !== categoryId)
    this.update()
  }

  relocateCounterCategory(categoryId: number, index: number) {
    if (index < this.categories.length) {
      const oldIndex = this.categories.findIndex(it => it.id === categoryId)

      if (oldIndex >= 0 && index !== oldIndex) {
        const category = this.categories[oldIndex]

        this.categories = [...this.categories]
        this.categories[oldIndex] = this.categories[index]
        this.categories[index] = category
        this.update()
      }
    }
  }

  private getNewCategoryId() {
    return this.categories
      .map(it => it.id)
      .reduce((prev, curr) => Math.max(prev, curr), 0) + 1
  }

  private update() {
    this.categoriesSubject.next(this.categories)
console.log(this.categories)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories))
  }
}
