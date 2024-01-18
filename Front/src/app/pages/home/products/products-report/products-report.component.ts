import { Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { formatCurrency, formatDate } from '@angular/common';
import { ProductService } from '../product.service'
import { ProductReport } from '../model/product.report.model';

@Component({
    selector: 'app-products-report',
    templateUrl: './products-report.component.html',
    styleUrls: ['./products-report.component.css']
})

export class ProductsReportComponent extends BaseComponent implements OnInit {
    @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('pop') popComponent!: PopupConfirmationComponent;

    loading =false;

    productsReportModel!: ProductReport;

    constructor(
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private router: Router,
        private service: ProductService,
        @Inject(LOCALE_ID) public locale: string,
    ) {
        super(notificacionService, el, message);
    }
    ngOnInit(): void {
    }
    msjConfirmOk() {
        try {
          this.popComponent.showConfirmation()
        } catch (error) { }
      }
    
      productsReport() {
        this.loading = true;
        this.service.productsReport().subscribe({
          next: (r) => {
            this.productsReportModel = r;
            this.loading = false;
            this.popComponent.handleCance();            
          },
          error: () => {
            this.loading = false;
            // this.invoicesReportList = [];
          },
        });
      }

      handleOk() {
        this.productsReport()
      }
    
      formaterDate(date: string | number | Date): string {
        return formatDate(date, 'MM/dd/YYYY', this.locale);
      }
}