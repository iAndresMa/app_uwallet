import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full'
  },
  {
    path: 'loading',
    loadChildren: () => import('./pages/loading/loading.module').then( m => m.LoadingPageModule)
  },
  {
    path: 'bicicletero',
    loadChildren: () => import('./pages/bicicletero/bicicletero.module').then( m => m.BicicleteroPageModule)
  },
  {
    path: 'carnet',
    loadChildren: () => import('./pages/carnet/carnet.module').then( m => m.CarnetPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'mesa',
    loadChildren: () => import('./pages/mesa/mesa.module').then( m => m.MesaPageModule)
  },
  {
    path: 'prestamos/:data',
    loadChildren: () => import('./pages/prestamos/prestamos.module').then( m => m.PrestamosPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./pages/qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'scanner-qr',
    loadChildren: () => import('./pages/scanner-qr/scanner-qr.module').then( m => m.ScannerQrPageModule)
  },
  {
    path: 'dasnet',
    loadChildren: () => import('./pages/dasnet/dasnet.module').then( m => m.DasnetPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
