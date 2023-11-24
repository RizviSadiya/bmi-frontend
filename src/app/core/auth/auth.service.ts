import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../user/user.types';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(this._userService.user);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}login`, credentials).pipe(
            switchMap((response: any) => {
                if (response.payload.status == 1) {
                    // Store the access token in the local storage
                    this.accessToken = response.payload.access_token;
                    // // Set the authenticated flag to true
                    this._authenticated = true;
                    // // Store the user on the user service
                    this._userService.user = response.payload;
                    this._userService.userDetails = response.payload;
                    localStorage.setItem('userName',JSON.stringify(response.payload.fullname))
                } else {
                    localStorage.setItem('accessToken', response.payload.access_token);
                    localStorage.setItem('userDetails', JSON.stringify(response.payload));
                    localStorage.setItem('userName',JSON.stringify(response.payload.fullname))
                    this._authenticated = false;
                }
                // // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                if (response) {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;
                }
                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userDetails');
        localStorage.clear();
        this._userService.user = null;
        this._userService.userDetails = null;

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUpPhaseOne(payload: any): Observable<any> {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}signup`, payload).pipe(
            switchMap((response: any) => {
                if (response.payload) {
                    if(response.payload.access_token){
                    localStorage.setItem('accessToken', response.payload.access_token);
                    }
                    // localStorage.setItem('accessToken', response.payload.access_token);
                    localStorage.setItem('userDetails', JSON.stringify(response.payload));
                    this._authenticated = false;
                }
                return of(response);
            })
        );
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUpPhaseTwo(payload: any): Observable<any> {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}signup-phase-two`, payload).pipe(
            switchMap((response: any) => {
                console.log(response.payload);
                if (response.payload.userType === 'influencer') {
                    this._userService.userDetails = response.payload;
                    this.accessToken = response.payload.access_token;
                    this._authenticated = true;
                    this._userService.user = response.payload;
                } else {
                    localStorage.setItem('accessToken', response.payload.access_token);
                    this._authenticated = false;
                    localStorage.setItem('userDetails', JSON.stringify(response.payload));
                }
                return of(response);
            })
        );
    }

    getUserInfo(email) {
        return this._httpClient.post(environment.API_BASE_ENDPOINT+ environment.PUBLIC_URL+'get-user-info',email)
    }
    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        } else {
            let userStatus = JSON.parse(localStorage.getItem("userDetails")) ? JSON.parse(localStorage.getItem("userDetails")).status : 0;
            if (userStatus == 0) {
                return of(false);
            }
        }
        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    loginWithGoogle() { 
        this.document.location.replace(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}social/login/google`);
        // return this._httpClient.get(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}social/login/google`);
    }

    // emailVerification(payload: any) {
    //     return this._httpClient.get(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}email-verification`, payload);
    // }
    instaCodeRedirect(payload) {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}instagram/callback`,payload);
    }

    emailVerification(id, hash) {
        return this._httpClient.get(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL_V2}email-verification/${id}/${hash}`);
    }

    submitContactForm(payload: any) {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}save-contact`, payload);
    }

    forgotpasswordemail(payload: any) {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}forgot-password`, payload);
    }

    passwordreset(payload: any) {
        return this._httpClient.post(`${environment.API_BASE_ENDPOINT + environment.PUBLIC_URL}update-password`, payload);
    }
}
