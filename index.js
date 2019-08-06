var self = {
	measurementSplit : (str, callback) => {
		//str co format nhu sau *2|2018/07/08_15:46|0988613510|0#
		str = str.substring(0, str.length -2);
		//console.log("++" + str);
		if(self.validateString(str, callback)){
			//tmpStr = str.replace(/([^\w]*)([^\w]#)/, '');
			tmpStr = str.replace('*', '').replace('#', '');
			var arr = tmpStr.split('|');
			var time = arr[1].split('_');
			
			arr = arr.concat(time);
			//console.log(arr);
			return arr;
		} 
		console.log("Ngoai pham vi")
		return [];
	},
	measurementSplitDateTime : (str, callback) => {
		if(self.validateStringDateTime(str, callback)){
			//tmpStr = str.replace(/([^\w]*)([^\w]#)/, '');
			tmpStr = str.replace('*', '').replace('#', '');
			var arr = tmpStr.split('|');
			
			//console.log(arr);
			return arr;
		} 
		return [];
	},
	parseToValue : (str, callback) => {
		//:0106000100AAEE
		if(self.validateString(str)){
			var id = str.substring(1,3);
			var value = str.substring(9,13);
			var time = str.substring(5, 9);
			//var stas = str.substring(8,9);
			return [id, value, time];
		}
		console.log("[Error] receive data not well form " + str );
		return [];
	},
	convertToDecimal: (str, callback) => {
		return parseInt(str, 16);
	},
	validateString : (str, callback) => {
		//console.log(str.startsWith(":") + "|" + str.length );
		
		return (str.startsWith(":"));// && (str.length == 17) );
	},
	validateStringDateTime : (str, callback) => {
		//format from client 2018/07/08_15:46
		return ( str.indexOf('_') == 10 );
	},
	
}

module.exports = self;
