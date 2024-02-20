import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      item.project_name.toLowerCase().includes(searchTerm) ||
      item.person_full_name.toLowerCase().includes(searchTerm) ||
      item.status_project.toLowerCase().includes(searchTerm)
    );
  }
}
