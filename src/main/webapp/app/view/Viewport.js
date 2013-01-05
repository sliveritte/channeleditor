Ext.define('tvedit.view.Viewport', {
    extend: 'Ext.Viewport',
    alias: 'widget.mainview',
	requires: ['tvedit.view.BrowsePanel'],
	layout: 'fit',
	items: [{xtype: 'browsepanel'}]
});
