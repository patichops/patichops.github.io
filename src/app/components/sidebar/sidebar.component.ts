import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/clientes', title: 'Clientes',  icon:'person', class: '' },
    { path: '/productos', title: 'Productos',  icon:'dashboard', class: '' },
    { path: '/facturas', title: 'Facturas',  icon:'content_paste', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  public nombre = ""
  public rol = ""
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.nombre = sessionStorage.getItem('usuario');
    this.rol = sessionStorage.getItem('rol');
    console.log(this.rol)
  }
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  closeSession(){
    sessionStorage.clear()
  }
}
