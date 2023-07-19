export interface ResponseApi {
  message: string;
  success: boolean;
  data: any;
}

export interface DataCliente {
  codigoCliente?: number;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  direccion?: string;
  telefono?: string;
  cedula?: string;
  rol?: string;
  correo?: string;
  contraseña?: string;
}

export interface RootFacturaPost {
  productos?: ProductoPost[]
  cliente?: DataCliente
  total?: number
  subTotal?: number
  iva?: number
}

export interface DataProducto {
  idProducto?: number
  nombre?: string
  stock?: number
  precio?: number
  esActivo?: boolean
  fechaRegistro?: string
}

export interface ProductoPost {
  idProducto?: number,
  nombre?:string,
  cantidad?: number
  precio?: number
  total?: number
}

export interface ListaVenta {
  idVenta: number
  numeroDocumento: string
  tipoPago: string
  cliente: string
  total: number
  fechaRegistro: string
}


export interface Root {
  factura?: Factura[]
  detalle?: Detalle[]
  iva?: number
  subtotal?: number
}

export interface Factura {
  idVenta?: number
  cedula?: string
  direccion?: string
  telefono?: string
  cliente?: string
  total?: number
  fechaRegistro?: string
}

export interface Detalle {
  idDetalleVenta: number
  idVenta: number
  nombre: string
  cantidad: number
  precio: number
  total: number
}

export interface Usuario {
  idUsuario?: number
  nombreCompleto?: string
  correo?: string
  clave?: string
  esActivo?: boolean
}