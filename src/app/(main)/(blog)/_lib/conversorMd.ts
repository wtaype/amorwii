/**
 * CONVERSOR MARKDOWN A HTML (Versión Pro con IDs para SEO)
 * Convierte texto Markdown en HTML limpio y añade IDs automáticos a los títulos.
 */
export function mdAHtml(md: string): string {
    if (!md) return "";

    // Función para crear un ID amigable desde el texto del título
    const crearId = (texto: string) => {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 50);
    };

    let html = md
        // 1. Cabeceras con generación de IDs dinámicos para anclas SEO
        .replace(/^### (.*$)/gim, (_, text) => `<h3 id="${crearId(text)}">${text}</h3>`)
        .replace(/^## (.*$)/gim, (_, text) => `<h2 id="${crearId(text)}">${text}</h2>`)
        .replace(/^# (.*$)/gim, (_, text) => `<h1 id="${crearId(text)}">${text}</h1>`)
        
        // 2. Formato de texto
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        .replace(/~~(.*?)~~/gim, "<del>$1</del>")
        .replace(/`([^`]+)`/gim, "<code>$1</code>")
        
        // 3. Citas y Separadores
        .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/^---/gim, '<hr style="border:none;border-top:1px solid var(--brd);margin:2vh 0"/>')
        
        // 4. Imágenes y Enlaces
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" loading="lazy" />')
        
        // Botón especial YouTube de WiiHope
        .replace(/\[(.*?)\]\((https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\S*?))\)/gim, 
            '<button type="button" class="po_yt_btn" data-yt="$3"><i class="fab fa-youtube" style="color:#fe0149; font-size:1.2em; margin-right:6px;"></i> $1</button>')
        
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const lines = html.split("\n");
    const result: string[] = [];
    let inList = false;
    let inTable = false;

    lines.forEach((line) => {
        const trimLine = line.trim();

        // Lógica de Tablas
        if (trimLine.startsWith("|") && trimLine.endsWith("|")) {
            if (!inTable) {
                result.push('<div class="po_table_wrap"><table>');
                inTable = true;
            }
            if (trimLine.match(/^\|?[\s\-\|:]+\|?$/)) return;

            const cells = trimLine.split("|").filter((c, i, a) => i > 0 && i < a.length - 1);
            const isHeader = inTable && (result[result.length - 1].includes("<table>") || result[result.length - 1].includes("</thead>"));
            const tag = isHeader ? "th" : "td";
            
            if (isHeader && !result[result.length - 1].includes("<thead>")) {
                result[result.length - 1] = result[result.length - 1].replace("<table>", "<table><thead>");
            }

            result.push("<tr>" + cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") + "</tr>");
            
            if (isHeader) result.push("</thead><tbody>");
            return;
        } else if (inTable) {
            result.push("</tbody></table></div>");
            inTable = false;
        }

        // Lógica de Listas
        const listMatch = line.match(/^[\-\*]\s+(.*)$/);
        if (listMatch) {
            if (!inList) {
                result.push("<ul>");
                inList = true;
            }
            let text = listMatch[1];
            if (text.startsWith("[ ] ")) text = '<input type="checkbox" disabled style="margin-right:0.5vh"> ' + text.slice(4);
            else if (text.startsWith("[x] ")) text = '<input type="checkbox" checked disabled style="margin-right:0.5vh"> ' + text.slice(4);
            
            result.push(`<li>${text}</li>`);
        } else {
            if (inList) {
                result.push("</ul>");
                inList = false;
            }
            if (trimLine === "") return;
            
            if (!line.match(/^<(h1|h2|h3|ul|ol|li|blockquote|img|hr|div|table|thead|tbody|tr|th|td)/)) {
                result.push(`<p>${line}</p>`);
            } else {
                result.push(line);
            }
        }
    });

    if (inTable) result.push("</tbody></table></div>");
    if (inList) result.push("</ul>");

    return result.join("\n");
}
