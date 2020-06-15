import { Component, Input, OnInit, Output } from '@angular/core'
import { ItemReorderEventDetail } from '@ionic/core'
import { AlertController, NavController } from '@ionic/angular'
import { Category } from '../../store/models/category.model'
import { Store } from '@ngrx/store'
import * as CounterAct from '../../store/actions/counter.actions'

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @Input()
  categories: Category[]

  constructor(
    private store: Store,
    private navController: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  onReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.store.dispatch(
      CounterAct.moveCounterCategory({
        id: this.categories[ev.detail.from].id,
        newIndex: ev.detail.to
      })
    )

    ev.detail.complete(false)
  }

  async onRenameClick(ev: any, category: Category) {
    const alert = await this.alertController.create({
      header: 'Rename category',
      inputs: [
        {
          name: 'categoryTitle',
          type: 'text',
          value: category.title,
          placeholder: 'Category name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Rename',
          handler: (data) =>
            this.renameCategory(category.id, data.categoryTitle)
        }
      ]
    })

    await alert.present()
  }

  async onDeleteClick(ev: any, category: Category) {
    const alert = await this.alertController.create({
      header: 'Delete category',
      message: `Are you really sure that you want to delete category "${category.title}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Delete',
          handler: (data) => this.deleteCategory(category.id)
        }
      ]
    })

    await alert.present()
  }

  onShowDetails(ev: any, category: Category) {
    const tagName = ev.target.tagName

    if (tagName === 'ION-BUTTON') {
      return
    }

    this.navController.navigateForward(['/category', category.id])
  }

  private renameCategory(categoryId: number, categoryTitle: string) {
    const newTitle = categoryTitle.trim()

    if (newTitle) {
      this.store.dispatch(
        CounterAct.renameCounterCategory({ id: categoryId, title: newTitle })
      )
    }
  }

  private deleteCategory(categoryId: number) {
    this.store.dispatch(CounterAct.deleteCounterCategory({ id: categoryId }))
  }
}
