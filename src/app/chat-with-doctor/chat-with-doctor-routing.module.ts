import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatWithDoctorPage } from './chat-with-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: ChatWithDoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatWithDoctorPageRoutingModule {}
