import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReportsPageRoutingModule } from './add-reports-routing.module';

import { AddReportsPage } from './add-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReportsPageRoutingModule
  ],
  declarations: [AddReportsPage]
})
export class AddReportsPageModule {}
