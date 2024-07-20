const express=require('express');
const cors = require('cors');
const mysql = require("mysql");
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const bodyparser = require('body-parser');
const db = require("./db_connect");
const authenticate_token = require('./authenticate_token');
const storage = require('localstorage-slim');
const bcrypt = require('bcrypt');
const router = express.Router();
const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));


module.exports={app,mysql,db,authenticate_token,storage,bcrypt,router,jwt,dotenv};