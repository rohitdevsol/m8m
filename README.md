# M8M - AI-Powered Workflow Automation Platform

A powerful, open-source workflow automation platform built with modern web technologies. Create, deploy, and manage AI-driven workflows with an intuitive visual interface and robust execution engine.

## Overview

M8M is a comprehensive workflow automation solution that enables you to build sophisticated AI workflows without writing code. Connect various services, APIs, and AI models to create powerful automation pipelines. Whether you're processing data, integrating services, or building complex AI applications, M8M provides the infrastructure you need.

## Key Features

### Workflow Management

- **Visual Workflow Builder** - Create workflows with an intuitive drag-and-drop interface
- **Version Control** - Track changes and rollback to previous workflow versions
- **Workflow Templates** - Start quickly with pre-built workflow templates
- **Real-time Validation** - Instant feedback on workflow configuration

### Execution Engine

- **Reliable Processing** - Kafka-based message queue ensures no execution is lost
- **Parallel Execution** - Run multiple workflow instances simultaneously
- **Error Handling** - Automatic retries and comprehensive error tracking
- **Execution History** - Complete audit trail of all workflow runs
- **Live Monitoring** - Real-time execution status and logs

### Credentials Management

- **Secure Storage** - Encrypted credential storage for API keys and secrets
- **Multiple Auth Types** - Support for OAuth, API keys, and custom authentication
- **Credential Sharing** - Share credentials across workflows and teams
- **Access Control** - Fine-grained permissions for credential access

### Messaging Integrations

- **Multi-Channel Support** - Connect to Slack, Discord, and more
- **AI Integrations** - Built-in support for Gemini and other AI services
- **Custom Webhooks** - Send and receive data from any HTTP endpoint
- **Event-Driven** - Trigger workflows from external events

### Advanced Capabilities

- **State Management** - Jotai-powered state handling for complex workflows
- **Type Safety** - Full TypeScript support across the stack
- **API-First** - tRPC ensures type-safe API communication
- **Scalable Architecture** - Turborepo monorepo for optimal development

## Tech Stack

### Frontend

- **Next.js 14+** - React framework with App Router
- **React** - UI component library
- **Jotai** - Atomic state management
- **TailwindCSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful, consistent icons
- **Zod** - TypeScript-first schema validation

### Backend

- **tRPC** - End-to-end typesafe APIs
- **Prisma ORM** - Type-safe database client
- **BetterAuth** - Complete authentication solution
- **Kafka** - Distributed message queue for workflow execution
- **Node.js** - Runtime environment

### Infrastructure

- **Turborepo** - High-performance build system
- **PostgreSQL** - Primary database
- **Docker** - Containerization for local development
- **TypeScript** - Type safety across the entire stack

## Architecture

```
m8m/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router pages
│   │   │   ├── components/    # Reusable React components
│   │   │   ├── features/      # Feature-specific modules
│   │   │   │   ├── executions/    # Execution management
│   │   │   │   ├── workflows/     # Workflow builder & management
│   │   │   │   ├── credentials/   # Credential management
│   │   │   │   └── messaging/     # Message channel configs
│   │   │   ├── config/        # App configuration
│   │   │   └── server/        # tRPC server configuration
│   │   └── package.json
│   └── worker/                 # Background worker process
│       ├── src/
│       │   ├── queue/         # Kafka consumer/producer
│       │   ├── executor/      # Workflow execution engine
│       │   └── handlers/      # Message handlers
│       └── package.json
├── packages/
│   ├── database/              # Prisma schema & migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   ├── typescript-config/     # Shared TypeScript configs
│   └── eslint-config/         # Shared ESLint configs
├── docker-compose.yml         # Local development services
├── turbo.json                 # Turborepo configuration
└── package.json               # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Docker and Docker Compose
- PostgreSQL (via Docker or external)
- Kafka (via Docker or external)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/rohitdevsol/m8m.git
cd m8m
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/m8m"

# NextAuth
BETTERAUTH_SECRET="your-secret-key"
BETTERAUTH_URL="http://localhost:3000"

# Kafka
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="m8m-worker"

# Optional: External Services
SLACK_CLIENT_ID=""
SLACK_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
GEMINI_API_KEY=""
```

