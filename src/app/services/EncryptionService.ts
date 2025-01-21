import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'mySecretKey123!';

  // encrypt(data: string): string {
  //   const iv = CryptoJS.lib.WordArray.random(16);
  //   console.log(this.secretKey)
  //   const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(this.secretKey), {
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7,
  //   });
  //   return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  // }

  // decrypt(encryptedData: string): string {
  //   const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // }
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}