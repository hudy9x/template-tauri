import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadMarkdownFile } from "@/utils/fileOpening";

export default function OpenWith() {
  const location = useLocation();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filePath = location.state?.filePath;

    if (!filePath) {
      console.log('[OpenWith] No file path provided');
      setIsLoading(false);
      return;
    }

    console.log('[OpenWith] Loading file:', filePath);

    loadMarkdownFile(filePath, (content, name) => {
      setFileContent(content);
      setFileName(name);
      setIsLoading(false);
      console.log('[OpenWith] File loaded successfully');
    }).catch((err) => {
      console.error('[OpenWith] Failed to load file:', err);
      setError('Failed to load file');
      setIsLoading(false);
    });
  }, [location.state]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Loading file...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  if (!fileContent) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">No file opened</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl py-10 px-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{fileName}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
        >
          Close
        </button>
      </div>

      <div className="p-6 border rounded-lg bg-card">
        <pre className="text-sm whitespace-pre-wrap font-mono">
          {fileContent}
        </pre>
      </div>
    </main>
  );
}