4. **Start infrastructure services**

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- Kafka message broker
- Zookeeper (for Kafka)

5. **Run database migrations**

```bash
cd packages/database
bun run db:migrate:dev
# or
npm run db:migrate:dev
```

6. **Seed the database (optional)**

```bash
bun run db:seed
# or
npm run db:seed
```

7. **Start the development servers**

```bash
# From the root directory
bun run dev
# or
npm run dev
```

This will start:

- Web app on `http://localhost:3000`
- Worker process for background jobs

### Building for Production

```bash
# Build all packages and apps
bun run build

# Start production servers
bun run start
```

## Development

### Project Structure

The project follows a modular, feature-based architecture:

- **apps/web** - Main Next.js application with tRPC server
- **apps/worker** - Background worker for processing workflow executions
- **packages/database** - Shared Prisma schema and database utilities
- **packages/typescript-config** - Shared TypeScript configurations
- **packages/eslint-config** - Shared ESLint rules

### Key Technologies

#### tRPC

Type-safe API routes without code generation. All API endpoints are defined in `apps/web/src/server/api/routers/` and are fully type-safe on both client and server.

```typescript
// Server-side router
export const workflowRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.workflow.findMany();
  }),
});

// Client-side usage (fully typed!)
const { data: workflows } = api.workflow.getAll.useQuery();
```

#### Jotai

Atomic state management for React. Used for managing complex UI state and workflow builder state.

```typescript
import { atom, useAtom } from "jotai";

const workflowAtom = atom(null);
const [workflow, setWorkflow] = useAtom(workflowAtom);
```

#### Kafka

Message queue for reliable workflow execution. The worker process consumes messages from Kafka topics and executes workflows.

```typescript
// Producer (in web app)
await producer.send({
  topic: "workflow-executions",
  messages: [{ value: JSON.stringify(execution) }],
});

// Consumer (in worker)
await consumer.subscribe({ topic: "workflow-executions" });
```

#### Prisma

Type-safe database access with auto-generated types.

```typescript
const execution = await prisma.execution.create({
  data: {
    workflowId: workflow.id,
    status: "RUNNING",
    startTime: new Date(),
  },
});
```

### Available Scripts

From the root directory:

```bash
# Development
bun run dev              # Start all apps in development mode
bun run dev:web          # Start only the web app
bun run dev:worker       # Start only the worker

# Building
bun run build            # Build all apps and packages
bun run build:web        # Build only the web app
bun run build:worker     # Build only the worker

# Database
bun run db:migrate:dev   # Create and apply migrations
bun run db:migrate:deploy # Apply migrations in production
bun run db:seed          # Seed the database
bun run db:studio        # Open Prisma Studio

# Code Quality
bun run lint             # Lint all packages
bun run format           # Format code with Prettier
bun run type-check       # Run TypeScript type checking
```

## Features Deep Dive

### Workflow Builder

Create workflows using a visual node-based editor:

- Drag and drop nodes
- Connect nodes to define execution flow
- Configure node parameters
- Test workflows in real-time

### Execution Management

Monitor and manage workflow executions:

- View execution history
- Inspect detailed logs
- Retry failed executions
- Cancel running executions

### Credential System

Securely manage API credentials:

- Create and store credentials
- Use credentials in workflow nodes
- Share credentials with team members
- Rotate credentials without updating workflows

### Messaging Channels

Connect to external services:

- **Slack**: Send messages, create channels, post updates(Working on it...)
- **Discord**: Send webhooks, manage servers
- **Gemini AI**: Integrate Google's AI capabilities
- **Custom Webhooks**: Connect to any HTTP endpoint

## Configuration

### Environment Variables

| Variable                | Description                  | Required |
| ----------------------- | ---------------------------- | -------- |
| `DATABASE_URL`          | PostgreSQL connection string | Yes      |
| `BETTERAUTH_SECRET`     | Secret for NextAuth.js       | Yes      |
| `BETTERAUTH_URL`        | Base URL of the application  | Yes      |
| `KAFKA_BROKERS`         | Kafka broker addresses       | Yes      |
| `KAFKA_CLIENT_ID`       | Kafka client identifier      | Yes      |
| `SLACK_CLIENT_ID`       | Slack OAuth client ID        | No       |
| `SLACK_CLIENT_SECRET`   | Slack OAuth client secret    | No       |
| `DISCORD_CLIENT_ID`     | Discord OAuth client ID      | No       |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret  | No       |
| `GEMINI_API_KEY`        | Google Gemini API key        | No       |

