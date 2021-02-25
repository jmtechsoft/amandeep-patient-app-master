import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayVideoPage } from './play-video.page';

const routes: Routes = [
  {
    path: '',
    component: PlayVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayVideoPageRoutingModule {}
