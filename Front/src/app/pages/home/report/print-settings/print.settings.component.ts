import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { ReportService } from "../report.service";
import { Router } from "@angular/router";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { PrintSettingsModel } from "../model/print.settings.model";

@Component({
    selector: 'app-print-settings',
  templateUrl: './print.settings.component.html',
  styleUrls: ['./print.settings.component.css']
})
export class PrintSettingsComponent extends BaseComponent implements OnInit {

isLoading=false;
printStatusmodel!: PrintSettingsModel;

constructor( 
notificacionService: NzNotificationService,
el: ElementRef,
message: NzMessageService,
private service: ReportService,
private router: Router
) {
    super(notificacionService, el, message);
}
ngOnInit(): void {}

getPrintSettings(){
    this.isLoading = true;
   this.service.getPrintSettings().subscribe({
      next: (r) => {
        this.printStatusmodel = r.consultarVersionBody;
        this.isLoading = false;
        
      },
      error: (e) =>{
        this.showMessageError(e.error.descripcion);
        this.isLoading = false;   
      }
   })
  }

}