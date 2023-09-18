import { getSeasons, getClubsOfSeason, getMembersOfClub } from './vttl-api/index.js';

var members; // 🙈

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
    
    let tournamentIncluded = document.getElementById("tournament").checked;
    applyFilter(tournamentIncluded);
    members.forEach((member) => {
        let row = table.insertRow();
        row.insertCell().innerHTML = member.firstname + " " + member.lastname;
        row.insertCell().innerHTML = member.ranking;
        row.insertCell().innerHTML = (tournamentIncluded ? member.allResults.matchesPlayed : member.tournamentLessResults.matchesPlayed);
        row.insertCell().innerHTML = (tournamentIncluded ? member.allResults.matchesWon : member.tournamentLessResults.matchesWon);
        row.insertCell().innerHTML = (tournamentIncluded ? member.allResults.setsWon : member.tournamentLessResults.setsWon);
        row.insertCell().innerHTML = (tournamentIncluded ? member.allResults.setWonInLoses : member.tournamentLessResults.setWonInLoses);
    });
}

async function newClubSelected(clubID, season) {
    members = await getMembersOfClub(clubID, season);
    populateTable();
}

function applyFilter(tournamentIncluded) {
    let filterOption = document.getElementById("filter").value;
    if (filterOption === "ranking") {
        members.sort((a, b) => a.ranking.localeCompare(b.ranking));
    }
    else if (filterOption === "most-matches") {
        members.sort((a, b) => (tournamentIncluded ? 
            b.allResults.matchesWon -  a.allResults.matchesWon :
            b.tournamentLessResults.matchesWon - a.tournamentLessResults.matchesWon
        ));
    }
    else if (filterOption === "most-sets") {
        members.sort((a, b) => (tournamentIncluded ? 
            b.allResults.setsWon - a.allResults.setsWon :
            b.tournamentLessResults.setsWon - a.tournamentLessResults.setsWon
        ));
    }
    else if (filterOption === "most-lost-sets") {
        members.sort((a, b) => (tournamentIncluded ? 
            b.allResults.setWonInLoses - a.allResults.setWonInLoses :
            b.tournamentLessResults.setWonInLoses - a.tournamentLessResults.setWonInLoses
        ));
    }
}

function main() {
    let seasonDropDown = document.getElementById("season");
    let clubDropDown = document.getElementById("club");
    let filterDropDown = document.getElementById("filter");
    let tournamentCheckBox = document.getElementById("tournament");

    initSeasonDropDown(seasonDropDown);

    seasonDropDown.addEventListener("change", function() { newSeasonSelected(clubDropDown, seasonDropDown.value) });
    clubDropDown.addEventListener("change", function() { newClubSelected(clubDropDown.value, seasonDropDown.value) });
    filterDropDown.addEventListener("change", function() { populateTable() });
    tournamentCheckBox.addEventListener("change", function() { populateTable() });
}

main();