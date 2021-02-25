import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
    public user_id;
    public value1;
    public value2;
    public value3;
    public value4;
    constructor(private statusBar: StatusBar, private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.route.queryParams.subscribe((params) => {
            this.user_id = this.router.getCurrentNavigation().extras.state.user_id;

        });
    }

    ngOnInit() { }

    goBack() {
        this.location.back();
    }

    // verifyOtp() {
    //     if (this.value1 == undefined || this.value2 == undefined || this.value3 == undefined || this.value4 == undefined) {
    //         this.utility.showToast('Please enter correct OTP')
    //     } else {
    //         this.utility.showLoading();
    //         let params = {
    //             otp: this.value1 + this.value2 + this.value3 + this.value4,
    //             user_id: this.user_id
    //         }
    //         this.http.post("verifyOTP", params).subscribe(
    //             (res: any) => {
    //                 if (res.success) {
    //                     this.utility.showMessageAlert("Verified!", "Mobile number is verified")
    //                     let navigationExtras: NavigationExtras = {
    //                         state: {
    //                             user_id: this.user_id
    //                         },
    //                     };
    //                     this.router.navigate(["change-password"], navigationExtras);
    //                 }
    //                 this.utility.hideLoading();

    //             }, err => {
    //                 console.log("err");
    //                 this.utility.hideLoading();
    //                 this.utility.showMessageAlert("Network error!", "Please check your network connection.")
    //             })
    //     }

    // }
    verifyOtp() {
        this.utility.showMessageAlert("", "Please enter the OTP sent to your mobile number.");
    }

    automaticallyVerifyOTP($event) {
        if ($event.length == 4) {
            this.utility.showLoading();
            let params = {
                otp: $event,
                user_id: this.user_id
            }
            this.http.post("verifyOTP", params).subscribe(
                (res: any) => {
                    this.utility.hideLoading();

                    if (res.success) {
                        this.utility.showMessageAlert("OTP verified!", "Your mobile number has been verified.");
                        let navigationExtras: NavigationExtras = {
                            state: {
                                user_id: this.user_id,
                                // mobile_no: this.mobile_no
                            },
                        };
                        this.router.navigate(["change-password"], navigationExtras);
                    } else {
                        this.utility.showMessageAlert("Wrong OTP!", "You have entered wrong OTP");
                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })
        }

    }

    resendOTP() {
        this.utility.showLoading();
        let params = {
            user_id: this.user_id
        }
        this.http.post("resendOTP", params).subscribe(
            (res: any) => {
                if (res.success) {
                    this.utility.showToast(res.message);
                    this.utility.showMessageAlert("OTP sent!", res.message)

                }
                this.utility.hideLoading();

            }, err => {
                console.log("err");
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")

            })
    }

}