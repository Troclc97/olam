var net = require('net');
var fs = require('fs');

/***************/
//const db = require('./db');
const helper = require('./helper');
//const mysql = require('./db/mysql');
const RECEIVE_OK = "$";

var redis_key = "DEVICE_";
var TIMER_KEY = "TIMER";
var TIMER2_KEY = "TIMER2";
var TEMP_KEY = "TEMP";
var PRESS_KEY = "PRES";
var LOT_KEY = "LOTNO";
var SHAFT_KEY = "SHAFT";
var DRUM_KEY = "DRUM";
var HUMI_KEY = "HUMI";
var ID_KEY = "ID";
var expire_time = 366;
var SERVER_PORT = 80;

var TEMP_IDS = ",1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,";
var PRESS_IDS = ",2,4,6,8,10,39,42,45,48,51,54,57,60,";
var HUMI_IDS = ",12,14,16,18,20,22,24,26,28,30,32,34,36,";
var SHAFT_IDS = ",38,41,44,47,50,53,56,59,";
var DRUMP_IDS = ",37,40,43,46,49,52,55,58,";
var	TIMER_IDS = ",1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,40,43,46,49,52,55,58,";
var TIMER2_ID = ",2,4,6,8,10" + HUMI_IDS;
//mapping ID device vs device group
var mapping = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 25, 25, 25, 26, 26, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
//var counter = 60;

/****************/
redis     = require('redis'),
  /* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
  client    = redis.createClient({
    port      : 6379,               // replace with your port
    host      : 'localhost',//'116.212.40.3',//'10.9.120.113',        // replace with your hostanme or IP address
    password  : '',    // replace with your password
    // optional, if using SSL
    // use `fs.readFile[Sync]` or another method to bring these values in
   /* tls       : {
      key  : stringValueOfKeyFile,  
      cert : stringValueOfCertFile,
      ca   : [ stringValueOfCaCertFile ]
    }*/
});
client.on("error", function (err) {
    console.log("Error " + err);
});
/*
var client = redis.createClient({
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});*/


/*
client.hset("hash-key", "hashtest 1", "some value", redis.print);
client.hset(["hash-key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash-key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
*/
var server = net.Server(function handle(socket) {
    socket.setNoDelay(true);
	
	socket.setTimeout(10000);
	
    socket.on('data', function(data) {
        //console.log('*');
		//data = '*2|2018/07/08_15:46|0988613510|0#';
			//var d = ":0B06000101BD3099";
		var rec = data.toString();
		//var rec = ":0E06020101BD3099";
		//var d= ":0106000B0000EE";
		var arr = helper.parseToValue(rec);
		
		if(arr.length != 3)
			return;
		
		console.log(arr);
		var ID = parseInt(arr[0], 16);
		//counter = counter + 1;
		//ID = counter;
		console.log("ID value is %s", ID);
		var value = parseInt(arr[1], 16);
	//	console.log ("%s|%s|%s", ID, value, TIMER_IDS);
	//	console.log(helper.convertToDecimal(arr[1]));
		var timer = "";
		var lotno1 = "";
		var key = redis_key + mapping[ID];
		console.log("%s   %s     %s  ", ID, value, key);
		client.hset([key, ID_KEY, mapping[ID]], redis.print);
		var index = "," + ID + ",";
		//counter = counter + 1;
		if (TIMER_IDS.indexOf(index) >= 0) {//device temp has timer
			timer = parseInt(arr[2], 16);
			console.log("Timer = " + timer);
			client.hset([key, TIMER_KEY, timer], redis.print);
			//client.hset([key, TEMP_KEY, value ], redis.print);
		} else if(ID > 60){//LOTNO
			lotno1 = parseInt(arr[2], 16);
			if(lotno1 < 10)
				lotno1 = "0" + lotno1;
			if(value < 1000){
				value = "0" + value;
			}
			console.log("LOTNO = %s|%s", (lotno1), value);
			var lotno = lotno1.toString() + (value).toString();
			console.log("LOTNO = %s", lotno);
			client.hset([key, LOT_KEY, lotno], redis.print);
			//return;
		} else { //other
			console.log("OTHER ");
			//client.hset([key, PRESS_KEY, value], redis.print);
		}
		//set timer2
		if (TIMER2_ID.indexOf(index) >= 0) {//device timer2
			timer = parseInt(arr[2], 16);
			console.log("Timer2 = " + timer);
			client.hset([key, TIMER2_KEY, timer], redis.print);
		} 
		var key_device = "";
		if(TEMP_IDS.indexOf(index) >= 0){
			key_device = TEMP_KEY;
		} else if(PRESS_IDS.indexOf(index) >= 0){
			key_device = PRESS_KEY;
		} else if(HUMI_IDS.indexOf(index) >= 0){
			key_device = HUMI_KEY;
		} else if(SHAFT_IDS.indexOf(index) >= 0){
			key_device = SHAFT_KEY;
		} else if(DRUMP_IDS.indexOf(index) >= 0){
			key_device = DRUM_KEY;
		}
		if(key_device != "")
			client.hset([key, key_device, value], redis.print);
		
		//set key expire
		client.expire([key, expire_time], redis.print);
		
		//set to redis
		//let sql = `INSERT INTO tbl_machine_values(machine_id,value)
          // VALUES(` + ID + `,` + value + `)`;
		   
		   /*let sql = `INSERT INTO tbl_machine_values(machine_id,value)
           VALUES('1', 170)`;*/
		/*mysql.query(sql, {}, function (error, results, fields) {
    //Do your stuff
	console.log("-------" + error)
});*/
        //console.log("---" + rec);
		
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
server.listen(SERVER_PORT, function(){
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
            server.listen(SERVER_PORT);
        }, 1000);
    }
});
