import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BicicleteroPage } from './bicicletero.page';

const routes: Routes = [
  {
    path: '',
    component: BicicleteroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BicicleteroPageRoutingModule {}
