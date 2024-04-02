function createSankey(data) {
	// Dimensions du diagramme
	const widthSankey = 500;
	const heightSankey = 250;

	// Création de l'espace SVG
	const svg = d3
		.select("#sankey")
		.html("")
		.append("svg")
		.attr("width", widthSankey)
		.attr("height", heightSankey);

	// Création de l'échelle pour les liens
	const linkScale = d3
		.scaleLinear()
		.domain([0, d3.max(data.links, (d) => d.value)])
		.range([0, heightSankey]);

    // function id(d) {
    //     return d.name;
    //     }

	// Création de l'objet Sankey
	const sankeyGenerator = d3
		.sankey()
        //.nodeId(id)
        .nodeSort(function(a,b){return b.value-a.value})
		.nodeWidth(20)
		.nodePadding(10)
		.extent([
			[50, 10],
			[widthSankey - 50, heightSankey - 10],
		]);

	// Génération des chemins du Sankey
	const { nodes, links } = sankeyGenerator(data);

	const myColor = d3.scaleOrdinal(d3.schemeCategory10);

    // const myColor = d3.scaleOrdinal().domain(["Acquisition","Pratique / Entraînement","Discussion", "Production","Collaboration", "Enquête","Classe entière","Groupes", "Individuel"]).range(d3.schemeCategory10);

	svg
		.append("defs")
		.selectAll("linearGradient")
		.data(links)
		.join("linearGradient")
		.attr("id", (d) => "mylinearGradient" + d.id)
		.attr("spreadMethod", "repeat")
		.html(
			(d) =>
				'<stop offset="0%" stop-color="' +
				myColor(d.idSource) +
				'"/><stop offset="100%" stop-color="' +
				myColor(d.idTarget) +
				'"/>'
		);

	// Création des liens
	svg
		.append("g")
		.selectAll("path")
		.data(links)
		.join("path")
		.attr("d", d3.sankeyLinkHorizontal())
		.attr("fill", "none")
		//.attr("stroke", d => myColor(d.idSource))
		.attr("stroke", (d) => "url(#mylinearGradient" + d.id + ")")
		.attr("stroke-opacity", 0.55)
		.attr("stroke-width", (d) => Math.max(1, d.width))
		.attr("id", (d) => "link" + d.id);

	// Création des nœuds
	svg
		.append("g")
		.selectAll("rect")
		.data(nodes)
		.join("rect")
		.attr("x", (d) => d.x0)
		.attr("y", (d) => d.y0)
		.attr("height", (d) => d.y1 - d.y0)
		.attr("width", (d) => d.x1 - d.x0)
		.attr("fill", (d) => myColor(d.id))
		.attr("opacity", 1);
	//.attr("stroke", "#000")

	svg
		.append("g")
		.selectAll("text")
		.data(nodes)
		.join("text")
		.attr("x", (d) => d.x0)
		.attr("y", (d) => d.y0)
		.attr("transform", "translate(" + -30 + ", " + 30 + ")")
		.html((d) => d.name);

	function correctDpath(string) {
		const firstCommaIndex = string.indexOf(",");
		const CIndex = string.indexOf("C");
		const partBeforeComma = string.substring(0, firstCommaIndex + 1);
		const partBetweenCommaAndC = string.substring(firstCommaIndex + 1, CIndex);
		const correctedNumber = parseFloat(partBetweenCommaAndC) + 0.25;
		const partAfterC = string.substring(CIndex);
		const newString = partBeforeComma + correctedNumber.toString() + partAfterC;
		return newString;
	}

	const sankeyElement = document.getElementById("sankey");
	const sankeyElementPaths = sankeyElement.querySelectorAll("path");
	sankeyElementPaths.forEach((path) => {
		const dAttribute = path.getAttribute("d");
		const newDattribute = correctDpath(dAttribute);
		path.setAttribute("d", newDattribute);
	});
}
