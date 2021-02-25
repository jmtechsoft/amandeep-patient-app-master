import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import codes from 'country-calling-code';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
    public codes: any;
    public dial_code;
    public user_id;
    public mobile_no;
    public name;
    public email_id;
    public password;
    constructor(private statusBar: StatusBar, private afAuth: AngularFireAuth, private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.codes = codes;
        // this.route.queryParams.subscribe((params) => {
        //     this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
        //     this.mobile_no = this.router.getCurrentNavigation().extras.state.mobile_no;
        // });

    }

    ngOnInit() { }

    onKeyPress(event) {
        if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 32 || event.keyCode == 46) {
            return true
        }
        else {
            return false
        }
    }

    signup() {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.name == undefined) {
            this.utility.showMessageAlert("Error!", "Please enter name")
        }
        //  else if (this.email_id == undefined) {
        //     this.utility.showMessageAlert("Error!","Please enter email")
        // } 
        else if (this.email_id != undefined && !this.email_id.match(mailformat)) {
            this.utility.showMessageAlert("Error!", "Please enter valid email address")
        } else if (this.mobile_no == undefined) {
            this.utility.showMessageAlert("Error!", "Please enter mobile number")
        } else if (this.mobile_no.toString().length > 10) {
            this.utility.showMessageAlert("Error!", "Please enter valid mobile number")
        } else if (this.password == undefined) {
            this.utility.showMessageAlert("Error!", "Please enter password")
        } else if (this.password.length < 8) {
            this.utility.showMessageAlert("Error!", "Password should be atlest 8 characters")
        } else {
            this.utility.showLoading();
            let params = {
                mobile: this.mobile_no.toString(),
                name: this.name,
                email: this.email_id,
                password: this.password,
                device_token: this.utility.device_token == undefined ? 'devicetoken' : this.utility.device_token,
                device_type: this.utility.device_type == undefined ? 'devicetype' : this.utility.device_type
            }
            this.http.post("register", params).subscribe(
                (res: any) => {
                    this.utility.hideLoading();
                    if (res.success || res.message == 'Details updated Successfully') {
                        this.utility.showMessageAlert("Welcome " + res.data['user'].user_name + '!', "We are hoping to provide you the best.");
                        this.utility.user = res.data['user'];
                        if (this.utility.user.profile_photo != null) {
                            this.utility.image = this.utility.user.profile_photo;
                        } else {
                            this.utility.image = "assets/imgs/no-profile.png";
                        }
                        localStorage.setItem('user_details', JSON.stringify(res.data['user']));
                        localStorage.setItem('token', JSON.stringify(res.data['token']))
                        let email = this.mobile_no + "@amandeephospitalpatient.com";
                        let password = "Techies@321";
                        this.afAuth.auth.signInWithEmailAndPassword(email, password).then((res: any) => {
                            if (res.code == 'auth/user-not-found') {
                                this.afAuth.auth.createUserWithEmailAndPassword(email, password)
                                    .then((user: any) => {
                                        localStorage.setItem('firebase_user_id', JSON.stringify(res['user']));
                                        this.router.navigateByUrl("/home");
                                    })
                            } else {
                                localStorage.setItem('firebase_user_id', JSON.stringify(res['user']));
                                this.router.navigateByUrl("/home");
                            }
                        }, (error) => {
                            this.afAuth.auth.createUserWithEmailAndPassword(email, password)
                                .then((user: any) => {
                                    console.log(user);
                                    localStorage.setItem('firebase_user_id', JSON.stringify(user['user']));
                                    this.router.navigateByUrl("/home");
                                })
                        })

                    } else {
                        this.utility.showMessageAlert("Error ", res.message['mobile'][0]);
                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })
        }

    }

    goBack() {
        this.location.back();
    }

}