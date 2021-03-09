# nhs-login-app

A GP chat app integrated into NHS Login

## Key features

- Openid Connect
    - Scope selection
    - Environment selection
    - Vector of trust selection
- Fido UAF
- Chat application
    - Realtime websocket-based chat
    - Image upload
    - Push Notifications

# Setup

Debug build: `npm run android`

1. Run the app and select `Change Environment`.
2. Enter the URL of the server to connect to. (Test server: https://du-nhs-login.herokuapp.com)
    - See [fishfred/nhs-login-app-server](https://github.com/fishfred/nhs-login-app-server) for server setup
3. Select which environment to log in to

