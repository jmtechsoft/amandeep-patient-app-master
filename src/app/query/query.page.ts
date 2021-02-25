import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.page.html',
  styleUrls: ['./query.page.scss'],
})
export class QueryPage implements OnInit {
  public title: string;
  public question: string;
  constructor(private statusBar: StatusBar, private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {

  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  submit() {
    if (this.title == undefined || this.question == '') {
      this.utility.showMessageAlert("Title Required!", "Please enter query title");
    } else if (this.question == undefined || this.question == '') {
      this.utility.showMessageAlert("Query Required!", "Please enter query")
    } else {
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'));
      let params = {
        user_id: user.id,
        title: this.title,
        question: this.question
      }
      this.http.addQuery("addQuery", params).subscribe(
        (res: any) => {
          this.utility.hideLoading();
          if (res.success) {
            this.title = undefined;
            this.question = undefined;
            this.utility.showMessageAlert("Query sent!", "We will respond to your query shortly.");
            this.router.navigateByUrl('/home');
          } else {
            this.utility.showMessageAlert("Error!", res.message)
          }
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
        })
    }
  }


}
