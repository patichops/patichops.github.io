import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Detalle, Factura, Root } from 'app/Models/Interfaces';
import { ServicesService } from 'app/Servicios/services.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ver-factura',
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.scss']
})
export class VerFacturaComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private service: ServicesService) { }

  private rol = ""

  idFactura = "";
  @ViewChild('htmlData') htmlData!: ElementRef;

  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      console.log(fileHeight)
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      var nombre = "factura" + "-" + this.idFactura +".pdf"
      PDF.save(nombre);
    });
  }

  ngOnInit(): void {
    if(sessionStorage.length === 0 || sessionStorage.getItem('token') === null){
      this.router.navigate(['']);
    }

    this.rol = sessionStorage.getItem('rol');

    this.idFactura = this.route.snapshot.paramMap.get('id');
    this.GetFacturaId(this.idFactura)
   
  }

  factura:Factura = {};
  detalle:Detalle[] = [];
  iva = 0;
  subtotal = 0;

  GetFacturaId(id){
    this.service.GetFacturasId(id).subscribe( (data:Root)=>{
      this.factura = data.factura[0]
      this.detalle = data.detalle;
      this.iva = data.iva;
      this.subtotal = data.subtotal;
      console.log(data)
    })
  }




}
