import { Link } from "@tanstack/react-router";
import { SITE, SITE_LINK } from "@/data/site";

export function PageFooter() {
  const landingBase = SITE_LINK.landingUrl.replace(/\/$/, "");

  return (
    <footer className="border-t border-border/70 bg-background/80 text-muted-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-xs sm:flex-row sm:py-4 sm:text-left">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <span>© {new Date().getFullYear()} SPC Meet · Usage interne et clients.</span>

          <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden="true">
            •
          </span>

          <p>
            Un service fourni par{" "}
            <a
              href={SITE_LINK.landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {SITE.name}
            </a>
          </p>
        </div>

        <nav className="flex items-center justify-center gap-4 text-xs font-medium">
          <Link
            to="/terms"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Conditions d'utilisation
          </Link>

          <span className="text-muted-foreground/40" aria-hidden="true">
            •
          </span>

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