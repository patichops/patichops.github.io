import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseApi, Root, DataCliente } from 'app/Models/Interfaces';
import { ServicesService } from 'app/Servicios/services.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private service: ServicesService, private router: Router,) { }

  public contra = ""
  credenciales: DataCliente = {
    cedula: "",
    contraseña: this.contra,
  };

  ngOnInit(): void {
    if(sessionStorage.length > 0 || sessionStorage.getItem('token') != null){
      this.router.navigate(['facturas']);
    }
  }

  showMessage(icon: any, title: any, text: any) {
    Swal.fire({
      showCloseButton: true,
      position: "center",
      icon: icon,
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  login() {
    this.credenciales = {cedula: this.credenciales.cedula, contraseña: this.contra}
    this.service.Login(this.credenciales).subscribe(
      (data) => {
        var datarecieved = data.body as ResponseApi
        if(datarecieved.success){
          sessionStorage.setItem('token',datarecieved.message);
          sessionStorage.setItem('usuario',datarecieved.data.nombre + ' ' + datarecieved.data.apellido)
          sessionStorage.setItem('rol',datarecieved.data.rol)
          if(sessionStorage.getItem('rol') === 'usuario')
            this.router.navigateByUrl('/facturas');
          else
          this.router.navigateByUrl('/dashboard');
        }else{
          this.showMessage(
            "warning", 
            datarecieved.message,
            "Usuario o contraseña incorrectos"
          );
        }
      },
      (err) => {
        console.log(err)
        if (err["error"].errors != undefined) {
          let msg = "";
          let cant = err["error"].errors.length;
          for (let index = 0; index < cant; index++) {
            const element = err["error"].errors[index];
            if (index + 1 == cant) {
              msg += element.msg;
            } else {
              msg += element.msg + ", ";
            }
          }

          this.showMessage(
            "info",
            "Alerta",
            msg
          );
        } else {
          
          this.showMessage(
            "info",
            "Alerta Sistema",
            "Oucrrio Un error"
          );
        }
      }
    );

    
  }

}
