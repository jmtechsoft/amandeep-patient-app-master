import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController, AlertController, Platform } from "@ionic/angular";

import { Location } from '@angular/common';

import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.page.html',
  styleUrls: ['./card-payment.page.scss'],
})
export class CardPaymentPage implements OnInit {
  private data: any;
  public name: string;
  public number;
  public cvv;
  public expiry_date;


  constructor(private modalCtrl: ModalController, private platform: Platform, private location: Location, private route: ActivatedRoute, private stripe: Stripe, private router: Router,

    private http: HttpService, private utility: UtilityService) {
    this.data = JSON.parse(localStorage.getItem('confirm-appointment'));
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.dismiss();

      this.utility.showMessageAlert("Payment Cancelled", "Your payment has been cancelled");
      this.router.navigateByUrl("/home");
    })

  }

  ngOnInit() {
  }

  selectCurrentDate() {
    let d = new Date();
    return new Date(new Date().setFullYear(new Date().getFullYear())).toISOString();
  }

  payNow() {
    if (this.name == undefined || this.number == undefined || this.cvv == undefined || this.expiry_date == undefined) {
      this.utility.showMessageAlert('Missing Fields!', "Some of the fields are missing")
    }
    else if (this.cvv.toString().length != 3) {
      this.utility.showMessageAlert('Invalid Cvv details!', "Please enter correct CVV.")
    } else if (this.number.toString().length != 16) {
      this.utility.showMessageAlert('Invalid card number!', "Card number you have entered is not valid.It must be of 16 digits.")

    }
    else {
      this.utility.showLoading();
      let card = {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2020,
        cvc: '220'
      }
      this.stripe.setPublishableKey('pk_test_51HY4PWGxS7HD5LRgl5KhFtxE52opZIcvtAbE5qqeoo2rt5kQJxiIUJ9tsStai5yNldou1fjEROeYQNlzQ8BUrPi400W1MBjnEa');
      this.stripe.createCardToken(card)
        .then(token => {
          if (this.data.type == 'OPD') {
            let params = {
              "speciality_id": this.data.speciality_id,
              "doctor_id": this.data.doctor_id,
              "date": this.data.date,
              "location_id": this.data.location_id,
              "fee": this.data.fee,
              "schedule_id": this.data.schedule_id,
              "book_for": this.data.book_for,
              "created_by": this.data.created_by,
              "amount": this.data.amount,
              "stripe_token": token.id,
              "name": this.data.name,
              "age": this.data.age,
              "mobile_no": this.data.mobile_no
            }
            this.http.confirmAppointment("confirmAppointment", params).subscribe(
              (res: any) => {
                this.utility.hideLoading();
                if (res.success || res.message == 'Appointment booked successfully') {
                  this.utility.showMessageAlert("Appointment booked!", "Appointment booked successfully.");
                  this.dismiss();
                  this.router.navigateByUrl("/home");
                } else if (res.success == false) {
                  this.utility.showMessageAlert("Appointment not booked!", res.message);
                  this.dismiss();
                } else {
                  this.utility.showMessageAlert("Appointment not booked!", "Please try again.")
                }
              }, err => {
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")
              })

          }

          else if (this.data.type == 'Video') {
            let params = {
              "speciality_id": this.data.speciality_id,
              "doctor_id": this.data.doctor_id,
              "date": this.data.date,
              "location_id": this.data.location_id,
              "fee": this.data.fee,
              "schedule_id": this.data.schedule_id,
              "book_for": this.data.book_for,
              "created_by": this.data.created_by,
              "amount": this.data.amount,
              "stripe_token": token.id,
              "name": this.data.name,
              "age": this.data.age,
              "mobile_no": this.data.mobile_no
            }
            this.http.confirmAppointment("confirmVideoAppointment", params).subscribe(
              (res: any) => {
                this.utility.hideLoading();
                if (res.success || res.message == 'Appointment booked successfully') {
                  this.utility.showMessageAlert("Appointment booked successfully!", "You will also get notified before call.");
                  this.dismiss();
                  this.router.navigateByUrl("/home");
                } else if (res.success == false) {
                  this.utility.showMessageAlert("Appointment not booked!", res.message);
                  this.dismiss();
                } else {
                  this.utility.showMessageAlert("Appointment not booked!", "Plese try again.")
                }
              }, err => {
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")
              })
          } else if (this.data.type == 'Chat') {
            let params = {
              "doctor_id": this.data.doctor_id,
              "book_for": this.data.book_for,
              "subscribed_by": this.data.subscribed_by,
              "health_query": this.data.health_query,
              "amount": 200,
              "stripe_token": token.id,
              "name": this.data.name,
              "age": this.data.age,
              "mobile_no": this.data.mobile_no
            }

            this.http.buyChatSubscription("chatSubscription", params).subscribe(
              (res: any) => {
                this.utility.hideLoading();
                if (res.success) {
                  localStorage.setItem('payment_status', 'true');
                  this.utility.showMessageAlert("Chat subscribed!", "You can now chat with doctor directly.");
                  this.dismiss();
                  this.router.navigateByUrl("/chat-lists");
                }
              }, err => {
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")
              })
          }
        })
        .catch(error => {
          console.error(error)
        });
    }

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
      
    });
  }

}
