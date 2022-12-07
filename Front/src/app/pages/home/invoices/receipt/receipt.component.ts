import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { receiptList } from '../model/receipt.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  permissions = Permission;

  /*
   ** Indicador de carga de la grilla
   */
  loading = false;

  receiptList: receiptList[] = [];

  ngOnInit(): void {}
}
