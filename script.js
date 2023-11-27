document.addEventListener("DOMContentLoaded", function () {
    const entryForm = document.getElementById("entry-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const entriesContainer = document.getElementById("entries");

    // Funktion zum Laden der Einträge
    function loadEntries() {
        fetch('https://u-connect-board-api.vercel.app/entries')
            .then(response => response.json())
            .then(entries => {
                // Lösche vorhandene Einträge
                entriesContainer.innerHTML = '';

                // Füge geladene Einträge hinzu
                entries.forEach(entry => {
                    // Konvertiere das Zeitstempel-Format
                    const timestamp = new Date(entry.zeitstempel).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    });

                    const entryElement = document.createElement("div");
                    entryElement.className = "entry";
                    entryElement.innerHTML = `<div class="timestamp">${timestamp}</div><h2>${entry.titel}</h2><p>${entry.inhalt}</p>`;
                    entriesContainer.appendChild(entryElement);

                    // Zufällige Hintergrundfarbe generieren und zuweisen
                    entryElement.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
                });
            })
            .catch(error => console.error('Fehler beim Laden der Einträge:', error));
    }

    entryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = titleInput.value;
        const content = contentInput.value;

        if (title.trim() === "" || content.trim() === "") {
            alert("Bitte fülle alle Felder aus.");
            return;
        }

        const formData = new FormData();
        formData.append('titel', title);
        formData.append('inhalt', content);

        fetch('https://u-connect-board-api.vercel.app/entries', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                // Lade Einträge nach dem Hinzufügen eines neuen Eintrags
                loadEntries();
            })
            .catch(error => {
                console.error('Fehler beim Senden der Daten an den Server:', error);
                throw error;
            });

        // Zurücksetzen des Formulars
        titleInput.value = "";
        contentInput.value = "";
    });

    // Lade Einträge beim Laden der Seite
    loadEntries();
});
