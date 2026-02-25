import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private readonly keyHex = '7af35bce04bd4d60d3a70968e96c76a1818bbd1a235843ad1a00366534a4a102';

    private async getKey(): Promise<CryptoKey> {
        const keyBytes = this.hexToBytes(this.keyHex);
        return await crypto.subtle.importKey(
            'raw',
            keyBytes as unknown as BufferSource,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    private hexToBytes(hex: string): Uint8Array {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
        }
        return bytes;
    }

    private bytesToBase64(bytes: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    private base64ToBytes(base64: string): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    async encrypt(data: any): Promise<string> {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(JSON.stringify(data));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey();

        const encryptedContent = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encodedData as unknown as BufferSource
        );

        const encryptedBytes = new Uint8Array(encryptedContent);

        // WebCrypto appends the 16-byte authentication tag to the cipher text
        const cipherText = encryptedBytes.slice(0, encryptedBytes.length - 16);
        const tag = encryptedBytes.slice(encryptedBytes.length - 16);

        return `${this.bytesToBase64(iv)}.${this.bytesToBase64(tag)}.${this.bytesToBase64(cipherText)}`;
    }

    async decrypt(bundle: string): Promise<any> {
        try {
            const parts = bundle.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid encrypted bundle format');
            }

            const [ivB64, tagB64, cipherTextB64] = parts;

            const iv = this.base64ToBytes(ivB64);
            const tag = this.base64ToBytes(tagB64);
            const cipherText = this.base64ToBytes(cipherTextB64);

            // WebCrypto expects cipher text + tag
            const encryptedData = new Uint8Array(cipherText.length + tag.length);
            encryptedData.set(cipherText);
            encryptedData.set(tag, cipherText.length);

            const key = await this.getKey();

            const decryptedContent = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encryptedData as unknown as BufferSource
            );

            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decryptedContent));
        } catch (error) {
            console.error('Decryption failed', error);
            throw error;
        }
    }
}
