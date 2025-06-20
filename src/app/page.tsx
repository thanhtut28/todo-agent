export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-primary mb-6 text-4xl font-bold">
          Welcome to Todo Agent
        </h1>
        <p className="text-muted-foreground mb-8">
          A powerful todo application with dark theme enabled by default.
        </p>
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="text-card-foreground mb-4 text-2xl font-semibold">
            Getting Started
          </h2>
          <p className="text-muted-foreground">
            Your application is now configured with Tailwind CSS dark theme as
            the default.
          </p>
        </div>
      </div>
    </div>
  );
}
