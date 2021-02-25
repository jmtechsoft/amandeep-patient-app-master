import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ActionSheetController } from "@ionic/angular";
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ChatsService } from './chats.service';
import { HttpService } from './http.service';
import { UtilityService } from './utility.service';

declare var cordova: any;



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public user: any;
  public image: any;
  public menu = [
    {
      title: "Home",
      url: "/home",
      icon: "home-outline",
    },
    {
      title: "Book OPD Consultation",
      url: "",
      icon: "calendar",
    },
    {
      title: "Book Video Consultation",
      url: "",
      icon: "phone-portrait-outline",
    },
    {
      title: "Chat with Doctor",
      url: "",
      icon: "chatbox-ellipses-outline",
    },
    {
      title: "Ask a Query",
      url: "/query",
      icon: "help",
    },
    {
      title: "Videos",
      url: "/videos",
      icon: "logo-youtube",
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: "newspaper-outline",
    },
    {
      title: "My Reports",
      url: "/my-reports",
      icon: "receipt-outline",
    },
    {
      title: "My Appointments",
      url: "/my-appointments",
      icon: "calendar-outline",
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: "person-outline",
    },
    {
      title: "Change Password",
      url: "/change-password",
      icon: "lock-closed-outline",
    },
    {
      title: "About Us",
      url: "/about",
      icon: "help",
    },
    {
      title: "Contact Us",
      url: "/contact-us",
      icon: "call"
    },
    {
      title: "Share via",
      url: "",
      icon: "share-social-outline"
    },
    {
      title: "Logout",
      url: "/login",
      icon: "log-in-outline",
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private push: Push,
    private badge: Badge,
    private emailComposer: EmailComposer,
    private androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    private fb: FacebookService,
    private socialSharing: SocialSharing,
    public localNotifications: LocalNotifications,
    private http: HttpService,
    private chats: ChatsService,
    public utility: UtilityService
  ) {
    const initParams: InitParams = {
      appId: '3372377396172876',
      xfbml: true,
      version: 'v2.8'
    };

    this.fb.init(initParams);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#FF0000');
      this.splashScreen.hide();
      if (this.platform.is('android')) {
        this.utility.device_type = 'android';
      }
      if (this.platform.is('ios')) {
        this.utility.device_type = 'ios';
      }
      // this.backgroundMode.enable();
      this.pushNotification();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => {
          if (result.hasPermission == false) {
            this.androidPermissions.requestPermissions([
              this.androidPermissions.PERMISSION.CAMERA,
              this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
              this.androidPermissions.PERMISSION.RECORD_AUDIO
            ])
          }
        },
        err => {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        }
      );
      if (JSON.parse(localStorage.getItem('token')) != undefined) {
        //this.getChats();
        this.user = JSON.parse(localStorage.getItem('user_details'));
        this.getBanners();
        this.utility.user = JSON.parse(localStorage.getItem('user_details'));
        console.log(this.utility.user)
        if (this.utility.user.profile_photo != null || this.utility.user.profile_photo != undefined) {
          this.utility.image = this.utility.user.profile_photo;
        } else {
          this.utility.image = "assets/imgs/no-profile.png";
        }
        this.router.navigate(["home"])
      } else {
        this.router.navigate(["login"])
      }

    });
  }

  getBanners() {
    this.http.getAllBanners('getBanners').subscribe((res: any) => {
      this.utility.banners = res['data']
    })
  }

  share() {

    const params: UIParams = {
      href: 'https://github.com/zyra/ngx-facebook',
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }

  shareViaEmail() {

    let email = {
      to: '',
      //cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      // attachments: [
      //   'file://img/logo.png',
      //   'res://icon.png',
      //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //   'file://README.pdf'
      // ],
      subject: 'Amandeep Hospital App',
      body: 'Hello Dear,Please install this new app of amandeep hospital. (URL)',
      isHtml: true
    }

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  chooseOption(page) {
    if (page == 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_details');
      // this.utility.showMessageAlert("Logout","You have been logout");
      this.router.navigate(["login"])
    }
    if (page == 'Book OPD Consultation') {
      if (localStorage.getItem('location_id') == undefined) {
        this.http.getLocations('allLocations');
        let navigationExtras: NavigationExtras = {
          state: {
            book_type: 'OPD'
          },
        };
        this.router.navigate(['/select-location'], navigationExtras);
      } else {
        this.http.getLocations('allLocations');
        let navigationExtras: NavigationExtras = {
          state: {
            location_id: localStorage.getItem('location_id'),
            location_name: localStorage.getItem('location_name'),
            helpline_number: localStorage.getItem('helpline_number'),
            book_type: 'OPD'
          },
        };
        this.router.navigate(['/select-specility'], navigationExtras);
      }
    }
    if (page == 'Book Video Consultation') {
      if (localStorage.getItem('location_id') == undefined) {
        this.http.getLocations('allLocations');
        let navigationExtras: NavigationExtras = {
          state: {
            book_type: 'videocall'
          },
        };
        this.router.navigate(['/select-location'], navigationExtras);
      } else {
        this.http.getLocations('allLocations');
        let navigationExtras: NavigationExtras = {
          state: {
            location_id: localStorage.getItem('location_id'),
            location_name: localStorage.getItem('location_name'),
            helpline_number: localStorage.getItem('helpline_number'),
            book_type: 'videocall'
          },
        };
        this.router.navigate(['/select-specility'], navigationExtras);
      }
    }
    if (page == 'Chat with Doctor') {

      console.log(localStorage.getItem('payment_status'));
      let a = localStorage.getItem('payment_status');
      if (a != 'false') {

        this.router.navigateByUrl('/chat-lists')
      } else {
        this.router.navigateByUrl('/chat-with-doctor');
      }
      //this.utility.showMessageAlert("Work in progress","Discussion reuqired")
    }
    if (page == 'Share via') {
      this.socialSharingApp()
    }
  }

  async socialSharingApp() {
    const actionSheet = await this.actionSheetController.create({
      header: "Share our app on your social handels",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Share via facebook",
          icon: "logo-facebook",
          handler: () => {
            this.share();
          },
        },
        {
          text: "Share via whatsapp ",
          icon: "logo-whatsapp",
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Share via email ",
          icon: "mail-outline",
          handler: () => {
            this.shareViaEmail();
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

  pushNotification() {
    const options: PushOptions = {
      android: {
        // badge:true,
        sound: true,
        vibrate: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      this.badge.set(1);
      console.log(notification)
      if (notification.additionalData['notification_type'] == 'start_call') {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });

        let navigationExtras: NavigationExtras = {
          state: {
            streamId: notification.additionalData['unique ID'],
            channel_name: notification.additionalData['channel'],
          },
        };
        this.router.navigateByUrl('/video-call-appointment', navigationExtras)
      } else if (notification.additionalData['notification_type'] == 'end_call') {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });

        this.utility.showMessageAlert(notification.title, notification.message)
        this.utility.publishEvent({
          'call:ended': notification.title
        });
      } else if (notification.additionalData['notification_type'] == 'chat') {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });
      } else {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });
       this.utility.publishEvent({
          'message:recieved': notification
        });
      }

    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      debugger;
      this.utility.device_token = registration.registrationId;
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
