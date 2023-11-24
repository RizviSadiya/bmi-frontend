import { Component } from '@angular/core';
import { Subscription } from "rxjs";
import { debounceTime } from 'rxjs/operators';

import { LoaderService } from 'app/core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  loading: boolean = true;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    // this.loadingSubscription = this.loaderService.loadingStatus.pipe(
    //   debounceTime(200)
    // ).subscribe((value) => {
    //   this.loading = value;
    // });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
