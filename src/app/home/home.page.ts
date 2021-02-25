import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor(private statusBar: StatusBar, private menu: MenuController, private badge: Badge, private utility: UtilityService, private route: ActivatedRoute, private router: Router, private http: HttpService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.badge.clear();
      this.getAllDoctors();
    });
  }

  bookOPD() {
    if (localStorage.getItem('location_id') == undefined) {
      this.http.getLocations('allLocations');
      let navigationExtras: NavigationExtras = {
        state: {
          book_type: 'OPD'
        },
      };
      this.router.navigate(['/select-location'], navigationExtras);
    } else {
      this.http.getLocations('allLocations');
      let navigationExtras: NavigationExtras = {
        state: {
          location_id: localStorage.getItem('location_id'),
          location_name: localStorage.getItem('location_name'),
          helpline_number: localStorage.getItem('helpline_number'),
          book_type: 'OPD'
        },
      };
      this.router.navigate(['/select-specility'], navigationExtras);
    }
  }

  myReports() {
    this.router.navigateByUrl('/my-reports')
  }

  bookVideoCall() {
    if (localStorage.getItem('location_id') == undefined) {
      this.http.getLocations('allLocations');
      let navigationExtras: NavigationExtras = {
        state: {
          book_type: 'videocall'
        },
      };
      this.router.navigate(['/select-location'], navigationExtras);
    } else {
      this.http.getLocations('allLocations');
      let navigationExtras: NavigationExtras = {
        state: {
          location_id: localStorage.getItem('location_id'),
          location_name: localStorage.getItem('location_name'),
          helpline_number: localStorage.getItem('helpline_number'),
          book_type: 'videocall'
        },
      };
      this.router.navigate(['/select-specility'], navigationExtras);
    }
  }

  aboutUs() {
    this.router.navigateByUrl("/about");
  }

  blogs() {
    this.router.navigateByUrl("/blogs");
  }

  chatWithDoctor() {
    console.log(localStorage.getItem('payment_status'));
    let a = localStorage.getItem('payment_status');
    if (a != 'false') {
      this.router.navigateByUrl('/chat-lists')
    } else {
      this.router.navigateByUrl('/chat-with-doctor');
    }
  }


  myAppointments() {
    this.router.navigate(['/my-appointments']);
  }
  account() {
    this.router.navigate(['/profile']);
  }
  openMenu() {
    this.menu.enable(true, 'first');
  }

  getAllDoctors() {
    this.http.getAllDoctors("allDoctors").subscribe((res: any) => {
      if (res.success) {
        this.utility.all_doctors = res.data;
      } else {

      }
    }, err => {

    })
  }

}
