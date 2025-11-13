// ========================================
// MÓDULO: Markdown Parser
// Responsável por converter Markdown em HTML
// ========================================

export const MarkdownParser = {
  parse(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() &&
          !para.startsWith('<h') &&
          !para.startsWith('<ul') &&
          !para.startsWith('<ol') &&
          !para.startsWith('<pre') &&
          !para.startsWith('<blockquote')) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  }
};
