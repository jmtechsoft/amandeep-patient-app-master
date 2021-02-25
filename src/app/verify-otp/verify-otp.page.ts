import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-verify-otp',
    templateUrl: './verify-otp.page.html',
    styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage implements OnInit {
    @ViewChild('ngOtpInput') ngOtpInputRef: any;
    public user_id;
    public mobile_no;
    public value1 = '';
    public value2 = '';
    public value3 = '';
    public value4 = '';
    constructor(private statusBar: StatusBar,private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.route.queryParams.subscribe((params) => {
            this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
            this.mobile_no = this.router.getCurrentNavigation().extras.state.mobile_no;
        });
    }

    ngOnInit() { }

    goBack() {
        this.location.back();
    }

    yourMethod(yourValue) {
        this.ngOtpInputRef.setValue(yourValue);//yourvalue can be any string or number eg. 1234 or '1234'
    }

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
                                mobile_no: this.mobile_no
                            },
                        };
                        this.router.navigate(["sign-up"], navigationExtras);
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
                    this.utility.showMessageAlert("OTP sent!", res.message)
                }
                this.utility.hideLoading();
            }, err => {
                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")

            })
    }


}