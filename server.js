const express = require('express');
const app = express();
const { createServer } = require('http');
//const server = http.createServer(app);
const { Server }= require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const getUser = require('./utils/getUser');

dotenv.config({ path: './config/config.env' });

connectDB();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/socket.io', express.static(__dirname + 'http://172.16.55.48:5001', {
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }))
  
app.get("/", (req, res, next) => {
  res.sendFile("./frontend/index.html", { root: __dirname });
});

io.on('connection', (socket) => {
  console.log('New Client Connected');
  socket.on('getTransactions', async () => {
    try {
        const ip = socket.request.connection.remoteAddress; //  socket.request.remoteAddress gives the IP address of the user
        const { user } = await getUser(ip);
        transaction = {
          sucess: true,
          count:user.transactions.length,
          data: user.transactions
        }
        socket.emit('transaction',await transaction);

      } catch (err) {
          console.log('error in getTransactions', err);
        }
      });

      socket.on('addTransaction', async (transaction) => {
        try {
          const ip = socket.request.connection.remoteAddress;
          const { user, addTransaction } = await getUser(ip);
      
          const { description, amount } = transaction;
          const newTransaction = { description, amount };
      
          await addTransaction(newTransaction);
      
          io.emit('addedTransaction', newTransaction);

        } catch (err) {
          console.log('error in addTransaction', err);
        }
      });
      

  socket.on('deleteTransaction',async (id)=>{
    try {
      const ip = socket.request.connection.remoteAddress; 
      const { user, deleteTransaction } = await getUser(ip);
  
      //const transactionId = id;
  
      await deleteTransaction(id);
  
      io.emit('deletedTransaction', id);

    } catch (err) {
        console.log('error in deleteTransaction', err);
    }
  })

})

const PORT = process.env.PORT || 5001;

//http.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  });
  