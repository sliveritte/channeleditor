Ext.define('tvedit.model.DigitalChannel', {
    extend: 'Ext.data.Model',
    fields: ['ordinal', 'index', 'name'],
	
	constructor: function(data, id, raw, convertedData) {
		this.buffer = getBufferFromString(data);
		var fields = this.getFields();
		this.callParent([fields, id, raw, convertedData]);
	},
	
	getFields: function() {
		return {
			index: this.getIndex(),
			name: this.getName()
		};
	},
	
	setOrdinal: function(ord) {
		this.set('ordinal', ord);
	},
	getIndex: function() {
		return getUShortLE(this.buffer, 0);
	},
	getName: function() {
		return getString(this.buffer, 0x40, 100, 'UCS-2').trim();
	},
	getFormat: function() {
		
	},
	getType: function() {
		var type = getUByte(this.buffer, 0x0F);
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
	setIndex: function(num) {
		setUShortLE(this.buffer, 0, num);
		this.set('index', num);
	},
	toString: function() {
		return this.getIndex() + '. ' + this.getName() + ' (' + this.getType() + ')';
	},
	getData: function() {
		this.updateChecksum();
		return getStringFromBuffer(this.buffer);
	},
	getChecksum: function() {
		return getUByte(this.buffer, this.buffer.length-1);
	},
	calcChecksum: function() {
		var cs = 0;
		for(var i = 0; i < this.buffer.length-1; i++) {
			cs = (cs + getUByte(this.buffer, i)) & 0xFF;
		}
		return cs;
	},
	isValid: function() {
		return this.getChecksum() == this.calcChecksum();
	},
	updateChecksum: function() {
		setUByte(this.buffer, this.buffer.length - 1, this.calcChecksum());
	},
	isEmptyChannel: function() {
		return this.getIndex() == 0;
	}
});
