const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

//middleware from express.js
app.use(cors());
app.use(express.json());

//from mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p29ie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//from node mongo crud
//quick start
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('genius-car').collection('service');
        const orderCollection = client.db('genius-car').collection('order');

        //auth jwt token
        app.post('/login', async (req, res) => {
            const user = req.body;
            console.log(user);
            var token = jwt.sign(user, process.env.TOKEN_SECRET, { expire: '1y' });
            res.send({ token });
        });

        //find multiple
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //akta service id diye get er jonno 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //post from insert a document
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        //delete 
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        //order collection api

        //get all order
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = email;
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //book order
        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Car Service');
});

app.listen(port, () => {
    console.log('Listening from port', port);
})