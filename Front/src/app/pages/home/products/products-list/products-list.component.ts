import { query, style } from '@angular/animations';
import { Component, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Router, RouterLinkWithHref } from '@angular/router';
import { id_ID } from 'ng-zorro-antd/i18n';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { environment } from 'src/environments/environment';
import { ProductsModel } from '../model/product.model';
import { ProductService } from '../product.service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  CellClickedEvent, ICellRendererParams, GridReadyEvent, GridApi, IGetRowsParams, ColDef,
  RowModelType, IDatasource, GridOptions, GetRowIdFunc, GetRowIdParams, Module, ModuleRegistry, RowNode
} from 'ag-grid-community';
import { from, Observable, of } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { ProductsEditComponent } from '../products-edit/products-edit.component';
import { CommonServicesModule } from 'src/app/common/services/services.module';
import { ApiService } from 'src/app/common/services/api.base.service';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  /*
    ** Listado de los productos
    */
  productList: ProductsModel[] = [];

  /*
  ** Indicador de carga de la grilla
  */
  loading = false;

  /*
  ** Catidad total de productos
  */
  totalItems = 0;

  /*
  ** Lista de marcas
  */
  brandsList = [];

  /*
  ** Lista de Productos
  */
  productLinesList = [];

  /*
  ** Indicador de carga de marcas y lineas
  */
  loadingBrands!: boolean;

  /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: '',
    page: 0,
    /* pageSize:10 */
  };
  gridColumn: any;
  private GridApi: any;
  gridColumnApi: any;
  info!: string;




  /*
  ** Constructor
  */
  constructor(private service: ProductService, private router: Router) {

  }


  /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {

  }



  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.filter = localStorage.getItem('productListFilter')!;
    this.queryParams.page = params.pageIndex - 1;
    /* this.queryParams.pageSize = params.pageSize;   */
    this.getData(this.queryParams);
  }

  /*
  ** Evento de busqueda datos en el server
  */

  getData(params: any): void {
    this.loading = true;
    this.service.getProducts(params).subscribe({
      next: (r) => {
        this.productList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.productList = [];
      }
    })
  }


  /*
  ** Evento al presionar buscar o presionar enter
  */
  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }
  
/*   creacion de columnas de la grid */
  public columnDefs: ColDef[] = [
    {
      headerName: 'Producto',
      field: 'description',
    },
    {
      headerName: 'Categoria',
      field: 'categoryName'
    },
    {
      headerName: 'Marca',
      field: 'brandName'
    },
    {
      headerName: 'Proveedor',
      field: 'supplierName'
    },
    {
      headerName: 'Código',
      field: 'code'
    },
    {
      headerName: 'Cantidad',
      field: 'quantity',
      width: 60
    },
    {
      headerName: 'Precio Costo',
      field: 'purchasePrice',
      cellStyle: { color: 'blue', 'text-align': 'center' }
    },
    {
      headerName: 'Precio Lista',
      field: 'salePrice',
      cellStyle: { color: 'green', 'text-align': 'center' }
    },
    {
      headerName: 'Precio Contado',
      field: 'cashSalePrice',
      cellStyle: { color: 'red', 'text-align': 'center' }
    },
    {
      headerName: 'Precio Tarjeta',
      field: 'cardSalePrice',
      cellStyle: { 'text-align': 'center' }
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  /* componentes de configuracion de la grid */
  rowBuffer = 40;
  rowHeight = 23;
  public gridApi!: GridApi<ProductsModel>
  rowModelType: RowModelType = 'infinite';
  infiniteInitialRowCount = 1;
  paginationPageSize = 100;
  cacheOverflowSize = 2;
  cacheBlockSize = 100;
  maxConcurrentDatasourceRequests = 2;
  maxBlocksInCache = 2;

  /* eventos de docle click y enter renderizan a otra pagina */
  gridOptions: GridOptions = {
    rowSelection: 'single',
    columnDefs: this.columnDefs,
    onRowDoubleClicked: datos => {
      var data = datos.data.id
      this.router.navigate(['home/products/edit/', data]);
    },
    navigateToNextCell: this.myNavegation, 
    onCellKeyPress:  datos => {
      var data = datos.data.id
      this.router.navigate(['home/products/edit/', data]);
    },
  }
  
/* funcion cambio de navegacion de las teclas */
  myNavegation(params: any) {
    var nI:number = params.nextCellPosition?.rowIndex;
    if (nI !== undefined) {      
    var nextRow = {column: params.nextCellPosition.column , rowIndex: nI, rowPinned: null };  
    var ARROWUP = 'ArrowUp';
    var ARROWDOWN = 'ArrowDown';
    
    switch (params.key) {
      case ARROWDOWN:
       var previousCell = params.previousCellPosition;
        params.api.forEachNode( (node: any) => {
          if(node.rowIndex !== null && node.rowIndex !== undefined){
            if ( previousCell.rowIndex + 1 === node.rowIndex) {
              node.setSelected(true);              
          }
          }         
        });
      
       return nextRow;

       case ARROWUP :     
        var nextCell = params.previousCellPosition;
        params.api.forEachNode( (node: any) => {
          if (nextCell.rowIndex - 1 === node.rowIndex) {
              node.setSelected(true);              
          }
        });
        return nextRow;
        default:
          return null;

    }
  }
  return null
  }
/* función para mostrar los datos y scroll infinito */
  onGridReady(params: GridReadyEvent<ProductsModel>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service
      .getProducts(this.queryParams)
      .subscribe((productList) => {
        const dataSource: IDatasource = {
          rowCount: undefined,
          getRows: (params: IGetRowsParams) => {
            console.log(
              'asking for ' + params.startRow + ' to ' + params.endRow
            );
            setTimeout(function () {
              const rowsThisPage = (productList.data).slice(params.startRow, params.endRow);
              let lastRow = -1;
              if ((productList.data).length >= params.endRow) {
                lastRow = (productList.data).length
              }
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          },
        };
        params.api!.setDatasource(dataSource);
      });
  }
}


