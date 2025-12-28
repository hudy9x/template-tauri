import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 flex items-center justify-center gap-4 bg-background backdrop-blur-sm border-t border-muted-foreground/30 text-xs text-muted-foreground z-[9998]">
      <button
        onClick={() => openLink('https://github.com/hudy9x/template-tauri')}
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <Github size={14} />
        <span>GitHub</span>
        <ExternalLink size={10} />
      </button>

      <span className="text-muted-foreground/50">•</span>

      <button
        onClick={() => openLink('https://hudy9x.com')}
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <span>hudy9x.com</span>
        <ExternalLink size={10} />
      </button>
    </footer>
  );
}
