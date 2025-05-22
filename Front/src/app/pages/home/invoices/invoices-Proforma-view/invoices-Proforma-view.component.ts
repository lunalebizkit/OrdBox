import { formatCurrency } from "@angular/common";
import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { InvoiceService } from "../invoices.service";
import { eInvoiceType } from "../model/invoice-type.Enum";
import { InvoiceDetails, InvoiceModel } from "../model/invoice.model";
import { ActivatedRoute, Router } from "@angular/router";
declare var require: any;
import * as pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';
import * as FileSaver from 'file-saver';
const htmlToPdfmake = require("html-to-pdfmake");



@Component({
  selector: 'app-invoices-Proforma-view',
  templateUrl: './invoices-Proforma-view.component.html',
  styleUrls: ['./invoices-Proforma-view.component.css'],
})
export class InvoiceProformaViewComponent extends BaseComponent implements OnInit {




  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  // variables Generales
  isLoading = true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  type: any;
  invoiceDetail: InvoiceDetails[] = [];
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
          this.getInvoice(p['id']);
          this.id = p['id'];

        }
      }
    })
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getInvoice(this.id)
    }




  }
  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
  }

  getInvoice(id: number): void {

   

    if (id != 0)
      this.service.getInvoiceById(id).subscribe({
        next: (r) => {
          this.type = r.type,
            this.customerAddress = r.customerAddress,
            this.customerCuit = r.customerCuit,
            this.customerName = r.customerName,
            this.observation = r.observation,
            this.invoiceNumber = r.invoiceNumber,
            this.ivaTotal = r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.iva10 = r.iva10,
            this.iva21 = r.iva21,
            this.iva27 = r.iva27,

            this.invoiceDetail = r.invoiceDetails
          this.subTotal = r.total - r.ivaTotal;
          this.isLoading = false;
          this.getTipo(r.type);

        },
        error: () => { this.isLoading = false; }
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

  invoiceType(id: any): string {
    return eInvoiceType[id]
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

  closeWindow(): void {
    window.close();
  };

  sumaIva() {




  }
}
