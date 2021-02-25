import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueryPageRoutingModule } from './query-routing.module';

import { QueryPage } from './query.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QueryPageRoutingModule
  ],
  declarations: [QueryPage]
})
export class QueryPageModule {}
