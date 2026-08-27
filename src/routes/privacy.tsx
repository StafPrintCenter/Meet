import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SpcLogo } from "@/components/site/Brand";
import { PageFooter } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — SPC Meet" },
      {
        name: "description",
        content:
          "Comment SPC Meet traite vos données : flux audio/vidéo, nom d'affichage, emails de liste blanche et journaux de supervision.",
      },
      { property: "og:title", content: "Politique de confidentialité — SPC Meet" },
      {
        property: "og:description",
        content: "Données traitées, durées de conservation et vos droits sur SPC Meet.",
      },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "1. Responsable du traitement",
    body: "STAF PRINT CENTER est responsable du traitement des données collectées via SPC Meet. Pour toute demande, contactez le référent interne à l'adresse contact@stafprint.com.",
  },
  {
    title: "2. Données traitées",
    body: "Nom d'affichage saisi avant l'entrée en réunion, adresse email lorsqu'une liste blanche ou une restriction de domaine s'applique, préférences de périphériques audio/vidéo, messages du chat de la réunion, et métadonnées techniques (horodatage de connexion, salon rejoint, rôle).",
  },
  {
    title: "3. Flux audio et vidéo",
    body: "Les flux audio et vidéo servent uniquement à la tenue de la réunion en temps réel. Aucun enregistrement n'est réalisé par défaut : si une session doit être enregistrée, l'hôte doit en informer les participants au préalable.",
  },
  {
    title: "4. Finalités",
    body: "Permettre la tenue des réunions, vérifier les autorisations d'accès (code, lien, liste blanche, domaine), assurer la modération et la supervision, et garantir la sécurité du service contre les abus.",
  },
  {
    title: "5. Stockage local",
    body: "Votre nom d'affichage et vos préférences de micro/caméra sont enregistrés dans le stockage local de votre navigateur pour vous éviter de les saisir à nouveau. Vous pouvez les supprimer en vidant les données du site.",
  },
  {
    title: "6. Conservation",
    body: "Les messages de chat sont supprimés à la fin du salon. Les journaux techniques de supervision sont conservés pour une durée limitée à des fins de sécurité et de facturation interne, puis supprimés ou anonymisés.",
  },
  {
    title: "7. Partage",
    body: "Aucune donnée n'est vendue. Les données ne sont accessibles qu'aux personnes habilitées de STAF PRINT CENTER (hôtes, administrateurs, super-administrateurs) et aux prestataires techniques strictement nécessaires au fonctionnement du service.",
  },
  {
    title: "8. Vos droits",
    body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données, ainsi que la limitation ou l'opposition au traitement, en écrivant à contact@stafprint.com.",
  },
];

function Privacy() {
  return (
    <div className="paper-grid flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5">
        <SpcLogo />
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Retour à l'accueil
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
        <div className="surface-card mt-8 space-y-6 rounded-2xl p-6 sm:p-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-lg tracking-tight">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
