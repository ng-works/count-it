import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ItemReorderEventDetail } from '@ionic/core'
import { AlertController, NavController } from '@ionic/angular'
import { Category } from '../../models/category.model'
import { PositionChangeEvent } from '../../events/PositionChangeEvent'
import { CategoryTitleChangeEvent } from '../../events/CategoryTitleChangeEvent'
import { CounterService } from 'src/app/services/counter/counter.service'

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @Input()
  categories: Category[]

  @Output()
  positionChange: EventEmitter<PositionChangeEvent>

  @Output()
  categoryTitleChange: EventEmitter<CategoryTitleChangeEvent>

  constructor(
    private counterService: CounterService,
    private navController: NavController,
    private alertController: AlertController
  ) {
    this.positionChange = new EventEmitter()
  }

  ngOnInit() {
  }

  onReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const positionChangeEvent: PositionChangeEvent = {
      type: 'positionChange',
      oldIndex: ev.detail.from,
      newIndex: ev.detail.to
    }

    this.positionChange.emit(positionChangeEvent)
    ev.detail.complete(false)
  }

  async onRenameClick(ev: any, category: Category) {
    ev.preventDefault()

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
          text: 'OK',
          handler: data => this.renameCategory(category.id, data.categoryTitle)
        }
      ]
    })

    await alert.present()
  }

  async onDeleteClick(ev: any, category: Category) {
    ev.preventDefault()
    
    const alert = await this.alertController.create({
      header: 'Delete category',
      message: `Are you really sure that you want to delete category "${category.title}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        
        {
          text: 'Delete',
          handler: data => this.deleteCategory(category.id)
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

  onCategoryClick(category: Category) {
    console.log('clicked', category)
  }

  private renameCategory(categoryId: number, categoryTitle: string) {
    const newTitle = categoryTitle.trim()
    
    if (newTitle) {
      this.counterService.renameCounterCategory(categoryId, categoryTitle.trim())
    }
  }

  private deleteCategory(categoryId: number) {
    this.counterService.removeCounterCategory(categoryId)
  }
}
