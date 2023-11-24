import { Injectable } from '@angular/core';
import { BmiDrawerComponent } from '@bmi/components/drawer/drawer.component';

@Injectable({
    providedIn: 'root'
})
export class BmiDrawerService
{
    private _componentRegistry: Map<string, BmiDrawerComponent> = new Map<string, BmiDrawerComponent>();

    /**
     * Constructor
     */h
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: BmiDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): BmiDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
