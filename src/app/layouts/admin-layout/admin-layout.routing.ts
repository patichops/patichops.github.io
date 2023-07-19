import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ClienteComponent } from 'app/cliente/cliente.component';
import { ProductoComponent } from 'app/producto/producto.component';
import { ListaFacturaComponent } from 'app/lista-factura/lista-factura.component';
import { VerFacturaComponent } from 'app/ver-factura/ver-factura.component';
import { CrearFacturaComponent } from 'app/crear-factura/crear-factura.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'clientes',  component: ClienteComponent },
    { path: 'productos',  component: ProductoComponent },
    { path: 'facturas',  component: ListaFacturaComponent },
    { path: 'verFactura/:id',  component: VerFacturaComponent },
    { path: 'creaFactura',  component: CrearFacturaComponent },
];
