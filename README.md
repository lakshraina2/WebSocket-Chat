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

## Notes

- Media is sent as Base64 data over WebSocket for demo purposes.
- For production-scale apps, use file/object storage and send URLs instead of large Base64 payloads.
