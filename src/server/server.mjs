import express from "express";
import cors from "cors";
import fs from "fs";
import readline from "readline";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = ["http://localhost:3001"]; // Specify the allowed origins for the demo app

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins],
  },
});

const PORT = 3000;

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); // Enable CORS for all routes

const filePath = `${__dirname}/data/14-29-05_data_data.txt`; //Supplied data file
const chunkSize = 400;

let totalCountOfChunks = 0;
let indexGenerated = false;
let chunkIndexMap = new Map(); // Map to store the start and end lines of each chunk for the ECG reading

const generateIndex = () => {
  let lineCount = 0;
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  rl.on("line", () => {
    lineCount++;
  });

  rl.on("close", () => {
    totalCountOfChunks = Math.ceil(lineCount / chunkSize);
    indexGenerated = true;
    console.log(`Total count of chunks: ${totalCountOfChunks}`);

    // Generate the ECG chunk index map
    for (let i = 1; i <= totalCountOfChunks; i++) {
      const startLine = (i - 1) * chunkSize + 1;
      const endLine = Math.min(i * chunkSize, lineCount);
      chunkIndexMap.set(i, { startLine, endLine });
    }

    // Notify React client that the ECG index is generated
    io.emit("indexGenerated", totalCountOfChunks);
  });
};

const sendChunkData = (req, res, chunkNumber) => {
  const chunkRange = chunkIndexMap.get(chunkNumber);
  if (!chunkRange) {
    return res.status(400).json({ error: "Invalid ECG chunk number" });
  }
  const { startLine, endLine } = chunkRange;

  const data = [];
  let lineCount = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  // Conversion to millivolts (mV) helper
  const ecgAmplitudesMillivolts = (value) => value / 1000;

  rl.on("line", (line) => {
    lineCount++;
    if (lineCount === 1 || lineCount < startLine || lineCount > endLine) {
      // Skip the first line as contains data structure
      return;
    }

    const values = line.split(",");
    const chunkData = {
      time: parseFloat(values[0]).toFixed(2),
      ecgDataPoints: [
        parseFloat(values[1]),
        parseFloat(values[2]),
        parseFloat(values[3]),
        parseFloat(values[4]),
        parseFloat(values[5]),
      ]
        .filter(Boolean)
        .map(ecgAmplitudesMillivolts),
      // Assuming, based on dataset, the raw values are represented as microvolts (uV)
      // In clinical settings, from my experience, it is more common to display ECG data in millivolts (mV) than in microvolts (uV)
    };
    data.push(chunkData);

    if (lineCount >= endLine) {
      rl.close();
    }
  });

  rl.on("close", () => {
    const response = {
      data: data,
      chunkNumber: chunkNumber,
      totalCountOfChunks: totalCountOfChunks,
      thereIsMoreData: chunkNumber < totalCountOfChunks,
    };
    res.setHeader("Content-Type", "application/json"); // Set the Content-Type header to JSON for api payload
    res.json(response);
  });
};

app.get("/api/ecg-data", (req, res) => {
  const chunkNumber = parseInt(req.query.chunk);

  if (chunkNumber <= 0 || chunkNumber > totalCountOfChunks) {
    return res.status(400).json({ error: "Invalid chunk number" });
  }

  if (indexGenerated) {
    sendChunkData(req, res, chunkNumber);
  } else {
    res.json({ info: "Index not generated yet for test ECG file" });
  }
});

//Mock patient data API
app.get("/api/patient", (req, res) => {
  const patientObj = {
    title: "Mr",
    surname: "Alvarez Ferro",
    forename: "Juan",
    born: "01-Jan-1955",
    age: "75y",
    gender: "male",
    hospitalID: 156586656,
    nationalID: 5454645,
    clinician: "Dr Alba Fernandez",
    ward: "Cardiology",
    bay: "14",
    bed: "A45",
  };

  res.json(patientObj);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  generateIndex();
});

io.on("connection", (socket) => {
  console.log("Connected to socket");
  // Send initial message to the client about the index generation status
  if (indexGenerated) {
    console.log("Index generation was a success - ECH data now available");
    socket.emit("indexGenerated", totalCountOfChunks);
  }

  socket.on("disconnect", () => {
    // TODO: Handle client disconnection - would be next steps
  });
});
