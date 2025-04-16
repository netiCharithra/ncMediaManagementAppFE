import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly SECRET_SALT = 'NC_MEDIA_SALT_2025@#$%'; // Complex salt
  private readonly KEY_SIZE = 256;
  private readonly ITERATIONS = 1000;

  constructor() {}

  encryptObject(obj: any): string {
    try {
      // Convert object to JSON string
      const jsonStr = JSON.stringify(obj);
      return this.encrypt(jsonStr);
    } catch (error) {
      console.error('Object encryption error:', error);
      return '';
    }
  }

  decryptObject<T>(encrypted: string): T | null {
    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Object decryption error:', error);
      return null;
    }
  }

  private encrypt(value: string): string {
    try {
      // Generate a random IV (Initialization Vector)
      const iv = CryptoJS.lib.WordArray.random(16);
      
      // Generate key using PBKDF2
      const key = CryptoJS.PBKDF2(this.SECRET_SALT, iv, {
        keySize: this.KEY_SIZE / 32,
        iterations: this.ITERATIONS
      });

      // Encrypt using AES
      const encrypted = CryptoJS.AES.encrypt(value, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });

      // Combine IV and encrypted data
      const result = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  private decrypt(encrypted: string): string {
    try {
      // Convert from base64
      const ciphertext = CryptoJS.enc.Base64.parse(encrypted);
      
      // Extract IV and data
      const iv = CryptoJS.lib.WordArray.create(ciphertext.words.slice(0, 4));
      const encryptedData = CryptoJS.lib.WordArray.create(ciphertext.words.slice(4));

      // Generate key using PBKDF2
      const key = CryptoJS.PBKDF2(this.SECRET_SALT, iv, {
        keySize: this.KEY_SIZE / 32,
        iterations: this.ITERATIONS
      });

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData.toString(CryptoJS.enc.Base64),
        key,
        {
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }
}