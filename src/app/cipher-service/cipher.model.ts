export interface CipherModel {
    encrypted: string;
    iv: string;
    key?: string;
    tag?: string;
    encapsulation?: string;
}
