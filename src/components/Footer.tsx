import { Github, ExternalLink } from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';

export function Footer() {
  const openLink = async (url: string) => {
    await openUrl(url);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 flex items-center justify-center gap-4 bg-background backdrop-blur-sm border-t border-muted-foreground/30 text-xs text-muted-foreground z-[9998]">
      <a
        href="https://github.com/hudy9x/template-tauri"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <Github size={14} />
        <span>GitHub</span>
      </a>

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
