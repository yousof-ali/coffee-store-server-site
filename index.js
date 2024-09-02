const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lewcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // creat a client 
    const database = client.db("CoffeStore")
    const coffeCollections = database.collection('COFFEE')

    // add coffee in database 
    app.post('/newcoffee',async(req,res) => {
         const newCoffe = req.body
         const result = await coffeCollections.insertOne(newCoffe);
         res.send(result);
    })

    // get one data 
    app.get('/details/:id',async(req,res) => {
      const reqId = req.params.id;
      const query = {_id: new ObjectId(reqId)}
      const coffe = await coffeCollections.findOne(query);
      res.send(coffe);
    })

    // update data 
    app.put('/edit/:id',async(req,res) => {
      const reqId = req.params.id;
      console.log(reqId);
      const editData = req.body;
      const query = {_id : new ObjectId(reqId)}
      const option = {upsert:true}
      const updateCoffe = {
        $set:{
          name:editData.name,
          details:editData.details,
          chef:editData.chef,
          category:editData.category,
          photo:editData.photo,
          supplier:editData.supplier,
          taste:editData.taste,
        }
      };
      const result = await coffeCollections.updateOne(query,updateCoffe,option);
      res.send(result);
    })


    // delete data 
    app.delete('/delete/:id',async(req,res) => {
      const id = req.params.id
      const qurey = {_id: new ObjectId(id)}
      const result = coffeCollections.deleteOne(qurey);
      res.send(result)
    })

    // get all data ?
    app.get('/allcoffee',async(req,res) => {
      const cursor = coffeCollections.find();
      const allcoffee = await cursor.toArray();
      res.send(allcoffee);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.post('/newCoffe',(req,res) => {
  const coffee = req.body
  console.log(coffee);
  res.send(coffee);
  
})



app.get('/' , (req,res) => {
    res.send("coffee store server is running !!!")
})


app.listen(port, () => {
    console.log(`cofffe server is running on port ${port}`);
    
}) 