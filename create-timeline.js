// Gestion timeline
function createTimeline(dataTimeline) {
	const widthTimeline = 500;
	const heightTimeline = 100;

	function replaceNumberWithPrevious(string) {
		return string.replace(/(\d+):/g, (match, number) => {
			const previousNumber = parseInt(number, 10) - 1;
			return `${previousNumber}:`;
		});
	}

	function timelineRelativeTime() {
		//This solution is for relative time is from
		//http://stackoverflow.com/questions/11286872/how-do-i-make-a-custom-axis-formatter-for-hours-minutes-in-d3-js

		const chart = d3
			.timelines()
			.relativeTime()
			.tickFormat({
				format: function (d) {
					return replaceNumberWithPrevious(
						d3.timeFormat("%H:%M")(d).replace("01:00", "0").replace("01:", "")
					);
				},
				tickTime: d3.timeMinutes,
				tickInterval: 10,
				tickSize: 15,
			})
			.mouseover(function (d, i, datum) {
				if (i.label) {
					timelineDescriptifBloc.innerHTML = i.label;
				}
			})
			.mouseout(function (d, i, datum) {
				timelineDescriptifBloc.innerHTML = "";
			});

		const svgTimeline = d3
			.select("#timeline")
			.html("")
			.append("svg")
			.attr("width", widthTimeline)
			.attr("height", heightTimeline)
			.datum(dataTimeline)
			.call(chart);
	}

	timelineRelativeTime();
}
