import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { BmiNavigationItem } from '@bmi/components/navigation';
import { BmiMockApiService } from '@bmi/lib/mock-api';
import { influencerNavigation, brandNavigation } from 'app/mock-api/common/navigation/data';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi {
    private readonly _influencerNavigation: BmiNavigationItem[] = influencerNavigation;
    private readonly _brandNavigation: BmiNavigationItem[] = brandNavigation;
    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: BmiMockApiService,
        private _userService: UserService
    ) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                // Return the response
                return [
                    200,
                    {
                        influencer: cloneDeep(this._influencerNavigation),
                        brand: cloneDeep(this._brandNavigation)
                    }
                ];
            });
    }
    
}
