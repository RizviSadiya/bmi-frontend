import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSuff'
})
export class ThousandSuffixesPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    var exp, rounded, suffixes = ['K', 'M', 'B', 'T', 'AA', 'AB'];
    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));
    // return (input / Math.pow(1000, exp)).toFixed(args+1).slice(0, (args*-1)) + suffixes[exp - 1]; 
    return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }
}