import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
})
export class BlogsPage implements OnInit {
  public blogs : any = [];
  constructor(private location: Location,private platform:Platform, private iab: InAppBrowser, private http: HttpService, private utility: UtilityService) {
    this.getBlogs();
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    })
  }

  ngOnInit() {
  }

  getBlogs() {
    this.utility.showLoading();
    this.http.getLocations("allBlogs").subscribe(
      (res: any) => { 
        this.utility.hideLoading();
        
        res.data.map(x=> x.full_text = false);
        this.blogs = res.data;
      }, err => {
        this.utility.showToast("Sorry!! Try again")
      })
  }

  goBack() {
    this.location.back();
  }

  readMore(index){
    this.blogs[index].full_text = true;
  }

  readLess(index){
    this.blogs[index].full_text = false;
  }

}
