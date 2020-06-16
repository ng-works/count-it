import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { AlertController, IonContent } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { CounterService } from '../../services/counter/counter.service'
import { Category } from '../../store/models/category.model'
import * as CounterAct from '../../store/actions/counter.actions'
import { selectCounterCategory } from '../../store/selectors/routing.selectors'

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss']
})
export class CategoryPage implements OnInit, OnDestroy {
  category: Category

  private categoryIdSubscription: Subscription

  @ViewChild('content')
  content: IonContent

  constructor(
    private store: Store,
    private alertController: AlertController,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.categoryIdSubscription = this.store
      .select(selectCounterCategory)
      .subscribe((category) => {
        this.category = category
        console.log('updated category', this.category)
      })
  }

  ngOnDestroy() {
    this.categoryIdSubscription.unsubscribe()
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
          handler: (data) => this.addCounter(data.counterTitle)
        }
      ]
    })

    await alert.present()
  }

  private addCounter(counterTitle: string) {
    const title = counterTitle.trim()

    if (title) {
      this.store.dispatch(
        CounterAct.createCounter({
          id: this.counterService.nextCounterId(),
          title: counterTitle,
          categoryId: this.category.id
        })
      )

      setTimeout(() => this.content.scrollToBottom(100))
    }
  }
}
