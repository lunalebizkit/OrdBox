import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { receiptDetails } from "../model/receipt.model";
import { FormGroup } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ActivatedRoute, Router } from "@angular/router";
import { InvoiceService } from "../invoices.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { eInvoiceType } from "../model/invoice-type.Enum";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatCurrency } from "@angular/common";

@Component({
    selector: 'app-receipt-Proforma-view',
    templateUrl: './receipt-Proforma-view.component.html',
    styleUrls: ['./receipt-Proforma-view.component.css'],
  })
  export class ReceiptProformaViewComponent extends BaseComponent implements OnInit {

    @ViewChild('header') headerComponent!:HeaderOperationsButtonsComponent;

    isLoading = true;
    loadig!: boolean;
    isSaving!: boolean;
    id!: number;
    tipo!: string;
    //variable del comprobante
    receiptDetail:receiptDetails [] = [];
    customerAddress!: string;
    customerCuit!: string;
    invoiceNumber!: number;
    ivaTotal!: number;
    total!: number;
    customerName!: string;
    observation!: string;
    userId!: number;
    dateTime!: Date;
    subTotal!: number;
    form!: FormGroup;
    percIngBrutos!: number;
    percIva!: number;
    concNoGravado!: number;
    iva10 = 0;
    iva21 = 0;
    iva27 = 0;
    receiptNumber: any;
    constructor(

        notificacionService: NzNotificationService,
        private route: ActivatedRoute,
        private router: Router,
        private service: InvoiceService,
        el: ElementRef,
        message: NzMessageService,
    
        @Inject(LOCALE_ID) public locale: string
      ) {
        super(notificacionService, el, message);
    
      }
    ngOnInit(): void {
        this.route.params.subscribe({
            next: (p) => {
                if (p['id']) {
                    this.isLoading = true;
                    this.getReceipt(p['id']);
                    this.id = p['id'];
          
                  }
            }
        })
    }

    getReceipt(id:number):void{
        this.service.getReceiptById(id).subscribe({
            next:(r) => {
              this.subTotal= r.total - Number(this.subTotalCalculate(r.concNoGravado, r.percIngBrutos, r.percIva, r.ivaTotal)),
               this.tipo = r.tipo,
               this.concNoGravado = r.concNoGravado,
                this.customerAddress = r.supplierAddress,
                this.customerCuit = r.supplierCuit,
                this.customerName = r.supplierName,
                this.dateTime = r.dateTime,           
                this.iva10 = r.iva10,
                this.iva21 = r.iva21,
                this.iva27 = r.iva27,
                this.total = r.total,
                this.observation = r.observation,
                this.ivaTotal = r.ivaTotal,
              
                this.getTipo(r.type);
                this.receiptDetail = r.receiptDetails

            }, error: () => { this.isLoading = false; }
        })
    }

    getTipo(tipo: number): any {
        switch (tipo) {
          case eInvoiceType.A:
            return this.tipo = 'factA'
          case eInvoiceType.B:
            return this.tipo = 'factB'
        }
    
    }

    closeWindow(): void {
        window.close();
      };

    currencyFormat(data: any): string {
        if (!this.locale) return '';
        return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
      }
      
    imprimir(): void {

        let DATA: any = document.getElementById('pdf');
        html2canvas(DATA).then((canvas) => {
          let fileWidth = 209;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'mm', 'a4');
          let position = 5;
          PDF.addImage(FILEURI, 'PNG', 10, position, fileWidth, fileHeight);
          PDF.save('FacturaProforma.pdf');
        });
    }

   
    subTotalCalculate(concNoGravado: number, percIngBrutos: number, percIva:number, ivaTotal: number): number {
      return concNoGravado + percIngBrutos + percIva  + ivaTotal  
    }

  }