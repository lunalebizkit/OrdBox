import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceIvaReportComponent } from './invoice-iva.report/invoice-iva.report.component';
import { ReceiptIvaReportComponent } from './receipt-iva.report/receipt-iva.report.component';

const routes: Routes= [
    {path: '', component: InvoiceIvaReportComponent },
    {path: 'ivaCompra', component: ReceiptIvaReportComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IvaReportRoutingModule {}