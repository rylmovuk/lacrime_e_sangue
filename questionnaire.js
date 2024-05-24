import { FormArchitecture, runQuery } from "./database_utilities.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const questionnaireButton = document.getElementById('questionnaireButton');
    if (questionnaireButton) {
        questionnaireButton.addEventListener('click', function() {
            chrome.tabs.create({ url: 'questionnaire.html' });
        });
    } else {
        console.error("Element with ID 'questionnaireButton' not found.");
    }

    function createForm() {
        Object.keys(FormArchitecture).forEach(function (selectEntryId) {
            const querySelect = "SELECT * FROM " + FormArchitecture[selectEntryId].table + ";";
            console.log(querySelect);
            runQuery(querySelect)
            .then(payload => {
                const nameColumnValue = "ID_" + FormArchitecture[selectEntryId].name;
                const nameColumnDescription = "DESCRIZIONE";

                if (payload.rows > 0) {
                    const divName = selectEntryId + "_DIV";

                    let generatedHtml = `<label for="${FormArchitecture[selectEntryId].name}">${FormArchitecture[selectEntryId].question}</label><br>
                                         <select id="${FormArchitecture[selectEntryId].name}" name="${FormArchitecture[selectEntryId].name}">`;

                    for (let index = 0; index < payload.rows; ++index) {
                        const numericValue = payload.query_result[index][nameColumnValue];
                        const humanReadableDescription = payload.query_result[index][nameColumnDescription];
                        generatedHtml += `<option value="${numericValue}">${humanReadableDescription}</option>`;
                    }

                    generatedHtml += '</select>';

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

    function insertSurvey(answers) {
        var newspaperID = "your_newspaper_id"; // Replace with actual newspaper ID or retrieve dynamically
        var sql = "INSERT INTO CONNESSIONE_QUESTIONARIO (";
        var columns = answers.map(function(item) { return item[0]; });
        sql += columns.join(", ");
        sql += ", ID_GIORNALE) VALUES (";
        var values = answers.map(function(item) { return "'" + item[1] + "'"; });
        sql += values.join(", ");
        sql += ", '" + newspaperID + "')";

        console.log(sql);
        runQuery(sql);
    }

    function submitForm() {
        var form = document.getElementById("primaryForm");
        var answers = [];

        var allAnswered = true;

        Object.keys(FormArchitecture).forEach(function(selectEntryId) {
            var selectedOption = form.querySelector('#' + selectEntryId).value;
            const selectedOptionCasted = Number(selectedOption);

            if (isNaN(selectedOptionCasted)) {
                alert("Attenzione! Il form è stato compromesso!");
                allAnswered = false;
                return;
            }

            if (selectedOptionCasted === 0) {
                alert("Attenzione, tutte le domande obbligatorie devono essere compilate!");
                allAnswered = false;
                return;
            }

            answers.push([FormArchitecture[selectEntryId].table, selectedOptionCasted]);
        });

        if (!allAnswered) {
            return;
        }

        insertSurvey(answers);
    }

    createForm();
});
