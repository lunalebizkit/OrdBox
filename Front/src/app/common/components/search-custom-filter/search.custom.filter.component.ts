import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from "@angular/core";
import { SearchCustomFilterModel, initialSearchFilter } from "../model/search.custom.filter.model";
import { formatDate } from "@angular/common";
import { FormGroup } from "@angular/forms";
@Component({
  selector: 'app-search-custom-filter',
  templateUrl: './search.custom.filter.component.html',
  styleUrls: ['search.custom.filter.component.css'],
})
export class SearchCustomFilterComponent implements OnInit {
  @Input() customSearchForm!: FormGroup;

  @Output('onSearchCustomClick') onSearchCustomClick: EventEmitter<any> =
    new EventEmitter<any>();

  datetime!: Date | null;

  constructor(@Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
  }
  
  clearFormValue(formControl: string) {
  this.customSearchForm.get(formControl)?.setValue(null);
  this.onSearchCustomClick.emit(this.customSearchForm.value);
  }
}