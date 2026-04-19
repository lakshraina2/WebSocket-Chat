# Demo WebSocket Chat App

A real-time chat application built with Spring Boot (WebSocket + STOMP + SockJS) and React (Vite).

It supports:
- Text messages
- Image messages
- Voice notes

## Project Structure

- `demo_websocket/` - Spring Boot backend
- `app/frontend/` - React frontend

## Tech Stack

- Backend: Java, Spring Boot WebSocket, STOMP, SockJS
- Frontend: React, Vite, `@stomp/stompjs`, `sockjs-client`

## Prerequisites

- Java (version compatible with `demo_websocket/pom.xml`)
- Node.js and npm

## Run Locally

### 1) Start backend

From `demo_websocket/`:

- Windows:
  - `.\mvnw.cmd spring-boot:run`
- macOS/Linux:
  - `./mvnw spring-boot:run`

Backend runs on `http://localhost:8080` and exposes WebSocket endpoint: `/ws`.

### 2) Start frontend

From `app/frontend/`:

- `npm install`
- `npm run dev`

Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## How to Use

1. Enter your name in the chat UI.
2. Send text with the input + **Send** button.
3. For images:
   - Click **Send image**
   - Select file
   - Click **Send selected image**
4. For voice notes:
   - Click **Record voice note**
   - Click **Stop recording**
   - Click **Send voice note**

## Useful Commands

### Frontend

- npm run dev

### Backend

- ./mvnw.cmd spring-boot:run

## Screenshots

<img width="818" height="752" alt="Screenshot 2026-04-20 020050" src="https://github.com/user-attachments/assets/e217869a-11e3-4347-970c-e9b7f35ad731" />
<img width="735" height="702" alt="Screenshot 2026-04-20 020112" src="https://github.com/user-attachments/assets/0e2639ac-fc5a-484d-860f-d190b1146774" />
<img width="985" height="292" alt="Screenshot 2026-04-20 020207" src="https://github.com/user-attachments/assets/77c8412c-2af4-4eba-8e51-c7bc77c48316" />


## Notes

- Media is sent as Base64 data over WebSocket for demo purposes.
- For production-scale apps, use file/object storage and send URLs instead of large Base64 payloads.
