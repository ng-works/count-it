import { Injectable } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { Category } from '../../store/models/category.model'
import { Counter } from '../../store/models/counter.model'
import { selectCounterCategories } from '../../store/selectors/counter.selectors'

const STORAGE_KEY = 'count-it:categories'

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private categories: Category[]

  constructor(private store: Store) {
    this.store.select(selectCounterCategories).subscribe((categories) => {
      this.categories = categories
    })
  }
  /*
        try {
          this.categories = (
            JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
          ).map((it: any) => Category.fromJson(it))
        } catch {
          this.categories = []
        }
      }
*/
  getCounterCategoryById(id: number): Category | null {
    return this.categories.find((it) => it.id === id) || null
  }

  nextCounterCategoryId(): number {
    return (
      this.categories
        .map((it) => it.id)
        .reduce((prev, curr) => Math.max(prev, curr), 0) + 1
    )
  }

  nextCounterId(): number {
    let maxId = 0

    this.categories.forEach((category) => {
      category.counters.forEach((counter) => {
        maxId = Math.max(maxId, counter.id)
      })
    })

    return maxId + 1
  }
}
