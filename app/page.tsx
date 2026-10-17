import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen p-12">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to My Next.js Portfolio
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Explore my projects or talk to the AI assistant in the bottom-right
        corner!
      </p>

      {/* Floating Chatbot Widget */}
      <Chatbot />
    </main>
  );
}
