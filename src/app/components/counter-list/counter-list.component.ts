import { Component, Input } from '@angular/core'
import { Counter } from '../../store/models/counter.model'
import { CounterService } from '../../services/counter/counter.service'
import { AlertController } from '@ionic/angular'
import { ItemReorderEventDetail } from '@ionic/core'
import { Store } from '@ngrx/store'
import * as CounterAct from '../../store/actions/counter.actions'

@Component({
  selector: 'counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.scss']
})
export class CounterListComponent {
  @Input()
  counters: Counter[]

  constructor(
    private store: Store,
    private counterService: CounterService,
    private alertController: AlertController
  ) {}

  onDecrementClick(counter: Counter) {
    this.store.dispatch(
      CounterAct.decrementCounter({
        id: counter.id
      })
    )
  }

  onIncrementClick(counter: Counter) {
    this.store.dispatch(
      CounterAct.incrementCounter({
        id: counter.id
      })
    )
  }

  async onRenameClick(counter: Counter) {
    const alert = await this.alertController.create({
      header: 'Rename counter',
      inputs: [
        {
          name: 'counterTitle',
          type: 'text',
          value: counter.title,
          placeholder: 'Counter name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Rename',
          handler: (data) => {
            const title = data.counterTitle.trim()

            if (title) {
              this.store.dispatch(
                CounterAct.renameCounter({ id: counter.id, title })
              )
            }
          }
        }
      ]
    })

    await alert.present()
  }

  async onDeleteClick(counter: Counter) {
    const alert = await this.alertController.create({
      header: 'Delete counter',
      message: `Are you really sure that you want to delete counter "${counter.title}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Delete',
          handler: () =>
            this.store.dispatch(
              CounterAct.deleteCounter({
                id: counter.id
              })
            )
        }
      ]
    })

    await alert.present()
  }

  onItemReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.store.dispatch(
      CounterAct.moveCounter({
        id: this.counters[ev.detail.from].id,
        newIndex: ev.detail.to
      })
    )

    ev.detail.complete(false)
  }
}
