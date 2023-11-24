import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Brands } from 'app/layout/common/brands/brands.types';

@Injectable({
    providedIn: 'root'
})
export class BrandsService
{
    // Private
    private _brands: BehaviorSubject<Brands[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for tags
     */
    get brands$(): Observable<Brands[]>
    {
        return this._brands.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Brands
     */
    getBrands(): Observable<Brands[]>
    {
        return this._httpClient.get<Brands[]>('api/dashboards/project').pipe(
            tap((response: any) => {
                this._brands.next(response);
            }),
            shareReplay()
        );
    }

    /**
     * Update the brand
     *
     * @param id
     * @param brand
     */
    updateBrand(id: string, brand: Brands): Observable<Brands>
    {
        return this.brands$.pipe(
            take(1),
            shareReplay(),
            switchMap(brands => this._httpClient.patch<Brands>('api/apps/tasks/tag', {
                id,
                brand
            }).pipe(
                map((updatedBrand) => {

                    // Find the index of the updated brand
                    const index = brands.findIndex(item => item.id === id);

                    // Update the brands
                    brands[index] = updatedBrand;

                    // Update the brands
                    this._brands.next(brands);

                    // Return the updated brands
                    return updatedBrand;
                })
            ))
        );
    }
}
