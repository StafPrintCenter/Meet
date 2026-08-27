import { Link } from "@tanstack/react-router";
import { SITE, SITE_LINK } from "@/data/site";

export function PageFooter() {
  const landingBase = SITE_LINK.landingUrl.replace(/\/$/, "");

  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col items-center gap-3 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center">
          <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
            © {new Date().getFullYear()} SPC Meet · Usage interne et clients.
          </p>

          <span className="hidden text-xs text-muted-foreground/60 sm:inline">|</span>

          <p className="text-xs text-muted-foreground">
            Un service fourni par{" "}
            <a
              href={SITE_LINK.landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              {SITE.name}
            </a>
          </p>

        </div>


        <nav className="flex items-center gap-4">
          <Link
            to="/terms"
            className="transition-colors hover:text-foreground">
            Conditions d'utilisation
          </Link>
          <a
            href={`${landingBase}/legal/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Confidentialité
          </a>
        </nav>
      </div>
    </footer>
  );
}