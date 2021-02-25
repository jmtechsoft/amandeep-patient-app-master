import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { EmbedVideoService } from 'ngx-embed-video';
@Component({
  selector: 'app-play-video',
  templateUrl: './play-video.page.html',
  styleUrls: ['./play-video.page.scss'],
})
export class PlayVideoPage implements OnInit {
  public link : string;
  iframe_html: any;
  constructor(private navParams: NavParams,private embedService: EmbedVideoService,) {
    this.link = this.navParams.get('link');
    this.iframe_html = this.embedService.embed(this.link);
  }

  ngOnInit() {
  }
}
