import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { InvoiceModel } from './model/invoice.model';
import { receiptModel } from './model/receipt.model';
import { Type } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(public api: ApiService) { }

  /**
   * Obtiene un Comprobante por Id
   * @param id
   * @returns
   */
  public getInvoiceById(id: number): Observable<any> {
    return this.api.get(`invoice?id=${id}`, false);
  }

  /**
   * Obtiene todos los Comprobantes
   * @param queryParams
   * @returns
   */
  public getInvoices(queryParams: any): Observable<any> {
    return this.api.post(`invoice/list`, queryParams, false);
  }

  /**
   * Guarda una Factura/Comprobante
   * @param model
   * @returns
   */
  public saveInvoice(model: InvoiceModel): Observable<any> {
    return this.api.post(`invoice`, model, false);
  }

  /**
   * Obtiene un Comprobante de compra por Id
   * @param id
   * @returns
   */
  public getReceiptById(id: number): Observable<any> {
    return this.api.get(`Receipt?id=${id}`, false);
  }

  /**
   * Obtiene todos los Comprobantes de venta
   * @param queryParams
   * @returns
   */
  public getReceipt(queryParams: any): Observable<any> {
    return this.api.post(`receipt/list`, queryParams, false);
  }

  /**
   * Guarda una Factura/Comprobante
   * @param model
   * @returns
   */
  public saveReceipt(model: receiptModel): Observable<any> {
    return this.api.post(`receipt`, model, false);
  }

  /*Reimprimir resivo
  Reimprimir?tipoDocumento=1&numeroComprobante=0*/
  public Reprint(type: number, number: number): Observable<any> {
    return this.api.get(`Reimprimir?tipoDocumento=${type}&numeroComprobante=${number}`, false);
  }
  /**
    * Guarda una Factura/Comprobante
    * @param model
    * @returns
    */
 
   public Reprintinvoice(id: number): Observable<any> {
    return this.api.get(`Pdf/PdfComprobanteVenta?id=${id}`,false)

  }
 /* https://localhost:7261/api/v1/Pdf/PdfComprobanteVenta?id=40024*/
}

