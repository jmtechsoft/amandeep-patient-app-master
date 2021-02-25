import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user_id;
  public name: any;
  public gender: any;
  public mobile_no: any;
  public email_id: any;
  public dob: any;
  public gaurdian_name: any;
  public marital_status: any;
  public emergency_number: any;
  public image: any;
  constructor(private statusBar: StatusBar, private platform: Platform, private location: Location, private route: ActivatedRoute, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#FF0000');
    this.route.queryParams.subscribe((params) => {
      let user = JSON.parse(localStorage.getItem('user_details'));
      console.log(user);
      this.user_id = user.id;
      this.name = user.user_name;
      this.gender = user.gender;
      this.mobile_no = user.phone_number;
      this.dob = user.dob;
      this.email_id = user.email;
      this.gaurdian_name = user.guardian_name == null || user.guardian_name == '' ? 'NA' : user.guardian_name;
      this.emergency_number = user.emergency_num == null || user.emergency_num == '' ? 'NA' : user.emergency_num;
      this.marital_status = user.marital_status == null || user.marital_status == '' ? 'NA' : user.marital_status;
      if (this.utility.user_profile == undefined) {
        if (user.profile_photo != null) {
          this.utility.user_profile = user.profile_photo;
        } else {
          this.utility.user_profile = "assets/imgs/no-profile.png";
        }
      }

    })
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    })

  }

  ngOnInit() {

  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  editProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: JSON.parse(localStorage.getItem('user_details'))
      },
    };
    this.router.navigate(["/edit-profile"], navigationExtras)
  }
}