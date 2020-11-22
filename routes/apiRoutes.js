// Required Modules
const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, '../db/db.json')

//========== HELPER FUNCTIONS ==========
function writeToDB(notes) {
    // try: attempt some process that may fail (fs.readFile)
    // catch: if a failure happens inside try block, error references the thrown error
    try {
        // Converts new JSON Array back to string &&
        // Writes String back to db.json
        fs.writeFileSync(DB_PATH, JSON.stringify(notes));
        //1. JSON/stringify converts [{"title":"Test Title","text":"Test text"}]:notes[] -> "[{"title":"Test Title","text":"Test text"}]":string
        //2. fs.writeFileSync --> saves notes to db.json
    } catch (error) {
        console.log(error)
    }
}

function getFromDB() {
    // try: attempt some process that may fail (fs.readFile)
    // catch: if a failure happens inside try block, error references the thrown error
    try {
        // Gets String back from db.json &&
        // Converts new JSON Array from string
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) || [];
        //1. fs.readFile returns --> notes = "[{"title":"Test Title","text":"Test text"}]":string
        //2. JSON.parse(notes) = [{"title":"Test Title","text":"Test text"}]:notes[]
    } catch (error) {
        console.log(error)
    }
}

module.exports = function (app) {

    //========== API ROUTES ==========

    // GET Method to return all notes
    app.get("/api/notes", function (req, res) {
        const notesData = getFromDB();
        res.json(notesData);
    });

    // POST Method to add notes
    app.post("/api/notes", function (req, res) {
        const notesData = getFromDB();

        // Set unique id to entry
        if (notesData.length == 0) {
            req.body.id = 0;
        } else {
            req.body.id = notesData[notesData.length - 1].id + 1;
        }

        // Pushes Body to JSON Array
        notesData.push(req.body);

        // Write notes data to database
        writeToDB(notesData);

        // returns new note in JSON format.
        res.json(req.body);
    });

    // DELETE Method to delete note with specified ID
    app.delete("/api/notes/:id", function (req, res) {
        const notesData = getFromDB();

        // Obtains id and converts to a string
        let id = parseInt(req.params.id);

        // Goes through notesArray searching for matching ID
        for (i = 0; i < notesData.length; i++) {
            if (notesData[i].id == id) {
                // Removes the deleted note
                notesData.splice(i, 1);
                break;
            }
        }

        // Write notes data to database
        writeToDB(notesData);

        res.sendStatus(200);
    });
};