import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { CardComponent } from './card/card.component'


@NgModule({
  declarations: [
    FooterComponent,
    PoliticasComponent,
    CardComponent
  ],
  exports:[
    FooterComponent,
    PoliticasComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
