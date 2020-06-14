import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonContent, NavController } from '@ionic/angular'
import { CounterService } from '../../services/counter/counter.service'
import { Category } from '../../models/category.model'
import { Subscription } from 'rxjs';
import { PositionChangeEvent } from 'src/app/events/PositionChangeEvent';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: Category[]
  
  @ViewChild('content')
  content: IonContent
  
  private categoriesSubscription: Subscription

  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.categoriesSubscription = this.counterService.watchCounterCategories(
      (categories: Category[]) => {
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
    this.counterService.relocateCounterCategory(this.categories[ev.oldIndex].id, ev.newIndex)
  }

  private onAddCategory(data: { categoryName: string }) {
    const categoryName: string = data.categoryName.trim()

     if (categoryName) {
       this.counterService.addCounterCategory(categoryName)

       setTimeout(() => this.content.scrollToBottom(100))
     }
  }

  private onCategoryClick(category: Category) {
    console.log(category)
  }
}
