import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Counter } from '../../models/counter.model'

@Component({
  selector: 'counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.scss'],
})
export class CounterListComponent {
  @Input()
  counters: Counter[]

  constructor() {
  }
}
