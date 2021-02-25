import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router,NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-book-appointment',
    templateUrl: './book-appointment.page.html',
    styleUrls: ['./book-appointment.page.scss'],
})
export class BookAppointmentPage implements OnInit {
    public location_id;
    public location_name;
    public speciality_id;
    public speciality_name;
    public doctors : any = [];
    public helpline_number;
    public book_type;
    constructor(private statusBar: StatusBar,private route: ActivatedRoute,private location: Location, private router: Router, private http: HttpService, private utility: UtilityService) {
      this.statusBar.backgroundColorByHexString('#ffffff'); 
      this.route.queryParams.subscribe((params) => {
            this.location_id = this.router.getCurrentNavigation().extras.state.location_id;
            this.location_name = this.router.getCurrentNavigation().extras.state.location_name;
            this.helpline_number = this.router.getCurrentNavigation().extras.state.helpline_number;
            this.speciality_id = this.router.getCurrentNavigation().extras.state.speciality_id;
            this.speciality_name = this.router.getCurrentNavigation().extras.state.speciality_name;
            this.book_type = this.router.getCurrentNavigation().extras.state.book_type;
            this.getDoctors();
        });
    }

    ngOnInit() {}

    goBack() {
        // this.location.back();
        let navigationExtras: NavigationExtras = {
          state: {
            location_id: this.location_id,
            location_name: this.location_name,
            helpline_number: this.helpline_number,
            book_type: this.book_type
          },
        };
        this.router.navigate(['/select-specility'], navigationExtras);
    }
    
    bookAppointment(data) {
        let navigationExtras: NavigationExtras = {
            state: {
              location_name:this.location_name,
              helpline_number:this.helpline_number,
              data: data,
              speciality_id:  this.speciality_id,
              speciality_name:this.speciality_name,
              book_type:this.book_type
            },
          };
        this.router.navigate(['/select-timeslot'],navigationExtras);
    }

    getDoctors(){
      this.utility.showLoading();
      this.http.getDoctorsLocationwise('getDoctors/location/'+ this.location_id + '/speciality/' + this.speciality_id,{}).subscribe(
        (res: any) => {
          if (res.success) {
           this.utility.hideLoading();
            this.doctors = res.data;
            if(  this.doctors.length == 0){
              this.utility.showMessageAlert("No Doctors!","There is no doctor available for this specialty yet.")
           
            }
           }else{
             this.utility.hideLoading();
             this.utility.showMessageAlert("No Doctors!","There is no doctor available for this specialty yet.")
           }
         }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")
            
        })
    }
}