import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { WizardPageRoutingModule } from './wizard-routing.module';

import { WizardPage } from './wizard.page';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import {CloudinaryModule} from '@cloudinary/ng';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WizardPageRoutingModule,
    ReactiveFormsModule,
    IonIntlTelInputModule,
    CloudinaryModule,
    NgbModule
  ],
  declarations: [WizardPage]
})
export class WizardPageModule {}
