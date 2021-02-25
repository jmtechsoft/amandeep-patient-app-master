import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
 
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'verify-otp',
    loadChildren: () => import('./verify-otp/verify-otp.module').then( m => m.VerifyOtpPageModule)
  },
  {
    path: 'book-appointment',
    loadChildren: () => import('./book-appointment/book-appointment.module').then( m => m.BookAppointmentPageModule)
  },
  {
    path: 'select-timeslot',
    loadChildren: () => import('./select-timeslot/select-timeslot.module').then( m => m.SelectTimeslotPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'confirm-appointment',
    loadChildren: () => import('./confirm-appointment/confirm-appointment.module').then( m => m.ConfirmAppointmentPageModule)
  },
  {
    path: 'add-patient',
    loadChildren: () => import('./add-patient/add-patient.module').then( m => m.AddPatientPageModule)
  },
  {
    path: 'select-location',
    loadChildren: () => import('./select-location/select-location.module').then( m => m.SelectLocationPageModule)
  },
  {
    path: 'select-specility',
    loadChildren: () => import('./select-specility/select-specility.module').then( m => m.SelectSpecilityPageModule)
  },
  {
    path: 'my-appointments',
    loadChildren: () => import('./my-appointments/my-appointments.module').then( m => m.MyAppointmentsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./videos/videos.module').then( m => m.VideosPageModule)
  },
  {
    path: 'play-video',
    loadChildren: () => import('./play-video/play-video.module').then( m => m.PlayVideoPageModule)
  },
  
  {
    path: 'query',
    loadChildren: () => import('./query/query.module').then( m => m.QueryPageModule)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./blogs/blogs.module').then( m => m.BlogsPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'add-reports',
    loadChildren: () => import('./add-reports/add-reports.module').then( m => m.AddReportsPageModule)
  },
  {
    path: 'my-reports',
    loadChildren: () => import('./my-reports/my-reports.module').then( m => m.MyReportsPageModule)
  },
  {
    path: 'video-call-appointment',
    loadChildren: () => import('./video-call-appointment/video-call-appointment.module').then( m => m.VideoCallAppointmentPageModule)
  },
  {
    path: 'chat-with-doctor',
    loadChildren: () => import('./chat-with-doctor/chat-with-doctor.module').then( m => m.ChatWithDoctorPageModule)
  },
  {
    path: 'chat-lists',
    loadChildren: () => import('./chat-lists/chat-lists.module').then( m => m.ChatListsPageModule)
  },
  {
    path: 'chat-window',
    loadChildren: () => import('./chat-window/chat-window.module').then( m => m.ChatWindowPageModule)
  },
  {
    path: 'card-payment',
    loadChildren: () => import('./card-payment/card-payment.module').then( m => m.CardPaymentPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
