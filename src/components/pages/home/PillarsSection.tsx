import { UserCheck, ShieldLock, Zap } from "lucide-react";
import { SITE } from "@/data/site";

const pillars = [
  {
    icon: UserCheck,
    title: "Accès direct sans compte",
    text: "Apprenants, clients et partenaires rejoignent leurs réunions ou formations en un clic avec un simple code, sans création de compte.",
  },
  {
    icon: ShieldLock,
    title: "Sécurité & Confidentialité",
    text: "Toutes les sessions de visioconférence sont chiffrées, sécurisées et strictement réservées aux participants autorisés.",
  },
  {
    icon: Zap,
    title: `Optimisé par ${SITE.name}`,
    text: "Une expérience fluide et légère accessible directement depuis votre navigateur web, sur mobile comme sur ordinateur.",
  },
];

export function PillarsSection() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-panel"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}