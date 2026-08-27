import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SpcLogo, StatusPill } from "@/components/spc/Brand";
import { HeroSection, DemoRoomsSection, PillarsSection } from "@/components/pages/home";

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
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <SpcLogo />
        <StatusPill />
      </header>

      <main className="flex-1">
        <HeroSection />
        <DemoRoomsSection />
        <PillarsSection />
      </main>

      <SiteFooter />
    </div>
  );
}
