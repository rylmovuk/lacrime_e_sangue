import { FormArchitecture, runQuery } from "./database_utilitiesNEW.js";
/* Abbiamo ora chiesto di importare la variable FormArchitecture e la funzione runQuery implementate nel file
 * database_utilities.js all'interno di questo file. Come potete leggere nell'articolo che vi avevo linkato durante
 * l'ultima lezione
 * (https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file),
 * per abilitare questa opzione del Javascript (quella di importare moduli) dovete create un file nella stessa
 * cartella del file javascript, chiamato .json e inserire l'opzione
 *
 * {
 *   "type": "module"
 * }
 */
function createForm() {
    let promises = [];
    /* Iniziamo creando, per ciascuna delle DIV del nostro form, una query che interroghi il Database per estrarre
     * le possibili risposte. Qui sfruttiamo l'essenza stessa delle chiamate "asincrone", giá discusse precedentemente.
     * In un loop, lanciamo le 6 query SQL senza attendere il loro completamento.
     */
    Object.keys(FormArchitecture).forEach(function (selectEntryId) {
        const querySelect = "SELECT * FROM " + FormArchitecture[selectEntryId].table + ";";
        console.log (querySelect);
        runQuery(querySelect)
        .then(payload => {
            /* di payload sappiamo che "ID_" + FormArchitecture[selectEntryId] sara' il nome della colonna con i
             * valori, mentre "DESCRIZIONE" sara' il nome della colonna con i dati da mostrare all'utente
             */
            const nameColumnValue = "ID_" + FormArchitecture[selectEntryId].name;
            const nameColumnDescription = "DESCRIZIONE";
            /* Ora, il pacchetto ritornato (payload) ha questo formato (ho preso l'esempio del risultato generato
             * quando FormArchitecutre[selectEntryId]:
             *
             * {
             *    running_query: 'SELECT * FROM ORIENTAMENTO_POLITICO;',
             *    rows: 8,
             *    query_result: [
             *      { ID_ORIENTAMENTO_POLITICO: '1', DESCRIZIONE: 'Estrema destra' },
             *      { ID_ORIENTAMENTO_POLITICO: '2', DESCRIZIONE: 'Destra' },
             *      { ID_ORIENTAMENTO_POLITICO: '3', DESCRIZIONE: 'Centro destra' },
             *      { ID_ORIENTAMENTO_POLITICO: '4', DESCRIZIONE: 'Centro' },
             *      { ID_ORIENTAMENTO_POLITICO: '5', DESCRIZIONE: 'Centro sinistra' },
             *      { ID_ORIENTAMENTO_POLITICO: '6', DESCRIZIONE: 'Sinistra' },
             *      { ID_ORIENTAMENTO_POLITICO: '7', DESCRIZIONE: 'Estrema Sinistra' },
             *      {
             *        ID_ORIENTAMENTO_POLITICO: '8',
             *        DESCRIZIONE: 'Nessun orientamento'
             *      }
             *    ]
             *  }
             *
             * Per saperlo, ho ovviamente usato il comando "console.log(payload);". Come potete ricordare dalla
             * scorsa riunione, questo é un ogetto JSON, facilmente accessibile e controllabile da javascript.
             */
            if (payload.rows > 0) { /* C'é almeno un risultato, altrimenti non ci interessa affatto */
            /* ricordiamoci che il nome del DIV sara' il nome della colonna della tabella
             * CONNESSIONE_QUESTIONARI + il postfisso "_DIV" */
            const divName = selectEntryId + "_DIV";
            console.log("Il DIV " + divName + ", con la select " + selectEntryId + " ha le seguenti opzioni");
           
           
            let generatedHtml =  `<label for= "${FormArchitecture[selectEntryId].name}"> ${FormArchitecture[selectEntryId].question}</label><br>
                                    <select id= "${FormArchitecture[selectEntryId].name}" name= "${FormArchitecture[selectEntryId].name}">`;

                                    for (let index = 0; index < payload.rows; ++index) {
                                        /* Accedo quindi, per ciascuna delle righe generate dalla query, al valore numerico e
                                         * all'opzione selezionata.
                                         */
                                        const numericValue = payload.query_result[index][nameColumnValue];
                                        const humanReadableDescription = payload.query_result[index][nameColumnDescription];
                                        
                                                               
                                        generatedHtml = generatedHtml + '<option value= "'+numericValue + '">'+humanReadableDescription+'</option>';
                                            
                                                                }
                                    
                                     generatedHtml = generatedHtml +  '</select>';
                                     console.log (generatedHtml);
                                    document.getElementById(divName).innerHTML = generatedHtml;
                
                                    
                
            
        }
    
        })
        .catch(error => {
            throw error;
        });

    });
}
/* Proviamo a lanciare questa funzione ora... */

createForm();
