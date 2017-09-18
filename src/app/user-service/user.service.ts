import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Promise, User, auth } from 'firebase/app';

@Injectable()
export class UserService {
    private readonly adminDomain = '@admin.com';
    private readonly userDomain = '@donriver.com';
    private currentUser: User;
    private changingUser = true;
    public isAdminPart = false;

    constructor (private angularFireAuth: AngularFireAuth) {
        this.angularFireAuth.authState.subscribe(auth => {
            // console.log('user', auth);
            this.currentUser = auth;
            this.changingUser = false;
        });
    }

    getUserName(): string {
        return this.currentUser.displayName;
    }

    getUserEmail(): string {
        return this.currentUser.email;
    }

    isChangingUser(): boolean {
        return this.changingUser;
    }

    signInWithEmail(email: string, password: string): Promise<any> {
        // this.changingUser = true;
        return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    }

    signInWithGoogleRedirect(): Promise<any> {
        this.changingUser = true;
        return this.angularFireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider);
    }

    signInWithGooglePopup(): Promise<any> {
        this.changingUser = true;
        return this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider);
    }

    isAdminSignedIn(): boolean {
        return this.currentUser && this.currentUser.email.includes(this.adminDomain);
    }

    isUserSignedIn(): boolean {
        return this.currentUser !== null;
    }

    isCorrectUserDomain(): boolean {
        return this.currentUser && this.currentUser.email.includes(this.userDomain);
    }

    signOut() {
        this.changingUser = true;
        this.angularFireAuth.auth.signOut();
    }
}
