import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, share, switchMap, take, tap } from 'rxjs/operators';

import { Campaign } from 'app/modules/admin/apps/campaigns/campaigns.types';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../../../environments/environment';
import { Channel } from 'app/layout/common/channel/all-channels.types';
// import { AuthService } from '../../../../../../../../../auth/auth.service';
import { AuthService } from 'app/core/auth/auth.service';
import { shareReplay } from 'rxjs/operators';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ApplicationsService } from '../applications/applications.service';
@Injectable({
    providedIn: 'root'
})
export class CampaignsService {
    // Private
    private _campaign: BehaviorSubject<Campaign | null> = new BehaviorSubject(null);
    private _campaigns: BehaviorSubject<Campaign[] | null> = new BehaviorSubject(null);
    private _draftCampaigns: BehaviorSubject<Campaign[] | null> = new BehaviorSubject(null);
    private _totalCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalcount: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _allCampaignsCount: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _liveCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _invitedCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalPendingCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalRejectedCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalDraftCampaigns: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _channels: BehaviorSubject<Channel[] | null> = new BehaviorSubject(null);
    private _campaignResponse: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _totalResponses: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalpendings: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _shortlistedResponses: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _totalMessages: BehaviorSubject<number | 0> = new BehaviorSubject(null);
    private _saveButtonClicked: BehaviorSubject<boolean | false> = new BehaviorSubject(null);
    private nextRouteSelectedBeforeSave: string = null;
    private authservice:AuthService;

    /**
     * Constructor
     */
    plateform_type:any
    constructor(
        private _userService: UserService,
        private _httpClient: HttpClient,
        private navigation: NavigationService,
      
    ) {
        console.log("INFLUENCER_URL",environment.INFLUENCER_URL);
      let urls=  this.navigation.get_url()
      console.log("urls",urls);

      
    }

   

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get campaign$(): Observable<Campaign> {
        return this._campaign.asObservable();
    }

    /**
     * Getter for contacts
     */
    get campaigns$(): Observable<Campaign[]> {
        return this._campaigns.asObservable();
    }

    get draftCampaigns$(): Observable<Campaign[]> {
        return this._draftCampaigns.asObservable();
    }

    get totalCampaigns$(): Observable<number> {
        return this._totalCampaigns.asObservable();
    }

    get totalCampaignsCount$(): Observable<number> {
        return this._totalcount.asObservable();
    }

    get allCampaignsCount$(): Observable<number> {
        return this._allCampaignsCount.asObservable();
    }

    get liveCampaignsCount$(): Observable<number> {
        return this._liveCampaigns.asObservable();
    }

    get invitedCampaignsCount$(): Observable<number> {
        return this._invitedCampaigns.asObservable();
    }

    get totalPendingCampaigns$(): Observable<number> {
        return this._totalPendingCampaigns.asObservable();
    }

    get totalRejectedCampaigns$(): Observable<number> {
        return this._totalRejectedCampaigns.asObservable();
    }

    get totalDraftCampaigns$(): Observable<number> {
        return this._totalDraftCampaigns.asObservable();
    }

    get channels$(): Observable<Channel[]> {
        return this._channels.asObservable();
    }

    /**
     * Getter for application response
     */
    get campaignResponse$(): Observable<any[]> {
        return this._campaignResponse.asObservable();
    }

    get totalResponses$(): Observable<number> {
        return this._totalResponses.asObservable();
    }

    get totalPendings$(): Observable<number> {
        return this._totalpendings.asObservable();
    }

    get shortlistedResponses$(): Observable<number> {
        return this._shortlistedResponses.asObservable();
    }

    get totalMessages$(): Observable<number> {
        return this._totalMessages.asObservable();
    }

    setSaveButtonClicked$(value: boolean) {
        this._saveButtonClicked.next(value);
        console.log("value");
        
    }

    get saveButtonClicked$(): Observable<boolean> {
        return this._saveButtonClicked.asObservable();
    }

    setNextRouteSelectedBeforeSave(route: string) {
        this.nextRouteSelectedBeforeSave = route;
        console.log("route",route);
        
    }

    getNextRouteSelectedBeforeSave() {
        return this.nextRouteSelectedBeforeSave;
    }

    setPlateForm(x){
        this.plateform_type=x
        console.log("plateform_type",this.plateform_type);
        
    }

    getPlateForm(){
        return this.plateform_type
    }

    campResourse:any
    setCampResource(z){
this.campResourse=z
    }

