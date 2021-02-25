import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.page.html',
  styleUrls: ['./select-location.page.scss'],
})
export class SelectLocationPage implements OnInit {
  public locations: any = [];
  public choose_locationID;
  public last_location_choose;
  public location_name;
  public helpline_number;
  public book_type;
  constructor(private route: ActivatedRoute, private platform:Platform,private statusBar: StatusBar, private location: Location, private router: Router, private http: HttpService, public utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
    });
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    })
  }
 
  ngOnInit() {
    if(this.utility.locations.length == 0){
      this.getLocations();
    }
 }

  ionViewWillLeave() {
    this.utility.locations.map((x, i) => {
      x.choose = false;
    })
  }
  getLocations() {
   this.utility.showLoading();
    this.http.getLocations("allLocations").subscribe(
      (res: any) => {
        this.utility.hideLoading();
        if (res.success) {
          this.utility.locations = res.data;
          this.utility.locations.map((x, i) => {
            x.choose = false;
          })
        }
        else if(res.status == 'Token is Expired'){
          this.utility.showMessageAlert("Error","Token is Expired");
          this.router.navigateByUrl('/login');
        }

      }, err => {
        this.utility.showToast("Sorry!! Try again")
      })
  }

  goBack() {
    // this.location.back();
    this.router.navigateByUrl('/home')
  }

  next() {
    if (this.choose_locationID == undefined) {
      this.utility.showMessageAlert("Location required!", "Please select location");
    } else {
      localStorage.setItem('location_id',this.choose_locationID);
      localStorage.setItem('location_name',this.location_name);
      localStorage.setItem('helpline_number',this.helpline_number);
      let navigationExtras: NavigationExtras = {
        state: {
          location_id: this.choose_locationID,
          location_name: this.location_name,
          helpline_number: this.helpline_number,
          book_type: this.book_type
        },
      };
      this.router.navigate(['/select-specility'], navigationExtras);
    }
  }

  getImage(index, choose) {
    if (!choose) {

      if (index == 0) {
        return 'assets/imgs/amritsar-2.png'
      }
      if (index == 1) {
        return 'assets/imgs/medicity.png'
      }
      if (index == 2) {
        return 'assets/imgs/pathankot-2.png'
      }
      if (index == 3) {
        return 'assets/imgs/Tarn Taran-2.png'
      }
      if (index == 4) {
        return 'assets/imgs/ferozepur-2.png'
      } if (index == 5) {
        return 'assets/imgs/jammu-2.png'
      }
      if (index == 6) {
        return 'assets/imgs/srinagar-2.png'
      } if (index == 7) {
        return 'assets/imgs/amritsar-2.png'
      } if (index == 8) {
        return 'assets/imgs/amritsar-2.png'
      } else {
        return 'assets/imgs/amritsar-2.png'
      }
    } else {
      if (index == 0) {
        return 'assets/imgs/amritsar.png'
      }
      if (index == 1) {
        return 'assets/imgs/medicity red.png'
      }
      if (index == 2) {
        return 'assets/imgs/pathankot.png'
      }
      if (index == 3) {
        return 'assets/imgs/tarn taran.png'
      }
      if (index == 4) {
        return 'assets/imgs/ferozepur.png'
      } if (index == 5) {
        return 'assets/imgs/jammu.png'
      }
      if (index == 6) {
        return 'assets/imgs/srinagar.png'
      } if (index == 7) {
        return 'assets/imgs/amritsar.png'
      } if (index == 8) {
        return 'assets/imgs/amritsar.png'
      } else {
        return 'assets/imgs/amritsar.png'
      }
    }
  }

  chooseImage(index, location) {
    this.choose_locationID = location.id;
    this.location_name = location.location_name;
    this.helpline_number = location.helpline_number;
    if (this.last_location_choose == undefined) {
      this.utility.locations[index].choose = true;
      this.last_location_choose = index;
      this.next();
    } else {
      this.utility.locations[this.last_location_choose].choose = false;
      this.utility.locations[index].choose = true;
      this.last_location_choose = index;
      this.next();
    }
  }
}
