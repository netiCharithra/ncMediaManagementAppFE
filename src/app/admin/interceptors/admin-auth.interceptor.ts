import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.storageService.currentUserValue;

        if (user?.employeeId && request.url.includes('/admin/')) {
            const cloned = request.clone({
                setHeaders: {
                    adminAuth: user.employeeId,
                },
            });
            return next.handle(cloned);
        }

        return next.handle(request);
    }
}
