var net = require('net');
var fs = require('fs');

/***************/
const db = require('./db');
const helper = require('./helper');

const RECEIVE_OK = "$";
/****************/

var server = net.Server(function handle(socket) {
    socket.setNoDelay(true);
	
	socket.setTimeout(10000);
	
    socket.on('data', function(data) {
        //console.log('*');
		//data = '*2|2018/07/08_15:46|0988613510|0#';
		var rec = data.toString();
		
        console.log("---" + rec);
		
    });
	
	socket.on('close', function(){
		console.log('*******  Closing  ********');
	});
	 // Remove the client from the list when it leaves
	socket.on('end', function (c) {
		console.log("goodbye" );
		}).on('error', (err) => {
		// handle errors here
		//throw err;
		console.log(err);
	});
	
	socket.on('timeout', () => {
	  console.log('socket timeout');
	  socket.end();
	});
	

	
});
server.on('connection', function(socket){
		console.log('******* connection********');
})
server.listen(11000, function(){
	 console.log('Server started: Waiting for client connection ...');
});

server.on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying after 1minute..');
        setTimeout(function() {
            try {
                //fs.unlinkSync(domainSock);
                server.close();
            } catch (e) {
                console.log(e);
            }
            server.listen(11000);
        }, 1000);
    }
});