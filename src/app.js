const express = require('express')
const cors = require('cors')

require('./db/mongoose')

const login = require('./routes/login')

const app =express()
app.use(cors())
app.use(express.json())
app.use(login)


module.exports = app;