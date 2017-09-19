import { Subject, Subscription } from 'rxjs/Rx';
import { EmployeeService } from '../employee-service/employee.service';
import { CipherModel } from '../cipher-service/cipher.model';
import { CipherService } from '../cipher-service/cipher.service';
import { SalaryModel } from './salary.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class SalaryService {
    private dbRef: FirebaseListObservable<any>;
    private data: any;
    private subscription: Subscription;

    constructor (private cipherService: CipherService,
                 private angularFireDB: AngularFireDatabase,
                 private employeeService: EmployeeService) {
      this.dbRef = this.angularFireDB.list('/salaries');
      this.subscription = this.dbRef.subscribe(data => {
        this.data = data;
      });
    }

    unsubscribe() {
        this.employeeService.unsubscribe();
        this.subscription.unsubscribe();
    }

    getSalaryByEmployee(employee: string, privateKey: string): Promise<Array<SalaryModel>> {
        return new Promise((resolve, reject) => {
            const salaries = new Array<SalaryModel>();
            this.data.forEach(value => {
                if ((value.employee as string).toLowerCase() === employee.toLowerCase()) {
                    const decrypted = this.cipherService.asyncDecrypt(value.salary as CipherModel, privateKey);
                    if (decrypted === 'invalid private key' || decrypted === 'cannot decrypt data' ) {
                        reject(decrypted);
                    } else {
                        salaries.push({employee: value.employee,
                                        salary: this.cipherService.asyncDecrypt(value.salary as CipherModel, privateKey),
                                        year: value.year,
                                        month: value.month});
                    }
                }
            });

            resolve(salaries);
        });
    }

    pushSalary (salary: string): Subject<string> {
        const results = new Subject<string>();
        const splittedData = salary.trim().split('\n');

        splittedData.forEach((row, index) => {
            const splittedRow = row.split(',');
            const result = 'Line ' + (index + 1) + ' --- ' + row;

            if (splittedRow.length !== 4) {
                // TODO: rewrite this
                new Promise<string>(resolve => {
                    resolve(result + ' --- Not submitted. Incorrect format\n');
                }).then(res => {
                    results.next(res);
                });
            } else {
                this.employeeService.getPublicKeyByEmployee(splittedRow[0]).then(publicKey => {
                    this.dbRef.push({employee: splittedRow[0],
                                            salary: this.cipherService.asyncEncrypt(splittedRow[1], publicKey),
                                            year: splittedRow[2],
                                            month: splittedRow[3]});
                    results.next(result + ' --- Successfully submitted\n');
                }, () => {
                    results.next(result + ' --- Not submitted. Employee is not registered in the system\n');
                });
            }
        });
        return results;
    }

}
