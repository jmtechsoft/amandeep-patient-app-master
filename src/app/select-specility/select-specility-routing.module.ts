import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectSpecilityPage } from './select-specility.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSpecilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectSpecilityPageRoutingModule {}
