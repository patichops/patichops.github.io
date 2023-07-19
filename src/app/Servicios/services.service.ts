import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataCliente, DataProducto, ResponseApi, Root, RootFacturaPost } from 'app/Models/Interfaces';
import { environment } from 'environments/environment';
import { Usuario } from '../Models/Interfaces';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private _http:HttpClient) { }

  URL = environment.URL;

  GetClientes(){
    return this._http.get<ResponseApi>(this.URL + 'Clientes');
  }

  GetClientesActivos(){
    return this._http.get<ResponseApi>(this.URL + 'Clientes/ACTIVOS');
  }

  PostClientes(cliente: DataCliente){
   // console.log(cliente)
    return this._http.post<DataCliente>(this.URL + 'Clientes', cliente);
  }

  PutClientes(cliente: DataCliente){
    // console.log(cliente)
     return this._http.put<DataCliente>(this.URL + 'Clientes', cliente);
   }

   GetProductos(){
    return this._http.get<ResponseApi>(this.URL + 'Productos');
   }

   GetProductosActivos(){
    return this._http.get<ResponseApi>(this.URL + 'Productos/ACTIVOS');
   }

   PostProductos(producto:DataProducto){
    return this._http.post<ResponseApi>(this.URL + 'Productos', producto);
   }

   PutProductos(producto:DataProducto){
    return this._http.put<ResponseApi>(this.URL + 'Productos', producto);
   }

   GetFacturas(){
    return this._http.get<ResponseApi>(this.URL + 'Ventas');
   }

   GetFacturasId(id){
    return this._http.get<Root>(this.URL + 'Ventas/'+id);
   }

   PostFactura(factura: RootFacturaPost){
    return this._http.post(this.URL + 'Ventas', factura);
   }

   Login(user: DataCliente){
    return this._http.post(this.URL + 'Login/' + user.cedula + '&' + user.contraseña, null, {observe: 'response'})
   }

  
}
