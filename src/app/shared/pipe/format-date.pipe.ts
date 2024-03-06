import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string | undefined): string {

    if(!value) return ""

    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque getMonth() retorna 0-11
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

}
