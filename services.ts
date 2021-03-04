import { Messaging } from "./components/Messaging";
import { NhsLogin } from "./components/NhsLogin";

export const NhsLoginInstance: NhsLogin = new NhsLogin();
export var MessagingInstance: Messaging | undefined;

export function setMessagingInstance(msg: Messaging){
    MessagingInstance = msg;
}

export type RootStackParamList = {
    OpenidSettings: undefined,
    Welcome: undefined,
    Dashboard: undefined,
    OpenidDetails: undefined,
    Environment: undefined
  }
