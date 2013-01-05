Ext.define('tvedit.view.ChannelList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.channellist',
	multiSelect: true,
	columns: [],
	viewConfig: {
		plugins: {
			ptype: 'gridviewdragdrop',
			dragText: 'Change channel number'
		},
		stripeRows: true
    },
	fileColumns: {
		'map-CableD': [{xtype: 'rownumberer'},
						{dataIndex: 'ordinal', header: '№'},
						{dataIndex: 'index', header: 'Channel'},
						{dataIndex: 'name', header: 'Name', width: 250}],
		'map-CableA': [{xtype: 'rownumberer'},
						{dataIndex: 'ordinal', header: '№'},
						{dataIndex: 'index', header: 'Channel'},
						{dataIndex: 'name', header: 'Name', width: 250}],
		'map-AirD': [{xtype: 'rownumberer'},
						{dataIndex: 'ordinal', header: '№'},
						{dataIndex: 'index', header: 'Channel'},
						{dataIndex: 'name', header: 'Name', width: 250}],
		'map-AirA': [{xtype: 'rownumberer'},
						{dataIndex: 'ordinal', header: '№'},
						{dataIndex: 'index', header: 'Channel'},
						{dataIndex: 'name', header: 'Name', width: 250}],
		'CloneInfo': [{dataIndex: 'country', header: 'Country'},
						{dataIndex: 'model', header: 'TV Model'}]
	},
	
	
	initComponent: function() {
		this.actionMove = new Ext.Action({text: 'Move to...', handler: this.onChannelMove, scope: this});
		this.actionSmartMove = new Ext.Action({text: '', tpl: 'Move to {0}', handler: this.onSmartChannelMove, scope: this});
		this.contextMenu = new Ext.menu.Menu({
			items: [this.actionMove, this.actionSmartMove]
		});
		
		this.tbar = [this.actionMove, '-', this.actionSmartMove];
		
		this.callParent();
		this.addEvents('channelmove', 'smartchannelmove', 'datachanged');
		this.getView().on('itemcontextmenu', this.onContextMenu, this);
	},
	
	onContextMenu: function(view, rec, node, index, e) {
		e.stopEvent();
		this.contextMenu.showAt(e.getXY());
		return false;
	},
	
	onChannelMove: function() {
		this.fireEvent('channelmove');
	},
	
	onSmartChannelMove: function() {
		this.fireEvent('smartchannelmove');
	},
	
	loadFile: function(fileName, store) {
		this.reconfigure(store, this.fileColumns[fileName]);
	}
	
});
