import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import * as AWS from 'aws-sdk';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {

  public user_id;
  public name: any;
  public gender: any;
  public mobile_no: any;
  public email_id: any;
  public dob: any;
  public gaurdian_name: any;
  public marital_status: any;
  public emergency_number: any;
  public image: any;
  constructor(private statusBar: StatusBar, public actionSheetController: ActionSheetController, private filePath: FilePath, private base64: Base64, private crop: Crop, private location: Location, private camera: Camera, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#FF0000');
    let user = JSON.parse(localStorage.getItem('user_details'));
    this.user_id = user.id;
    this.name = user.user_name;
    this.gender = user.gender;
    this.mobile_no = user.phone_number;
    this.dob = user.dob;
    this.email_id = user.email;
    this.gaurdian_name = user.guardian_name == null ? '' : user.guardian_name;
    this.emergency_number = user.emergency_num == null ? '' : user.emergency_num;
    this.marital_status = user.marital_status == null ? '' : user.marital_status;
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  onKeyPress(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 32 || event.keyCode == 46) {
        return false
    }
    else {
        return true
    }
  }

  selectCurrentDate() {
    let d = new Date();
    console.log(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
    return new Date(new Date().setFullYear(new Date().getFullYear())).toISOString();
  }

  editProfile() {
    
    if(this.gaurdian_name.length > 25 && this.gaurdian_name != undefined){
     this.utility.showMessageAlert("Invalid guardian name!","Guardian name should not be more than 25 characters.")
    }else if (this.emergency_number.length != 10  && this.emergency_number != ''){
      this.utility.showMessageAlert("Invalid emergency mobile number!", "The mobile number you have entered is not valid.")
    }else {
      this.utility.showLoading();
    let params = {
      "id": this.user_id,
      "user_name": this.name,
      "email": this.email_id,
      "gender": this.gender,
      "dob": this.dob,
      "marital_status": this.marital_status,
      "emergency_num": this.emergency_number,
      "phone_number":this.mobile_no,
      "guardian_name": this.gaurdian_name
    }
    this.http.editProfile("editProfile", params).subscribe(
      (res: any) => {
        this.utility.hideLoading();
        if (res.success) {
          localStorage.setItem('user_details', JSON.stringify(res.data));
          this.utility.user = JSON.parse(localStorage.getItem('user_details'));
          this.utility.showMessageAlert("Account Updated!", "Your new info has been added.");
          this.router.navigate(['profile']);
        } else {
          this.utility.showMessageAlert("Error!", res.message);
        }
      }, err => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
    }
    
  }


  async getPicture() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Load from Library",
          icon: "images-outline",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "destructive",
          icon: "close",
          handler: () => { },
        },
      ],
    });
    await actionSheet.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL
    };

    this.camera.getPicture(options).then((imagePath) => {
      this.image = 'data:image/jpeg;base64,' + imagePath;
      this.utility.user_profile = 'data:image/jpeg;base64,' + imagePath;
      let imageName = "user-profile";
      this.uploadImage(imagePath, imageName).then((res: any) => {
        if (res.Location) {
          this.uploadPictureToServer(res.Location, imagePath);
        }

      });
    }, (err) => {
    });
  }

  uploadImage(image, imageName) {
    this.utility.showLoading();
    return new Promise((resolve, reject) => {
      const body = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');;
      const ext = image.split(';')[0].split('/')[1] || 'jpg';
      let date = Date.now();
      const key = imageName + date + "." + 'jpeg';
      this.s3Putimage({ body, mime: `image/${ext}` }, key, 'base64').then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });

    })
  }

  s3Putimage(file, key, encoding) {

    return new Promise((resolve, reject) => {
      let s3 = new AWS.S3({
        accessKeyId: environment.AWS_accesskey,
        secretAccessKey: environment.AWS_secret_key,
        region: 'ap-south-1'
      });

      const params = {
        Body: file.body,
        Bucket: 'amadeephospital-user-images',
        Key: key,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: "image/jpeg"
      };

      s3.upload(params, (err, data) => {

        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }


  uploadPictureToServer(url, imagePath) {

    // this.utility.showLoading();
    let params = {
      "user_id": this.user_id,
      "picture_url": url
    }

    this.http.editProfile("editPicture", params).subscribe(
      (res: any) => {
        this.utility.hideLoading();
        if (res.success) {
          localStorage.setItem('user_details', JSON.stringify(res.data));
          // this.image = url;
         // this.image = 'data:image/jpeg;base64,' + imagePath;
         // this.utility.user_profile = this.image;
          this.utility.image = this.image;
          localStorage.setItem('user-profile-image',this.image);
          this.utility.showMessageAlert("Profile Picture Updated!", "Your profile image has been updated.");
          this.router.navigateByUrl('/profile');
        } else {
          this.utility.showMessageAlert("Error!", res.message);
        }
      }, err => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")

      })
  }
}


