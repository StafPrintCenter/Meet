import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./";
import { SpcDeskLogo } from "@/components/site";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <SpcDeskLogo className="mx-auto h-14 w-auto" />
        </Link>
        {/* Theme Switcher */}
        <ThemeToggle />
        {children}
      </div>
    </header>
  );
}