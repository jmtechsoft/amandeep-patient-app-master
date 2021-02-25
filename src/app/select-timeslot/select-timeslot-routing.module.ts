import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTimeslotPage } from './select-timeslot.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTimeslotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTimeslotPageRoutingModule {}
