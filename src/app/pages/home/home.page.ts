import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import { Response } from 'src/app/model/Response';
import { Router } from '@angular/router';
import { FilterCriteria } from 'src/app/model/FilterCriteria';
import { Incident } from 'src/app/model/incident.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data: any[] = [];

  constructor(
    private _userService: UserService,
    private authService: AuthenticationService, private router: Router
  ) {
  }

  ngOnInit(): void {
    // this.loadData(null);
    this.appendItems(20);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.data.length === 1000) {
        event.target.disabled = true;
      } else {
        this.appendItems(20);
      }
    }, 1000);
  }

  appendItems(amount: number) {
    let criteria = new FilterCriteria<Incident>();
    criteria.pageNumber = 1;
    criteria.pageSize = amount;
    criteria.lastId = this.data[this.data.length - 1]?.id;
    this._userService.getIncidents(criteria).subscribe((res: Response<Incident[]>) => {
      if(res.success && res.data.length > 0)
        this.data.push(...res.data);
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  likeIncident(id: number) {
    console.log("incident liked: " + id);
    this.toggleIncidentLiked(id);
  }

  toggleIncidentLiked(id: number) {
    let incident = this.data.find(i => i.id == id);
    incident.likedByCurrentUser = !incident.likedByCurrentUser;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
