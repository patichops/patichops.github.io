import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ServicesService } from "app/Servicios/services.service";
import { isEmpty, tap } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { DataCliente, ResponseApi } from "app/Models/Interfaces";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.scss"],
})
export class ClienteComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private service: ServicesService, private router: Router) {}

  dataClientes: DataCliente[] = [];
  cliente: DataCliente = {};
  public nombre = ""
  public rol = ""
  public contra = ""
  @ViewChild("closeModal") closeModal: ElementRef;
  @ViewChild("closeEditar") closeModalEditar: ElementRef;

  ngOnInit(): void {
    if(sessionStorage.length === 0 || sessionStorage.getItem('token') === null){
      this.router.navigate(['']);
    } else {
      
      if(sessionStorage.getItem('rol') == 'usuario'){
        this.showMessage("info", "Alerta Sistema", "No autorizado.");
        this.router.navigate(['']);
      }

      this.nombre = sessionStorage.getItem('usuario');
      this.rol = sessionStorage.getItem('rol');
      this.dtOptions = {
        ajax: (dataTablesParameters: any, callback) => {
          this.service.GetClientes().subscribe((data: ResponseApi) => {
            callback({ data: data.data });
          });
        },
        ordering: false,
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
        },
        columns: [
          {
            title: "ID",
            data: "codigoCliente",
          },
          {
            title: "Cédula",
            data: "cedula",
            className: "text-center",
          },
          {
            title: "Nombre",
            data: "nombre",
            className: "text-center",
          },
          {
            title: "Apellido",
            data: "apellido",
            className: "text-center",
          },
          {
            title: "Dirección",
            data: "direccion",
            className: "text-center",
          },
          {
            title: "Teléfono",
            data: "telefono",
            className: "text-center",
          },
        ],
        columnDefs: [
          {
            targets: 6,
            title: "Activo",
            className: "text-center",
            data: null,
            render: function (data, type, row) {
              return data.activo
                ? `<button
                class="btn btn-success btn-sm btn-round">
                  Activo
              </button>`
                : `<button
                class="btn btn-danger btn-sm btn-round">
                  Inactivo
              </button>`;
            },
          },
  
          {
            targets: 7,
            title: "Opciones",
            className: "text-center",
            data: null,
            render: function (data, type, row) {
              
              return `
  
          <button
            id="btnEditar" 
            #Editar
            data-toggle="modal"
            data-target="#exampleModalEditar"
            class="btn btn-primary btn-sm btn-round">
              <i class="material-icons">edit</i>
          </button>
  
          <button
            id="btnEliminar" 
            class="btn btn-primary btn-sm btn-round">
              <i class="material-icons">delete</i>
          </button>
          
          `;
            },
          },
        ],
      };
    }
  }

  validarCliente() {
    if (!this.cliente.cedula || this.cliente.cedula.length < 10) {
      this.showMessage(
        "info",
        "Alerta Sistema",
        "La cédula debe tener 10 digitos"
      );
      return false;
    }
    if (!this.cliente.nombre || this.cliente.nombre.length <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese el nombre");
      return false;
    }
    if (!this.cliente.apellido || this.cliente.apellido.length <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese el apellido");
      return false;
    }
    if (!this.cliente.direccion || this.cliente.direccion.length <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese la dirección");
      return false;
    }

    if (!this.cliente.telefono || this.cliente.telefono.length <= 0) {
      this.showMessage(
        "info",
        "Alerta Sistema",
        "El teléfono debe tener 10 digitos"
      );
      return false;
    }
    if (!this.cliente.correo || this.cliente.correo.length <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese el correo");
      return false;
    }
    if (!this.cliente.contraseña || this.cliente.contraseña.length <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese la contraseña");
      return false;
    }

    return true;
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

  async reload() {
    let dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  }

  GuardarCliente() {
    if (this.validarCliente()) {
      this.cliente.codigoCliente = 0;
      this.cliente.activo = true;
      this.cliente.cedula = String(this.cliente.cedula);
      this.cliente.telefono = String(this.cliente.telefono);
      this.cliente.direccion = String(this.cliente.direccion);
      this.cliente.contraseña = String(this.contra);
      console.log(this.cliente);
      this.service.PostClientes(this.cliente).subscribe(
        async (data) => {
          //console.log(data)
          this.closeModal.nativeElement.click(); //<-- here
          this.cliente = {};
          await this.reload();
        },
        (err) => {
          console.log(err);
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
            console.log(msg);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  Editar() {
    if (this.validarCliente()) {
      console.log(this.cliente);
      this.cliente.activo = true;
      this.cliente.contraseña = this.contra;
      this.service.PutClientes(this.cliente).subscribe(
        async (data) => {
          await this.reload();
          this.closeModalEditar.nativeElement.click(); //<-- here
        },
        (err) => {
          console.log(err);
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
            console.log(msg);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  EliminarCliente(cliente: DataCliente) {
    this.cliente = cliente;
    this.cliente.activo = false;
    // console.log(this.cliente);
    this.service.PutClientes(this.cliente).subscribe(
      async (data) => {
        await this.reload();
        this.closeModalEditar.nativeElement.click(); //<-- here
        this.reload();
      },
      (err) => {
        console.log(err);
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
          console.log(msg);
        } else {
          console.log(err);
        }
      }
    );
  }

  EditarCliente(cliente: DataCliente) {
    // console.log(cliente);
    this.cliente.codigoCliente = cliente.codigoCliente;
    this.cliente.cedula = cliente.cedula;
    this.cliente.nombre = cliente.nombre;
    this.cliente.apellido = cliente.apellido;
    this.cliente.telefono = cliente.telefono;
    this.cliente.activo = cliente.activo;
    this.cliente.direccion = cliente.direccion;
    this.cliente.correo = cliente.correo;
    this.cliente.contraseña = cliente.contraseña;
    this.cliente.rol = cliente.rol;
  }

  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#client-table").on("click", "#btnEditar", function (data) {
      let datas = $("#client-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataCliente;
      // console.log(datas)

      _thisDoc.EditarCliente(datas);
    });

    $("#client-table").on("click", "#btnEliminar", function (data) {
      let datas = $("#client-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataCliente;

      _thisDoc.EliminarCliente(datas);
    });
  }
}
