import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { InvoiceService } from '../invoices.service';
import { eInvoiceType } from '../model/invoice-type.Enum';
import { InvoiceModel, } from '../model/invoice.model';
import { formatCurrency, formatDate } from '@angular/common';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrls: ['./invoices-list.component.css']
  })
  export class InvoicesListComponent implements OnInit {

  /*
  ** Catidad total de entidades
  */
 
  totalItems!: number;
  /*
  ** Indicador de carga de la grilla
  */
  loading = false;
  /*
  ** Lista de Productos
  */
  invoicesList: InvoiceModel []= [];
    /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 50
  };

      /*
  ** Constructor
  */
  constructor(private service: InvoiceService, 
    @Inject(LOCALE_ID) public locale: string) {}
 /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {
     this.getData(this.queryParams);
  }
  /*
  ** Evento al presionar buscar o presionar enter
  */
  search(): void {
    this.queryParams.page = 0;
     this.getData(this.queryParams);
  };
  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
    //  this.getData(this.queryParams);
  };
    /*
  ** Evento de busqueda datos en el server
  */
 
  getData(params: any): void {
    this.loading = true;
    this.service.getInvoices(params).subscribe({
      next: (r)=>{
        this.invoicesList= r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.invoicesList = [];
      }
    })};
    
    getInvoiceType(id:number) {
      return eInvoiceType[id];
    };

    formaterDate(date: string| number| Date):string {
      return formatDate( date, 'YYYY-MM-dd', this.locale)
    };
    
    currencyFormat(data: any):string  { 
      if(!this.locale) return '';
      return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
    }

  }