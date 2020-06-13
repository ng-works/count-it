import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountersPage } from './counters.page';

const routes: Routes = [
  {
    path: '',
    component: CountersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountersPageRoutingModule {}
