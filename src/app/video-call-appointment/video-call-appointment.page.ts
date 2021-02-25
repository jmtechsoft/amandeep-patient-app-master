import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { checkSystemRequirements, getDevices, createClient, createStream, Logger } from 'agora-rtc-sdk';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';


@Component({
  selector: 'app-video-call-appointment',
  templateUrl: './video-call-appointment.page.html',
  styleUrls: ['./video-call-appointment.page.scss'],
})
export class VideoCallAppointmentPage implements OnInit {
  localStream: Stream;
  stream : any;
  remoteCalls: any = [];
  activeCall: boolean = false;
  audioEnabled: boolean = true;
  videoEnabled: boolean = true;

  token: string;
  udid: string;
  channel_name: string;

  remote_screen: boolean = false;
  local_screen: boolean = true;


  audioDevices: any;
  videoDevices: any;

  user_id: any;
  doctor_id: any;
  appointment_id: any;

  stream_id: any;
  call_started : any;
  audio: any;
  speakerEnabled : boolean = false;

  constructor(private agoraService: AngularAgoraRtcService, private platform: Platform, private nativeAudio: NativeAudio, public audioman: AudioManagement, private route: ActivatedRoute, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.agoraService.createClient();
    this.route.queryParams.subscribe((params) => {
      this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
      this.doctor_id = this.router.getCurrentNavigation().extras.state.doctor_id;
      this.appointment_id = this.router.getCurrentNavigation().extras.state.appointment_id;
      this.stream_id = this.router.getCurrentNavigation().extras.state.streamId;
      this.channel_name = this.router.getCurrentNavigation().extras.state.channel_name;
    });
   
    this.utility.getevent().subscribe((message) => {
      console.log("call:ended",message)
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      //this.utility.showMessageAlert("Call ended!",message['call:ended']);
      this.router.navigate(["home"])
  });
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    })
  }


  ngOnInit() {
    this.setAudioMode();
    // this.startCall();
    this.audio = new Audio();
    this.audio.src = '../../assets/tone/iphone_6-30.mp3';
    this.audio.load();
    this.playAudio();
  }


  startCall() {
    this.getDevices();
  }

  playAudio() {
    this.audio.play();
    this.audio.loop = true;
  }


  setAudioMode() {
    this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
      .then(() => {
        console.log('Device audio mode is now NORMAL');
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  getDevices() {
    getDevices((devices) => {
      /** @type {?} */
      //    debugger
      console.log(devices)
      let audioDevices = devices.filter(device => {
        return device.kind === 'audioinput' && device.deviceId !== 'default';
      });
      /** @type {?} */
      let videoDevices = devices.filter(device => {
        return device.kind === 'videoinput' && device.deviceId !== 'default';
      });
      this.audioDevices = audioDevices;
      this.videoDevices = videoDevices;
      console.log(this.audioDevices);
      console.log(this.videoDevices);
      console.log("his.channel_name", this.channel_name)
      this.agoraService.client.join(null, this.channel_name, null, (streamID) => { // stream id created
        console.log(streamID);
        this.stream_id = streamID;//new add
        let audio = true;
        let video = true;
        let screen = false;
        let cameraId = this.videoDevices[0].deviceId;
        let microphoneId = this.audioDevices[0].deviceId;
        let incoming_id = this.stream_id
        // this.localStream = this.agoraService.createStream(uid, true, cameraId, microphoneId, true, false); // join stream
        this.localStream = createStream({ incoming_id, audio, cameraId, microphoneId, video, screen })
        console.log("this.localStream", this.localStream);
        var stream = this.localStream
        window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          let videoTrack = stream.getVideoTracks()[0];
          console.log(videoTrack);

          document.querySelector("video").srcObject = stream;
          this.localStream.play('agora_local');
        }).catch(err => console.log(err.name))
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });

    });
  }

  acceptCall() {
    this.startCall();
    this.activeCall = true;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.call_started = new Date();
    }
  }

  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });
    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        this.call_started = new Date();
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });
    console.log(" this.localStream.........", this.localStream)
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      this.stream = stream;
      console.log("agora remote id.....", `agora_remote${stream.getId()}`)
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
      // this.remote_screen = true;
      // this.local_screen = false;
      if (`agora_remote${stream.getId()}` != undefined) {
        if (this.audio) {
          this.audio.pause();
          this.audio = null;

        }
      } else {
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
          // this.call_started = new Date();
        }
      }
    });
    this.agoraService.client.on('stream-removed', (evt) => {
      this.localStream.stop();
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.utility.showMessageAlert("Call ended!", "Call has ended due to poor network connection");
      this.router.navigate(["home"])
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
        this.localStream.stop();
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
        }
        this.utility.showMessageAlert("Call ended!", "");
        this.router.navigate(["home"])
      }
    });
    console.log("this.remoteCalls.........", this.remoteCalls);
  }

  leave() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.agoraService.client.leave(() => {
      this.activeCall = false;
      if (this.localStream) {
        this.localStream.stop();
      }
      this.utility.showMessageAlert("Call ended!", "");
      this.router.navigate(["home"]);
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
  }
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    if (this.audioEnabled) this.localStream.enableAudio();
    else this.localStream.disableAudio();
  }
  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    if (this.videoEnabled) this.localStream.enableVideo();
    else this.localStream.disableVideo();
  }


  callEnded() {

    let user = JSON.parse(localStorage.getItem('user_details'));

    let params = {
      "user_id": this.user_id,
      "doctor_id": this.doctor_id,
      "uid": this.stream_id,
      "call_started": this.call_started,
      "call_ended": new Date(),
      "ended_by": "Patient"
    }

    console.log("params.............", JSON.stringify(params));

    this.http.videoCallPatient('callDuration', params).subscribe(
      (res: any) => {
        console.log("callDuration  ended call............", JSON.stringify(res));
        if (res.success) {
          this.utility.showMessageAlert("Call ended!", "");
          this.router.navigate(["my-appointments"])
          console.log("Leavel channel successfully");
        }
      }, err => {
        console.log("err.............", err)
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }


  toggleSpeaker(){
    this.speakerEnabled = !this.speakerEnabled;
    if (this.speakerEnabled) this.stream.adjustPlaybackSignalVolume(200);
    else this.stream.adjustPlaybackSignalVolume(50);
  }
  hideLocal() {
    this.remote_screen = true;
    this.local_screen = false;
  }

  hideRemote() {
    this.remote_screen = false;
    this.local_screen = true;
  }

}