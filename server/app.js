import {app} from "express";
import cors from "cors";

const app = app();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});