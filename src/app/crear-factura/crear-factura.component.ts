import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { DataCliente, DataProducto, ProductoPost, ResponseApi, RootFacturaPost } from "app/Models/Interfaces";
import { ServicesService } from "app/Servicios/services.service";
import Swal from "sweetalert2";


@Component({
  selector: "app-crear-factura",
  templateUrl: "./crear-factura.component.html",
  styleUrls: ["./crear-factura.component.scss"],
})
export class CrearFacturaComponent implements OnInit {
  constructor(private service: ServicesService, private router: Router) {}
  fecha = new Date();
  subTotal = 0;
  iva = 0;
  Total = 0;

  ClienteSelected: DataCliente = {};
  productoSeleccionado: DataProducto = {};

  ProductosPost: ProductoPost[] = [];

  clientSelect: boolean = false;
  save: boolean = false;
  productSelect: boolean = false;

  @ViewChild("closeModalClientes") editar: ElementRef;
  @ViewChild("closeModalProductos") cerrarProducto: ElementRef;
  @ViewChild("ProductosModal") abriModalProductos: ElementRef;

  @ViewChild("precio") input: ElementRef | any;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  @ViewChild("ModalClientes")
  dtElement1: DataTableDirective;
  @ViewChild("ModalProductos")
  dtElement2: DataTableDirective;

  dtOptionsClFac: DataTables.Settings = {};
  dtOptionsPrFac: DataTables.Settings = {};

  public precioP: string = "";
  public cantidad: string = "";

