let client;
import { Server } from "socket.io";

let config =  {
	cors: {
		origin: "*",
		allowedHeaders: []
	}
};

export default {
	init(socket) {
		console.log('Connected')
		client = new Server(socket, config);
		socket.emit('message', {type: 'REQUEST_AUTHORIZE'});
		// socket.on("connection", (socket) => {
		// 	console.log('Connected')
		// 	console.log("User connected");
		// });
	},
	emit(msg, data) {
		client.emit(msg, data)
	}
}