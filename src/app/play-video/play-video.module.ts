import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayVideoPageRoutingModule } from './play-video-routing.module';

import { PlayVideoPage } from './play-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayVideoPageRoutingModule
  ],
  declarations: [PlayVideoPage]
})
export class PlayVideoPageModule {}
