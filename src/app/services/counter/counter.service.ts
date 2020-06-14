import { Injectable } from '@angular/core';
import { PartialObserver, Subject, Subscription } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { Category } from '../../models/category.model'
import { Counter } from '../../models/counter.model'

const STORAGE_KEY = 'count-it:categories'

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private categories: Category[]
  private categoriesSubject: Subject<Category[]>

  constructor() {
    this.categoriesSubject = new Subject()

    try {
      this.categories =
        (JSON.parse(localStorage.getItem(STORAGE_KEY)) || [])
          .map((it: any) => Category.fromJson(it))
    } catch {
      this.categories = []
    }
  }

  getCounterCategories(): Category[] {
    return this.categories
  }

  getCounterCategory(categoryId: number) {
    return this.categories.find(it => it.id === categoryId) || null
  }

  watchCounterCategories(subscriber: (categories: Category[]) => void): Subscription {
    const ret = this.categoriesSubject.subscribe(subscriber)
    subscriber(this.categories)
    return ret
  }

  addCounterCategory(categoryName: string) {
    const category = new Category(
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
  
  relocateCounter(counterId: number, index: number) {
    const category = this.getCategoryByCounterId(counterId)

    if (category) {
      const oldIndex = category.counters.findIndex(it => it.id === counterId)
      const counter = category.counters[index]
      category.counters = [...category.counters]
      category.counters[oldIndex] = category.counters[index]
      category.counters[index] = counter
      this.update()
    }
  }

  addCounter(categoryId: number, counterName: string) {
    const category = this.getCounterCategory(categoryId)

    if (category) {
      const now = new Date()

      const newCounter = new Counter(
        this.getNewCounterId(),
        counterName,
        0,
        now,
        now
      )

      category.counters.push(newCounter)
      this.update()
    }
  }

  removeCounter(counterId: number) {
    const category = this.getCategoryByCounterId(counterId)

    if (category) {
      const index = category.counters.findIndex(it => it.id === counterId)
      
      category.counters =
        category.counters.slice(0, index).concat(category.counters.slice(index + 1))

      this.update()
    }
  }
  
  renameCounter(counterId: number, newTitle: string) {
    const category = this.getCategoryByCounterId(counterId)

    if (category) {
      const index = category.counters.findIndex(it => it.id === counterId)
      category.counters = [...category.counters]
      
      const newCounter = category.counters[index].copy()
      newCounter.title = newTitle
      newCounter.lastUpdate = new Date()
      category.counters[index] = newCounter
      this.update()
    }
  }

  incrementCounter(counterId: number, delta = 1) {
    const category = this.getCategoryByCounterId(counterId)

    if (category) {
      const index = category.counters.findIndex(it => it.id === counterId)
      const newCounter = category.counters[index].copy()
      newCounter.count += delta
      newCounter.lastUpdate = new Date()
      category.counters = [...category.counters]
      category.counters[index] = newCounter
      this.update()
    }
  }

  private getNewCategoryId(): number {
    return this.categories
      .map(it => it.id)
      .reduce((prev, curr) => Math.max(prev, curr), 0) + 1
  }

  private getCategoryByCounterId(counterId: number): Category | null {
    for (let i = 0; i < this.categories.length; ++i) {
      const category = this.categories[i]

      for (let j = 0; j < category.counters.length; ++j) {
        const counter = category.counters[j]

        if (counter.id === counterId) {
          return category
        }
      }
    }

    return null
  }
  
  private getNewCounterId(): number {
    let maxId = 0

    this.categories.forEach(category => {
      category.counters.forEach(counter => {
        maxId = Math.max(maxId, counter.id)
      })
    })

    return maxId + 1
  }

  private update() {
    this.categoriesSubject.next(this.categories)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories))
  }
}
