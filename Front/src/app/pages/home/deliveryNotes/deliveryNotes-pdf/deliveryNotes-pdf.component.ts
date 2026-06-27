import { Component, ElementRef, Inject, Renderer2 , LOCALE_ID, OnInit, ViewChild }  from '@angular/core';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../environments/environment';
import { formatCurrency, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

declare var require: any;
import * as pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';

import { deliveryNotesService } from '../deliveryNotes.service';
import { DeliveryNotesDetails, DeliveryNotesModel } from '../model/deliveryNotes.model';

@Component({
    selector: 'app-deliveryNotes-pdf',
    templateUrl: './deliveryNotes-pdf.component.html',
    styleUrls: ['./deliveryNotes-pdf.component.css'],
  })

  export class DeliveryNotesPdfComponent extends BaseComponent implements OnInit{
    
    
   

    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
     @ViewChild('pdfTable') pdfTable!: ElementRef;
     
    // variables Generales
    isLoading=true;
        id!: number;
        tipo!: string;

    Mydate = new Date();
    //variables del presupuesto
    deliveryNotesDetail: DeliveryNotesDetails [] = [];
    supplierName!: string;
    
    total!: number;
    dateTime!: Date;
    deliveryNotesNumber!: number;
    supplierAddress!: string;
   
    name: string = environment.name;
    shouldCloseWindow = false;
    template: any;
    imporTotal!: number;
    constructor(
   
    notificacionService: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private service: deliveryNotesService ,
    el: ElementRef,
    message: NzMessageService,

    @Inject(LOCALE_ID) public locale: string
     ) {
    super(notificacionService, el, message);
    
    }

    ngOnInit(): void {
        this.route.params.subscribe({
            next:(p) => {
                if(p['id']){
                    this.isLoading = true;
                    this.getDeliveryNotes(p['id']);
                    this.id = p['id'];
                    
                }
            }
        })
       
        if (this.id != null || this.id != undefined || this.id != 0) {
          this.getDeliveryNotes(this.id)
        }

    }
    

    getDeliveryNotes(id: number): void {
        if(id != 0)
        this.service.getDeliveryNotesById(id).subscribe({
            next: (r: DeliveryNotesModel) => {
                this.deliveryNotesNumber= this.id
                this.supplierName = r.supplierName,
                this.deliveryNotesDetail = r.deliveryNotesDetails,
                this.dateTime = r.dateTime,
                this.deliveryNotesNumber = r.deliveryNotes_number,
                this.supplierAddress = r.supplierAddress
                this.imporTotal=r.importTotal
            },
            error:() => {this.isLoading = false;}
        })
    }

 

    currencyFormat(data: any):string  { 
        if(!this.locale) return '';
        return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
    }

    closeWindow(): void {
        window.close();
    };

    imprimir(): void{
       
        let DATA: any = document.getElementById('pdf');
        html2canvas(DATA).then((canvas) => {
          let fileWidth = 250;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
          PDF.save('Remito.pdf');
        });
   
    }


}