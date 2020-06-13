import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular'
import { CategoryService } from '../../services/category/category.service'
import { CategoryModel } from '../../models/category.model'
import { Subscription } from 'rxjs';
import { PositionChangeEvent } from 'src/app/events/PositionChangeEvent';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: CategoryModel[]
  
  @ViewChild('content')
  content: IonContent
  
  private categoriesSubscription: Subscription

  constructor(
    private alertController: AlertController,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoriesSubscription = this.categoryService.watchCategories(
      (categories: CategoryModel[]) => {
        this.categories = categories
      }
    )
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe()
  }

  async onAddCategoryClick() {
    const alert = await this.alertController.create({
      header: 'Add category',
      inputs: [
        {
          name: 'categoryName',
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
          handler: data => this.onAddCategory(data)
        }
      ]
    })

    await alert.present()
  }

  onPositionChange(ev: PositionChangeEvent) {
    this.categoryService.relocateCategory(this.categories[ev.oldIndex].id, ev.newIndex)
  }

  private onAddCategory(data: { categoryName: string }) {
    const categoryName: string = data.categoryName.trim()

     if (categoryName) {
       this.categoryService.addCategory(categoryName)

       setTimeout(() => this.content.scrollToBottom(100))
     }
  }
}
