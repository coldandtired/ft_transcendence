# ft_transcendence
The final 42 Common Core project.
## Description
This it the last project of the 42 Common Core. It's a group project for 3-5 students and tests you on the methods you've learned since starting at the school, and how to apply them to a completely different type of project.

The basic requirement is for an SPA (Single Page Application) where users can play a [Pong](https://en.wikipedia.org/wiki/Pong) tournament against each other. The basic requirements need to be extended with a series of modules to add functionality. On top of this, the languages and frameworks necessary change from time to time.

## Modules
- 2FA/JWT
- 3D Game
- AI opponent
- Backend framework (Fastify)
- Database (SQLite)
- Expanded browser compatibility
- Frontend framework (Tailwind CSS)
- Live chat
- Multiple language support
- Remote authentication (Google Sign-in)
- Remote players
- Server-Side Rendering
- User management
- WAF/ModSecurity

## Technologies used
![](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Running
- Install [Docker](https://www.docker.com/).
- Rename the .env-example file to .env.
- Edit the values inside .env (optional):
    - Change the JWT_SECRET to something better
    - GOOGLE_CLIENT and GOOGLE_SECRET are for [Google sign-in](https://support.google.com/cloud/answer/15549257?hl=en).
    - APP_ISSUER is for 2FA via an authenticator app.
    - The rest are for 2FA via email.
- If you want to run the WAF tests you'll need to edit the HOST in waf/tests/waf_checks.sh.
- Run `docker compose up --build` or if you have Make installed, `make`.


## Screenshots
<img width="480" height="360" alt="transcendence_auth" src="https://github.com/user-attachments/assets/9a5553cc-3d37-4a3c-9ea2-bfa0cb653c24" /><br>
Auth

<img width="480" height="360" alt="transcendence_account" src="https://github.com/user-attachments/assets/a2fd040b-4775-4be1-ad67-2f6f6c0f4586" /><br>
Account

<img width="480" height="360" alt="transcendence_game" src="https://github.com/user-attachments/assets/d69750a9-b81c-4c52-bef4-bed47919b77d" /><br>
Games

<img width="480" height="360" alt="transcendence_match_lobby" src="https://github.com/user-attachments/assets/a858fdd4-daaf-4829-b7a9-dd6bc1ab3bab" /><br>
Match lobby

<img width="480" height="360" alt="transcendence_match" src="https://github.com/user-attachments/assets/97563901-0324-4fd3-b42e-86086d7900a3" /><br>
Match

<img width="480" height="360" alt="transcendence_match_over" src="https://github.com/user-attachments/assets/84286f92-dde1-4b2c-9544-331c1e9de5d4" /><br>
Match over

<img width="480" height="360" alt="transcendence_local_tournament" src="https://github.com/user-attachments/assets/afbf943a-f07f-4c75-b458-7e0bd0b2e81b" /><br>
Local tournament

<img width="480" height="360" alt="transcendence_tournament_lobby" src="https://github.com/user-attachments/assets/9fe276bd-00ef-4e5d-9c7d-c74d451e745d" /><br>
Tournament lobby

<img width="480" height="360" alt="transcendence_users" src="https://github.com/user-attachments/assets/13a9a3d7-1cf5-4214-b48f-5adbfd0da2cb" /><br>
Users

<img width="480" height="360" alt="transcendence_match_history" src="https://github.com/user-attachments/assets/2ce40ff8-8b4a-490a-a91f-79d2aa6e3f02" /><br>
Match history

<img width="480" height="360" alt="transcendence_chat" src="https://github.com/user-attachments/assets/00398bbd-a73d-481d-a543-25f6606c7aef" /><br>
Chat
