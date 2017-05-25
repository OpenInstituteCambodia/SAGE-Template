import { Component, ViewChild, Input, Renderer } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { xelaRoute } from '../../app/xelaModule/xelaRoute';
import { xelaAudio } from '../../app/xelaModule/xelaAudio';
import { xelaToolbar } from '../../app/xelaModule/xelaToolbar';


/*
  Generated class for the Q page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
  providers:  [ xelaRoute, xelaAudio, xelaToolbar ]
})
export class QuestionPage {

  // New Code
  public assets:Array<any> = [{
    image: 'assets/app/image/',
    audio: 'assets/app/audio/'
  }];

  private _question_length: number = 0;
  public question_id;
  public content:any;


  // Interface Rendering
  public isWidth100: boolean = null;
  public isWidth50: boolean = true;
  public isWrap: boolean = true;
  public isFlex: boolean = true;
  public isNextButton: boolean = false;
  public isEnableAnswer: boolean = false;

  public isChoice1: boolean = true;
  public isChoice2: boolean = true;
  public isChoice3: boolean = true;
  public isChoice4: boolean = true;

  constructor(private _toolbar: xelaToolbar, public navCtrl: NavController, public navParams: NavParams, public _route: xelaRoute, public _audioPlayer: xelaAudio) {
    this.question_id = this.navParams.get("_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QPage');
    console.clear();

    // Initialize UNIT DATA
    let unit = 'unit[id="'+this.question_id+'"]';
    this.content = {
      'audio_1': this.attr(unit, 'audio-1'),
      'audio_2': this.attr(unit, 'audio-2'),
      'answer_correct_audio': this.attr(unit+' ion-grid', 'choice-correct-answer'),
      'answer_wrong_audio': this.attr(unit+' ion-grid', 'choice-wrong-answer'),
      'choice_1_audio': this.attr(unit+' [choice-1-audio]', 'choice-1-audio'),
      'choice_2_audio': this.attr(unit+' [choice-2-audio]', 'choice-2-audio'),
      'choice_3_audio': this.attr(unit+' [choice-3-audio]', 'choice-3-audio'),
      'choice_4_audio': this.attr(unit+' [choice-4-audio]', 'choice-4-audio'),
    }

    console.group('Initialized UNIT DATA');
      console.log( "%cDisplaying UNIT: "+this.question_id, 'font-size: 20px;' );

      console.log( "%cAudio 1: "+this.content['audio_1'], 'font-size: 16px;' );
      console.log( "%cAudio 2: "+this.content['audio_2'], 'font-size: 16px;', );

      console.log( "%cCorrect Audio: "+this.content['answer_correct_audio'], 'font-size: 16px;' );
      console.log( "%cWrong Audio: "+this.content['answer_wrong_audio'], 'font-size: 16px;' );

      console.log( "%cChoice 1: "+this.content['choice_1_audio'], 'font-size: 16px;' );
      console.log( "%cChoice 2: "+this.content['choice_2_audio'], 'font-size: 16px;' );
      console.log( "%cChoice 3: "+this.content['choice_3_audio'], 'font-size: 16px;' );
      console.log( "%cChoice 4: "+this.content['choice_4_audio'], 'font-size: 16px;' );
    console.groupEnd();

    this.playQuestion();
  }

  private attr(parent, attr) {
    return document.querySelector(
      parent
    ).getAttribute(attr);
  }

  ionViewWillLeave() {
    // this._audioPlayer.unload();
  }

  private enableAnswerButton() {
    let waiting = setInterval(() => {
      if(this._audioPlayer.isFinishedPlaying == true) {
        console.log("Waiting for Audio Playback: Finished -> ", this._audioPlayer.isFinishedPlaying);
        this.isEnableAnswer = true;
        clearInterval(waiting);
      }else{
        console.log("Waiting for Audio Playback: Finished -> ", this._audioPlayer.isFinishedPlaying);
        this.isEnableAnswer = false;
      }
    }, 1000);
  }

  private playQuestion() {
    this.isEnableAnswer = false;
    let opt;

    if (this.content['audio_2'] != '') {
      opt = {
        u_id: 'Media1',
        path: this.assets[0].audio+this.content['audio_1']
      };
      this._audioPlayer.play(opt);

      let waiting = setInterval(() => {
        if(this._audioPlayer.isFinishedPlaying == true) {
          clearInterval(waiting);
          opt = {
            u_id: 'Media2',
            path: this.assets[0].audio+this.content['audio_2']
          };
          this._audioPlayer.play(opt);
          this.enableAnswerButton();
        }
      }, 1000);
    }else{
      opt = {
        u_id: 'Media1',
        path: this.assets[0].audio+this.content['audio_1']
      };
      this._audioPlayer.play(opt);
      this.enableAnswerButton();
    }

    console.log('Media1', this.assets[0].audio+this.content['audio_1']);
    console.log('Media2', this.assets[0].audio+this.content['audio_2']);
  }

  public replay() {
    if (this._audioPlayer.isFinishedPlaying == true) {
      this._audioPlayer.unload();
    }
    this.playQuestion();
  }


  public answer(correct, choice) {
    if (this.isEnableAnswer == false || this.isNextButton == true) {
      return false;
    }

    this.isEnableAnswer = false;
    this._render(choice);

    let opt;
    if (this.content['choice_'+choice+'_audio'] != '') {
      opt = {
        u_id: 'Media1',
        path: this.assets[0].audio+this.content['choice_'+choice+'_audio']
      };
      this._audioPlayer.play(opt);
    }

    if(correct == choice){
      console.log("Answer Is Correct!");
      opt = {
        u_id: 'Media2',
        path: this.assets[0].audio+this.content['answer_correct_audio']
      };
    }else {
      console.log("Answer Is Incorrect!");
      opt = {
        u_id: 'Media2',
        path: this.assets[0].audio+this.content['answer_wrong_audio']
      };
    }

    let waiting = setInterval(() => {
      if(this._audioPlayer.isFinishedPlaying == true) {
        clearInterval(waiting);
        this._audioPlayer.play(opt);
        setTimeout(() => {
          if(correct == choice){
            this.isNextButton = true;
          }else{
            this._render(99);
            this.isNextButton = false;
            this.isEnableAnswer = true;
          }
        }, 1500);
      }
    }, 1000);
  }

  public question_next(_id) {
    console.log("this._question_length", this._question_length);
    this._audioPlayer.unload();
    this._route.go(
      QuestionPage, {
        _id: _id
      }
    );
  }

  private _render(choice) {
    // Is use for Enable / Disable Element on the HTML Page
    switch(choice) {
      case 1:
        this.isChoice2 = false;
        this.isChoice3 = false;
        this.isChoice4 = false;
        console.log("_render(choice) -> ", choice);
        break;
      case 2:
        this.isChoice1 = false;
        this.isChoice3 = false;
        this.isChoice4 = false;
        console.log("_render(choice) -> ", choice);
        break;
      case 3:
        this.isChoice1 = false;
        this.isChoice2 = false;
        this.isChoice4 = false;
        console.log("_render(choice) -> ", choice);
        break;
      case 4:
        this.isChoice1 = false;
        this.isChoice2 = false;
        this.isChoice3 = false;
        console.log("_render(choice) -> ", choice);
        break;
      case 0:
        this.isChoice1 = false;
        this.isChoice2 = false;
        this.isChoice3 = false;
        this.isChoice4 = false;
        this.isWidth100 = null;
        console.log("_render(choice) -> ", choice);
        return true;
      case 99:
        this.isChoice1 = true;
        this.isChoice2 = true;
        this.isChoice3 = true;
        this.isChoice4 = true;
        this.isWrap = true;
        this.isWidth100 = null;
        this.isWidth50 = true;
        console.log("_render(choice) -> ", choice);
        return true;
    }

    this.isWidth100 = true;
    this.isWidth50 = null;
    this.isWrap = null;
    this.isFlex = null;
    console.log("_render(choice) -> Ending", choice);
  }

  public popToRoot() {
    if (this.isEnableAnswer == false ) {
      return false;
    }
    this._route.popToRoot();
  }

  public exit() {
    this._toolbar.exit();
  }

}
