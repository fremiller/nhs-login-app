import {connect, Socket} from "socket.io-client";

export class Messaging {
    sio: typeof Socket
    app_token: string
    static instance: Messaging
    constructor(server_url: string, app_token: string){
        if (Messaging.instance){
            console.warn("Messaging instance already exists");
        }
        Messaging.instance = this;
        this.app_token = app_token;
        this.sio = connect(server_url, {
            transports: ["websocket"],
            // extraHeaders: {
            //     "Authorization": "Bearer " + app_token
            // }
        });
        this.sio.on("connection", () => {
            this.sio.send("hello");
        });
    }
}