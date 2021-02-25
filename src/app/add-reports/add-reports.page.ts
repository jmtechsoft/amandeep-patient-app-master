import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import * as AWS from 'aws-sdk';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-reports',
  templateUrl: './add-reports.page.html',
  styleUrls: ['./add-reports.page.scss'],
})
export class AddReportsPage implements OnInit {
  public description: string;

  public report_1: string;
  public report_2: string;
  public report_3: string;
  public report_4: string;
  public report_5: string;

  public uploded_reports: any = [];



  constructor(private location: Location, private filePath: FilePath, private fileChooser: FileChooser, private camera: Camera, public actionSheetController: ActionSheetController, private router: Router, private http: HttpService, private utility: UtilityService) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  async getPicture(picture_number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Load from Library",
          icon: "images-outline",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, picture_number);
          },
        },
        {
          text: "Use Camera",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, picture_number);
          },
        },
        {
          text: "Upload PDF reports",
          icon: "document-outline",
          handler: () => {
            this.choosePdf(picture_number);
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

  choosePdf(picture_number) {
    this.fileChooser.open()
      .then(uri => {

        let fileName = "report";
        console.log(uri);
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            console.log(filePath);
            if (filePath.split('.')[1] == 'pdf') {
              if (picture_number == '1') {
                this.report_1 = 'assets/imgs/pdf.png';
              }
              if (picture_number == '2') {
                this.report_2 = 'assets/imgs/pdf.png';
              }
              if (picture_number == '3') {
                this.report_3 = 'assets/imgs/pdf.png';
              }
              if (picture_number == '4') {
                this.report_4 = 'assets/imgs/pdf.png';
              }
              if (picture_number == '5') {
                this.report_5 = 'assets/imgs/pdf.png';
              }
              this.uploadPDF(uri, fileName).then((res: any) => {
                if (res.Location) {
                  this.utility.hideLoading();
                  // this.uploadPictureToServer(res.Location,imagePath);
                  this.uploded_reports.push(res.Location);
                }
              });
            } else {
              this.utility.showMessageAlert("Invalid pdf file!", "The file you have choosen is not pdf.")
            }
          })
          .catch(err => console.log(err));

      })
  }

  public takePicture(sourceType, picture_number) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL
    };

    this.camera.getPicture(options).then((imagePath) => {
      //this.image = 'data:image/jpeg;base64,' + imagePath;
      // debugger
      if (picture_number == '1') {
        this.report_1 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '2') {
        this.report_2 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '3') {
        this.report_3 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '4') {
        this.report_4 = 'data:image/jpeg;base64,' + imagePath;
      }
      if (picture_number == '5') {
        this.report_5 = 'data:image/jpeg;base64,' + imagePath;
      }
      let imageName = "report";
      console.log
      this.uploadImage(imagePath, imageName).then((res: any) => {
        if (res.Location) {
          this.utility.hideLoading();
          // this.uploadPictureToServer(res.Location,imagePath);
          this.uploded_reports.push(res.Location);
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

  uploadPDF(file, fileName) {
    this.utility.showLoading();
    return new Promise((resolve, reject) => {
      const body = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');;
      const ext = 'pdf';
      let date = Date.now();
      const key = fileName + date + "." + 'pdf';
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
        //ContentEncoding: 'base64',
        ContentType: "pdf"
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


  addReport() {
    if (this.description == undefined || this.description == '') {
      this.utility.showMessageAlert("Description required!", "Please write description about your reports")
    } else if (this.uploded_reports.length == 0) {
      this.utility.showMessageAlert("Upload report!", "Please upload your reports")
    } else {
      this.utility.showLoading();
      let user = JSON.parse(localStorage.getItem('user_details'));

      let params = {
        "user_id": user.id,
        "description": this.description,
        "reports": this.uploded_reports,
        "report_type": "png"
      }


      this.http.editProfile("addReports", params).subscribe(
        (res: any) => {
          this.utility.hideLoading();
          if (res.success) {
            this.utility.showMessageAlert("Reports uploaded!", res.message);
            this.router.navigateByUrl('/my-reports');
          } else {
            this.utility.showMessageAlert("Error!", res.message);
          }
        }, err => {
          this.utility.hideLoading();
          this.utility.showMessageAlert("Network error!", "Please check your network connection.")

        })
    }
  }

} 
