# CLAUDE.md — Expedition Journal (travel tracker)

## Obiettivo
Sito statico su GitHub Pages per registrare i viaggi di Matthias: paesi, regioni, città, monumenti, con foto, testo e altri campi. Estetica mista tra mappa antica vintage e passaporto.

## Stato attuale del progetto
File esistenti in `travel-tracker/`:
- `index.html`: struttura pagina, mappa del mondo, curtain, lightbox
- `style.css`: tema scuro oro (variabili in `:root`)
- `script.js`: logica (navigazione a livelli, note, foto, curtain, mappe, backup)
- `geo-data.js`: `GEO_DATA` con paesi, regioni (`provinces`), città (`cities`) e campo `map`
- `world-map.svg`: mappa del mondo
- `maps/*.svg`: 41 mappe regionali per paese (Italia, Germania, Spagna, USA, ecc.)
- `README.md`: istruzioni GitHub Pages e crediti

Dati salvati in `localStorage` (chiave `expeditionJournalData`), con export/import JSON.

## Decisioni approvate (da implementare)
1. **Homepage**: globo 3D che ruota, usando **Globe.gl** (CDN cdnjs o jsDelivr con versione fissata). Ogni paese visitato è cliccabile e porta alla sua pagina.
2. **Barra di esplorazione** grande, stile passaporto, con percentuale = paesi visitati / 197 (totale `GEO_DATA.countries`).
3. **Navbar** con almeno: Home (globo), Tutte le foto, Chatbot, e le pagine dei paesi.
4. **Gerarchia di zoom**: Mondo → Paese (intero, oppure zoom su regione) → Regione (intera, oppure zoom su città) → Città (intera, oppure zoom sui monumenti) → Monumento. Ogni livello è selezionabile.
5. **Campi per ogni nodo**: foto, testo e campi aggiuntivi scelti dall'utente (date, link, valutazioni, tag, file, coordinate, liste). Il modello dati deve permettere campi personalizzati senza cambiare il codice.
6. **Chatbot** (pagina dedicata): risponde solo in base ai dati dell'utente (paesi, regioni, città, monumenti, note). Nessuna chiamata a API esterne. Niente chiavi API nel codice.
7. **Estetica**: sfondo pergamena/mappa antica per sfondo e titoli, timbri e bordi da passaporto per i componenti. Il tema scuro oro attuale può essere la base, ma va reso più vintage.
8. **Login**: filtro lato browser con credenziali (hash, non password in chiaro nel codice). Va chiarito all'utente che non è una protezione reale: chi legge il codice può aggirarlo.

## Regole di lavoro
- **Non inventare funzionalità.** Prima di creare qualcosa di nuovo, chiedere approvazione. Il piano sopra è già approvato; tutto ciò che non è nel piano va proposto prima.
- **Risposte brevi e dirette.** L'utente preferisce conferme secche e comandi copiabili, senza testo di riempimento.
- **Lingua**: comunicare con l'utente in italiano. I testi dell'interfaccia restano in inglese o italiano secondo il contesto già presente nel file.
- **Nel codice (CSS e HTML compresi) non scrivere commenti**, tranne un piccolo commento di una riga che spiega cosa fa ogni nuova parte aggiunta.
- Mantenere il tono visivo esistente quando possibile; modifiche estetiche grandi solo dopo approvazione.
- Non usare `localStorage` in contesti diversi da quello già usato dall'app, e non introdurre backend senza approvazione.
- Dopo ogni modifica: controllo sintassi JS (`node`), e verificare che i nomi dei paesi/regioni combacino con i file in `maps/` e con `world-map.svg`.

## Attenzione tecnica
- I nomi dei paesi nella lista devono corrispondere a `aria-label` nelle SVG. Alcuni alias sono in `script.js` (`MAP_NAME_ALIASES`, `ITALY_REGION_ALIASES`).
- Le SVG della mappa provengono da svg-maps (CC BY 4.0): mantenere i crediti in `index.html` e `README.md`.
- Il tag `[hidden]` va sempre sovrascritto esplicitamente in CSS quando un elemento ha `display` impostato (vedi `.lightbox[hidden]` e `.world-map-section[hidden]`).
- Le immagini sono ridimensionate prima del salvataggio (max 900 px) per restare nei limiti di `localStorage`.
- GitHub Pages serve solo file statici: nessun codice lato server.

## Prossimi passi (in ordine)
1. Chiedere conferma sullo stato attuale del sito dopo il deploy.
2. Implementare la homepage con globo Globe.gl e la barra di esplorazione.
3. Aggiungere navbar e pagina "Tutte le foto".
4. Aggiungere la pagina chatbot basata solo sui dati locali.
5. Aggiungere il login lato browser con credenziali hashate.
6. Rendere la gerarchia a campi personalizzati (Mondo → Paese → Regione → Città → Monumento).
7. Applicare l'estetica vintage/passaporto.
