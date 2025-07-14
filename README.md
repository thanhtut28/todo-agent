# Todo Agent 🤖✅

An AI-powered todo application with a modern block editor interface. Create, organize, and manage your tasks with the help of artificial intelligence.

## ✨ Features

- **AI-Powered Content Generation**: Generate todo lists, daily plans, workout routines, and more using natural language prompts
- **Block Editor Interface**: Modern, drag-and-drop block-based editor for organizing content
- **Interactive Components**: Checkboxes, headings, lists, and paragraphs with real-time editing
- **Customizable Styling**: Color and typography editors for personalized content
- **Database Persistence**: All your data is stored securely using PostgreSQL
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🎥 Demo Videos

### 🤖 AI Content Generation

![AI Content Generation Demo](./public/assets/ai_generation.gif)

Generate todo lists, plans, and structured content using natural language prompts with AI assistance.

### ✏️ Inline Block Editing

![Inline Block Editing Demo](./public/assets/inline_editing.gif)

Edit content directly inline with real-time updates and smooth interactions.

### 🎨 Block Editor Features

![Block Editor Demo](./public/assets/editor_demo.gif)

Drag and drop blocks, customize styling, and organize your content with the powerful block editor.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **AI Integration**: OpenAI API
- **Database**: PostgreSQL with Drizzle ORM
- **Drag & Drop**: @dnd-kit
- **Development**: ESLint, Prettier, TypeScript

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/todo-agent.git
   cd todo-agent
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_agent"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Start the database**

   ```bash
   ./start-database.sh
   ```

5. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application running.

## 🗄️ Database Commands

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## 🎨 Usage

1. **Create AI-Generated Content**: Use natural language prompts to generate todo lists, plans, or any structured content
2. **Edit with Block Editor**: Drag and drop blocks to reorder, edit text inline, and customize styling
3. **Organize Tasks**: Use checkboxes to mark completed items and track progress
4. **Customize Appearance**: Use the color and typography editors to style your content

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app router
├── components/
│   ├── editor/         # Block editor components
│   ├── item/           # Content block types
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── server/
│   ├── agent/          # AI agent logic
│   └── db/             # Database schema and queries
└── lib/                # Utilities and types
```

## 🔧 Development

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format:check
pnpm format:write

# Build for production
pnpm build

# Run production build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [T3 Stack](https://create.t3.gg/)
- AI powered by [OpenAI](https://openai.com/)

---

**Made with ❤️ and AI**
