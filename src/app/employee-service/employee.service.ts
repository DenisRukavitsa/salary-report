import { UserService } from '../user-service/user.service';
import { CipherModel } from '../cipher-service/cipher.model';
import { CipherService } from '../cipher-service/cipher.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class EmployeeService {
    private dbRef: FirebaseListObservable<any>;

    constructor (private cipherService: CipherService,
                 private angularFireDB: AngularFireDatabase) {
      this.dbRef = this.angularFireDB.list('/employees');
    }

    isEmployeeRegistered(email: string, callback: (isRegistered: boolean) => void) {
        this.dbRef.forEach(data => {
            let result = false;
            data.forEach(element => {
                if (element.email === email) {
                    result = true;
                }
            });

            callback(result);
        });
    }

    registerEmployee(employeeName: string, email: string): Promise<string> {
        return new Promise(resolve => {
            this.cipherService.generateKeyPair((err, keypair) => {
                const privateKey = this.cipherService.privateKeyToPem(keypair.privateKey);
                this.dbRef.push({employee: employeeName,
                                email: email,
                                publicKey: this.cipherService.publicKeyToPem(keypair.publicKey)});
                localStorage.setItem('privateKey', privateKey);
                resolve(privateKey);
            });
        });
    }

    getPublicKeyByEmployee(employee: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dbRef.forEach(data => {
                data.forEach(element => {
                    if (element.employee === employee) {
                        resolve(element.publicKey);
                    } else {
                        reject();
                    }
                });
            });
        });
    }

}
