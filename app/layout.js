import "./globals.css";

export const metadata = {
  title: "Response LLM Workspace",
  description: "A dynamic workspace for processing Python and Power BI modules.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500/30 selection:text-brand-200">
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
