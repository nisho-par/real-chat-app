var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var httpModule = require("http");
import { Server } from "socket.io";

var app = express();
// var http = require('http').Server(app);
// var io = require("socket.io")(http);

var http = httpModule.Server(app);
var io = new Server(http, {
    // Socket.IO options
});


app.use(express.static(__dirname));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}))

mongoose.connect(
    "mongodb://localhost:27017/real-chat-messages", (err: Error) => {
        console.log("mongodb connected ", err);
    }
);

const messageSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: [true]
    },
    message: String
})

const Message = mongoose.model("Message", messageSchema);

app.get('/messages', (req:Request, res:any) => {
    Message.find({}, (err:Error, messages: any) => {
        res.send(messages);
    })
})


app.post("/messages", async (req: Request, res: any) => {

    try {
        console.log(req.body);
        var message = new Message(req.body);
        var savedMessage = await message.save();
        
        io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
        console.log("error on message")
    }
});


io.on('connection', (socket: any) => {
    console.log('a new connection is opened ',socket.id);
})

var server = http.listen(3001, () => {
    console.log("start server chat application at port 3001");
})