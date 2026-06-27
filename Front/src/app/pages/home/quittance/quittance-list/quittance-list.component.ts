import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, formatDate } from '@angular/common';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { quittanceModel } from '../model';
import { QuittanceService } from '../quittance.service';
import { Router } from '@angular/router';
import { QuittanceViewDrawerComponent } from '../quittance-view-drawer/quittance-view-drawer.component';
import { parseFilterCustomSeachData, resetQuerySearchFilter, SearchCustomFilterModel } from 'src/app/common/components/model/search.custom.filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quittance-list',
  templateUrl: './quittance-list.component.html',
  styleUrls: ['./quittance-list.component.css'],
})
export class QuittanceListComponent implements OnInit {
  customQSearchForm!: FormGroup;
  permissions = Permission;
  dia:any;
  index!: number;
  id!: number;
  dato!: any
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
  quittanceList: quittanceModel[] = [];
  /*
   ** Parametros de busqueda
   */
  queryParams: SearchCustomFilterModel = resetQuerySearchFilter();  

  /*
   ** Constructor
   */
  constructor(
    private service: QuittanceService,
    private router: Router,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService,
    private fb: FormBuilder
  ) { this.customQSearchForm = this.fb.group({
      cuit: [''],
      customerName: [''],
      invoicenumber: [0],
      date: [null]  
    })}

  selectedIndex!: number;
  selectedQuittance: any;

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
    this.getData(this.queryParams);
    this.queryParams.page = 0;
    this.queryParams.pageSize = 20; 

  }
  /*
   ** Evento de busqueda datos en el server
   */

  getData(params: any): void {
    this.loading = true;
    let loadedparams = parseFilterCustomSeachData(params, this.customQSearchForm, this.locale);
    this.service.getQuittance(loadedparams).subscribe({
      next: (r) => {
        this.quittanceList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedQuittance = this.quittanceList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.quittanceList = [];
      },
    });
  }


  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'YYYY-MM-dd', this.locale);
  }
 
  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }

  onDoubleClicked(datos: quittanceModel) {
    this.id = datos.id;
    this.openComponentQuittanceView();
  }

  onClick(datos: quittanceModel, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedQuittance = datos;
  }

  onEnter(id: any) {
    this.selectedQuittance = this.quittanceList[this.index];
    this.id = this.quittanceList[this.index].id;
    this.router.navigate(['/home/quittance/edit', this.id]); 
  }

  /*
   ** Evento de navegacion por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.quittanceList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.quittanceList.length;
        if (this.quittanceList[nextCell] !== undefined) {
          this.selectedQuittance = this.quittanceList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.quittanceList[previousCell] !== undefined) {
          this.selectedQuittance = this.quittanceList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  /*
   ** Evento scroll infinito con llamada a la api
   */
  onScroll(event: any): void {
    let scrollHeight = event.target.scrollHeight;
    let scrolltop = event.target.scrollTop;
    let client = event.target.clientHeight;
    let ScrollPosition = Math.abs(
      Math.round(scrollHeight - (scrolltop + client))
    );
    if (
      ScrollPosition <= 5 &&
      this.totalItems / this.queryParams.page > this.queryParams.page
    ) {
      let page = this.queryParams.page;
      this.queryParams.page = this.queryParams.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryParams.page * this.queryParams.pageSize <= this.totalItems
      ) {
        this.service.getQuittance(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((quittance: quittanceModel) =>
              this.quittanceList.push(quittance)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.quittanceList = [];
          },
        });
      } else {
        this.queryParams.page = page;
      }
    }
  }

  openComponentQuittanceView(): void {
    const drawerRefCustomer = this.drawerService.create<
      QuittanceViewDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: QuittanceViewDrawerComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
  }

  reimprimirQuittance(id:number):void{
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `Recibo_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.ReprintQuittance(id).subscribe({
      next:(r)=>{  this.downloadFile(r, fileName);}
      
    });
  }

  downloadFile(response: any, fileName: string){
    const dataType= response.type;
    const binaryData = [];

    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}))
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
   
}


  

