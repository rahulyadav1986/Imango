import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from 'src/app/model/Response';
import { IonContent } from '@ionic/angular';
import { Comment } from 'src/app/model/comment.model';
import { FilterCriteria } from 'src/app/model/FilterCriteria';
import { User } from 'src/app/Model/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  comments: Comment[] = [];

  currentUser: User;
  incidentId: number;
  newMsg: '';
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private _userService: UserService,
    private _authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['incidentId'];
      this.incidentId = parseInt(params['incidentId']);
      // console.log(`${id}`);
      // need user service and session
      this._authService.getCurrentUser()
      .subscribe((res: any) => {
        console.log(res);
        this.currentUser = JSON.parse(res.value);
      });
      this.loadData(id);

      this.chatService.retrieveMappedObject().subscribe(
        (receivedObj: Comment) => {
          this.addToInbox(receivedObj);
        });
    });
  }

  addToInbox(obj: Comment) {
    if(this.incidentId === obj.incidentId)
      this.comments.push(obj);

    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 200);
  }

  loadData(id: number) {
    let criteria = new FilterCriteria<number>();
    criteria.pageNumber = 1;
    criteria.filter = id;
    this._userService.getComments(criteria).subscribe((res: Response<Comment[]>) => {
      if (res.success && res.data.length > 0)
        this.comments.push(...res.data);

        setTimeout(() => {
          this.content.scrollToBottom(200);
        }, 200);
    });
  }

  sendMessage(message: string) {
    let comment = {
      id: 2,
      author: {
        id: this.currentUser.id,
        name: this.currentUser.userName,
        imageUrl: this.currentUser.imageUrl
      },
      createDate: new Date(),
      detail: this.newMsg,
      disabled: false,
      incidentId: this.incidentId
    };
    this.chatService.broadcastMessage(comment);

    this.newMsg = '';
  }
}
