import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Counter } from '../../models/counter.model'
import { CounterService } from '../../services/counter/counter.service'

@Component({
  selector: 'counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.scss'],
})
export class CounterListComponent {
  @Input()
  counters: Counter[]

  constructor(
    private counterService: CounterService
  ) {}

  onDecrementClick(counter: Counter) {
    this.counterService.incrementCounter(counter.id, -1)
  }
  
  onIncrementClick(counter: Counter) {
    this.counterService.incrementCounter(counter.id, 1)
  }
}
