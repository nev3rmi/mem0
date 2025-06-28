# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## OpenMemory Development

OpenMemory is a self-hosted, private memory layer for LLMs built with FastAPI + Next.js + Docker.

### Quick Start Commands

```bash
# Initial setup
make env           # Copy .env.example files
make build         # Build Docker images  
make up            # Start all services

# Alternative one-line setup
curl -sL https://raw.githubusercontent.com/mem0ai/mem0/main/openmemory/run.sh | OPENAI_API_KEY=your_key bash
```

### Development Commands

```bash
# Container management
make up            # Start development environment
make down          # Stop and clean up containers  
make logs          # View container logs
make shell         # Access API container shell

# Database operations
make migrate       # Run Alembic migrations
make upgrade       # Same as migrate
make downgrade     # Rollback one migration

# Frontend development
make ui-dev        # Install deps and start Next.js dev server
cd ui && pnpm dev  # Manual frontend development
```

### Project Architecture

**Stack:**
- **Backend**: FastAPI with MCP (Model Context Protocol) server
- **Frontend**: Next.js 15 with React 19, TypeScript, shadcn/ui
- **Database**: SQLite (default) with SQLAlchemy ORM + Alembic migrations
- **Vector Store**: Qdrant for memory embeddings
- **State Management**: Redux Toolkit

**Key Services:**
- `mem0_store`: Qdrant vector database (port 6333)
- `openmemory-mcp`: FastAPI backend + MCP server (port 8765)
- `openmemory-ui`: Next.js frontend (port 3000)

### Environment Configuration

Required environment variables:

**`/api/.env`:**
```env
OPENAI_API_KEY=sk-xxx
USER=user_id
```

**`/ui/.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8765
NEXT_PUBLIC_USER_ID=user_id
```

### Database Schema

Core models:
- **User**: User management with unique user_id constraints
- **App**: Application containers for organizing memories
- **Memory**: Core memory storage with vector embeddings
- **Category**: Auto-categorization using OpenAI
- **AccessControl**: Permission management system
- **MemoryAccessLog**: Access tracking and analytics

### API Structure

**Key Endpoints:**
- `/api/v1/memories` - Memory CRUD operations
- `/api/v1/apps` - Application management
- `/api/v1/stats` - Analytics and statistics  
- `/api/v1/config` - Configuration management
- `/mcp/*` - MCP server endpoints for LLM integration

**Authentication**: User-based via USER environment variable

### Frontend Architecture

**Component Organization:**
```
ui/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui component library
│   ├── dashboard/         # Dashboard-specific components
│   └── shared/            # Shared business components
├── hooks/                 # Custom React hooks for API calls
├── store/                 # Redux Toolkit slices
└── lib/                   # Utility functions
```

**State Management**: Redux slices for memories, apps, config, UI, filters, and profile

### Testing

```bash
make test           # Run tests in container
make test-clean     # Run tests and clean volumes
```

### Key Features

**Memory Management:**
- Automatic categorization using OpenAI
- Vector embeddings with Qdrant integration
- Memory lifecycle states (active, paused, archived, deleted)
- Related memory suggestions based on vector similarity

**MCP Integration:**
- Model Context Protocol server for LLM memory access
- Lazy client initialization with graceful fallbacks
- Memory operations exposed via MCP for AI agents

**UI Features:**
- Memory dashboard with advanced filtering
- App management interface
- Real-time statistics and analytics
- Dark/light theme support
- Responsive design

### Development Tips

**Backend Development:**
- FastAPI app auto-reloads on file changes in development
- Use `make shell` to access container for debugging
- Alembic handles all database schema changes

**Frontend Development:**
- Next.js hot reload enabled in development
- Use `pnpm` instead of npm for package management
- Redux DevTools available for state debugging
- Components use TypeScript strict mode

**Docker Development:**
- Development uses volume mounting for hot reload
- Production builds are optimized without volumes
- Database persists in `openmemory.db` file

### Troubleshooting

**UI not starting on localhost:3000:**
```bash
cd ui
pnpm install
pnpm dev
```

**Database migration issues:**
```bash
make shell
alembic upgrade head
```

**Qdrant connection issues:**
- Ensure `mem0_store` container is running
- Check `QDRANT_HOST` and `QDRANT_PORT` in environment