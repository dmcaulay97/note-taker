const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require('uniqid');
const e = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/../public"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/../public/index.html")));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/../public/notes.html")));

app.get("/api/notes", (req, res) => {
    fs.readFile("../db/db.json", (error, data) => {
        if (error) {
            console.error(error)
        } else {
            res.send(data);
        }
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile("../db/db.json", (error, data) => {
        if (error) {
            console.error(error)
        } else {
            let notes = JSON.parse(data);
            console.log(notes);
            let newNote = req.body;
            newNote["id"] = uniqid();
            notes.push(newNote);
            fs.writeFile("../db/db.json", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log('New note has been stored in db'))
            res.json(newNote);
        }
    })
})

app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("../db/db.json", (error, data) => {
        if (error) {
            console.error(error);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter(e => e.id != req.params.id)
            fs.writeFile("../db/db.json", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log('Note has been deleted'))
            res.send({});
        }
    })
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));