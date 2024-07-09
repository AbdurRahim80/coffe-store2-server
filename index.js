const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ck878ci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
        
        const coffeeConnection = client.db("coffeeDB").collection("coffee");
        app.post('/users', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeConnection.insertOne(newCoffee);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = coffeeConnection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeConnection.findOne( query);
            res.send(result);
        })

        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    category: updateCoffee.category,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo
                }
            }
            const result = await coffeeConnection.updateOne(filter,  coffee, options);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeConnection.deleteOne(query);
            res.send(result);
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




app.get('/', (req, res) => {
    res.send('start running server')
})



app.listen(port, () => {
    console.log(`start running server port: ${port}`);
})