import { Pipe, PipeTransform } from '@angular/core';
import { eInvoiceType } from 'src/app/pages/home/invoices/model/invoice-type.Enum';

@Pipe({name: 'invoiceTypeFilter'})
export class InvoiceTypePipe implements PipeTransform{
    transform(value: eInvoiceType):string {
        if (!value) return '';

        if (value == eInvoiceType.EXENTO) return 'B';
    
    return eInvoiceType[value];
    }
}