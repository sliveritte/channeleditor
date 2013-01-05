Ext.define('tvedit.model.CloneInfo', {
    extend: 'Ext.data.Model',
    fields: ['country', 'model'],
	
	constructor: function(data, id, raw, convertedData) {
		this.buffer = getBufferFromString(data);
		var fields = this.getFields();
		this.callParent([fields, id, raw, convertedData]);
	},
	
	getFields: function() {
		return {
			country: this.getCountryCode(),
			model: this.getModel()
		};
	},
	
	setOrdinal: function(ord) {
	},

	getCountryCode: function() {
		var code = getString(this.buffer, 0x0, 4, 'ISO-8859-1').trim();
		return code.split('').reverse().join('');//reverse string
	},
	
	getModel: function() {
		return getString(this.buffer, 0x4, 15, 'ISO-8859-1').trim();
	},
	
	isEmptyChannel: function() {
		return false;
	}
});
