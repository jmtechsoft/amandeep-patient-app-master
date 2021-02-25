import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-select-specility',
  templateUrl: './select-specility.page.html',
  styleUrls: ['./select-specility.page.scss'],
})
export class SelectSpecilityPage implements OnInit {
  specialities: any = [];
  location_id: any;
  location_name: any;
  choose_specilityID: any;
  helpline_number: any;
  searchArray: any = [];
  book_type;
  constructor(private statusBar: StatusBar, private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.location_id = this.router.getCurrentNavigation().extras.state.location_id;
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.helpline_number = this.router.getCurrentNavigation().extras.state.helpline_number;
      this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
      this.getSpeciality()
    });
  }

  ngOnInit() {
  }

  getSpeciality() {
    this.http.getSpeciality("getSpecialities/location/" + this.location_id).subscribe(
      (res: any) => {
        if (res.success) {
          this.specialities = res.data;
          this.searchArray = this.specialities;
          if (this.specialities.length == 0) {
            this.utility.showMessageAlert("No Speciality!", "This location has no speciality added.")
          }
        } else {
          this.utility.showMessageAlert("No Speciality!", "This location has no speciality added.")
        }
      }, err => {
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }

  goBack() {
    if (localStorage.getItem('location_id') == undefined) {
      let navigationExtras: NavigationExtras = {
        state: {
          book_type: this.book_type
        },
      };
      this.router.navigate(['/select-location'], navigationExtras);
    } else {
      let navigationExtras: NavigationExtras = {
        state: {
          book_type: this.book_type
        },
      };
      this.router.navigate(['/home'], navigationExtras);
    }
  }

  goToLocations() {
    let navigationExtras: NavigationExtras = {
      state: {
        book_type: this.book_type
      },
    };
    this.router.navigate(['/select-location'], navigationExtras);
  }

  selectSpeciality(speciality_name, id) {
    let navigationExtras: NavigationExtras = {
      state: {
        location_id: this.location_id,
        location_name: this.location_name,
        helpline_number: this.helpline_number,
        speciality_id: id,
        speciality_name: speciality_name,
        book_type: this.book_type
      },
    };
    this.router.navigate(['/book-appointment'], navigationExtras);
  }

  search(searchInput) {
    if (searchInput.target.value != null) {
      this.specialities = this.searchArray.filter(function (ele, i, array) {
        let arrayelement = ele.speciality_name.toLowerCase();
        return arrayelement.includes(searchInput.target.value)
      })
    } else {
      this.specialities = this.searchArray;
    }
  }

  stopSearch() {
    this.specialities = this.searchArray;
  }

  getIcon(name) {
    if (name == 'Orthopaedics & Joint Replacement') {
      return "assets/imgs/Orthopaedics.png"
    } else if (name == 'Plastic & Cosmetic Surgery') {
      return "assets/imgs/Plastic Cosmetic.png"
    }
    else if (name == 'Pulmonology') {
      return "assets/imgs/Pulmonology.png"
    }
    else if (name == 'Neurology') {
      return "assets/imgs/Neurology.png"
    }
    else if (name == 'Plastic, Cosmetic & Microvascular Surgery') {
      return "assets/imgs/Cosmetic Surgery.png"
    }
    else if (name == 'Medicine') {
      return "assets/imgs/Medicine.png"
    } else if (name == 'Gastroenterology') {
      return "assets/imgs/Gastroenterology.png"
    } else if (name == 'Neuro and Spine') {
      return "assets/imgs/Neuro & Spine.png"
    } else if (name == 'Pathology') {
      return "assets/imgs/Pathology.png"

    } else if (name == 'General & Laparoscopic Surgeon') {
      return "assets/imgs/General & Laparo.png"
    } else if (name == 'ENT') {
      return "assets/imgs/ENT.png"
    }
    else if (name == 'Medical oncology') {
      return "assets/imgs/Medical Oncology.png"
    }
    else {
      return "assets/imgs/testing.png"
    }
  }
}
