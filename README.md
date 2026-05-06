# M8M - AI-Powered Workflow Automation Platform

A powerful, open-source workflow automation platform built with modern web technologies. Create, deploy, and manage AI-driven workflows with an intuitive visual interface and robust execution engine.

## Overview

M8M enables you to build sophisticated AI workflows without writing code. Connect various services, APIs, and AI models (like Gemini and OpenAI) to create powerful automation pipelines processed reliably through a Kafka-based execution engine.

## Architecture & Flow

```mermaid
graph TD
    subgraph Frontend[Frontend Application]
        UI[Visual Builder]
        State[Jotai State]
    end

    subgraph Backend[Backend API]
        API[tRPC Server]
    end

    subgraph Infrastructure[Data & Events]
        DB[(PostgreSQL)]
        Kafka[Kafka Broker]
    end

    subgraph Worker[Execution Engine]
        Executor[Workflow Engine]
    end

    subgraph Integrations[External Services]
        AI[LLM Providers]
        Messaging[Webhooks & Chat]
    end

    UI <--> State
    UI -->|RPC Calls| API
    API -->|Responses| UI
    
    API <-->|Read/Write| DB
    API -->|Publish Job| Kafka
    
    Kafka -->|Consume Job| Executor
    Executor -->|Update State| DB
    
    Executor <-->|API Requests| AI
    Executor -->|Push Events| Messaging
```

## Core Concepts

Understanding M8M requires familiarity with a few core components that make up the automation pipeline:

- **Nodes:** The fundamental building blocks of a workflow. Each node represents a single unit of work—such as extracting data, calling an AI model, executing custom TypeScript logic, or sending a Slack message.
- **Edges:** The connections between nodes that define the execution path. Edges carry the state and payload from the output of one node to the input of the next, allowing for complex branching and conditionals.
- **Workflows:** A Directed Acyclic Graph (DAG) consisting of Nodes and Edges. Workflows are visually constructed on the canvas and define the end-to-end automation sequence.
- **Executions:** A single, tracked run of a Workflow. When a workflow is triggered (via webhook, schedule, or manual run), an Execution is created. It tracks the state of every node, capturing logs, inputs, outputs, and any errors.
- **Event Bus:** Powered by Kafka, the Event Bus decouples the web interface from the execution engine. When an execution is requested, a job is published to the broker. The background worker consumes these jobs, ensuring that no execution is lost even if the system restarts, and enabling horizontal scaling of the workers.
- **Credentials Vault:** A secure, encrypted storage layer for your API keys and OAuth tokens. Nodes reference these credentials by ID, ensuring that sensitive information is never exposed in the workflow payload or frontend canvas.

## Key Features

- **Visual Workflow Builder:** Intuitive drag-and-drop interface with real-time validation.
- **Enterprise Execution:** Kafka-powered message queue ensures zero lost events and parallel execution.
- **Secure Vault:** Encrypted credential storage with fine-grained access control.
- **AI Native:** Built-in integration for Gemini, OpenAI, and Anthropic.
- **Multi-Channel:** Connect to Discord, Slack, and custom webhooks.

## Tech Stack

- **Frontend:** Next.js 14, React, Jotai, TailwindCSS
- **Backend:** tRPC, Prisma ORM, BetterAuth
- **Infrastructure:** Turborepo, PostgreSQL, Kafka, Docker

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Docker & Docker Compose

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/rohitdevsol/m8m.git
   cd m8m
   bun install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` with your PostgreSQL, Kafka, and Auth configurations.*

3. **Start Infrastructure**
   ```bash
   docker-compose up -d
   ```
   *Note: This spins up the required PostgreSQL database and Kafka/Zookeeper instances for local development.*

4. **Database Migration**
   ```bash
   cd packages/database
   bun run db:migrate:dev
   ```

5. **Start Development Server**
   ```bash
   # From the root directory
   bun run dev
   ```
   *Web app starts on `http://localhost:3000` alongside the background worker.*

## Support & License

- **Documentation:** [docs.m8m.dev](https://docs.m8m.dev)
- **Discord Community:** [discord.gg/m8m](https://discord.gg/m8m)
- **License:** MIT License
