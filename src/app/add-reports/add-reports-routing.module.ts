import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddReportsPage } from './add-reports.page';

const routes: Routes = [
  {
    path: '',
    component: AddReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddReportsPageRoutingModule {}
