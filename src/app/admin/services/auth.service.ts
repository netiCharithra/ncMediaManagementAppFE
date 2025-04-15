import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DataStore } from '../store/data.store';
import { environment } from '../../../environments/environment';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.BE_BASE_URL;

  constructor(
    private http: HttpClient,
    private dataStore: DataStore,
    private encryptionService: EncryptionService
  ) {}

  login(email: string, password: string): Observable<any> {
    // Encrypt request data
    const encryptedData = this.encryptionService.encryptObject({ email, password });
    
    return this.http.post(`${this.apiUrl}/admin/employeeLogin`, { 
      data: encryptedData 
    }).pipe(
      map((response: any) => {
        console.log("RES", response)
        if (response?.data) {
          // Decrypt the response data
          const decryptedData = this.encryptionService.decryptObject<any>(response.data);
          if (decryptedData) {
            console.log("DEC", decryptedData)
            return { ...response, data: decryptedData?.data };
          }
        }
        throw new Error('Invalid response format');
      }),
      tap((response: any) => {
        if (response?.data) {
          console.log(response?.data)
          this.dataStore.setUserData(response.data);
        }
      })
    );
  }

  logout() {
    this.dataStore.clearUserData();
  }
}
