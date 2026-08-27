import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageFooter } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — SPC Meet" },
      {
        name: "description",
        content:
          "Conditions d'utilisation de SPC Meet, le service de visioconférence exclusif de STAF PRINT CENTER.",
      },
      { property: "og:title", content: "Conditions d'utilisation — SPC Meet" },
      {
        property: "og:description",
        content: "Règles d'accès, obligations des hôtes et des participants sur SPC Meet.",
      },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "1. Objet et périmètre",
    body: "SPC Meet est le service de visioconférence exclusif de STAF PRINT CENTER. Il est mis à disposition du personnel, des formateurs, des apprenants et des clients de l'entreprise dans le cadre de réunions internes, de sessions de formation et de rendez-vous commerciaux.",
  },
  {
    title: "2. Accès au service",
    body: "La création de salons est réservée aux administrateurs, aux formateurs habilités et au système automatique de réservation de rendez-vous. Les invités rejoignent une réunion uniquement via un lien d'invitation valide ou un code d'accès, et selon les restrictions définies par l'hôte (accès libre, liste blanche d'emails, ou personnel STAF PRINT CENTER uniquement).",
  },
  {
    title: "3. Usage acceptable",
    body: "Il est interdit d'enregistrer, de diffuser ou de rediffuser une réunion sans l'accord explicite de l'hôte, de partager un code d'accès en dehors du périmètre autorisé, de perturber une session, ou de transmettre des contenus illicites, diffamatoires ou contraires aux droits de tiers.",
  },
  {
    title: "4. Rôle de l'hôte",
    body: "L'hôte définit la jauge maximale de participants, l'activation de la salle d'attente et l'autorisation d'inviter. Il peut couper le micro ou la caméra d'un participant, l'exclure, verrouiller le salon ou mettre fin à la réunion.",
  },
  {
    title: "5. Supervision et mesures d'urgence",
    body: "Les administrateurs et super-administrateurs de STAF PRINT CENTER disposent d'une vue de supervision des salons en cours. En cas d'abus, de dépassement de quota ou d'incident de sécurité, ils peuvent révoquer un lien, modifier un code d'accès ou fermer immédiatement un salon.",
  },
  {
    title: "6. Disponibilité et limites techniques",
    body: "Le service repose sur les capacités audio et vidéo de votre navigateur et sur votre connexion réseau. STAF PRINT CENTER met en œuvre les moyens raisonnables pour assurer la continuité du service sans garantir une disponibilité ininterrompue.",
  },
  {
    title: "7. Modification des conditions",
    body: "Ces conditions peuvent évoluer pour des raisons légales, techniques ou organisationnelles. La version applicable est celle publiée sur cette page au moment de votre connexion.",
  },
];

function Terms() {
  return (
    <div className="paper-grid flex min-h-screen flex-col">
      <PageHeader>
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Retour à l'accueil
        </Link>
      </PageHeader>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Conditions d'utilisation
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
      <PageFooter />
    </div>
  );
}
