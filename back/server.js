const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config({path: './config/.env'});
const {checkUser, requireAuth} = require('./middleware/authmiddleware')
const app = express();
const userRoutes = require('./routes/user.routes')
// const nomenclatureRoutes = require('./routes/nomenclature.routes');
// const imputationRoutes = require('./routes/impitation.routes');
const sectionRoutes = require('./routes/section.routes')
const chapitreRoutes = require('./routes/chapitre.routes')
const articleRoutes = require('./routes/article.routes')
const paragrapheMerRoutes = require('./routes/paragrapheMer.routes')
const paragrapheRoutes = require('./routes/paragraphe.routes')
const inputationRoutes =require('./routes/impitation.routes')
const operationRoutes = require('./routes/operation.routes')
const comptableRoutes = require('./routes/comptable.routes')
const cors = require('cors'); 


connectDB()

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, 
    allowedHeaders: ['sessionId', 'Content-Type'], 
    exposedHeaders: ['sessionId'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false 
}

app.use(cors(corsOptions));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

//jwt
app.get('*', checkUser)
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});


// //nomenclature
// app.use('/nomenclature', nomenclatureRoutes);
// app.use('/imputations', imputationRoutes);


app.use('/api/section', sectionRoutes)
app.use('/api/chapitre', chapitreRoutes)
app.use('/api/article', articleRoutes)
app.use('/api/paragrapheMer', paragrapheMerRoutes)
app.use('/api/paragraphe', paragrapheRoutes)
app.use('/api/inputation', inputationRoutes)
app.use('/api/operation', operationRoutes)
app.use('/api/comptable', comptableRoutes)


//routes
app.use('/api/user', userRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Le server est connecter sur le port ${process.env.PORT}`);
});

