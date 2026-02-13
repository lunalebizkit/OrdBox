import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { deliveryNotesService } from '../deliveryNotes.service';
import { DeliveryNotesModel } from '../model/deliveryNotes.model';
import { formatCurrency, formatDate } from '@angular/common';
import { DeliveryNotesViewDrawerComponent } from '../deliveryNotes-view-drawer/deliveryNotes-view-drawer.component';
import { pStatusType } from '../model/status.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { parseFilterCustomSeachData, resetQuerySearchFilter, SearchCustomFilterModel } from 'src/app/common/components/model/search.custom.filter.model';

@Component({
  selector: 'app-deliveryNotes-list',
  templateUrl: './deliveryNotes-list.component.html',
  styleUrls: ['./deliveryNotes-list.component.css'],
})
export class DeliveryNotesListComponent implements OnInit {

  customDNSearchForm!: FormGroup;
  permissions = Permission;
  dia:any;
  index!: number;
  id!: number;
  dato!: any
  /*
   ** Cantidad total de remitos
   */

  totalItems!: number;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  /*
   ** Lista de Remitos
   */
  deliveryNotesList: DeliveryNotesModel[] = [];
  /*
   ** Parametros de busqueda
   */
  queryParams: SearchCustomFilterModel = resetQuerySearchFilter();
  
  constructor(
    private service: deliveryNotesService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService,
    private router: Router,
    private fb: FormBuilder, 
  ) { this.customDNSearchForm = this.fb.group({
      cuit: [''],
      customerName: [''],
      invoicenumber: [0],
      date: [null]  
    })}

  selectedIndex!: number;
  selectedDeliveryNotes: any;
    ngOnInit(): void {
        this.getData(this.queryParams)
    }

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
      let loadedparams = parseFilterCustomSeachData(params, this.customDNSearchForm, this.locale);
      this.service.getDeliveryNotes(loadedparams).subscribe({
        next: (r) => {
          this.deliveryNotesList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedDeliveryNotes = this.deliveryNotesList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        },
        error: () => {
          this.loading = false;
          this.deliveryNotesList = [];
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
  
    onDoubleClicked(datos: DeliveryNotesModel) {
      this.id = datos.id;
      this.openComponentDeliveryNotesView();      
    }
  
    onClick(datos: DeliveryNotesModel, index: number): void {
      this.index = index;
      this.selectedIndex = index;
      this.selectedDeliveryNotes = datos;
    }
  
    onEnter(id: any) {
      this.selectedDeliveryNotes = this.deliveryNotesList[this.index];
      this.id = this.deliveryNotesList[this.index].id;
      this.router.navigate(['/home/deliveryNotes/edit', this.id]); 
    }
   
  
    /*
     ** Evento de navegacion por teclado
     */
    myNavegation(event: any) {
      switch (event.key) {
        case 'ArrowDown':
          let nextCell =
            this.deliveryNotesList.length > this.selectedIndex
              ? ++this.selectedIndex
              : this.deliveryNotesList.length;
          if (this.deliveryNotesList[nextCell] !== undefined) {
            this.selectedDeliveryNotes = this.deliveryNotesList[nextCell];
            this.index = nextCell;
            document.getElementById(nextCell.toString())?.focus();
          }
          break;
        case 'ArrowUp':
          let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
          if (this.deliveryNotesList[previousCell] !== undefined) {
            this.selectedDeliveryNotes = this.deliveryNotesList[previousCell];
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
          this.service.getDeliveryNotes(this.queryParams).subscribe({
            next: (r) => {
              r.data.map((deliveryNotes: DeliveryNotesModel) =>
                this.deliveryNotesList.push(deliveryNotes)
              );
              this.loading = false;
            },
            error: () => {
              this.loading = false;
              this.deliveryNotesList = [];
            },
          });
        } else {
          this.queryParams.page = page;
        }
      }
    }

    openComponentDeliveryNotesView(): void {
      const drawerRefCustomer = this.drawerService.create<
        DeliveryNotesViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: DeliveryNotesViewDrawerComponent,
        nzSize: 'large',
        nzWidth: '90%',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    }
    
    getStatusName(id: number) {
      return pStatusType [id];
    }

    print(id: Number){
      window.open('__/'+id,"_blank");
    }
    
    reimprimirdeliveryNotes(id:number):void {
      let fecha: Date = new Date();
      let año: string = fecha.getFullYear().toString();
      let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      let dia = fecha.getDate().toString().padStart(2, '0');
      let hora: string = fecha.getHours().toString().padStart(2, '0');
      let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
      let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
      const fileName = `Remito_${año}${mes}${dia}${hora}${minutos}${segundos}`;
      this.service.ReprintdeliveryNotes(id).subscribe({
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

