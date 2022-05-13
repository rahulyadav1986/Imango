import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaxPageRoutingModule } from './fax-routing.module';

import { FaxPage } from './fax.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaxPageRoutingModule
  ],
  declarations: [FaxPage]
})
export class FaxPageModule {}
