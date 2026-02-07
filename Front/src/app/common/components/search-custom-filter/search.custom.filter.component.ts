import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from "@angular/core";
import { SearchCustomFilterModel, initialSearchFilter } from "../model/search.custom.filter";
import { formatDate } from "@angular/common";

@Component({
    selector: 'app-search-custom-filter',
    templateUrl: './search.custom.filter.component.html',
    styleUrls: ['search.custom.filter.component.css'],
})
export class SearchCustomFilterComponent implements OnInit{
    @Input('title') title!: string;
    @Input('palceHolder') palceHolder!: string;
    @Input() model: SearchCustomFilterModel = this.resetSearchFilter();


    @Output('onSearchCustomClick') onSearchCustomClick: EventEmitter<any> =
    new EventEmitter<any>();
        
   constructor(@Inject(LOCALE_ID) public locale: string){}

    ngOnInit(): void {
    }  

    resetSearchFilter(): SearchCustomFilterModel {
    return { ...initialSearchFilter };
    }

    formaterDate(date: string | number | Date): string {
        return formatDate(date, 'YYYY-MM-dd', this.locale);
      }
    
    dateChange(date: any): void {
      if (date) {
        this.model.filter.date = this.formaterDate(date)
      } else {
        this.model.filter.date = ''
      }
    }
}