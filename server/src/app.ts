import express from "express";

// Create Express server
const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

if (process.env.JEST_WORKER_ID === undefined) {
    app.listen(8081, () => {
        console.log("App listening on port 8081");
    });
}

export default app;
