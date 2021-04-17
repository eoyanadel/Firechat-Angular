import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => {
      console.log('Usuario: ', user);

      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }


  login(proveedor: string): void {

    if (proveedor === 'google') {
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }

  }

  logout(): void {
    this.usuario = {};
    this.afAuth.signOut();
  }


  cargarMensajes(): any {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                           .limit(5));

    return this.itemsCollection.valueChanges()
                              .pipe(
                              map( (mensajes: Mensaje[]) => {
                                console.log(mensajes);
                                /* this.chats = mensajes; */
                                this.chats = [];
                                for (const mensaje of mensajes) {
                                  this.chats.unshift(mensaje);
                                }

                                return this.chats;
                              })
                              );
  }


  agregarMensaje(texto: string): Promise<DocumentReference<Mensaje>> {

    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.itemsCollection.add(mensaje);
  }
}
