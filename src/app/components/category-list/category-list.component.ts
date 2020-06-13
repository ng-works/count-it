import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { CategoryModel } from '../../models/category.model'
import { PositionChangeEvent } from '../../events/PositionChangeEvent'
import { CategoryTitleChangeEvent } from '../../events/CategoryTitleChangeEvent'
import { CategoryService } from 'src/app/services/category/category.service'

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  @Input()
  categories: CategoryModel[]

  @Output()
  positionChange: EventEmitter<PositionChangeEvent>

  @Output()
  categoryTitleChange: EventEmitter<CategoryTitleChangeEvent>

  constructor(
    private categoryService: CategoryService,
    private alertController: AlertController
  ) {
    this.positionChange = new EventEmitter()
  }

  ngOnInit() {
  }

  onReorder(ev: any) {
    const positionChangeEvent: PositionChangeEvent = {
      type: 'positionChange',
      oldIndex: ev.detail.from,
      newIndex: ev.detail.to
    }

    this.positionChange.emit(positionChangeEvent)
    ev.detail.complete()
  }

  async onRenameClick(category: CategoryModel) {
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

  private renameCategory(categoryId: number, categoryTitle: string) {
    const newTitle = categoryTitle.trim()
    
    if (newTitle) {
      this.categoryService.renameCategory(categoryId, categoryTitle.trim())
    }
  }
}
