import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
import { RolesConst } from 'src/app/common/auth/models/permission-rol.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isCollapsed = true;

  constRol: RolesConst = new RolesConst();

  constructor(
    public token: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  getYear() {
    return new Date().getFullYear();
  }

  logOut() {
    this.token.logout();
    this.router.navigate(['/auth/login'], { relativeTo: this.route });
  }
}
