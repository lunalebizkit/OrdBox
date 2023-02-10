import { Component, ElementRef, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-report-z',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseComponent implements OnInit {

  constructor( 
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private service: ReportService,
    ) {
      super(notificacionService, el, message);
  }

  ngOnInit(): void {
    console.log("holaaaaaa")
  }

  reportZ(){
   this.service.reportZ().subscribe({
      next: (r) => {
        r.data
      },
      error: (message) =>{
        message
      }
   })
  }

}
