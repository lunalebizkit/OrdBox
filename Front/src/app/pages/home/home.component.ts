import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { RolesConst } from 'src/app/common/auth/models/permission-rol.enum';
import { Permission } from '../auth/permission-rol/model/permission-rol.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  usuario!: string;
  permiso:any;
  color!: string;
  colorList: string[] = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1112EC', '#11EC17',
'#E9EC11', '#ECA911', '#C811EC'];

  constRol: RolesConst = new RolesConst();

  constructor(
    public token: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {    
    this.color= this.colorList[Math.floor(Math.random() * 10)];
    this.getUser();    
  }

  getYear() {
    return new Date().getFullYear();
  }
  getUser(){
    this.usuario=this.token.currentUser.userName;
    this.permiso= this.token.currentUser.permission;
  }

  logOut() {
    this.token.logout();
    this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }
}
