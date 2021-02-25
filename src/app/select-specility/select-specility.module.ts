import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectSpecilityPageRoutingModule } from './select-specility-routing.module';

import { SelectSpecilityPage } from './select-specility.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectSpecilityPageRoutingModule
  ],
  declarations: [SelectSpecilityPage]
})
export class SelectSpecilityPageModule {}
