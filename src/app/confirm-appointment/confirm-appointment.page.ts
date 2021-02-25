import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController, AlertController, Platform } from "@ionic/angular";
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CardPaymentPage } from '../card-payment/card-payment.page';


@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.page.html',
  styleUrls: ['./confirm-appointment.page.scss'],
})
export class ConfirmAppointmentPage implements OnInit {
  location_name: any;
  data: any;
  location_id: any;
  doctor_id: any;
  schedule_id: any;
  speciality_id: any;
  date: any;
  time: any;
  user: any;
  book_for: string;
  book_type;
  show_patient_details: boolean = false;
  show_patient_form: boolean = false;
  show_registered_patients: boolean = false;
  name: any;
  mobile_no: number;
  age: any;
  speciality_name: string;
  choose_self: boolean = false;
  choose_relative: boolean = false;
  booking_options: any = [{
    title: "SELF",
    isChecked: false
  }, {
    title: "RELATIVE",
    isChecked: false
  }];
  registered_patients: any = [];


  constructor(private statusBar: StatusBar, public platform: Platform, public modalController: ModalController, private alertController: AlertController, private launchNavigator: LaunchNavigator, private route: ActivatedRoute, private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
    this.route.queryParams.subscribe((params) => {
      this.modalController.dismiss({
        'dismissed': true
      });
      this.speciality_id = this.router.getCurrentNavigation().extras.state.speciality_id;
      this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
      this.data = this.router.getCurrentNavigation().extras.state.data;
      this.location_id = this.data.location_id;
      this.doctor_id = this.data.doctor_id;
      this.date = this.router.getCurrentNavigation().extras.state.date;
      this.time = this.router.getCurrentNavigation().extras.state.time;
      this.schedule_id = this.router.getCurrentNavigation().extras.state.schedule_id;
      this.speciality_name = this.router.getCurrentNavigation().extras.state.speciality_name;
      this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
      if (this.router.getCurrentNavigation().extras.state.patient != undefined) {
        this.book_for = 'relative';
        this.user = this.router.getCurrentNavigation().extras.state.patient;
      } else {
        this.user = JSON.parse(localStorage.getItem('user_details'));
        this.getAlreadyRegisteredPatients();
      }
      this.platform.backButton.subscribeWithPriority(9999, () => {
        // do nothing
        this.goBack();
        //  alert(1)
        //this.router.navigateByUrl("/select-timeslot");
      })
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  chooseBookingOption(title, index) {
    console.log(title)
    if (title == 'SELF') {
      this.book_for = 'self';
      this.user = JSON.parse(localStorage.getItem('user_details'));
      this.name = this.user.user_name;
      this.mobile_no = this.user.phone_number;
      this.age = null;
      this.show_patient_details = true;
      this.show_patient_form = false;
      this.booking_options[1].isChecked = false;
      this.booking_options[0].isChecked = true;
    } else {
      this.show_patient_form = true;
      this.show_patient_details = false;
      this.show_registered_patients = true;
      this.book_for = 'relative';
      this.name = undefined;
      this.mobile_no = undefined;
      this.age = undefined;
      this.booking_options[0].isChecked = false;
      this.booking_options[1].isChecked = true;
    }
  }

  choosePatient(data) {
    this.user = data;
    this.name = data.name;
    this.mobile_no = data.mobile_no;
    this.age = data.age;
    this.show_patient_details = true;
    this.show_patient_form = false;
    this.show_registered_patients = false;
  }

  // addPatient() {
  //   debugger
  //   let regx = /^[A-Za-z]+$/;
  //   if (this.name == undefined || this.name == '' || this.age == undefined || this.mobile_no == undefined || this.mobile_no == '') {
  //     this.utility.showMessageAlert("Error!", "All fields are required.")
  //   } else if (!this.name.match(regx)) {
  //     this.utility.showMessageAlert("Invalid Patient name", "Only alphabets are allowed to enter in patient name field.")
  //   } else if (this.mobile_no.toString().length != 10 && this.book_for != 'self') {
  //     this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
  //   } else if (this.age.toString().length > 2 && this.book_for != 'self') {
  //     this.utility.showMessageAlert("Invalid age !", "The age  you have entered is not valid.")
  //   } else {
  //     this.utility.showLoading();
  //     let params = {
  //       "name": this.name,
  //       "mobile_no": this.mobile_no,
  //       "age": this.age
  //     }
  //     this.http.addPatient("addPatient", params).subscribe(
  //       (res: any) => {
  //         this.utility.hideLoading();
  //         if (res.success || res.message == 'Patient added successfully') {
  //           this.utility.showMessageAlert("Patient added!", "Your patient has been added.");
  //           this.show_patient_details = true;
  //           this.show_patient_form = false;
  //           this.book_for = 'relative';
  //           this.user = res.data.patient;
  //           this.choose_self = false;
  //           this.choose_relative = true;
  //         } else {
  //           this.choose_self = false;
  //           this.choose_relative = true;
  //           let state = {
  //             patient: res.data.patient,
  //             location_name: this.location_name,
  //             data: this.data,
  //             date: this.date,
  //             time: this.time,
  //             schedule_id: this.schedule_id
  //           }
  //           this.showAlert('Patient already added', 'Do you want to continue with this patient?', state)
  //         }
  //       }, err => {
  //         this.utility.hideLoading();
  //         this.utility.showMessageAlert("Network error!", "Please check your network connection.")
  //       })
  //   }
  // }


  getAlreadyRegisteredPatients() {
    this.http.getAlreadyRegisteredPatients('getPatients/user/' + this.user.id).subscribe((res: any) => {
      console.log("getAlreadyRegisteredPatients", res);
      if (res.success == true) {
        if (res.data.length > 0) {
          this.registered_patients = res['data'];
        }
      }
    }, err => {

    })
  }

  async showAlert(header: string, message: string, state) {
    const alert = await this.alertController.create({
      cssClass: "alert-container",
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
            this.show_patient_details = true;
            this.book_for = 'relative';
            this.user = state.patient;
            this.show_patient_form = false;
          }
        }
      ]
    });
    await alert.present();
  }

