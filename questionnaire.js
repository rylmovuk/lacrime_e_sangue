import { FormArchitecture, runQuery } from "./database_utilities.js";

// This code creates an event listener that opens the questionnaire once the html element questionnaireButton is clicked
document.getElementById('questionnaireButton').addEventListener('click', function() {
    chrome.tabs.create({ url: 'questionnaire.html' });
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    function createForm() {
        let promises = [];
        Object.keys(FormArchitecture).forEach(function (selectEntryId) {
            const querySelect = "SELECT * FROM " + FormArchitecture[selectEntryId].table + ";";
            console.log(querySelect);
            runQuery(querySelect)
            .then(payload => {
                const nameColumnValue = "ID_" + FormArchitecture[selectEntryId].name;
                const nameColumnDescription = "DESCRIZIONE";

                if (payload.rows > 0) {
                    const divName = selectEntryId + "_DIV";
                    console.log("Il DIV " + divName + ", con la select " + selectEntryId + " ha le seguenti opzioni");

                    let generatedHtml = `<label for="${FormArchitecture[selectEntryId].name}">${FormArchitecture[selectEntryId].question}</label><br>
                                         <select id="${FormArchitecture[selectEntryId].name}" name="${FormArchitecture[selectEntryId].name}">`;

                    for (let index = 0; index < payload.rows; ++index) {
                        const numericValue = payload.query_result[index][nameColumnValue];
                        const humanReadableDescription = payload.query_result[index][nameColumnDescription];
                        generatedHtml += `<option value="${numericValue}">${humanReadableDescription}</option>`;
                    }

                    generatedHtml += '</select>';
                    console.log(generatedHtml);

                    const targetDiv = document.getElementById(divName);
                    if (targetDiv) {
                        targetDiv.innerHTML = generatedHtml;
                    } else {
                        console.error(`Element with ID ${divName} not found.`);
                    }
                }
            })
            .catch(error => {
                console.error("Error running query:", error);
            });
        });
    }

    createForm();
});
