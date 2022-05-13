import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
// import signalR
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Comment } from 'src/app/model/comment.model';
import { Urls } from 'src/app/model/Constant';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: any = new signalR.HubConnectionBuilder().withUrl(`${Urls.Base}chatsocket`)
  .withAutomaticReconnect()   // mapping to the chathub as in startup.cs
    .configureLogging(signalR.LogLevel.Information)
    .build();
  readonly POST_URL = `${Urls.BaseApi}chat/sendComment`

  private receivedMessageObject: Comment = new Comment();
  private sharedObj = new Subject<Comment>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on("ReceiveOne", (comment) => { this.mapReceivedMessage(comment); });
    this.start();
  }


  // Strart the connection
  public async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(comment: Comment): void {
    this.receivedMessageObject = comment;
    this.sharedObj.next(this.receivedMessageObject);
  }

  public broadcastMessage(comment: Comment) {
    const params = new HttpParams().set('req', JSON.stringify(comment));
    this.http.post(this.POST_URL, null, {
      headers: new HttpHeaders()
        .set('accept', 'application/json'),
      params: params,
      responseType: 'json'
    }).subscribe(data => {
      console.log(data)
    });
  }

  public retrieveMappedObject(): Observable<Comment> {
    return this.sharedObj.asObservable();
  }
}
