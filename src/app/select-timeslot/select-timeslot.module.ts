import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTimeslotPageRoutingModule } from './select-timeslot-routing.module';
// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';
import { SelectTimeslotPage } from './select-timeslot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    SelectTimeslotPageRoutingModule
  ],
  declarations: [SelectTimeslotPage]
})
export class SelectTimeslotPageModule {
	
}
