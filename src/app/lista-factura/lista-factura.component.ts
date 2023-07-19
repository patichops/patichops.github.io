import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { ListaVenta } from "app/Models/Interfaces";
import { ServicesService } from "app/Servicios/services.service";

@Component({
  selector: "app-lista-factura",
  templateUrl: "./lista-factura.component.html",
  styleUrls: ["./lista-factura.component.scss"],
})
export class ListaFacturaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptionsF: DataTables.Settings = {};
  constructor(private service: ServicesService,  private router: Router) {}

  ngOnInit(): void {
    if(sessionStorage.length === 0 || sessionStorage.getItem('token') === null){
      this.router.navigate(['']);
    }

    this.dtOptionsF = {
      ajax: (dataTablesParameters: any, callback) => {
        this.service.GetFacturas().subscribe((data) => {
          callback({ data: data.data });
        });
      },
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json",
      },
      columns: [
        {
          title: "Id Venta",
          data: "idVenta",
        },
        {
          title: "Cliente",
          data: "cliente",
        },
        {
          title: "Documento",
          data: "numeroDocumento",
        },
        {
          title: "Pago",
          data: "tipoPago",
        },
        {
          title: "Fecha Registro",
          data: "fechaRegistro",
          type: "datetime",
        },
        {
          title: "Total",
          data: "total",
          render: $.fn.dataTable.render.number(",", ".", 2, "$ "),
          type: "currency",
        },
      ],
      columnDefs: [
        {
          targets: 6,
          title: "Opción",
          data: "",
          render: function (data, type, row) {
            return `<button
              id="btnVer" 
              class="btn btn-primary btn-sm btn-round"
            >
             Ver
            </button>`;
          },
        },
      ],
    };
  }


  ngAfterViewInit(): void {

    var _thisDoc = this;
  
    $("#factura-table").on("click", "#btnVer", function (data) {
      let datas = $("#factura-table")
        .DataTable()
        .row($(this).parents("tr"))
        .data() as ListaVenta;

      
        _thisDoc.VerFactura(datas.idVenta);
    });
  }

  VerFactura(id: number) {
    let ruta = '/verFactura/' + id;
    this.router.navigateByUrl(ruta);
  }
}
