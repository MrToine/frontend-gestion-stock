import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input()
  total: number = 0;

  @Input()
  size: number = 20;

  @Input()
  currentPage: number = 1;

  get lastPage(): number  {
    return Math.ceil(this.total / this.size);
  }

  currentPageChange = output<number>();

  getPages() {
    const result: any[] = [];
    const start = this.currentPage - 5;
    const first = start <= 0 ? 1 : start;
    const last = Math.ceil(this.total / this.size);

    for(let i = first; i < this.currentPage; i++) {
      result.push(i);
    }

    for(let i = this.currentPage; 
      i <= this.currentPage + 5 && i <= last;
      i++
    ) {
      result.push(i);
    }

    return result;
  }

  changePage(page: number) {
    this.currentPageChange.emit(page);
  }
}
