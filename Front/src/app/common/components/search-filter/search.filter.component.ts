import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-search-filter',
    templateUrl: './search.filter.component.html',
    styleUrls: ['search.filter.component.css'],
})
export class SearchFilterComponent implements OnInit{
    @Input('title') title!: string;
    @Input('palceHolder') palceHolder!: string;
    @Input() model: any;


    @Output('onSearchClick') onSearchClick: EventEmitter<any> =
    new EventEmitter<any>();
    @Output() modelChange = new EventEmitter<string>();
    
   constructor(){}
    ngOnInit(): void {
    }

    onModelChange(value: string) {
    this.model = value;
    this.modelChange.emit(value);
    }

    clearInput() {
    this.model = '';
    this.modelChange.emit(this.model);
    this.onSearchClick.emit();
    }
}