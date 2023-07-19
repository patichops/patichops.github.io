import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { DataProducto } from "app/Models/Interfaces";
import { ServicesService } from "app/Servicios/services.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.scss"],
})
export class ProductoComponent implements OnInit {
  producto: DataProducto = {};
  @ViewChild("closeModalProducto") closeModal: ElementRef;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptionsP: DataTables.Settings = {};
  private rol = ""
  constructor(private service: ServicesService, private router: Router) {}

  ngOnInit(): void {
    if(sessionStorage.length === 0 || sessionStorage.getItem('token') === null){
      this.router.navigate(['']);
    }

    this.rol = sessionStorage.getItem('rol');
    
    this.dtOptionsP = {
      ajax: (dataTablesParameters: any, callback) => {
        this.service.GetProductos().subscribe((data) => {
          callback({ data: data.data });
        });
      },
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
      },
      columns: [
        {
          title: "ID",
          data: "idProducto",
        },
        {
          title: "Nombre",
          data: "nombre",
        },
        {
          title: "Precio",
          data: "precio",
          render: $.fn.dataTable.render.number(",", ".", 2, "$ "),
          type: "currency",
        },
        {
          title: "Stock",
          data: "stock",
        },
      ],
      columnDefs: [
        {
          targets: 4,
          title: "Estado",
          data: "esActivo",
          render: function (data, type, row) {
            return data
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
          targets: 5,
          title: "Opciones",
          data: null,
          render: function (data, type, row) {
            return `

            <button
              id="btnEditarP" 
              #EditarP
              data-toggle="modal"
              data-target="#exampleModalProducto"
              class="btn btn-primary btn-sm btn-round">
                <i class="material-icons">edit</i>
            </button>
    
            <button
              id="btnEliminarP" 
              class="btn btn-primary btn-sm btn-round">
                <i class="material-icons">delete</i>
            </button>
            
            `;
          },
        },
      ],
    };
  }

  //

  validarProducto() {
    if (!this.producto.nombre || this.producto.nombre.length <= 0) {
      this.showMessage(
        "info",
        "Alerta Sistema",
        "Ingrese Datos"
  
      );
      return false;
    }
    if (!this.producto.precio || this.producto.precio  <= 0) {
      this.showMessage("info", "Alerta Sistema", "Ingrese el precio valido");
      return false;
    }
    if (!this.producto.stock || this.producto.stock <= 0) {
      this.showMessage(
        "info",
        "Alerta Sistema",
        "Ingrese stock valido"
      );
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


  GuardarProducto() {
    if (this.validarProducto()) {
      this.producto.nombre = String(this.producto.nombre);
      this.producto.precio = this.producto.precio.valueOf();
      this.producto.stock = this.producto.stock.valueOf();
      this.service.PostProductos(this.producto).subscribe(
        async (data) => {
          //console.log(data)
          this.closeModal.nativeElement.click(); //<-- here
          this.producto = {};
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

  //
  EditarP(){

    this.service.PutProductos(this.producto).subscribe( async (data)=>{
      this.reload();
      this.producto = {}
      this.closeModal.nativeElement.click(); //<-- here
    }, (err)=>{
      console.log(err)
    })
    //this.producto = {}
  }

  EditarProducto(producto: DataProducto){
    this.producto.esActivo = true;
    this.producto.idProducto = producto.idProducto;
    this.producto.nombre = producto.nombre;
    this.producto.stock = producto.stock;
    this.producto.precio = producto.precio;
  }

  async reload() {
    let dt = await this.dtElement.dtInstance;
    dt.ajax.reload();
  }

  EliminarProducto(producto: DataProducto){
    producto.esActivo = false;
    console.log(producto)
    this.service.PutProductos(producto).subscribe( async (data)=>{
      this.reload();
      this.producto = {}
      // console.log("first")
      this.closeModal.nativeElement.click(); //<-- here
    }, (err)=>{
      console.log(err)
    })
  }

  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#producto-table").on("click", "#btnEditarP", function (data) {
      let datas = $("#producto-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataProducto;
        //console.log(datas)
     _thisDoc.EditarProducto(datas);
    });

    $("#producto-table").on("click", "#btnEliminarP", function (data) {
      let datas = $("#producto-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataProducto;

      _thisDoc.EliminarProducto(datas);
    });
  }
}

//