  idFactura= 1;
  ngOnInit(): void {
    if(sessionStorage.length === 0 || sessionStorage.getItem('token') === null){
      this.showMessage("info", "Alerta Sistema", "Debe Iniciar Sesión");
      this.router.navigate(['']);
    }

    this.service.GetFacturas().subscribe((data) => {
      this.idFactura = data.data[data.data.length - 1].idVenta + 1;
    });
    
    this.dtOptionsClFac = {
      ajax: (dataTablesParameters: any, callback) => {
        this.service.GetClientesActivos().subscribe((data: ResponseApi) => {
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
          title: "Opción",
          className: "text-center",
          data: null,
          render: function (data, type, row) {
            return `<button
            #Editar
          id="Editar"
          type="button"
          class="btn btn-info btn-sm"
         
        >
          Seleccionar
        </button>

        `;
          },
        },
      ],
    };


    this.dtOptionsPrFac = {
      ajax: (dataTablesParameters: any, callback) => {
        this.service.GetProductosActivos().subscribe((data) => {
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
          title: "Seleccionar",
          data: null,
          render: function (data, type, row) {
            return `<button
            
          id="SeleccionarProducto"
          type="button"
          class="btn btn-info btn-sm"
          
        >
          Seleccionar
        </button>

        `;
          },
        },
      ],
    };
  }

  async SeleccionarProducto(producto: DataProducto) {
    this.productoSeleccionado = producto;
    
    this.productSelect = true;

    await this.reloadTable()
    this.input.nativeElement.focus();
  }

  private async reloadTable() {
    let dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  }

  async reloadClientes() {
    let dtIntance = await this.dtElement.dtInstance;
    dtIntance.ajax.reload();
  }

  async SeleccionarCliente(cliente: DataCliente) {
   // this.RootFactPost.IdCliente = cliente.ID;

    this.ClienteSelected = cliente;

    this.clientSelect = true;

    await this.reloadClientes();
  }

  onlyNumber(event: any) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
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

  private SaveBool() {
    this.save = this.ProductosPost.length > 0;
  }

  private Limpiar() {
    this.productoSeleccionado = {};
    this.cantidad = "";
  }

  private LimpiarCantidad() {
    this.cantidad = "";
  }

  AgregarProducto() {
    if (!this.productoSeleccionado.idProducto) {
      this.showMessage("warning", "Alerta", "Ingrese el Producto");
      return;
    }

    if (!this.cantidad) {
      this.showMessage("warning", "Alerta", "Ingrese la Cantidad");
      this.input.nativeElement.focus();
      return;
    }

    const cant = Number(this.cantidad);

    if (cant == 0) {
      this.showMessage(
        "error",
        "Alerta Sistema",
        "Ingrese una cantidad diferente"
      );
      this.input.nativeElement.focus();
      this.LimpiarCantidad();
      return;
    }

    if (this.setItemEdit) {
      // Verificar Stock Nuevo Producto
      if (cant > this.productoSeleccionado.stock!) {
        this.showMessage(
          "info",
          "Stock Producto",
          `La cantidad ${cant} es mayor que el Stock Disponible ${this.productoSeleccionado.stock}`
          //'La cantidad ingresada es mayor que el Stock Disponible '
        );
        return;
      }

      // Verificar
      // Editar
      const id = this.ProductosPost.findIndex(
        (x) => x.idProducto == this.productoEditar.idProducto
      );

      if (id == -1) {
        this.showMessage(
          "error",
          `Producto ${this.productoEditar.nombre}`,
          "No se Encontro el producto"
        );
        return;
      }

      // Verificar si el nuevo producto existe en la lista
      const idx = this.ProductosPost.findIndex(
        (x) => x.idProducto == this.productoSeleccionado.idProducto
      );

      if (idx == -1) {
        // No existe
        // reemplazar
        this.ProductosPost[id].idProducto = this.productoSeleccionado.idProducto;
        this.ProductosPost[id].nombre = this.productoSeleccionado.nombre;
        this.ProductosPost[id].cantidad = cant;
        this.ProductosPost[id].precio = this.productoSeleccionado.precio;
        this.ProductosPost[id].total =
          cant * this.productoSeleccionado.precio!;

        this.showMessage(
          "info",
          "Editado",
          "El Producto fue editado exitosamente"
        );
      } else {
        //existe en la lista

        const c = cant; //+ this.ProductosPost[idx].cantidad!;
        // this.showMessage(
        //   "info",
        //   "Editado",
        //   "El Producto fue editado exitosamente"
        // );
        // console.warn(c);
        // console.warn(this.ProductosPost[idx].Cantidad!);
        // console.warn(cant);
        // console.warn(idx);
        // console.warn(id);



        if (c > this.productoSeleccionado.stock!) {
          this.showMessage(
            "info",
            "Stock Producto",
            `La nueva cantidad ${c} es mayor que el Stock Disponible ${this.productoSeleccionado.stock}`
          );
          this.cantidad = "";
          this.input.nativeElement.focus();
          return;
        }

        this.ProductosPost[idx].cantidad = c;
        this.ProductosPost[idx].total =
          c * this.productoSeleccionado.precio!;

        // console.warn(id);
        // console.warn(idx);

        if (id != idx) {
          this.ProductosPost.splice(id, 1);
        }
      }
    } else {
      const id = this.ProductosPost.findIndex(
        (x) => x.idProducto == this.productoSeleccionado.idProducto
      );

      if (id == -1) {
        if (
          this.productoSeleccionado.precio &&
          this.productoSeleccionado.stock
        ) {
          if (cant > this.productoSeleccionado.stock) {
            this.showMessage(
              "info",
              "Stock Producto",
              `La cantidad ${cant} es mayor que el Stock Disponible ${this.productoSeleccionado.stock}`
            );
            return;
          }

          const precio = this.productoSeleccionado.precio;
          this.ProductosPost.push({
            idProducto: this.productoSeleccionado.idProducto,
            nombre: this.productoSeleccionado.nombre,
            cantidad: cant,
            precio: this.productoSeleccionado.precio,
            total: cant * precio,
          });
        }
      } else {
        /* Aumentar la Cantidad */
        const c = this.ProductosPost[id].cantidad! + cant;

        if (c > this.productoSeleccionado.stock!) {
          this.showMessage(
            "info",
            "Stock Producto",
            `La nueva cantidad ${c} es mayor que el Stock Disponible ${this.productoSeleccionado.stock}`
          );
          this.cantidad = "";
          this.input.nativeElement.focus();
          return;
        }
        this.ProductosPost[id].cantidad = c;
        this.ProductosPost[id].total = c * this.productoSeleccionado.precio!;
        //this.showMessage("info", "Finalizado", "Nueva cantidad del Producto");
        // const p = this.ProductosPost.find(x=>x.Id_Pro ==)
      }
    }

    this.Limpiar();
    this.CalcularValores();
    this.SaveBool();
    this.productSelect = false;
    this.setItemEdit = false;
  }

  setItemEdit: boolean = false;
  productoEditar: ProductoPost = {};

  editarItem(item: ProductoPost) {
    // Mostrar el modal de
    this.productoEditar = item;
    this.setItemEdit = true;
    this.abriModalProductos.nativeElement.click();
  }

  editarItemCantidad(item: ProductoPost) {
    // Mostrar el modal de
    this.productoEditar = item;
    this.setItemEdit = true;
    this.SeleccionarProducto(item)
    //this.productoSeleccionado = item;
    //this.abriModalProductos.nativeElement.click();
  }

  eliminarItem(producto: ProductoPost) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Esta seguro de Eliminar?",
        text: `Eliminar el Producto ${producto.nombre}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const id = this.ProductosPost.findIndex(
            (x) => x.idProducto == producto.idProducto
          );
          this.ProductosPost.splice(id, 1);
          this.CalcularValores();
          this.SaveBool();
          swalWithBootstrapButtons.fire(
            "Eliminado!",
            "El item fue eliminado",
            "success"
          );
        }
      });
  }

  Cancelar() {
    this.ProductosPost = [];
    this.ClienteSelected = {};
    this.CalcularValores();
    this.clientSelect = false;
    this.productSelect = false;
    this.save = false;
    this.Limpiar();
  }

  GuardarFactura() {
    console.log(this.ProductosPost)
    console.log(this.ClienteSelected)
    console.log(this.iva)
    console.log(this.Total)
    console.log(this.subTotal)
    const factura: RootFacturaPost = {};
    factura.cliente = this.ClienteSelected;
    factura.productos = this.ProductosPost;
    factura.iva = this.iva;
    factura.subTotal = this.subTotal;
    factura.total = this.Total;
    console.log(factura)
    this.service
      .PostFactura(factura)
      .subscribe((response: any) => {
        console.warn(response);
        this.Cancelar();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          }, 
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire("Guardado!", "Su Factura fue guardada!", "success")
          .then(async (result) => {
            if (result.isConfirmed) {
             // console.log("first");
              
              await this.reloadClientes();
              await this.reloadTable()
            }
          });

        //this.dtTrigger.next(this.clientes);
      }); 
    // console.log(this.RootFactPost);
  }

  private CalcularValores() {
    this.subTotal = 0;
    for (const item of this.ProductosPost) {
      if (item.total) {
        this.subTotal += item.total;
      }
    }
    this.iva = this.subTotal * 0.12;
    this.Total = this.subTotal + this.iva;
  }


  ngAfterViewInit(): void {
    var _thisDoc = this;
    $("#clientFac-table").on("click", "#Editar", function (data) {
      _thisDoc.editar.nativeElement.click(); //<-- here
      let datas = $("#clientFac-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataCliente;

      // _thisDoc.ClienteSelected = datas;
      _thisDoc.SeleccionarCliente(datas);
    });
    // $("#table1").on("click", "#EditarCantidad", function (data) {
    //   var currentRow=$(this).closest("tr"); 
         
    //   var col1=currentRow.find("td:eq(1)").text();
    //   console.log(col1)
    //   this.setItemEdit = true;
    //   // this.productoSeleccionado.idProducto = 0;
 
      
    //     // idProducto?: number
    //     // nombre?: string
    //     // stock?: number
    //     // precio?: number
    //     // esActivo?: boolean
    //     // fechaRegistro?: string
      



    // })
    

    $("#productFac-table").on("click", "#SeleccionarProducto", function (data) {
      let datas = $("#productFac-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as DataProducto;

      _thisDoc.cerrarProducto.nativeElement.click(); //<-- here

     
     datas.precio = Number(datas.precio)
     //console.log(datas)
     _thisDoc.SeleccionarProducto(datas);
      // _thisDoc.ClienteSelected = datas;
     // _thisDoc.SeleccionarCliente(datas);
    });
  }
}
