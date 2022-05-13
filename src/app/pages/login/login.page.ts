import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FacebookLoginPlugin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { Plugins } from '@capacitor/core';
import { isPlatform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Urls } from 'src/app/model/Constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;
  exceptionData: string;
  showException: boolean = false;
  readonly POST_URL = `${Urls.BaseApi}account/loginExternal`;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslicka', [Validators.required, Validators.minLength(6)]],
    });

    this.setupFbLogin();

    this.authService.onError
      .subscribe((res: any) => {
        this.exceptionData = res;
      });

    this.authService.isAuthenticated.subscribe(async (res: any) => {
      // this.loginRes = 'result: ' + JSON.stringify(res);
      const loading = await this.loadingController.getTop();
      loading?.dismiss();
      
      if(res) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        // this.loginRes = 'failed result: ' + JSON.stringify(res);
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
      }
    });
  }

  async setupFbLogin() {
    if (isPlatform('desktop')) {
      this.fbLogin = FacebookLogin;
    } else {
      // Use the native implementation inside a real app!
      // const { FacebookLogin } = Plugins;
      // this.fbLogin = FacebookLogin;
      await FacebookLogin.initialize({appId: '225839309317271'});
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }, async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }

  async loginWithFacebook() {
    const loading = await this.loadingController.create();
    await loading.present();
    let result: any = {};
    const FACEBOOK_PERMISSIONS = ['public_profile', 'user_location', 'user_friends', 'user_gender', 'user_link', 'user_photos', 'email', 'user_birthday'];
    if (isPlatform('desktop')) {
      result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    } else {
      result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
      // this.loginRes = JSON.stringify(result);
    }

    console.log(result);
 
    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
    } else if (result.accessToken && !result.accessToken.userId) {
      // Web only gets the token but not the user ID
      // Directly call get token to retrieve it now
      this.getCurrentToken();
      loading.dismiss();   
    } else {
      // Login failed
    }
  }
 
  async getCurrentToken() { 
    let result: any = {};   
    if (isPlatform('desktop')) {
      result = await FacebookLogin.getCurrentAccessToken();
    } else {
      result = await this.fbLogin.getCurrentAccessToken();
    }
 
    if (result && result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      // Not logged in.
      console.log(result);
    }
  }
 
  async loadUserData() {
    const loading = await this.loadingController.create();
    await loading.present();
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,friends,gender,link,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe(res => {
      this.user = res;
      // this.loginRes = this.POST_URL;
      // this.loginRes = JSON.stringify(this.user);
      this.authService.loginWithExternalProvider(this.user);
      // .subscribe(async (lRes: any) => {
      //   console.log(lRes);
      //   await loading.dismiss();
      //   this.router.navigateByUrl('/home', { replaceUrl: true });
      // });
      loading.dismiss();
    });
  }

  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

}
function result(result: any) {
  throw new Error('Function not implemented.');
}

