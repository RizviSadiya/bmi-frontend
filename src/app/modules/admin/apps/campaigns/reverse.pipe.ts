import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform<T>(value: T[]): T[] {
    console.log('transform');
    return value.slice().reverse();
  }
}