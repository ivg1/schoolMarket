require("dotenv").config();
const port = process.env.PORT;

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.listen(port, async () => {
    console.log(`server running on ${process.env.SERVER_URL} (port ${port})`);
    
});

//uploading images code
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ 
    storage: multer.memoryStorage() ,
    limits: {
        fileSize: 10*1024*1024
    }
});

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("file:", req.file);

        const outputFile = Date.now() + "_" + (Math.floor(Math.random() * 10000)) + ".webp";
        const outputPath = "uploads/" + outputFile;

        //compression
        await sharp(req.file.buffer)
            //.resize({ width: 1440 })
            .webp({ quality: 85, effort: 2 })
            .toFile(outputPath);


        res.status(200).json({ image_url: `${process.env.SERVER_URL}/uploads/${outputFile}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "upload failed" });
    }
});

const db = require("./db/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const listingsRouter = require("./routes/listings");
const authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/auth", authRouter);


app.get("/", (req, res) => {
    res.send("<h1>hello</h1>");
});
