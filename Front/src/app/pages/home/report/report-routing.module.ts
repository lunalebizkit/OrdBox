import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report-z/report.component';
import { PrintSettingsComponent } from './print-settings/print.settings.component';

const routes: Routes= [
    {path: '', component: ReportComponent},
    {path: 'print/settings', component: PrintSettingsComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule {}