import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage implements OnInit {
  appointments: any = [];
  constructor(private statusBar: StatusBar,private route: ActivatedRoute, private location: Location, private launchNavigator: LaunchNavigator, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  ngOnInit() {
    this.getMyAppointments();
  }
  videocall(){
    this.router.navigateByUrl("/video-call-appointment");
//
  }

 

  getMyAppointments() {
    this.utility.showLoading();
    let user = JSON.parse(localStorage.getItem('user_details'))
    this.http.getMyAppointments('allAppointments/user/' + user.id).subscribe(
      (res: any) => {
        console.log(res);
        this.utility.hideLoading();
        if (res.success) {
         // this.appointments = res.data;
          res.data['OPD'].map(x=> {
            x.type = 'OPD'
            this.appointments.push(x);
          });
          res.data['Video'].map(x=> {
            x.type = 'Video'
            this.appointments.push(x);
          });
          
          console.log(  this.appointments)
          if (this.appointments.length == 0) {
            this.utility.showMessageAlert("No Appointments!", "You have no appointments booked yet.")
          }
        } else {
          this.utility.showMessageAlert("No Appointments!", "You have no appointments booked yet.")
        }
      }, err => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }

  goBack() {
    this.location.back();
  }


  showMap(address, location) {
    let location_name = address + location;
    this.launchNavigator.navigate(location_name)
      .then(
      );
  }

}
