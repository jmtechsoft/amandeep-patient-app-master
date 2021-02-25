import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
	public user_id;
    public new_password;
    public confirm_password;

    constructor(private statusBar: StatusBar,private platform:Platform,private router: Router, private route: ActivatedRoute, private location: Location, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff'); 
        this.route.queryParams.subscribe((params) => {
            if(this.router.getCurrentNavigation().extras.state != undefined){
                this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
            }else{
                let user = JSON.parse(localStorage.getItem('user_details'));
                this.user_id = user.id
            }
           
        });
        this.platform.backButton.subscribeWithPriority(9999, () => {
            // do nothing
            this.goBack();
          })
      
    }

    ngOnInit() {}

    goBack() {
        this.location.back();
    }

    changePassword() {
        if (this.new_password == undefined) {
            this.utility.showToast("Please enter new password")
        } else if (this.confirm_password == undefined) {
            this.utility.showToast("Please enter confirm password");
        } else if (this.new_password != this.confirm_password) {
            this.utility.showToast("New password doesnt match the cofnirm password");
        } else {
            this.utility.showLoading();
            let params = {
                user_id: this.user_id,
                password: this.new_password
            }
            this.http.post("forgotPassword", params).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.utility.showToast(res.message);
                        this.router.navigate(["login"]);

                    } else {
                        this.utility.showToast("Something went wrong.Please try  again!");
                    }
                    this.utility.hideLoading();
                  
                }, err => {
                    this.utility.hideLoading();
                    this.utility.showToast("Sorry!! Try again")
                })
        }

    }

}