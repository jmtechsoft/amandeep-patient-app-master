import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  public name;
  public email_id;
  public mobile_no;
  public message;

  constructor(private location: Location, private http: HttpService,
    private utility: UtilityService) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  contactUs() {
    if (this.name == undefined) {
      this.utility.showMessageAlert("Error", "Name is required");
    } else if (this.email_id == undefined) {
      this.utility.showMessageAlert("Error", "Email id is required");
    } else if (this.mobile_no == undefined) {
      this.utility.showMessageAlert("Error", "Mobile number/Phone number is required");
    } else if (this.message == undefined) {
      this.utility.showMessageAlert("Error", "Message is required");
    } else {
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'));
      let params = {
        "user_id": user.id,
        "name": this.name,
        "message": this.message,
        "email_id": this.email_id,
        "phone_number": this.mobile_no,
      }

      this.http.contactUs("contactUs", params).subscribe((res: any) => {
        this.utility.hideLoading();
        if(res.success == true){
           this.utility.showMessageAlert("Submitted",res.message);
           this.location.back();
        }else{
          this.utility.showMessageAlert("Error",res.message)
        }
      }, err => {
        console.log(err)
      })
    }
  }

}
