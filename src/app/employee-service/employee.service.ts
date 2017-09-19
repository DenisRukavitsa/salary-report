import { Subscription } from 'rxjs/Rx';
import { UserService } from '../user-service/user.service';
import { CipherModel } from '../cipher-service/cipher.model';
import { CipherService } from '../cipher-service/cipher.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class EmployeeService {
    private dbRef: FirebaseListObservable<any>;
    private data: any;
    private subscriptions: Array<Subscription>;

    constructor (private cipherService: CipherService,
                 private angularFireDB: AngularFireDatabase) {
      this.dbRef = this.angularFireDB.list('/employees');
      this.subscriptions = new Array();
    }

    unsubscribe() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    isEmployeeRegistered(email: string): Promise<boolean> {
        return new Promise(resolve => {
            this.subscriptions.push(this.dbRef.subscribe(data => {
                let result = false;
                data.forEach(element => {
                    if (element.email === email) {
                        result = true;
                    }
                });

                resolve(result);
            }));
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
            this.subscriptions.push(this.dbRef.subscribe(data => {
                data.forEach(element => {
                    if (element.employee === employee) {
                        resolve(element.publicKey);
                    } else {
                        reject();
                    }
                });
            }));
        });
    }

}