    getCampResource(){
        return this.campResourse
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get campaigns
     */
    getCampaigns(body?): Observable<Campaign[]> {
        const userType = this._userService.userDetails.userType.toLowerCase();
        let payload = {
            "status": "",
            // "limit": "5",
            // "offset": "0"
            "page":"1",
            "perPage":"10",
            'plateform_type':'1'
        };
        const endpoint = userType === "brand"
            ? environment.API_BASE_ENDPOINT + environment.BRAND_URL + "campaign-list"
            : environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL + "get-campaign";
        return this._httpClient.post<Campaign[]>(`${endpoint}`, body ? body : payload).pipe(
                shareReplay(),
            tap((campaigns) => {
                if (campaigns["success"]) {
                    campaigns["payload"].campaign.forEach(element => {
                        element.isReadMore = true;
                    });
                    this._campaigns.next(campaigns["payload"].campaign);
                    this._draftCampaigns.next(campaigns["payload"].drafts);
                    this._totalCampaigns.next(campaigns["payload"].totalCount);
                    this._totalcount.next(campaigns["payload"].total);
                    this._allCampaignsCount.next(campaigns["payload"].allCampaignsCount);
                    this._liveCampaigns.next(campaigns["payload"].liveCount);
                    this._invitedCampaigns.next(campaigns["payload"].InvitedCount);
                    this._totalPendingCampaigns.next(campaigns["payload"].pendingCount);
                    this._totalRejectedCampaigns.next(campaigns["payload"].rejectCount);
                    this._totalDraftCampaigns.next(campaigns["payload"].draftCount);
                } else {
                    this._campaigns.next(null);
                    this._draftCampaigns.next(null);
                    this._totalCampaigns.next(null);
                    this._totalcount.next(null);
                    this._allCampaignsCount.next(null);
                    this._liveCampaigns.next(null);
                    this._invitedCampaigns.next(null);
                    this._totalPendingCampaigns.next(null);
                    this._totalRejectedCampaigns.next(null);
                    this._totalDraftCampaigns.next(null);
                }
            })
        );
    }

    getDraftCampaigns(body?): Observable<Campaign[]> {
        const userType = this._userService.userDetails.userType.toLowerCase();
        const endpoint = userType === "brand"
            ? environment.API_BASE_ENDPOINT + environment.BRAND_URL + "campaign-list"
            : environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL + "get-campaign";
        return this._httpClient.post<Campaign[]>(`${endpoint}`, body).pipe(shareReplay());
    }

    getInvitedCampaigns(body ?
        
        ): Observable<Campaign[]> {
        const userType = this._userService.userDetails.userType.toLowerCase();
        const endpoint = userType === "influencer"
            ? environment.API_BASE_ENDPOINT + environment.BRAND_URL + "invite-campaign-list"
            : environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL + "invitation-list";
        let payload = {
            "status": "2",
            // "limit": "",
            // "offset": ""
            "page":"1",
            "perPage":"10"
        };
        return this._httpClient.post<Campaign[]>(`${endpoint}`,body ? body : payload).pipe(
            shareReplay(),
            tap((campaigns) => {
                if (campaigns["success"]) {
                    campaigns["payload"].invitations.forEach(element => {
                        element.isReadMore = true;
                    });
                    // this._campaignResponse.next(campaigns["payload"].invitations);
                    this._campaigns.next(campaigns["payload"].invitations);
                    this._totalCampaigns.next(campaigns["payload"].totalCount);
                } else {
                    this._campaigns.next(null);
                    this._totalCampaigns.next(null);
                }
            })
        );
    }

    getCampaignInvitedList(campaignId): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}camp-invitations`,
            campaignId );
    }

    sendCampaignInvitation(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}send-invitation`, payload);
    }
    sendViewListInvitation(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}send-invite-list`, payload);
    }

    CampaignInvitation(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}invitation-list`, payload);
    }

    showSimilar(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}show-similar`, payload);
    }

    revealdChannel(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}revealed-channel-list`, payload);
    }



    getChannels(): Observable<Channel[]> {
        let payload={
            "page":1,
            "perPage":10,
            "plateform_type":this.plateform_type?.plateform_type
        }
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}channel-list`,payload).pipe(
            shareReplay(1),
            tap((response: any) => {
                this._channels.next(response.payload.channel_list);
            })
            
        );
    }

    getSuggestedChannelList(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}show-similar`, payload);
    }

    invoice_download(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}order-manual-pay-invoice`, payload);
    }

    getInvitedInfluencers(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}invite-influencers`, payload);
    }
    getDrafts(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}campaign-list`, payload).pipe(shareReplay(1));
    }

    sendWhatsappRequest(channel_id): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}whatsapp-request`, channel_id);
    }

    applyCampaign(campaign: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.INFLUENCER_URL}applied-campaign`, campaign);
    }

    getCategoryList(): Observable<any> {
        return this._httpClient.get<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}category-list`).pipe(
            shareReplay());
    }

    /**
     * Get campaign by id
     */
    getCampaignById(id: string): Observable<Campaign> {
        let user_url = this._userService.userDetails.userType.toLowerCase() === "brand"
            ? environment.BRAND_URL : environment.INFLUENCER_URL;
        let payload = { "id": id };
        return this._httpClient.post<Campaign[]>(`${environment.API_BASE_ENDPOINT + user_url}view-campaign`, payload).pipe(
            take(1),
            shareReplay(),
            tap((response: any) => {
                if (response.success) {
                    this._campaign.next(response["payload"]);
                    return response["payload"];
                } else {
                    return throwError('Could not found campaign with id of ' + id + '!');
                }
            })
        );
    }

    postCampaign(campaign: any, editMode: boolean): Observable<any> {
    
       
        console.log("service editmode",editMode);
        
        let base_url = environment.API_BASE_ENDPOINT + environment.BRAND_URL;
    if (editMode) {
            base_url += 'edit-campaign';
        } else {
            base_url += 'add-campaign';
        }
        console.log("campaign",campaign);
        
        if(campaign.camp_title !=null && campaign.camp_title===campaign.camp_title){
           
        return this._httpClient.post<any>(`${base_url}`, campaign);

        }
    }

    live_campData:any
    setLiveCampData(live){
        this.live_campData = live
    }

    getLiveCampData(){
        return this.live_campData
    }
  
    /**
     * Get application response by campaign id
     */
    getCampaignResponseById(id: string, status?,plateform_type?): Observable<any> {
        let payload
        console.log("plateform_type",plateform_type);
        console.log("this.plateform_type",this.plateform_type.plateform_type);
        
        if(!plateform_type){
             payload = {
                "camp_id": id,
               "page":1,
               "perPage":10,
                "status": status ? status : '',
                "plateform_type":this.plateform_type.plateform_type
            };
        }else{
         payload = {
            "camp_id": id,
           "page":1,
           "perPage":10,
            "status": status ? status : '',
            "plateform_type":plateform_type ?plateform_type:2
        };
    }
        return this._httpClient.post<any[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}application-responses`, payload).pipe(
            take(1),
            shareReplay(),
            tap((response: any) => {
                if (response.success) {
                    this._campaignResponse.next(response["payload"]);
                    this._totalResponses.next(response["payload"]?.totalCount);
                    this._totalpendings.next(response["payload"]?.pendingCount);
                    this._shortlistedResponses.next(response["payload"]?.shortlistCount);
                    this._totalMessages.next(response["payload"]?.messageCount);
                    return response["payload"];
                } else {
                    return throwError('Could not found application response with campaign id of ' + id + '!');
                }
            })
             
        );
    }

     hireChannel(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}hire-influencer`, payload);
    }

    ProposalHistroy(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}application-responses`, payload);
    }

    shotlistChannel(id: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}application-shortlist`, { "id": id });
    }

    ViewProposal(payload:any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}application-view`, payload).pipe(shareReplay(1));
    }
    // ViewProposal(id: any): Observable<any> {
    //     return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}application-view`, { "id": id }).pipe(shareReplay(1));
    // }

    DeleteProposal(payload: any): Observable<any> {
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}influencer/delete-application`,payload);
    }
    DeleteCampaign(id: any,obj): Observable<any> {

  
        return this._httpClient.post<any>(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}brand/delete-campaign`, { "id": id },obj);
    }

    getGraphData(payload): Observable<any> {
        return this._httpClient.post<Channel[]>(`${environment.API_BASE_ENDPOINT + environment.BRAND_URL}influencers-graph`, payload);
    }

similarData:any
similarCat:any
    setSimilardata(x:any){
        this.similarData=x;
    }

    getSimilardata(){
        return this.similarData 
    }

    setSimilarcatdata(y:any){
        this.similarCat=y;
    }

    getSimilarcatdata(){
        return this.similarCat;
    }

    channel:any
    application:any
    campaign:any
    test:any
    
    setHireapplicationData(application){
        this.application=application
        
    }

    setHirechannelData(channel){
       
        this.channel=channel
    }

    
    setHirecampaignData(campaign){
       
        this.campaign=campaign
    }

    setdemoData(test){
       
        console.log('test',test);
    }

    getHirechannelData(){
    
      return  this.channel;
      
    }

    getHireapplicationData(){
      return  this.application;

      
    }

    getHirecampaignData(){
        return  this.campaign;  
    }

    gettestData(){
        return  this.test;  
    }


}
