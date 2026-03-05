import {ViewChild} from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { ReportService } from '../report.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-report-z',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('popdownload') popDownload!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;
  isSaving=false;
  form!: FormGroup;

  constructor( 
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private service: ReportService,
    private router: Router,
    private fb: FormBuilder,
    ) {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      fechaInicial: ['', Validators.required],
      fechaFinal:['', Validators.required],
    },
      {
        validators: [this.fechaRangoValidator],
      }
);
  }

  ngOnInit(): void {
  }

  reportZ(){
    this.isSaving = true;
   this.service.reportZ().subscribe({
      next: () => {
        this.showNotificationSuccess(
          'Generado correcto',
          `Generado correctamente`
        );
        this.isSaving = false;
        this.popComponent.handleCance()
        this.router.navigate(['/home/products/list']);
      },
      error: (e) =>{
        this.showMessageError(e.error.descripcion);
        this.isSaving = false;   
      }
   })
  }
  
  downloadPrintReport(){
    if (this.isValidForm(this.form)) {
      this.isSaving = true;
      let body = {
        fechaInicial: this.formatFechaAAMMDD(this.form.controls['fechaInicial'].value),
        fechaFinal: this.formatFechaAAMMDD(this.form.controls['fechaFinal'].value) 
      }
      this.service.downloadPrintReport(body.fechaInicial, body.fechaFinal).subscribe({
        next: (r) => {
          const fileName = `ReporteFiscal_${body.fechaInicial}_${body.fechaFinal}.zip`;
          this.downloadFile(r, fileName);
          this.isSaving = false;
        },
        error: (e) =>{
          this.showMessageError("Ocurrio un error al ejecutar el método");
          this.isSaving = false;   
        }
      });      
    }
    this.popDownload.handleCance()
  }

  msjConfirmOk() {
    try {
      this.popComponent.showConfirmation() 
    } catch (error) {}
  }
  
  msjConfirmDownloadOk() {
    try {
      if (this.isValidForm(this.form))
      this.popDownload.showConfirmation() 
    } catch (error) {}
  }

  handleOk(){
    this.reportZ()
  }

  fechaRangoValidator(group: AbstractControl) {
    const fechaInicial = group.get('fechaInicial')?.value;
    const fechaFinal = group.get('fechaFinal')?.value;

    if (!fechaInicial || !fechaFinal) {
      return null;
    }

    const inicio = new Date(fechaInicial);
    const fin = new Date(fechaFinal);

    return inicio <= fin ? null : { rangoInvalido: true };
  }

  formatFechaAAMMDD(fecha: Date | string | null): string {
    if (!fecha) return '';

    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;

    const year = d.getFullYear().toString().slice(-2); // últimos 2 dígitos
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // meses 01-12
    const day = d.getDate().toString().padStart(2, '0'); // días 01-31

    return `${year}${month}${day}`;
  }

  downloadFile(response: Blob, fileName: string){  
    const filtePath = window.URL.createObjectURL(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
