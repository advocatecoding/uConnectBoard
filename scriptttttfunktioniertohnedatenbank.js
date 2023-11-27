document.addEventListener("DOMContentLoaded", function () {
    const entryForm = document.getElementById("entry-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const entriesContainer = document.getElementById("entries");

    entryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = titleInput.value;
        const content = contentInput.value;

        if (title.trim() === "" || content.trim() === "") {
            alert("Bitte fülle alle Felder aus.");
            return;
        }

        // Erstelle einen neuen Eintrag
        const entry = document.createElement("div");
        entry.className = "entry";

        // Erstelle einen Timestamp ohne Sekunden
        const timestamp = new Date().toLocaleString(undefined, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

        entry.innerHTML = `<div class="timestamp">${timestamp}</div><h2>${title}</h2><p>${content}</p>`;

        // Füge den Eintrag der Anzeige hinzu
        entriesContainer.appendChild(entry);

        // Zurücksetzen des Formulars
        titleInput.value = "";
        contentInput.value = "";
    });
});
