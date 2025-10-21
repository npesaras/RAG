# Wolfie: Web-based Retrieval Augemented Generation (RAG) Application

This repository contains a web-based Retrieval-Augmented Generation (RAG) application developed for the College of Computer Studies at Mindanao State University – Iligan Institute of Technology (MSU‑IIT).

## Environment Setup

To run this repository locally without any issues, we need to setup the following environment:

1. Node.js (v20.x.x or later)
2. npm (v9.x.x or later)
3. Ngrok (for exposing local server to the internet)
4. Docker (for containerization)
5. N8N (for workflow automation)

### Ngrok setup and configuration

Ngrok setup and configuration

Using snap package manager to install ngrok
```bash
snap install ngrok
```

Authenticate your ngrok installation with your auth token
```bash
ngrok config add-authtoken <your_auth_token>
```

Deploy ngrok on port <your_port>
```bash
ngrok http <your_port>
```

### Docker setup and configuration

Make sure you have Docker installed on your machine. You can download it from [Docker's official website](https://www.docker.com/get-started).

