import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("Thread_1");
  let results = await collection.find({}).toArray(); 
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("Accounts");
  let query = {_id: /*new ObjectId(*/req.params.id};
  let result = await collection.findOne(query);
  if (!result) 
    return res.send("Not found").status(404);
  else  {
    return res.json(result).status(200);//not being recieved
  }

    
});

// This section will help you create a new record.

router.post("/", async (req, res) => {
  if (req.body.user != null) {
    let accountAdd = {
      _id: req.body.user,
      user: req.body.user,
      pass: req.body.pass
    };
    let collection = await db.collection("Accounts");
    let result = await collection.insertOne(accountAdd);
    res.send(result).status(204);
  } else {
    let newDocument = {
      date: req.body.date,
      name: req.body.name,
      chat: req.body.chat
    };
    let collection = await db.collection("Thread_1");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  }
  
  
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      date: req.body.date,
      name: req.body.name,
      chat: req.body.chat
    }
  };

  let collection = await db.collection("Thread_1");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("Thread_1");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
