const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const userRouter = require('./routes/userRoutes')
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
app.use(cors({origin: process.env.CLIENT_URL}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true})); //body-parser


app.use("/files", express.static(path.resolve(__dirname, "files")));
app.use(routes);
app.use("/user", userRouter)

try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    console.log('MongoDB connected successfully!');
} catch (error) {
    console.log(error);
}


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})
