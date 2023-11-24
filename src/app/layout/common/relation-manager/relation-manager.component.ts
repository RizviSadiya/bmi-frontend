import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
    selector       : 'relation-manager',
    templateUrl    : './relation-manager.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationManager implements OnInit
{
    /**
     * Constructor
     */
    relationManager:any
    constructor()
    {
    }

    ngOnInit(): void {
        this.relationManager =JSON.parse(localStorage.getItem("relationship_manager")) 
        console.log("relationManager",this.relationManager);
        
    }
}