### Database Configuration

The application uses Prisma ORM with PostgreSQL. The schema is defined in `packages/database/prisma/schema.prisma`.

To modify the schema:

1. Edit `schema.prisma`
2. Run `bun run db:migrate:dev` to create a migration
3. Apply the migration to update the database

### Kafka Configuration

Kafka is used for reliable message queuing. Configure topics in `apps/worker/src/config/kafka.ts`:

```typescript
export const TOPICS = {
  WORKFLOW_EXECUTION: "workflow-executions",
  WORKFLOW_EVENTS: "workflow-events",
  NOTIFICATIONS: "notifications",
};
```

## Deployment

### Docker Deployment

1. Build the Docker images:

```bash
docker build -t m8m-web -f apps/web/Dockerfile .
docker build -t m8m-worker -f apps/worker/Dockerfile .
```

2. Run with Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment

The application can be deployed to various cloud platforms:

- **Vercel**: Deploy the web app directly (automatically configured)
- **Railway**: Full-stack deployment with PostgreSQL and Kafka
- **AWS**: Use ECS for containers, RDS for PostgreSQL, MSK for Kafka
- **Google Cloud**: Use Cloud Run, Cloud SQL, and Pub/Sub

## API Documentation

### tRPC Endpoints

All API endpoints are type-safe and defined using tRPC. Access the API playground at `http://localhost:3000/api/trpc-playground` in development.

#### Workflows

- `workflow.getAll` - Get all workflows
- `workflow.getById` - Get workflow by ID
- `workflow.create` - Create new workflow
- `workflow.update` - Update workflow
- `workflow.delete` - Delete workflow

#### Executions

- `execution.getAll` - Get all executions
- `execution.getById` - Get execution by ID
- `execution.getLogs` - Get execution logs
- `execution.retry` - Retry failed execution
- `execution.cancel` - Cancel running execution

#### Credentials

- `credential.getAll` - Get all credentials
- `credential.create` - Create new credential
- `credential.update` - Update credential
- `credential.delete` - Delete credential

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict type checking
- Follow the existing code style (enforced by ESLint)
- Write unit tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## Testing

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch
```

## Performance

M8M is built for performance:

- **Turborepo** caching reduces build times by up to 85%
- **tRPC** eliminates API overhead with direct function calls
- **Kafka** ensures reliable, scalable message processing
- **Prisma** provides optimized database queries
- **Next.js** enables fast page loads with server-side rendering

## Security

- All credentials are encrypted at rest
- NextAuth.js provides secure authentication
- Environment variables for sensitive configuration
- CORS protection on API endpoints
- SQL injection prevention via Prisma ORM
- XSS protection in React components

## Troubleshooting

### Common Issues

**Database connection failed**

```bash
# Check if PostgreSQL is running
docker-compose ps

# Reset the database
bun run db:reset
```

**Kafka connection failed**

```bash
# Check Kafka logs
docker-compose logs kafka

# Restart Kafka
docker-compose restart kafka zookeeper
```

**Port already in use**

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 bun run dev
```

## Roadmap

- [ ] Visual workflow debugging
- [ ] Workflow marketplace
- [ ] Advanced scheduling options
- [ ] Multi-tenant support
- [ ] Webhook triggers
- [ ] GraphQL support
- [ ] Mobile app
- [ ] Advanced analytics dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- Documentation: [docs.m8m.dev](https://docs.m8m.dev)
- Discord Community: [discord.gg/m8m](https://discord.gg/m8m)
- GitHub Issues: [github.com/rohitdevsol/m8m/issues](https://github.com/rohitdevsol/m8m/issues)
- Email: support@m8m.dev

## Acknowledgments

Built with amazing open-source technologies:

- Next.js
- tRPC
- Prisma
- Kafka
- Jotai
- Zustand
- TailwindCSS
- And many more!

---

Made with ❤️ by the Rohit
