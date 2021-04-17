import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;

  constructor(public chatService: ChatService) {
    chatService.cargarMensajes()
               .subscribe( () => {
                 setTimeout(() => {
                  this.elemento.scrollTop = this.elemento.scrollHeight;
                 }, 20);
               });
   }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');
  }


  enviar_mensaje(): void {
    console.log(this.mensaje);

    if (this.mensaje.length === 0) {
      return;
    }

    this.chatService.agregarMensaje(this.mensaje)
                    .then( () => {
                      console.log('Mensaje enviado');
                      this.mensaje = '';
                    })
                    .catch( (err) => console.error('Error al enviar', err));

  }

}
