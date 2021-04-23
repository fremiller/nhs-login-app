import {Manager} from 'socket.io-client';
import {connect, Socket} from 'socket.io-client';
import {NhsLogin} from './NhsLogin';

export interface ChatInfo {
  gp: GPUser;
  patient?: User;
}

export interface User {
  name: string;
  nhsNumber: string;
}

export interface GPUser {
  name: string;
  location: string;
  image: string;
  id: string;
}

export type MessageType = 'text' | 'image';

export interface Message {
  type: MessageType;
  data: string;
  time: number;
}

export type DisplayMessage = Message & {gp: boolean};

export class Messaging {
  sio: typeof Socket;
  app_token: string;
  server_url: string;
  static instance: Messaging;
  constructor(server_url: string, app_token: string) {
    if (Messaging.instance) {
      console.warn('Messaging instance already exists');
    }
    Messaging.instance = this;
    this.app_token = app_token;
    this.server_url = server_url;
    const manager = new Manager(server_url);
    this.sio = connect(server_url, {
      transports: ['websocket'],
      query: {
        env: NhsLogin.instance.env.name,
      },
      //@ts-ignore
      auth: {
        token: app_token,
      },
    });
    this.sio.on('message:text', (msg: Message, gp: boolean) => {
      if (this.onMessageHandler) {
        this.onMessageHandler({
          ...msg,
          gp,
        });
      }
    });
  }

  sendTextMessage(chatid: string, text: string) {
    this.sio.emit('message:text', {
      chatid,
      text,
    });
  }

  async getChats(): Promise<{chats: ChatInfo[]} | {error: string}> {
    const chats = await fetch(
      this.server_url + '/chats?env=' + NhsLogin.instance.env.name,
      {
        headers: {
          Authorization: 'Bearer ' + this.app_token,
        },
      },
    )
      .then((res) => res.json())
      .catch((e) => console.log(e));
    return chats;
  }

  async getMessages(
    id: string,
  ): Promise<{messages?: DisplayMessage[]; error?: String}> {
    const messages = await fetch(
      this.server_url + `/chat/${id}?env=` + NhsLogin.instance.env.name,
      {
        headers: {
          Authorization: 'Bearer ' + this.app_token,
        },
      },
    )
      .then((res) => res.json())
      .catch((e) => console.log(e));
    console.log(messages);
    const {gpToPatient, patientToGp} = messages as {
      gpToPatient: Message[];
      patientToGp: Message[];
    };
    let messagesCombined = gpToPatient
      .map((g) => {
        return {...g, gp: true} as DisplayMessage;
      })
      .concat(
        patientToGp.map((g) => {
          return {...g, gp: false} as DisplayMessage;
        }),
      );
    messagesCombined.sort((a, b) => a.time - b.time);
    return {
      messages: messagesCombined,
    };
  }

  onMessageHandler?: (msg: DisplayMessage) => void;

  registerOnMessageHandler(handler: (msg: DisplayMessage) => void) {
    this.onMessageHandler = handler;
  }
}
