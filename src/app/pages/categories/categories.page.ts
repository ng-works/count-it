import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { AlertController, IonContent, NavController } from '@ionic/angular'
import { CounterService } from '../../services/counter/counter.service'
import { Category } from '../../store/models/category.model'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectCounterCategories } from '../../store/selectors/counter.selectors'
import * as CounterAct from '../../store/actions/counter.actions'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: Category[]

  @ViewChild('content')
  content: IonContent

  private categoriesSubscription: Subscription

  constructor(
    private store: Store,
    private navController: NavController,
    private alertController: AlertController,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.categoriesSubscription = this.store
      .select(selectCounterCategories)
      .subscribe((categories) => (this.categories = categories))
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe()
  }

  async onAddCategoryClick() {
    const alert = await this.alertController.create({
      header: 'Add category',
      inputs: [
        {
          name: 'categoryTitle',
          type: 'text',
          placeholder: 'Category name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'OK',
          handler: (data) => this.onAddCategory(data)
        }
      ]
    })

    await alert.present()
  }

  /*
  onPositionChange(ev: PositionChangeEvent) {
     // TODO!!!!
    this.counterService.relocateCounterCategory(
      this.categories[ev.oldIndex].id,
      ev.newIndex
    )
  }
    */

  private onAddCategory(data: { categoryTitle: string }) {
    const categoryTitle: string = data.categoryTitle.trim()

    if (categoryTitle) {
      this.store.dispatch(
        CounterAct.createCounterCategory({
          id: this.counterService.nextCounterCategoryId(),
          title: categoryTitle
        })
      )

      setTimeout(() => this.content.scrollToBottom(100))
    }
  }

  private onCategoryClick(category: Category) {
    console.log(category)
  }
}
