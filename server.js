"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var httpModule = require("http");
const socket_io_1 = require("socket.io");
var app = express();
// var http = require('http').Server(app);
// var io = require("socket.io")(http);
var http = httpModule.Server(app);
var io = new socket_io_1.Server(http, {
// Socket.IO options
});
app.use(express.static(__dirname));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost:27017/real-chat-messages", (err) => {
    console.log("mongodb connected ", err);
});
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true]
    },
    message: String
});
const Message = mongoose.model("Message", messageSchema);
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});
app.post("/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        var message = new Message(req.body);
        var savedMessage = yield message.save();
        io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
        console.log("error on message");
    }
}));
app.get("/suka", () => {
    console.log("what@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
});
io.on('connection', (socket) => {
    console.log('a user is connected ', socket.id);
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
    // socket.on("hello from client", (...args: any) => {
    // })
});
var server = http.listen(3001, () => {
    console.log("start server chat application at port 3001");
});
