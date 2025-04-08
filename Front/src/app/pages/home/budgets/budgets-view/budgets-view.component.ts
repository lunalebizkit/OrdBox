import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild }  from '@angular/core';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { BudgetDetails, BudgetsModel } from '../model/budgets.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BudgetsService } from '../budgets.services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../environments/environment';
import { formatCurrency } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-budgets-view',
    templateUrl: './budgets-view.component.html',
    styleUrls: ['./budgets-view.component.css'],
  })

  export class BudgetsViewComponent extends BaseComponent implements OnInit{ 

    @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
    @ViewChild('pdfTable') pdfTable!: ElementRef;
     
    // variables Generales
    isLoading=true;
        id!: number;
        tipo!: string;

    Mydate = new Date();
    //variables del presupuesto
    budgetDetail: BudgetDetails [] = [];
    customerName!: string;
    
    total!: number;
    dateTime!: Date;
    budgetNumber!: number;
    customerAddress!: string;
   
    name: string = environment.name;
    shouldCloseWindow = false;
    template: any;
    constructor(
   
    notificacionService: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private service: BudgetsService,
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
                    this.getBudget(p['id']);
                    this.id = p['id'];
                    
                }
            }
        })
       
        if (this.id != null || this.id != undefined || this.id != 0) {
          this.getBudget(this.id)
        }

    }
    

    getBudget(id: number): void {
        if(id != 0)
        this.service.getById(id).subscribe({
            next: (r: BudgetsModel) => {
                this.customerName = r.customerName,
                this.budgetDetail = r.budgetDetails,
              
                this.total = r.total,
                this.dateTime = r.dateTime,
                this.budgetNumber = r.budgetNumber,
                this.customerAddress = r.customerAddress
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
          PDF.save('Presupuesto.pdf');
        });
   
    }
}


  