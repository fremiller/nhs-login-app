import { ChatInfo } from "./components/Messaging";

export type RootStackParamList = {
    OpenidSettings: undefined,
    Welcome: undefined,
    Dashboard: undefined,
    OpenidDetails: undefined,
    Environment: undefined,
    LoginWebview: {url: string},
    Chat: {
      chat: ChatInfo
    }
  }
