import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscritosPage } from './inscritos.page';

const routes: Routes = [
  {
    path: '',
    component: InscritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscritosPageRoutingModule {}
