import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EmbedVideo } from 'ngx-embed-video';
import { EmbedVideoService } from 'ngx-embed-video'
import { VideosPageRoutingModule } from './videos-routing.module';

import { VideosPage } from './videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideosPageRoutingModule
  ],
  providers:[EmbedVideo,EmbedVideoService],
  declarations: [VideosPage]
})
export class VideosPageModule {}
