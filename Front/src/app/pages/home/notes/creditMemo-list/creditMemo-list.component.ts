import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';

@Component({
  selector: 'app-creditMemo-list',
  templateUrl: './creditMemo-list.component.html',
  styleUrls: ['./creditMemo-list.component.css'],
})
export class creditMemoListComponent implements OnInit {
  
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean; 
    ngOnInit(): void {
        
    }
}