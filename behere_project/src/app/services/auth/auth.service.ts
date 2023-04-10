import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCredential } from 'firebase/auth';
import { User } from 'firebase/auth';
import { from, Observable, Subject} from 'rxjs';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;

  constructor() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.user = auth.currentUser;
      }
      else {
        // User is signed out
        this.user = null;
      }
      this.loginStatusChangedSubject.next();
    });
  }

  private loginStatusChangedSubject = new Subject<void>();
  loginStatusChanged$ = this.loginStatusChangedSubject.asObservable();

  loginViaGoogle(): Observable<UserCredential> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(auth, provider));
  }

  logout(): Observable<void> {
    const auth = getAuth();
    return from(signOut(auth));
  }
}