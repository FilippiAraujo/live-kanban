// ========================================
// Markdown Viewer Component
// ========================================

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return '';
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md overflow-x-auto my-3"><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary underline">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-border pl-4 italic text-muted-foreground my-3">$1</blockquote>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<ul class="list-disc ml-6 my-2"><li>$1</li></ul>');
    html = html.replace(/^\d+\. (.*$)/gim, '<ol class="list-decimal ml-6 my-2"><li>$1</li></ol>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() &&
          !para.startsWith('<h') &&
          !para.startsWith('<ul') &&
          !para.startsWith('<ol') &&
          !para.startsWith('<pre') &&
          !para.startsWith('<blockquote')) {
        return `<p class="mb-3">${para}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  };

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
