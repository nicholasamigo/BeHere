import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserCredential } from 'firebase/auth';
import { User } from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<Observable<User>> = new BehaviorSubject<Observable<User>>(null);

  user$ = this.user.asObservable().pipe(switchMap((user: Observable<User>) => user));

  constructor(private afAuth: AngularFireAuth) {
    const auth = getAuth();
    
    onAuthStateChanged(auth, (user: User | null) => {
      this.user.next(auth.);
    });
  }

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