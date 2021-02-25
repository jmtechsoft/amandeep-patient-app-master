import { Component, OnInit, Input, ViewChild, NgZone } from "@angular/core";
import { IonContent, ActionSheetController, Platform } from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { Base64 } from "@ionic-native/base64/ngx";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import * as AWS from "aws-sdk";
import { FilePath } from "@ionic-native/file-path/ngx";
import { ChatsService } from "../chats.service";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import { environment } from "../../environments/environment";
import * as _ from "lodash";

@Component({
  selector: "app-chat-window",
  templateUrl: "./chat-window.page.html",
  styleUrls: ["./chat-window.page.scss"],
})
export class ChatWindowPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild("input") messageInput;
  public chat: any;
  public messages: any = [];
  public sender_id: any;
  public reciever_id: any;
  public doctor_details: any;
  public message: string = "";
  lengthmessage: number=0;

  constructor(
    private router: Router,
    private photoViewer: PhotoViewer,
    private zone: NgZone,
    private platform: Platform,
    private keyboard: Keyboard,
    public actionSheetController: ActionSheetController,
    private filePath: FilePath,
    private base64: Base64,
    private crop: Crop,
    private camera: Camera,
    private utility: UtilityService,
    private route: ActivatedRoute,
    private chats: ChatsService,
    private http: HttpService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.sender_id = this.router.getCurrentNavigation().extras.state.sender;
      this.reciever_id = this.router.getCurrentNavigation().extras.state.reciever;
      this.doctor_details = this.router.getCurrentNavigation().extras.state.doctor_details;
      console.log("doctor_details", this.doctor_details);
    });
    this.platform.resume.subscribe(() => {
      this.ngOnInit();
    });

    this.utility.getevent().subscribe((message) => {
      console.log("message:recieved", message);
      let user = JSON.parse(localStorage.getItem("user_details"));
      if (message["message:recieved"]["additionalData"].type == 1) {
        let msg = {
          //"id":  this.messages.length,
          message_type: 1,
          message: message["message:recieved"].message,
          image_url: null,
          sender_id: "P-" + user.id,
          reciever_id: "D-" + this.doctor_details.id,
          send_by: "doctor",
          status: 1,
          del_by: null,
          created_at: "2020-11-18 09:54:07",
          updated_at: "2020-11-18 09:54:07",
        };
        this.zone.run(() => {
          this.messages.push(msg);
        });

        console.log(this.messages);
        this.content.scrollToBottom(1500);
      } else {
        let msg = {
          //"id":  this.messages.length,
          message_type: 2,
          message: null,
          image_url: message["message:recieved"].message,
          sender_id: "P-" + user.id,
          reciever_id: "D-" + this.doctor_details.id,
          send_by: "doctor",
          status: 1,
          del_by: null,
          created_at: "2020-11-18 09:54:07",
          updated_at: "2020-11-18 09:54:07",
        };
        this.zone.run(() => {
          this.messages.push(msg);
        });
        this.content.scrollToBottom(1500);
      }
    });
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("user_details"));
    let params = {
      'sender_id': this.sender_id,
      'reciever_id': this.reciever_id,
    };
    //this.messages = [];
    setInterval(() => {
      this.chats.getChatMessages("getChatMessages", params).subscribe(
        (res: any) => {
          console.log(res);

         this.scrollToBottom();
          if (res.data.length > this.lengthmessage) {
            this.lengthmessage = res.data.length;
            this.messages = res.data;
          }
          localStorage.setItem("messages", this.messages);
        },
        (err) => {}
      );
    }, 2000);
  }

  goBack() {
    this.router.navigateByUrl("/chat-lists");
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 200);
  }

  sendMessage() {
    let user = JSON.parse(localStorage.getItem("user_details"));
    let message = {
      id: this.messages.length,
      message_type: 1,
      message: this.message,
      image_url: null,
      sender_id: "P-" + user.id,
      reciever_id: "D-" + this.doctor_details.id,
      send_by: "patient",
      status: 1,
      del_by: null,
      created_at: "2020-11-18 09:54:07",
      updated_at: "2020-11-18 09:54:07",
    };
    this.messages.push(message);
    let params = {
      message_type: 1,
      message: this.message,
      sender_id: "P-" + user.id,
      reciever_id: "D-" + this.doctor_details.id,
      send_by: "patient",
    };
    this.chats.getChatMessages("storeChatMessage", params).subscribe(
      (res: any) => {},
      (err) => {}
    );
    this.message = "";
    setTimeout(() => {
      this.messageInput.setFocus();
      // this.keyboard.show();
    }, 100);
    this.content.scrollToBottom(1500);
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
      destinationType: this.camera.DestinationType.DATA_URL,
    };

    this.camera.getPicture(options).then(
      (imagePath) => {
        // this.image = 'data:image/jpeg;base64,' + imagePath;
        let user = JSON.parse(localStorage.getItem("user_details"));
        let message = {
          id: this.messages.length,
          message_type: 2,
          message: null,
          image_url: "data:image/jpeg;base64," + imagePath,
          sender_id: "P-" + user.id,
          reciever_id: "D-" + this.doctor_details.id,
          send_by: "patient",
          status: 1,
          del_by: null,
          created_at: "2020-11-18 09:54:07",
          updated_at: "2020-11-18 09:54:07",
        };
        //this.messages.push(message);
        this.zone.run(() => {
          this.messages.push(message);
          this.content.scrollToBottom(1500);
        });
        // this.content.scrollToBottom(15000);
        let imageName = "user-profile";
        this.uploadImage(imagePath, imageName).then((res: any) => {
          if (res.Location) {
            this.sendImage(res.Location);
          }
        });
      },
      (err) => {}
    );
  }

  uploadImage(image, imageName) {
    //this.utility.showLoading();
    return new Promise((resolve, reject) => {
      const body = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const ext = image.split(";")[0].split("/")[1] || "jpg";
      let date = Date.now();
      const key = imageName + date + "." + "jpeg";
      this.s3Putimage({ body, mime: `image/${ext}` }, key, "base64")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  s3Putimage(file, key, encoding) {
    return new Promise((resolve, reject) => {
      let s3 = new AWS.S3({
        accessKeyId: environment.AWS_accesskey,
        secretAccessKey: environment.AWS_secret_key,
        region: "ap-south-1",
      });

      const params = {
        Body: file.body,
        Bucket: "amadeephospital-user-images",
        Key: key,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };

      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  sendImage(img) {
    // debugger
    console.log(img);
    let user = JSON.parse(localStorage.getItem("user_details"));
    let message = {
      //"id":  this.messages.length,
      message_type: 2,
      message: null,
      image_url: img,
      sender_id: "P-" + user.id,
      reciever_id: "D-" + this.doctor_details.id,
      send_by: "patient",
      status: 1,
      del_by: null,
      created_at: "2020-11-18 09:54:07",
      updated_at: "2020-11-18 09:54:07",
    };
    this.messages.push(message);
    // this.messages[this.messages.length].status = 1;
    let params = {
      message_type: 2,
      message: null,
      image_url: img,
      sender_id: "P-" + user.id,
      reciever_id: "D-" + this.doctor_details.id,
      send_by: "patient",
    };
    this.chats.getChatMessages("storeChatMessage", params).subscribe(
      (res: any) => {},
      (err) => {}
    );
    // this.message = '';
    // setTimeout(() => {
    //   this.messageInput.setFocus();
    //   // this.keyboard.show();
    // }, 100)
    this.content.scrollToBottom(1500);
  }

  showImage(url) {
    this.photoViewer.show(url, url.split("/")[1], { share: true });
  }
}
