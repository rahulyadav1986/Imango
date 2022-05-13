import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
     canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'fax/:id',
    loadChildren: () => import('./pages/fax/fax.module').then( m => m.FaxPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'comment/:incidentId',
    loadChildren: () => import('./pages/comment/comment.module').then( m => m.CommentPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'wizard',
    loadChildren: () => import('./pages/wizard/wizard.module').then( m => m.WizardPageModule),
    canLoad: [AuthGuard]
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  // },
  {
    path: 'phone-number',
    loadChildren: () => import('./pages/phone-number/phone-number.module').then( m => m.PhoneNumberPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
