import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import codes from 'country-calling-code';
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {
  public codes: any;
  public name: any;
  public gender: any;
  public mobile_no: any;
  public email_id: any;
  public dob: any;
  public location_name: any;
  public data: any;
  public date: any;
  public time: any;
  public schedule_id: any;
  constructor(private statusBar: StatusBar,private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.codes = codes;
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.data = this.router.getCurrentNavigation().extras.state.data;
      this.date = this.router.getCurrentNavigation().extras.state.date;
      this.time = this.router.getCurrentNavigation().extras.state.time;
      this.schedule_id = this.router.getCurrentNavigation().extras.state.schedule_id;
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  submit() {
    if (this.name == undefined || this.email_id == undefined || this.mobile_no == undefined || this.dob == undefined || this.gender == undefined) {
      this.utility.showMessageAlert("Error!", "All fields are required'.")
    } else if (this.mobile_no.length > 10) {
      this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
     } else {
      this.utility.showLoading();
      let params = {
        "name": this.name,
        "mobile_no": '91' + this.mobile_no,
        "email": this.email_id,
        "gender": this.gender,
        "dob": this.dob

      }
      this.http.addPatient("addPatient", params).subscribe(
        (res: any) => {
          if (res.success || res.message == 'Patient added successfully') {
            this.utility.showMessageAlert("Patient added!","Your patient has been added.");
            let navigationExtras: NavigationExtras = {
              state: {
                patient: res.data.patient,
                location_name: this.location_name,
                data: this.data,
                date: this.date,
                time: this.time,
                schedule_id: this.schedule_id

              },
            };
            this.router.navigateByUrl("/confirm-appointment", navigationExtras);
          } else {
            // this.utility.showToast("Patient already exists");
            let state = {
              patient: res.data.patient,
              location_name: this.location_name,
              data: this.data,
              date: this.date,
              time: this.time,
              schedule_id: this.schedule_id

            }
            this.utility.showAlert('Patient already added', 'Do you want to continue with this patient?', state)
          }
          this.utility.hideLoading();
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
        })
    }
  }

}
