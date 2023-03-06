import {ViewChild} from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-report-z',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;
  constructor( 
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private service: ReportService,
    private router: Router
    ) {
      super(notificacionService, el, message);
  }

  ngOnInit(): void {
  }

  reportZ(){
   this.service.reportZ().subscribe({
      next: () => {
        this.showNotificationSuccess(
          'Generado correcto',
          `Generado correctamente`
        );
        this.popComponent.handleCance()
        this.router.navigate(['/home/products/list']);
      },
      error: (e) =>{
        this.showMessageError(e.error.descripcion)      
      }
   })
  }

  msjConfirmOk() {
    try {
      this.popComponent.showConfirmation() 
    } catch (error) {}
  }

  handleOk(){
    this.reportZ()
  }

}
