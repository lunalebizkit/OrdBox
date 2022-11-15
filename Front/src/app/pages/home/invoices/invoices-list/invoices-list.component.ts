import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
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
    pageSize:20
  };

      /*
  ** Constructor
  */
  constructor(private service: InvoiceService, 
    @Inject(LOCALE_ID) public locale: string) {}

    selectedIndex!: number; 
    selectedInvoice: any;
    productId!:number |null; 
    index!: number;
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

    onClick(datos:InvoiceModel, index:number): void {
      this.index= index;
      this.selectedIndex = index
      this.selectedInvoice = datos
      }  

      /*
  ** Evento de navegacion por teclado
  */
    myNavegation(event:any) {
      switch (event.key) {
        case "ArrowDown":
          let nextCell = this.invoicesList.length > this.selectedIndex ? ++ this.selectedIndex : this.invoicesList.length;
          if(this.invoicesList[nextCell] !== undefined){
            this.selectedInvoice= this.invoicesList[nextCell];
            this.index= nextCell;
            document.getElementById(nextCell.toString())?.focus()          
        } 
          break; 
        case "ArrowUp":
          let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
          if (this.invoicesList[previousCell] !== undefined ){
            this.selectedInvoice= this.invoicesList[previousCell];
            this.index = previousCell;
            document.getElementById(previousCell.toString())?.focus()
        }
          break 
      } 
    }

      /*
  ** Evento scroll infinito con llamada a la api
  */
    onScroll(event:any): void { 
      let scrollHeight= event.target.scrollHeight;
      let scrolltop= event.target.scrollTop;
      let client= event.target.clientHeight
      let ScrollPosition= Math.abs(Math.round(scrollHeight - (scrolltop + client)));
      if((ScrollPosition <=5 ) && (this.totalItems / this.queryParams.page) > this.queryParams.page){ 
        let page= this.queryParams.page;
        this.queryParams.page = this.queryParams.page +1; 
        if(this.totalItems === undefined ||(this.queryParams.page * this.queryParams.pageSize <= this.totalItems)){ 
          this.service.getInvoices(this.queryParams)
          .subscribe({
            next:(r)=>{
              r.data.map((invoice: InvoiceModel)=>
              this.invoicesList.push(invoice))  
              this.loading= false 
            },
            error: ()=>{  this.loading = false;
            this.invoicesList= [];}
          }) 
        }else{
          this.queryParams.page = page;  
        }
      }
    };

  }