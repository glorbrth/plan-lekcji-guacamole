let tbl = document.querySelector("table tbody");
let btn = document.querySelector("table button");
let header_row = tbl.querySelector("tr");

const LENGTH = 45;

function parse_time(time) {
	const value = time.split(":");
	if (value.length != 2) {
		return false;
	}
	const parsed = value.map(Number);
	if (isNaN(parsed[0]) || isNaN(parsed[1])) return false;
	return parsed;
}

function add_minutes(time, minutes) {
	time[1] += minutes;
	const div = Math.floor(time[1] / 60);
	const rem = time[1] % 60;
	return [time[0] + div, rem];
}

function append_header() {
	const col = document.importNode(col_template.content, true);
	const no = header_row.children.length - 1;
	col.getElementById("no").textContent = no;

	const begin = col.getElementById("begin");
	const end = col.getElementById("end");
	begin.addEventListener("focusout", () => {
		let first = parse_time(begin.value);
		if (!first) return;
		first = add_minutes(first, LENGTH);
		end.value = `${first[0]}:${first[1]}`;
	});

	btn.parentElement.parentElement.insertBefore(col, btn.parentElement);

	begin.focus();
}

append_header();
btn.addEventListener("click", append_header);

function save() {
	console.log("!");
	let data = {};
	data.times = Array.from(header_row.children).slice(1, -1).map(child => {
		console.log(child);
		return {
			begin: parse_time(child.querySelector("#begin").value),
			end: parse_time(child.querySelector("#end").value),
		};
	});
	return data;
}

new_row_btn.addEventListener("click", () => {
	const tr = document.createElement("tr");
	const td = document.createElement("td");
	const input = document.createElement("input");
	input.type = "text";
	input.className = "input_row";
	td.appendChild(input);
	tr.appendChild(td);
	tbl.insertBefore(tr, new_row_row);
});