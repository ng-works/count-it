import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController, AlertController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { CounterService } from 'src/app/services/counter/counter.service'
import { Category } from 'src/app/models/category.model'

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit, OnDestroy {
  category: Category

  private routeSubscription: Subscription

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(paramMap => {
      const categoryId = +paramMap.get('categoryId')

      if (Number.isSafeInteger(categoryId)) {
        const category = this.counterService.getCounterCategory(categoryId)

        if (category) {
          this.category = category
        } else {
          this.navController.navigateBack('/categories')
        }
      }
    })
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
  }
  
  async onAddCounterClick() {
    const alert = await this.alertController.create({
      header: 'Add counter',
      inputs: [
        {
          name: 'counterTitle',
          type: 'text',
          placeholder: 'Counter name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        
        {
          text: 'OK',
          handler: data => this.onAddCounter(data.counterTitle)
        }
      ]
    })

    await alert.present()
  }

  private onAddCounter(counterTitle: string) {
    const title = counterTitle.trim()

    if (title) {
      this.counterService.addCounter(this.category.id, counterTitle)
    }
  }
}
