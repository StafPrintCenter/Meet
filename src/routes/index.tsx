import { createFileRoute } from "@tanstack/react-router";
import { MeetShell } from "@/components/site";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { HeroSection, DemoRoomsSection, PillarsSection } from "@/components/pages";
import { SITE } from "@/data/site";

const PAGE_TITLE = `SPC Meet | ${SITE.name}`;
const PAGE_DESC = `SPC Meet, la visioconférence officielle et exclusive de ${SITE.name}. Accès par code ou lien d'invitation pour utilisateurs, développeurs et équipe support.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <MeetShell
      headerContent={
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Systèmes opérationnels
        </span>
      }
      mainClassName="overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-70" />
      <div className="relative z-10">
        <HeroSection />
        <DemoRoomsSection />
        <PillarsSection />

        {/* Actions secondaires & Garanties */}
        <div className="mx-auto mb-4 max-w-xl px-4">
          <Link to="/admin/meet" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="h-11 w-full rounded-xl border-border/80 bg-background hover:bg-accent sm:w-auto">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              Espace Staff & Formateurs
            </Button>
          </Link>
        </div>
      </div>
    </MeetShell>
  );
}
