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
		console.log('Socket initialized');
		client = new Server(socket, config);
	},
	emit(msg, data) {
		client.emit(msg, data)
	}
}