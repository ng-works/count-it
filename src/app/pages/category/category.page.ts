import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController, AlertController, IonContent } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { CounterService } from '../../services/counter/counter.service'
import { Category } from '../../store/models/category.model'
import * as CounterAct from '../../store/actions/counter.actions'
import { selectCategoryById } from 'src/app/store/selectors/counter.selectors'

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss']
})
export class CategoryPage implements OnInit, OnDestroy {
  category: Category

  @ViewChild('content')
  content: IonContent

  private routeSubscription: Subscription

  constructor(
    private store: Store,
    private alertController: AlertController,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private counterService: CounterService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(
      (paramMap) => {
        const categoryId = +paramMap.get('categoryId')

        if (Number.isSafeInteger(categoryId)) {
          const category = this.counterService.getCounterCategoryById(
            categoryId
          )

          if (category) {
            this.category = category
          } else {
            this.navController.navigateBack('/categories')
          }
        }
      }
    )

    this.store
      .select(selectCategoryById, this.category.id)
      .subscribe((it) => (this.category = it || this.category))
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
