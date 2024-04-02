const highlightCode = editor => {
	let code = editor.textContent;
	// Coloration syntaxique pour les titres
	code = code.replace(/^#+\s(.*)/gm, '<span class="markdownTitles">$&</span>');
	// Coloration syntaxique pour le texte en gras
	code = code.replace(/\*\*(\w.*?)\*\*/g, '<span class="markdownBold">**$1**</span>');
	code = code.replace(/__(\w.*?)__/g, '<span class="markdownBold">__$1__</span>');
	// Coloration syntaxique pour le texte en italique
	code = code.replace(/(?<!\*)\*(\w.*?)\*(?!\*)/g, '<span class="markdownItalic">*$1*</span>');
	code = code.replace(/(?<!_)_(\w.*?)_(?!_)/g, '<span class="markdownItalic">_$1_</span>');
	// Coloration syntaxique pour les listes
	code = code.replace(/^(\s*)([-*]|\d+\.)(\s)/gm,'<span class="markdownLists">$1$2</span>$3')
	// Coloration syntaxique pour les liens
	code = code.replace(/(\[.*?\])\((.*?)\)/g, '<span class="markdownLinksText">$1</span><span class="markdownLinksURL">($2)</span>');
	
	editor.innerHTML = code;

  };

const editorElement = document.getElementById('editor')

const options = { 
	addClosing: false,
	spellCheck: true,
	preserveIdent: false
}

let jar = CodeJar(editorElement,highlightCode,options)


function autoComplete(search, replace){
	const cursorPosition = jar.save();
    const text = editorElement.textContent.substring(0, cursorPosition.start);
	if (text.endsWith(search)) {
		const remainingText = editorElement.textContent.substring(cursorPosition.start);
		editorElement.textContent = text.substring(0, text.length - search.length) + replace + remainingText;
		const diff = replace.length - search.length;
		cursorPosition.start = cursorPosition.start+diff
		cursorPosition.end = cursorPosition.end+diff
		jar.restore(cursorPosition);
	  }
}

function parseMarkdown(string) {
	const regex = /^## (.+?)\n([\s\S]+?)\n\n((?:(?!^## ).|\n)+)/gm;

	let result = [];
	let match;
	while ((match = regex.exec(string)) !== null) {
		const title = match[1];
		const listItems = match[2].split('\n').map(item => item.trim().replace(/^- /,'')).filter(item => item !== '');
		const content = match[3].trim();
		result.push([title, listItems, content]);
	}
	return result;
}

editorElement.addEventListener('input', function(event) {
	autoComplete('## Acq','## Acquisition');
    autoComplete('## Pra','## Pratique / Entraînement');
	autoComplete('## Ent','## Pratique / Entraînement');
	autoComplete('## Disc','## Discussion');
	autoComplete('## Pro','## Production');
	autoComplete('## Pro','## Production');
	autoComplete('## Col','## Collaboration');
	autoComplete('## Enq','## Enquête');
	const parsedMD = parseMarkdown(editorElement.textContent);
	createViz(parsedMD);
});