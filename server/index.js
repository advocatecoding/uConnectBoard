const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT  || 9001; // Wähle einen Port deiner Wahl
const multer = require('multer');
app.use(cors());


// Middleware für den Umgang mit JSON-Daten
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware für FormData
const upload = multer();
app.use(upload.array());


// Verbindung zur Datenbank herstellen
const db = mysql.createConnection({
    host: 'sql11.freesqldatabase.com',
    user: 'sql11683651',
    password: 'XBimpeyPxB',
    database: 'sql11683651'
});

db.connect((err) => {
    if (err) {
        console.error('Verbindung zur Datenbank fehlgeschlagen:', err);
    } else {
        console.log('Verbindung zur Datenbank erfolgreich hergestellt');
    }
});

// Endpunkt für GET-Anfrage aller Einträge
app.get('/entries', (req, res) => {
    const sql = 'SELECT * FROM Eintraege';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Fehler beim Abrufen der Einträge:', err);
            res.status(500).send('Interner Serverfehler');
        } else {
            res.json(result);
        }
    });
});

// Endpunkt für POST-Anfrage zum Hinzufügen eines Eintrags
app.post('/entries', (req, res) => {
    const { titel, inhalt } = req.body;
    const sql = 'INSERT INTO Eintraege (titel, inhalt) VALUES (?, ?)';
    console.log(req.body)
    db.query(sql, [titel, inhalt], (err, result) => {
        if (err) {
            console.error('Fehler beim Hinzufügen des Eintrags:', err);
            res.status(500).send('Interner Serverfehler');
        } else {
            res.send('Eintrag erfolgreich hinzugefügt');
        }
    });
});

// Endpunkt für GET-Anfrage eines bestimmten Eintrags anhand seiner ID
app.get('/entries/:id', (req, res) => {
    const entryId = req.params.id;
    const sql = 'SELECT * FROM Eintraege WHERE id = ?';

    db.query(sql, [entryId], (err, result) => {
        if (err) {
            console.error('Fehler beim Abrufen des Eintrags:', err);
            res.status(500).send('Interner Serverfehler');
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Den gefundenen Eintrag zurückgeben
            } else {
                res.status(404).send(`Eintrag mit der ID ${entryId} wurde nicht gefunden`);
            }
        }
    });
});


// Endpunkt für DELETE-Anfrage zum Löschen eines Eintrags anhand seiner ID
app.delete('/entries/:id', (req, res) => {
    const entryId = req.params.id;
    const sql = 'DELETE FROM Eintraege WHERE id = ?';

    db.query(sql, [entryId], (err, result) => {
        if (err) {
            console.error('Fehler beim Löschen des Eintrags:', err);
            res.status(500).send('Interner Serverfehler');
        } else {
            if (result.affectedRows > 0) {
                res.send(`Eintrag mit der ID ${entryId} erfolgreich gelöscht`);
            } else {
                res.status(404).send(`Eintrag mit der ID ${entryId} nicht gefunden`);
            }
        }
    });
});



function deleteOldEntries() {
    const sql = 'DELETE FROM Eintraege WHERE zeitstempel <= NOW() - INTERVAL 7 DAY';
    db.beginTransaction(function (err) {
        if (err) { throw err; }
        db.query(sql, function (err, result) {
            if (err) {
                return db.rollback(function () {
                    console.error('Fehler beim Löschen alter Einträge:', err);
                });
            }
            db.commit(function (err) {
                if (err) {
                    return db.rollback(function () {
                        console.error('Fehler beim Commit:', err);
                    });
                }
                console.log('Ältere Einträge erfolgreich gelöscht', result);
            });
        });
    });
}

setInterval(deleteOldEntries, 86400000);

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
