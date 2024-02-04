import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { SubscribersComponent } from 'app/subscribers/subscribers.component';
import { EmployeesComponent } from 'app/layouts/admin-layout/employees/employees.component';
import { NewsPublicationComponent } from 'app/layouts/admin-layout/news-publication/news-publication.component';
import { EmployeesListComponent } from 'app/layouts/admin-layout/employees-list/employees-list.component';
import { AndhraJyothiComponent } from './link-news/andhra-jyothi/andhra-jyothi.component';
import { AdvertisementManagementComponent } from 'app/advertisement-management/advertisement-management.component';
import { EmployeeTracingManagementComponent } from './employee-tracing-management/employee-tracing-management.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'news', component: NewsPublicationComponent },
    { path: 'news/:type', component: AndhraJyothiComponent },
    { path: 'employee-management', component: EmployeesComponent },
    { path: 'employees', component: EmployeesListComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'subscribers', component: SubscribersComponent },
    { path: 'advertisementManagement', component: AdvertisementManagementComponent },
    { path: 'employee-tracing', component: EmployeeTracingManagementComponent },
];
