import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';



@Injectable({
    providedIn: 'root'
})

export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    subject = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Setter & getter for user details
     */
    set userDetails(value: User) {
        localStorage.setItem('userDetails', JSON.stringify(value));
    }

    get userDetails(): User {
        let userDetails = JSON.parse(localStorage.getItem('userDetails') ?? '');
        this._user.next(userDetails);
        return userDetails;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        // return this._user.asObservable();
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    updateUserDetailsInLocalStorage(key: string, value: string) {
        let currentUser = JSON.parse(localStorage.getItem("userDetails"));
        currentUser[key] = value;
        localStorage.setItem('userDetails', JSON.stringify(currentUser));
        this._user.next(currentUser);
    }

    brandObj:any
    setData(obj){
        this.brandObj=obj
       
    }

    getData(){
        return this.brandObj
    }

    inviteList:any
    setinviteList(obj){
        this.inviteList=obj

    }

    getinviteList(){
        return this.inviteList
    }

    
    listArray:any
    listname:any
    setListData(list){
        this.listArray=list
      

    }

    getListData(){


    return this.listArray
    }

    setListname(x){
      
        this.listname=x

    }

    getListname(){


    return this.listname
    }
}
