const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`car doctor's server running`);
})


///=====----------==========-----------
//                 Mongo DB CODE STARTS FROM HERE
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1o3onh9.mongodb.net/?retryWrites=true&w=majority`;
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
        // await client.connect();

        // get all data 
        const servicesCollection = client.db('carDoctor').collection('services');
        const bookingsCollection = client.db('carDoctor').collection('bookings');

        app.get('/services/', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        })


        // get specific id data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            console.log(typeof id);
            const query = { _id: id };
            console.log(query);
            const result = await servicesCollection.findOne(query,);
            console.log(result);
            res.send(result)
        })

        // users bookings
        app.post('/bookings', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await bookingsCollection.insertOne(data);
            res.send(result)
        })

        // get specific user's bookings data
        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req?.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray();
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




//                 Mongo DB CODE STARTS ENDS HERE
///=====----------==========-----------
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})