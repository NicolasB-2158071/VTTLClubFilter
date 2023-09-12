import { getSeasons, getClubsOfSeason, getMembersOfClub } from './vttl-api/index.js';

var members; // 🙃

async function newSeasonSelected(dropDown, season) {
    let clubResponse = await getClubsOfSeason(season);
    dropDown.innerHTML = "";

    let clubOption = document.createElement("option");
    clubOption.text = "...";
    dropDown.appendChild(clubOption);

    clubResponse.sort((a, b) => a.longname.localeCompare(b.longname)).forEach(
        (clubElement) => {
            let clubOption = document.createElement("option");
            clubOption.text = clubElement.longname;
            clubOption.value = clubElement.id;
            dropDown.appendChild(clubOption);
        }
    );
}

async function initSeasonDropDown(dropDown) {
    let seasonResponse = await getSeasons();

    seasonResponse.reverse().forEach(
        (seasonElement) => {
            let seasonOption = document.createElement("option");
            seasonOption.text = seasonElement.name;
            seasonOption.value = seasonElement.id;
            dropDown.appendChild(seasonOption);
        }
    );

}

function populateTable() {
    let table = document.getElementById("club-table");
    table.innerHTML = "";

    members.forEach((member) => {
        let row = table.insertRow();
        row.insertCell().innerHTML  = member.firstname + " " + member.lastname;
        row.insertCell().innerHTML = member.ranking;
        row.insertCell().innerHTML = member.matchesPlayed;
        row.insertCell().innerHTML = member.matchesWon;
        row.insertCell().innerHTML = member.setsWon;
        row.insertCell().innerHTML = member.setWonInLoses;
    });
}

async function newClubSelected(clubID, season) {
    members = await getMembersOfClub(clubID, season);
    populateTable();
}

function newFilterSelected(filterOption) {
    if (filterOption === "ranking") {
        members.sort((a, b) => a.ranking.localeCompare(b.ranking));
    }
    else if (filterOption === "most-matches") {
        members.sort((a, b) => b.matchesWon - a.matchesWon);
    }
    else if (filterOption === "most-sets") {
        members.sort((a, b) => b.setsWon - a.setsWon);
    }
    else if (filterOption === "most-lost-sets") {
        members.sort((a, b) => b.setWonInLoses - a.setWonInLoses);
    }
    populateTable();
}

function main() {
    let seasonDropDown = document.getElementById("season");
    let clubDropDown = document.getElementById("club");
    let filterDropDown = document.getElementById("filter");

    initSeasonDropDown(seasonDropDown);

    seasonDropDown.addEventListener("change", function() { newSeasonSelected(clubDropDown, seasonDropDown.value) });
    clubDropDown.addEventListener("change", function() { newClubSelected(clubDropDown.value, seasonDropDown.value) });
    filterDropDown.addEventListener("change", function() { newFilterSelected(filterDropDown.value) });
}

main();