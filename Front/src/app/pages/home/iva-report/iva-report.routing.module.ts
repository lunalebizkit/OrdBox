import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceIvaReportComponent } from './invoice-iva.report/invoice-iva.report.component';

const routes: Routes= [
    {path: '', component: InvoiceIvaReportComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IvaReportRoutingModule {}