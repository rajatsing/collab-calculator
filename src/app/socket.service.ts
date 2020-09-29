import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SocketService {

    private socket: WebSocket;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
        this.socket = new WebSocket("ws://"+"servego.herokuapp.com"+'/ws');
        this.socket.onmessage = event => {
            this.listener.emit({"type": "message", "data": JSON.parse(event.data)});
        }
    }

    public send(data: string) {
        this.socket.send(data); // sending data to the backend
    }

    public close() {
        this.socket.close(); // closing a socket when a client leaves
    }

    public getEventListener() {
        return this.listener;
    }

}
