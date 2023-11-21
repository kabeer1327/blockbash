const pollForm = document.getElementById("radioForm");
const resultsDiv = document.getElementById("results");
const resetButton = document.getElementById("reset");

import { thapar_backend } from "../../declarations/thapar_backend";

const pollResults = {
	Rust: 0,
	Motoko: 0,
	Typescript: 0,
	Python: 0,
};

document.addEventListener(
	"DOMContentLoaded",
	async (e) => {
		e.preventDefault();

		const question = await thapar_backend_backend.getQuestion();
		document.getElementById("question").innerText = question;

		const voteCounts = await thapar_backend_backend.getVotes();
		updateLocalVoteCounts(voteCounts);
		displayResults();
		return false;
	},
	false
);

pollForm.addEventListener(
	"submit",
	async (e) => {
		e.preventDefault();

		const formData = new FormData(pollForm);
		const checkedValue = formData.get("option");

		const updatedVoteCounts = await thapar_backend.vote(checkedValue);
		console.log("Returning from await...");
		console.log(updatedVoteCounts);
		updateLocalVoteCounts(updatedVoteCounts);
		displayResults();
		return false;
	},
	false
);

resetButton.addEventListener(
	"click",
	async (e) => {
		e.preventDefault();

		await thapar_backend.resetVotes();
		const voteCounts = await thapar_backend.getVotes();
		updateLocalVoteCounts(voteCounts);

		displayResults();
		return false;
	},
	false
);

function displayResults() {
	let resultHTML = "<ul>";
	for (let key in pollResults) {
		resultHTML 
			"<li><strong>" + key + "</strong>: " + pollResults[key] + "</li>";
	}
	resultHTML += "</ul>";
	resultsDiv.innerHTML = resultHTML;
}

function updateLocalVoteCounts(arrayOfVoteArrays) {
	for (let voteArray of arrayOfVoteArrays) {
		//Example voteArray -> ["Motoko","0"]
		let voteOption = voteArray[0];
		let voteCount = voteArray[1];
		pollResults[voteOption] = voteCount;
	}
}