import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {Camera, Photo, CameraResultType, CameraSource} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { async } from 'rxjs';

import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
const IMAGE_DIR = 'stroed-image';
interface LocalFile{
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage implements OnInit {
  surveyQuestionForm: FormGroup;
  formSubmitted = false;
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  currentRate = 0;
 images: LocalFile[] = [];
  questionIndex: number = 0;

  formValue = {phoneNumber: '', test: ''};
  telForm: FormGroup;
  imgForm: FormGroup;
  tellForm: FormGroup;
  finform: FormGroup;
  constructor(private fb: FormBuilder, public navCtrl: NavController, private platform: Platform, private loadingController: LoadingController, private actionSheetCtrl: ActionSheetController) {
    
  }
  slideOpts = {
    allowTouchMove: false
    };
    isNotValid:boolean = true;
    flag:number=0;
 
  questions: any = [
    {
      id: 11,
      surveyNo: 5,
      qNo: 1,
      question: 'Was anything lost to theft in your interaction?',
      qType: 1,
      noAnswrs: 3,
      answerType: 1,
      answers: [ 
        { value: 'Strong arm robbery', code: 1},
        { value: 'Finessed', code: 2},
        { value: 'No', code: 3},
      ],
    },
    {
      id: 12,
      surveyNo: 5,
      qNo: 2,
      question: 'Actions during interation?',
      qType: 2,
      noAnswrs: 4,
      answerType: 1,
      answers: [
        { value: 'Consuming Alcohol', code: 4}, 
        { value: 'Other Drugs', code: 5}, 
        { value: 'Sex', code: 6}, 
        { value: 'Fight', code: 7}
      ],
    },
    {
      id: 13,
      surveyNo: 5,
      qNo: 3,
      question:
        'Rank the following features in order of importance?',
      qType: 3,
      noAnswrs: 4,
      answerType: 1,
      answers: [
        { value: 'Location', code: 8}, 
        { value: 'Confort', code: 9}, 
        { value: 'Service', code: 10}, 
        { value: 'Value for money' , code: 11}
      ],
    },
    // {
    //   id: 14,
    //   surveyNo: 5,
    //   qNo: 4,
    //   question: 'What is your idea about our institute?',
    //   qType: 4,
    //   noAnswrs: 0,
    //   answerType: 1,
    //   answers: [],
    // },
  ];


  ngOnInit() {
    this.createForms();
    this.loadFiles();
    
  }
  createForms(): any {
    this.telForm = new FormGroup({
      phoneNumber: new FormControl({
        value: this.formValue.phoneNumber
      }, [
        Validators.required,
        IonIntlTelInputValidators.phone
      ])
    });

    this.surveyQuestionForm = this.fb.group(
      this.questions.reduce((group: any, question: { qNo: string }) => {
        return Object.assign(group, {
          ['q' + question.qNo]: this.buildSubGroup(question),
        });
      }, {})
    );
    console.log(this.surveyQuestionForm);

    this.tellForm = new FormGroup({
      Tell_us: new FormControl('',Validators.required)
    })
    
    this.finform = new FormGroup({
      Final: new FormControl('',Validators.required)
    })
  }

  get phoneNumber() { return this.telForm.get('phoneNumber'); }

  onSavePhone() {
    console.log(this.phoneNumber.value);
  }

  private buildSubGroup(question) {
    switch (question.qType) {
      case 2:
        return this.fb.group(
          question.answers.reduce((subGroup, answer) => {
            return Object.assign(subGroup, { [answer]: [false] });
          }, {}),
          { validators: [this.atLeastOneRequired()] }
        );
      case 3:
        return this.fb.group(
          question.answers.reduce((subGroup, answer) => {
            return Object.assign(subGroup, {
              [answer]: [
                '',
                [Validators.required, Validators.min(1), Validators.max(3)],
              ],
            });
          }, {}),
          { validators: [this.uniqueNumbersValidator()] }
        );
      case 1:
        return this.fb.group({ answer: ['', [Validators.required]] });
      case 4:
        return this.fb.group({ answer: ['', [Validators.required]] });
      default:
        throw new Error('unhandled question type');
    }
  }

  atLeastOneRequired() {
    return (ctrl: AbstractControl) => {
      const fg = ctrl as FormGroup;
      const atLeastOneTrue = Object.values(fg.controls).some(
        (fc) => !!fc.value
      );
      return atLeastOneTrue ? null : { atLeastOneRequired: true };
    };
  }

  uniqueNumbersValidator() {
    return (ctrl: AbstractControl) => {
      const fg = ctrl as FormGroup;
      let allUnique = true;
      const values = [];
      Object.values(fg.controls).forEach((fc) => {
        const val = fc.value;
        if (val && allUnique) {
          if (values.includes(val) && allUnique) {
            allUnique = false;
          }
          values.push(val);
        }
      });
      return allUnique ? null : { notAllUnique: true };
    };
  }

  next() {
    this.slides.slideNext();
  }
  prev(){
    this.slides.slidePrev();
  }
  
  qnext(){
    this.isNotValid=true;
    this.slides.slideNext();
  }
  qprev(){
    this.slides.slidePrev();
    this.isNotValid= false;
  }
  // sliderChanges() {

  //   const context = this;
  //   this.slides.getActiveIndex().then(index => {
  //     console.log('@@@@ sliderChanges: index:', index);
  //     console.log(this.formsName[index].name)
      
      
  //   });
  // }
  
onDescSave(){

}
onRatingChange(){

}

  valid(){
    this.isNotValid = false;this.flag = 1;
  }

  onNext() {
    this.formSubmitted = true;
    this.questionIndex ++;
    this.isNotValid= true;
    console.log(this.formSubmitted);
  }

  

  onBack() {
    this.formSubmitted = true;
    this.questionIndex --;
    console.log(this.formSubmitted);
  }

  
  close() {
    
  }

  
  async loadFiles(){

    this.images = [];
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result =>{
      console.log('HERE:', result);
      this.loadFileData(result.files);

    }, async err =>{
      console.log('err:', err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_ =>{
      loading.dismiss();
    })
    
  }

  async loadFileData(fileNames: string[]){
    for(let f of fileNames){
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log('READ:', readFile)
    }
  }

  async selectImage(){
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Gallery Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];
    // Only allow file selection inside a browser
    if (!this.platform.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.Uri,
    //   source: CameraSource.Camera
    // });
    
    
    
  }
  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source
    });
    console.log(image);
    if (image){
      this.saveImage(image);
    }
 
    
  
  }

  async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);
    const fileName = new Date().getTime() + '.jpeg';
    const saveFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('saver file: ', saveFile);
    this.loadFiles();

  }

  async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

startUpload(){

}
async deleteImage(file: LocalFile){
  await Filesystem.deleteFile({
    directory: Directory.Data,
    path: file.path
  });
  this.loadFiles();
}


}