  showMap() {

    this.launchNavigator.navigate(this.location_name)
      .then(
      );
  }

  confirmAppointment() {
    // debugger
    console.log(this.mobile_no.toString().length)
    if (this.book_for == '' || this.book_for == undefined) {
      this.utility.showMessageAlert("Patient info required!", "Please select one option for whom you are booking this appointment.")
    } else if (this.book_for == 'relative' && (this.name == undefined || this.name == '' || this.age == undefined || this.mobile_no == undefined)) {
      this.utility.showMessageAlert("Error!", "Please enter patient details.")
    } else if (this.mobile_no.toString().length != 10 && this.book_for != 'self') {
      this.utility.showMessageAlert("Invalid mobile number!", "Mobile number should be of 10 digits.")

    } else if (this.age != null && this.age.toString().length > 2 && this.book_for != 'self') {
      this.utility.showMessageAlert("Invalid age!", "Please enter valid age.")

    } else {
      if (this.book_type == 'OPD') {
        let user = JSON.parse(localStorage.getItem('user_details'));
        let params = {}
        if (this.mobile_no != undefined) {
          params = {
            "speciality_id": this.data.speciality_id,
            "doctor_id": this.doctor_id,
            "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
            "location_id": this.location_id,
            "fee": this.data.opdfee,
            "schedule_id": this.schedule_id,
            "book_for": this.book_for,
            "created_by": user.id,
            "amount": this.data.opdfee,
            "name": this.name,
            "mobile_no": this.mobile_no,
            "age": this.age,
            "type": "OPD"
          }
        } else {
          params = {
            "speciality_id": this.data.speciality_id,
            "doctor_id": this.doctor_id,
            "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
            "location_id": this.location_id,
            "fee": this.data.opdfee,
            "schedule_id": this.schedule_id,
            "book_for": this.book_for,
            "created_by": user.id,
            "amount": this.data.opdfee,
            "name": this.name,
            // "mobile_no": this.mobile_no,
            "age": this.age,
            "type": "OPD"
          }
        }

        localStorage.setItem('confirm-appointment', JSON.stringify(params));
        // debugger
        console.log("params.....", params);

        this.presentModal();

      }
      if (this.book_type == 'videocall') {
        let user = JSON.parse(localStorage.getItem('user_details'));
        let params = {};
        if (this.mobile_no != undefined) {
          params = {
            "speciality_id": this.data.speciality_id,
            "doctor_id": this.doctor_id,
            "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
            "location_id": this.location_id,
            "fee": this.data.opdfee,
            "schedule_id": this.schedule_id,
            "book_for": this.book_for,
            "created_by": user.id,
            "amount": this.data.opdfee,
            "name": this.name,
            "mobile_no": this.mobile_no,
            "age": this.age,
            "type": "Video"
          }
        }
        else {
          params = {
            "speciality_id": this.data.speciality_id,
            "doctor_id": this.doctor_id,
            "date": this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getDate(),
            "location_id": this.location_id,
            "fee": this.data.opdfee,
            "schedule_id": this.schedule_id,
            "book_for": this.book_for,
            "created_by": user.id,
            "amount": this.data.opdfee,
            "name": this.name,
            // "mobile_no": this.mobile_no,
            "age": this.age,
            "type": "Video"
          }
        }

        localStorage.setItem('confirm-appointment', JSON.stringify(params));
        // debugger
        console.log("params.....", params);
        this.presentModal();

      }
    }

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CardPaymentPage,
      animated: true,
      backdropDismiss: true,
      showBackdrop: true,
    });
    return await modal.present();
  }


}
