import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';

@Component({
  selector: 'app-debit-memo',
  templateUrl: './debit-memo.component.html',
  styleUrls: ['./debit-memo.component.css'],
})
export class debitMemoComponent implements OnInit {
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean;
  startDate = this.formaterDate(Date.now());
  constructor(@Inject(LOCALE_ID) public locale: string){}
    ngOnInit(): void {
        
    }
    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'MM/dd/YYYY', this.locale);
    }
}