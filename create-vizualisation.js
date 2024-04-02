// const timelineElement = document.getElementById("timeline");
const timelineDescriptifBloc = document.getElementById(
	"timelineDescriptifBloc"
);

function createViz(parsedMD) {
	// Create Timeline
	let previousClassElement = "";
	let timelineElementObject = {};
	let complexTimelineElement = false;
	let startTime = 0;
	let timelineArray = [];
	parsedMD.forEach((element, index, array) => {
		const isLastElement = index === array.length - 1;
		const classElement = element[0].toLowerCase();
		const duration = parseInt(element[1][0].match(/^\d+/));
		const endTime = startTime + duration;
		const label = element[1][1]
			? element[1][1] + " : " + element[2]
			: element[2];
		const timeObject = {
			label: label,
			starting_time: startTime * 60 * 1000,
			ending_time: endTime * 60 * 1000,
		};

		if (previousClassElement != classElement) {
			if (complexTimelineElement) {
				timelineArray.push(timelineElementObject);
				complexTimelineElement = false;
				timelineElementObject = {};
			}
			timelineElementObject = {
				class: classElement,
				times: [timeObject],
			};
			startTime = endTime;
			timelineArray.push(timelineElementObject);
		} else {
			complexTimelineElement = true;
			startTime = endTime;
			timelineElementObject.times.push(timeObject);
			if (isLastElement) {
				timelineArray.push(timelineElementObject);
			}
		}

		previousClassElement = classElement;
	});
	createTimeline(timelineArray);

	// Create Sankey

	const sankeyLabelsSources = [
		"Acquisition",
		"Pratique / Entraînement",
		"Discussion",
		"Production",
		"Collaboration",
		"Enquête",
	];
	const sankeyLabelsTargets = [
		"Classe entière",
		"Groupes",
		"Individuel"
	];
	const sankeyLabels = sankeyLabelsSources.concat(sankeyLabelsTargets);	

	function selectByLabelsSource(array, label) {
		return array.filter((subArray) => subArray[0] === label);
	}

	let parsedMDbyLabelsSource = [];
	// let existingSources = [];
	// let existingTargets = [];

	//let nodesSankey = [];
	let linksSankey = [];

	sankeyLabelsSources.forEach((label, i) => {
		parsedMDbyLabelsSource[i] = selectByLabelsSource(parsedMD, label);
	});

	const existingSources = sankeyLabelsSources.filter(item => parsedMD.toString().includes(item))
	const existingTargets = sankeyLabelsTargets.filter(item => parsedMD.toString().includes(item))
	const existingLabels = existingSources.concat(existingTargets)


	let nodesSankey = existingLabels.map(item => {return {name: item, id: sankeyLabels.indexOf(item)}});
	// const existingSources = sankeyLabels.filter(item => parsedMD.toString().includes(item))

	//parsedMD.forEach((element) => {
	// 	labelSource = element[0];
	// 	labelTarget = element[1][1];
	// 	if (labelSource && !existingSources.includes(labelSource)) {
	// 		existingSources.push(labelSource);
	// 	}

	// 	if (labelTarget && !existingTargets.includes(labelTarget)) {
	// 		existingTargets.push(labelTarget);
	// 		labelTargetID = sankeyLabels.indexOf(labelTarget);
	// 		const node = { name: labelTarget, id: labelTargetID };
	// 		nodesSankey.push(node);
	// 	}
	// });

	//const existingLabels = existingSources.concat(existingTargets)
	//console.log(existingLabels);

	let linkID = 0;
	parsedMDbyLabelsSource.forEach((arrayLabels, i) => {
		if (arrayLabels.length > 0) {
			const nodeName = arrayLabels[0][0];
			//const node = { name: nodeName, id: i };
			let targetsNode = {};
			arrayLabels.forEach((target) => {
				const targetLabel = target[1][1];
				if (!targetsNode[targetLabel]) {
					targetsNode[targetLabel] = parseInt(target[1][0].match(/^\d+/));
				} else {
					targetsNode[targetLabel] =
						parseInt(target[1][0].match(/^\d+/)) + targetsNode[targetLabel];
				}
			});

			for (const target in targetsNode) {
				const sourceIDGeneral = sankeyLabels.indexOf(nodeName);
				const sourceIDExistingSources = existingLabels.indexOf(nodeName);
				const linkWeight = targetsNode[target];
				const targetIDGeneral = sankeyLabels.indexOf(target);
				const targetIDExistingTargets = existingLabels.indexOf(target);
				linksSankey.push({
					target: targetIDExistingTargets,
					value: linkWeight,
					id: linkID,
					idSource: sourceIDExistingSources,
					idTarget: targetIDGeneral,
					source: sourceIDExistingSources
				})
				linkID++;
			}

			// sankeyLabelsTargets.forEach(target => {
			// 	const test = selectByLabelsTarget(arrayLabels,target);
			// 	console.log(test);
			// })
		}
	});

	// nodesSankey.sort((a, b) => {
	// 	return a.id - b.id;
	// });

// nodesSankey = nodesSankey.sort(function(a,b){return b.value-b.value})
// console.log(linksSankey)
// linksSankey = linksSankey.sort(function(a,b){return a.value - b.value})
// console.log(linksSankey)

	const dataSankey = {
		nodes: nodesSankey,
		links: linksSankey,
	};



	createSankey(dataSankey);
}
