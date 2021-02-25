import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import codes from 'country-calling-code';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

// import { AngularFireAuth } from "@angular/fire/auth";
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public codes: any;
    public dial_code;
    public mobile_no=8527860444;
    public password;
    constructor(private statusBar: StatusBar, private googlePlus: GooglePlus, private fb: Facebook, private afAuth: AngularFireAuth, private router: Router, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.codes = codes;
    }

    ngOnInit() { }

    login() {
        if (this.mobile_no == undefined) {
            this.utility.showMessageAlert("Mobile number required!", "Please enter your mobile number.")
        }
        else if (this.mobile_no.toString().length != 10) {
            this.utility.showMessageAlert("Invalid mobile number!", "The mobile number you have entered is not valid.")
        } else if (this.password == undefined) {
            this.utility.showMessageAlert("Password required!", "Please enter the password.")
        } else {

            this.utility.showLoading();
            let params = {
                mobile_no: this.mobile_no.toString(),
                password: this.password,
                device_token: this.utility.device_token == undefined ? 'devicetoken' : this.utility.device_token,
                device_type: this.utility.device_type == undefined ? 'devicetype' : this.utility.device_type

            }
            this.http.post("login", params).subscribe(
                (res: any) => {
                    console.log(res)
                    this.utility.hideLoading();
                    if (res.success == true) {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!', "We are hoping to provide you the best.");
                        this.utility.user = res.data['user'];
                        if (this.utility.user.profile_photo != null) {
                            this.utility.image = this.utility.user.profile_photo;
                        } else {
                            this.utility.image = "assets/imgs/no-profile.png";
                        }
                        console.log(res.data['payment_status'])
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']));
                        localStorage.setItem('payment_status', res['payment_status']);
                        this.router.navigateByUrl("/home");
                    } else {
                        this.utility.showMessageAlert("Error", res.message);
                    }
                }, err => {
                    this.utility.hideLoading();

                })

        }
    }

    facebookLogin() {
        this.fb.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log('Logged into Facebook!', res);
                this.utility.showLoading();
                const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
                this.afAuth.auth.signInWithCredential(credential)
                    .then((response) => {
                        console.log(response);
                        let user = JSON.stringify(response);
                        let params = {
                            social_id: response.additionalUserInfo.profile['id'],
                            type: 2,
                            user_name: response.additionalUserInfo.profile['name'],
                            email: response.additionalUserInfo.profile['email'],
                            profile_photo: response.additionalUserInfo.profile['picture'].data.url,
                            device_token: this.utility.device_token == undefined ? 'devicetoken' : this.utility.device_token,
                            device_type: this.utility.device_type == undefined ? 'devicetype' : this.utility.device_type
                        }

                        this.http.socialLogin('socialLogin', params).subscribe((res: any) => {
                            console.log(res)
                            this.utility.hideLoading();
                            if (res.success == true) {
                                this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!', "We are hoping to provide you the best.");
                                this.utility.user = res.data['user'];
                                if (this.utility.user.profile_photo != null) {
                                    this.utility.image = this.utility.user.profile_photo;
                                } else {
                                    this.utility.image = "assets/imgs/no-profile.png";
                                }
                                localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                                localStorage.setItem('token', JSON.stringify(res.data['token']));
                                localStorage.setItem('payment_status', res['payment_status']);
                                this.router.navigateByUrl("/home");
                            } else {
                                this.utility.showMessageAlert("Error", res.message);
                            }
                        }, err => {
                            this.utility.hideLoading();
                        })

                    });
            })
            .catch(e => console.log('Error logging into Facebook', e));

    }

    googlePlusLogin() {

        this.googlePlus.login({})
            .then(res => {
                console.log(res);
                this.utility.showLoading();

                let params = {
                    social_id: res.userId,
                    type: 3,
                    user_name: res.displayName,
                    email: res.email,
                    profile_photo: res.imageUrl,
                    device_token: this.utility.device_token == undefined ? 'devicetoken' : this.utility.device_token,
                    device_type: this.utility.device_type == undefined ? 'devicetype' : this.utility.device_type
                }

                this.http.socialLogin('socialLogin', params).subscribe((res: any) => {
                    console.log(res)
                    this.utility.hideLoading();
                    if (res.success == true) {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!', "We are hoping to provide you the best.");
                        this.utility.user = res.data['user'];
                        if (this.utility.user.profile_photo != null) {
                            this.utility.image = this.utility.user.profile_photo;
                        } else {
                            this.utility.image = "assets/imgs/no-profile.png";
                        }
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']));
                        localStorage.setItem('payment_status', res['payment_status']);
                        this.router.navigateByUrl("/home");
                    } else {
                        this.utility.showMessageAlert("Error", res.message);
                    }
                }, err => {
                    this.utility.hideLoading();
                })
            })
            .catch(err => {
                console.error(err);
                this.utility.showMessageAlert("Google login error", "Please try again.");

            });
    }

    signup() {
        this.router.navigate(['/sign-up']);
    }

}