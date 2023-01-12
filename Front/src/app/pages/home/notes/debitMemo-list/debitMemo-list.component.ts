import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';

@Component({
  selector: 'app-debitMemo-list',
  templateUrl: './debitMemo-list.component.html',
  styleUrls: ['./debitMemo-list.component.css'],
})
export class debitMemoListComponent implements OnInit {
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean;
    ngOnInit(): void {
        
    }
}