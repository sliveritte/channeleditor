Ext.define('tvedit.controller.Browse', {
    extend: 'Ext.app.Controller',
	refs: [{ref: 'browsePanel', selector: 'browsepanel'},
			{ref: 'viewport', selector: 'mainview'}],
	
	requires: ['tvedit.view.BrowsePanel'],

	init: function() {
		this.control({
			'browsepanel': {
				'fileselected': this.onFileSelected
			}
		});
    },
	
	onFileSelected: function(content) {
		var browsePanel = this.getBrowsePanel();
		browsePanel.ownerCt.remove(browsePanel);
		this.application.fireEvent('load', content);
	}
	
});
