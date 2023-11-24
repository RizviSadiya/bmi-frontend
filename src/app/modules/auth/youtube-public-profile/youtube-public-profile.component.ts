import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'app/modules/admin/pages/profile/profile.service';
import { UserService } from 'app/core/user/user.service';
import { Subject } from 'rxjs';

import { VerifyChannelPopupComponent } from 'app/layout/common/verify-channel-popup/verify-channel-popup.component';
import { NotificationService } from 'app/core/services/notification.service';

@Component({
  selector: 'app-youtube-public-profile',
  templateUrl: './youtube-public-profile.component.html',
  styleUrls: ['./youtube-public-profile.component.scss']
})
export class YoutubePublicProfileComponent implements OnInit {

  isReadMore: boolean = true;
  data: any = {
      profile_pic: "",
      title: "",
      description: "",
      subscriberCount: 0,
      viewCount: 0,
      videoCount: 0,
      averageView: 0,
      channel_link: "",
      facebook: "",
      instagram: ""
  };
  statsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  statsTableColumns: string[] = ['details', 'avgViews'];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userDetails: any;
  userType: string = "";
  channelId: string = "";
  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _sanitizer: DomSanitizer,
      private _matDialog: MatDialog,
      private _activatedRoute: ActivatedRoute,
      private _profileService: ProfileService,
      private _userService: UserService,
      private _notifyService: NotificationService
  ) {
  }

  ngOnInit(): void {
      // this.userDetails = this._userService.userDetails;
      // this.userType = this.userDetails.userType.toUpperCase();
      this.channelId = this._activatedRoute.firstChild?.snapshot.params['channel'];
      let uuId = this._activatedRoute.firstChild?.snapshot.params['uuid'];
      console.log(this.channelId);
      console.log('uuId',uuId);
  

      this._profileService.getpublicurlData(this.channelId,uuId).subscribe((data) => {
          // Store the data
          this.data = data.payload;

          this.statsDataSource.data = [
              {
                  details: '<strong>Top 5</strong> of last 10 videos',
                  avgViews: data.payload.last_10_views
              }, {
                  details: '<strong>Top 5</strong> of last 20 videos',
                  avgViews: data.payload.last_20_views
              }, {
                  details: '<strong>Top 5</strong> of last 30 videos',
                  avgViews: data.payload.last_30_views
              }, {
                  details: '<strong>Latest 5</strong> videos',
                  avgViews: data.payload.latest_5_views
              }, {
                  details: '<strong>Latest 10</strong> videos',
                  avgViews: data.payload.latest_10_views
              }, {
                  details: '<strong>Latest 30</strong> videos',
                  avgViews: data.payload.latest_30_views
              }
          ];
          this._changeDetectorRef.markForCheck();
      });

    
  }

  safeUrl(videoURL) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  showText() {
      this.isReadMore = !this.isReadMore;
  }

  trackByFn(index: number, item: any): any {
      return item.id || index;
  }

  openChannelVerification() {
      const verifyChannelPopup = this._matDialog.open(VerifyChannelPopupComponent, {
          maxHeight: '95vh',
          width: '80vw',
          autoFocus: true,
          disableClose: true,
          data: {
              channel: this.data
          }
      });

      verifyChannelPopup.afterClosed().subscribe(response => {
          // Verify Channel popup closed, Update the UI
          if (response.success) {
              if (this.data.id === response.payload.id) {
                  this.data.is_verified = 1;
              }
              this._notifyService.showSuccess(response.message, "");
              this._changeDetectorRef.markForCheck();
          }
      });
  }

}

