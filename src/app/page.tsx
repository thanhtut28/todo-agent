import { generatePageWithAI } from "~/server/db/actions";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-primary mb-6 text-4xl font-bold">
          Welcome to Todo Agent
        </h1>
        <p className="text-muted-foreground mb-8">
          A powerful todo application with AI-powered content generation.
        </p>

        {/* AI Content Generator */}
        <div className="bg-card border-border mb-8 rounded-lg border p-6">
          <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
            Create with AI ✨
          </h2>

          <form action={generatePageWithAI} className="space-y-4">
            <div>
              <input
                type="text"
                name="prompt"
                placeholder="e.g., 'create a grocery list', 'plan my day', 'workout routine'..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-colors"
            >
              Generate Page
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
