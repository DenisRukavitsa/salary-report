import { CipherModel } from './cipher.model';
import * as forge from 'node-forge/lib';
import { Injectable } from '@angular/core';

@Injectable()
export class CipherService {

    generateKeyPair(callback: (err, keypair) => void) {
        forge.rsa.generateKeyPair({bits: 2048, workers: -1}, callback);
    }

    publicKeyToPem(publicKey): string {
        return forge.pki.publicKeyToPem(publicKey);
    }

    privateKeyToPem(privateKey): string {
        return forge.pki.privateKeyToPem(privateKey);
    }

    asyncEncrypt(text: string, publicKey: string): CipherModel {
        // generate and encapsulate a 16-byte secret key
        const kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
        const kem = forge.kem.rsa.create(kdf1);
        const result = kem.encrypt(forge.pki.publicKeyFromPem(publicKey), 16); // result has 'encapsulation' and 'key'

        // encrypt the text
        const iv = forge.random.getBytesSync(12);
        const someBytes = text;
        const cipher = forge.cipher.createCipher('AES-GCM', result.key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(someBytes));
        cipher.finish();
        const encrypted = cipher.output.getBytes();
        const tag = cipher.mode.tag.getBytes();

        return {encrypted: encrypted, iv: iv, tag: tag, encapsulation: result.encapsulation};
    }

    asyncDecrypt(code: CipherModel, privateKey: string): string {
        // decrypt encapsulated 16-byte secret key
        const kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
        const kem = forge.kem.rsa.create(kdf1);
        let key;
        try {
            key = kem.decrypt(forge.pki.decryptRsaPrivateKey(privateKey), code.encapsulation, 16);
        } catch (Error) {
            return 'invalid private key';
        }

        // decrypt the text
        const decipher = forge.cipher.createDecipher('AES-GCM', key);
        decipher.start({iv: code.iv, tag: code.tag});
        decipher.update(forge.util.createBuffer(code.encrypted));
        const pass = decipher.finish(); // pass is false if there was a failure (eg: authentication tag didn't match)
        if (pass) {
            return decipher.output.getBytes();
        } else {
            return 'cannot decrypt data';
        }

    }
}
