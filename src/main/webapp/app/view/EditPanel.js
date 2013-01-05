Ext.define('tvedit.view.EditPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editpanel',
	layout: 'border',
	
	requires: ['tvedit.view.FileList',
				'tvedit.view.ChannelList'],
	
	initComponent: function() {
    	this.items = [
			{
				title: 'Select a channel group', 
				cls: 'tv-channel-groups', 
				width: 200, 
				region: 'west', 
				items: [{xtype: 'filelist'},
						{xtype: 'button', iconCls: 'tv-save-btn-icon', cls: 'tv-btn tv-save-btn', text: 'Save', scale: 'large', handler: this.onSave, scope: this, width: 100, height: 50}]
			},
			{xtype: 'channellist', region: 'center', title: 'Channel List'},
		];
		this.callParent();
		this.addEvents('save');
	},
	
	onSave: function() {
		this.fireEvent('save');
	}

});
