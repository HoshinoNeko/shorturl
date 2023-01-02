const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const models = require("./models");
const validUrl = require("valid-url");
const router = express.Router();

const app = express();
const corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req,res) => {
    res.sendFile(__dirname + '/view/')
});

router.get('/:url', async (req,res) => {
   try {
       let url = await models.findURL(req.params.url);
       if(url !== null) {
           res.redirect(url)
       } else {
           res.send('invalid/expired URL');
       }
   }
   catch(e) {
       console.log(e);
       res.send('internal error contact administrator')
   }
});

router.post('/api/short', async (req,res) => {
   try {
       let hash = await models.storeURL(req.body.url);
       res.send(req.hostname + '/' + hash);
   }
   catch(e) {
       console.log(e);
       res.send('error occurred while creating short URL');
   }
});

app.use('/', router);

app.listen(process.env.PORT || 3000);
console.log(`Starting server on port ${process.env.PORT || 3000}`);