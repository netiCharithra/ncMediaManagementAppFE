import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly secretKey = 'your-secret-key'; // In production, this should be in environment variables

  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  public decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public encryptObject(data: any): string {
    return this.encrypt(JSON.stringify(data));
  }

  public decryptObject<T>(encryptedData: string): T | null {
    try {
      const decrypted = this.decrypt(encryptedData);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}
