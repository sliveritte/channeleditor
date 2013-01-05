Ext.define('tvedit.model.AnalogChannel', {
    extend: 'Ext.data.Model',
    fields: ['ordinal', 'name'],
	
	constructor: function(data, id, raw, convertedData) {
		this.buffer = getBufferFromString(data);
		var fields = this.getFields();
		this.callParent([fields, id, raw, convertedData]);
	},
	
	getFields: function(index) {
		return {
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
		return getString(this.buffer, 0x14, 10, 'UCS-2').trim();
	},
	getFormat: function() {
		
	},
	getType: function() {
		return 'TV';
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
//		setUShortLE(this.buffer, 0, num);
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
