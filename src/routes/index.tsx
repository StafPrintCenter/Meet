import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageFooter } from "@/components/site";
import { HeroSection, DemoRoomsSection, PillarsSection } from "@/components/pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPC Meet — Visioconférence STAF PRINT CENTER" },
      {
        name: "description",
        content:
          "SPC Meet, la visioconférence officielle de STAF PRINT CENTER. Rejoignez une réunion avec votre code d'accès ou votre lien d'invitation.",
      },
      { property: "og:title", content: "SPC Meet — Visioconférence STAF PRINT CENTER" },
      {
        property: "og:description",
        content:
          "Rejoignez votre réunion STAF PRINT CENTER avec un code d'accès ou un lien d'invitation.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="paper-grid flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PageHeader>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Systèmes opérationnels
        </span>
      </PageHeader>

      <main className="flex-1">
        <HeroSection />
        <DemoRoomsSection />
        <PillarsSection />
      </main>

      <PageFooter />
    </div>
  );
}
