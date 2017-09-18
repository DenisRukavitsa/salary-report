import { CipherModel } from '../cipher-service/cipher.model';

export interface SalaryModel {
    employee: string;
    salary: CipherModel | string;
    year: string;
    month: string;
}
