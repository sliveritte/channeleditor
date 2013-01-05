tvedit.Channel = function(data) {
	this.data = getBufferFromString(data);
}
tvedit.Channel.prototype = {
	getIndex: function() {
		return getUShortLE(this.data, 0);
	},
	getName: function() {
		return getString(this.data, 0x40, 100, 'UCS-2').trim();
	},
	getFormat: function() {
		
	},
	getType: function() {
		var type = getUByte(this.data, 0x0F);
		switch(type) {
		case 0x01: return 'TV';
		case 0x02: return 'RADIO';
		case 0x0C: return 'DATA';
		case 0x19: return 'HD';
		default: return 'UNKNOWN';
		}
	},
	isFaviorite1: function() {
		
	},
	isFaviorite2: function() {
		
	},
	isFaviorite3: function() {
		
	},
	isFaviorite4: function() {
		
	},
	setNumber: function(num) {
		setUShortLE(this.data, 0, num);
	},
	toString: function() {
		return this.getIndex() + '. ' + this.getName() + ' (' + this.getType() + ')';
	},
	getData: function() {
		this.updateChecksum();
		return getStringFromBuffer(this.data);
	},
	getChecksum: function() {
		return getUByte(this.data, this.data.length-1);
	},
	calcChecksum: function() {
		var cs = 0;
		for(var i = 0; i < this.data.length-1; i++) {
			cs = (cs + getUByte(this.data, i)) & 0xFF;
		}
		return cs;
	},
	isValid: function() {
		return this.getChecksum() == this.calcChecksum();
	},
	updateChecksum: function() {
		setUByte(this.data, this.data.length - 1, this.calcChecksum());
	}
};
