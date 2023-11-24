import { NgModule } from '@angular/core';
import { ThousandSuffixesPipe } from './thousand-suffix.pipe';
import { SearchPipe } from './search.pipe';
import { safe } from './html.pipe';

@NgModule({
    imports: [],
    declarations: [
        ThousandSuffixesPipe,
        SearchPipe,
        safe
    ],
    exports: [
        ThousandSuffixesPipe,
        SearchPipe,
        safe
    ]
})
export class PipesModule { }