// Back-end server side

// DEPENDENCIES

const express = require('express');
const path = require('path');
// const faker = require('faker');
const bodyParser = require('body-parser');
const moment = require('moment');
require('dotenv').config();

// IMPORTATIONS

const app = express();
app.use(bodyParser.json());
const { createMessage, getMessages } = require('./models/messagesModel');

// SET IO & CORS

const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);
// , {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   }
// }); - no need for these specifications
app.use(cors());

// ENDPOINT

app.use(express.static(path.join(__dirname, 'views')));
// informing express to use static file inside views directory
// better practice to put in public, for static
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (_req, res) => {
  // const data = [];
  // const allMessages = await getMessages();
  // res.render('index', { allMessages });
  // to be able to pass data to index.ejs, like passing a props
  res.render('index');
});

// IO LISTENERS - INTERACTION WITH CLIENT SIDE

io.on('connection', async (socket) => {
  console.log(`User ${socket.id} connected`);

  // 2. Receive 'message' emitted by client and emit back the formatted one
  socket.on('message', async ({ chatMessage, nickname }) => {
    // const defaultNickname = faker.name.firstName();
    // let finalNickname = '';
    // if (nickname.length > 0) {
    //   finalNickname = nickname;
    // } else {
    //   finalNickname = defaultNickname;
    // }
    const dateNow = new Date().getTime();
    const dateFormat = moment(dateNow).format('DD-MM-yyyy h:mm:ss A');
    const fullMessage = `${dateFormat} - ${nickname}: ${chatMessage}`;
    // req3 will keep this message in BD, calling function from model
    // await createMessage(fullMessage);
    // for now, gives error on side message (is this what forces us to use ejs?)
    // socket.broadcast.emit('message', fullMessage);
    // socket.emit('message', fullMessage);
    io.emit('message', fullMessage);
    // to have chat in both sides
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// PORT LISTENER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
