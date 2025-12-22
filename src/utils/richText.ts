// Utilidad para parsear texto enriquecido simple (Markdown básico)
export const parseRichText = (text: string | undefined) => {
  if (!text) return { __html: '' };
  
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline hover:text-blue-400 transition-colors font-medium">$1</a>');
  html = html.replace(/\n/g, '<br />');
  
  return { __html: html };
};
