import { Component, Input } from '@angular/core'
import { Counter } from '../../models/counter.model'
import { CounterService } from '../../services/counter/counter.service'
import { AlertController } from '@ionic/angular'
import { ItemReorderEventDetail } from '@ionic/core'

@Component({
  selector: 'counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.scss'],
})
export class CounterListComponent {
  @Input()
  counters: Counter[]

  constructor(
    private counterService: CounterService,
    private alertController: AlertController
  ) {}

  onDecrementClick(counter: Counter) {
    this.counterService.incrementCounter(counter.id, -1)
  }
  
  onIncrementClick(counter: Counter) {
    this.counterService.incrementCounter(counter.id, 1)
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
          handler: data => {
            const title = data.counterTitle.trim()

            if (title) {
              this.counterService.renameCounter(counter.id, title)
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
          handler: () => this.counterService.removeCounter(counter.id)
        }
      ]
    })

    await alert.present()
  }
  
  onItemReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log(ev.detail)
    this.counterService.relocateCounter(this.counters[ev.detail.from].id, ev.detail.to)
    ev.detail.complete(false)
    console.log(1111)
  }
}
