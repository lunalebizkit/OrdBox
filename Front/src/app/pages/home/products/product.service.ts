import { Injectable } from '@angular/core';
import { ApiService } from './../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { ProductsModel } from './model/product.model';
import { ProductAddModel } from './model/product.add.model';
// import { ProductModel } from './model/edit.product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /**
   * Constructor
   */
  constructor(public api: ApiService) {
  }

  /**
   * Obtiene todos los productos por query text
   * @param queryParams
   * @returns
   */
  public getProducts(queryParams: any): Observable<any> {
    return this.api.post(`product/list`, queryParams, false);
  }

  /**
   * Obtiene los productos por categoría
   * @param queryParams
   * @returns
   */
  public getProductsByCategory(queryParams: any) : Observable<any> {
    return this.api.post(`products/byCategory`, queryParams, false);
  }

  /**
   * Obtiene los productos por categoría
   * @param queryParams
   * @returns
   */
   public getProductsByCampaign(queryParams: any) : Observable<any> {
    return this.api.post(`products/byCampaign`, queryParams, false);
  }

  /**
   * Obtiene un producto por ID
   * @param id
   * @returns
   */
  public getById(id: string | number): Observable<any> {
    return this.api.get(`product?id=${id}`, false);
  }

  delete(id: string | number): Observable<any> {
    return this.api.delete(`product/${id}`, false);
  }

  /**
   * Guarda un producto
   * @param model
   * @returns
   */
  public saveProduct(model: ProductAddModel): Observable<any> {
    if (model.id === 0) {
      return this.api.post(`product`, model, false);
    } else {
      return this.api.put(`product`, model, false);
    }
  }

  /**
   * Obtiene todas lineas de productos
   * 
   * @returns
   */
   public getCategories(): Observable<any> {
    return this.api.post(`category/list`, null, false);
  }

  /**
   * Obtiene todas las Categorias de productos
   * @param id
   * @returns
   */
   public getCategory(id: number): Observable<any> {
    return this.api.get(`category?id=${id}`, false);
  }


}

