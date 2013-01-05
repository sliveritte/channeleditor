function getBufferFromString(str) {
	var buff = new Array(str.length);
	for(var i = 0; i < str.length; i++) {
		buff[i] = str.charCodeAt(i);
	}
	return buff;
}
function getStringFromBuffer(buff) {
	var str = new Array(buff.length);
	for(var i = 0; i < buff.length; i++) {
		str[i] = String.fromCharCode(buff[i]);
	}
	return str.join('');
}
function getUShortLE(buffer, offset) {
	return getUByte(buffer, offset) + (getUByte(buffer, offset+1) << 8);
}

function getUShortBE(buffer, offset) {
	return (getUByte(buffer, offset) << 8) + getUByte(buffer, offset+1);
}

function getUByte(buffer, offset) {
	return buffer[offset];
}

function getString(buffer, offset, length, encoding) {
	return STRING_ENCODINGS[encoding](buffer, offset, length);
}

function setUShortLE(buffer, offset, num) {
	var b1 = num & 0xFF;
	var b2 = (num >> 8) & 0xFF;
	setUByte(buffer, offset, b1);
	setUByte(buffer, offset+1, b2);
}

function setUByte(buffer, offset, byte) {
	buffer[offset] = byte;
}

STRING_ENCODINGS = {
	'UCS-2': function(buff, offset, length) {
		var str = [];
		var pos = offset;
		var end = offset + length;
		while(pos < end) {
			var charCode = getUShortBE(buff, pos);
			if(charCode == 0) break;
			var char = String.fromCharCode(charCode);
			str.push(char);
			pos += 2;
		}
		return str.join('');
	},
	
	'ISO-8859-1': function(buff, offset, length) {
		var str = [];
		var pos = offset;
		var end = offset + length;
		while(pos < end) {
			var charCode = getUByte(buff, pos);
			if(charCode == 0) break;
			var char = String.fromCharCode(charCode);
			str.push(char);
			pos += 1;
		}
		return str.join('');
	}
};
