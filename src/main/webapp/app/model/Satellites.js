Ext.define('tvedit.model.Satellites', {
    extend: 'Ext.data.Model',
    fields: ['ordinal', 'Name'],
	
	constructor: function(data, id, raw, convertedData) {
		this.buffer = getBufferFromString(data);
		var fields = this.getFields();
		this.callParent([fields, id, raw, convertedData]);
	},
	
	getFields: function() {
		return {
			name: this.getName()
		};
	},
	
	setOrdinal: function(ord) {
		this.set('ordinal', ord);
	},
	getName: function() {
		return getString(this.buffer, 0x0C, 15, 'UCS-2').trim();
	},
	
	isEmptyChannel: function() {
		return false;
	}
});
