Ext.define('tvedit.view.BrowsePanel', {
    extend: 'Ext.container.Container',
    alias: 'widget.browsepanel',
	layout: 'absolute',
	
	initComponent: function() {
		var viewSize = Ext.getBody().getViewSize();
		var width = 400;
		var height = 200;
		this.btnBrowse = new Ext.Button({iconCls: 'tv-browse-btn-icon', cls: 'tv-btn', text: 'Browse', scale: 'large', width: 100, height: 50});
		this.textArea = new Ext.Component({
			cls: 'tv-browse-text',
			html: 'Export a channel list file from your TV (.SCM extension) and <br>upload it using the button below or just drop it here.'
		});
		this.browsePanel = new Ext.Panel({
			title: 'Samsung Channel Editor',
			frame: true,
			width: width,
			height: height,
			x: (viewSize.width - width)/2,
			y: (viewSize.height - height)/2,
			layout: {
				type: 'vbox',
				align: 'center'
			},
			items: [this.textArea, this.btnBrowse]
		});
		
		this.items = this.browsePanel;

		var u = new plupload.Uploader({
			runtimes : 'html5,flash,html4',
			browse_button : this.btnBrowse.getId(),
			drop_element: this.browsePanel.getId(),
			max_file_size : '100kb',
			url : 'app.jsp',
			flash_swf_url : 'plupload2b/js/Moxie.swf',
			silverlight_xap_url : 'plupload2b/js/Moxie.xap',
			filters : [
				{title : "Samsung Channel File", extensions : "scm"}
			]
		});
		u.bind('Init', Ext.bind(this.onUploaderInit, this));
		u.bind('Error', Ext.bind(this.onUploaderError, this));
		u.bind('FilesAdded', Ext.bind(this.onUploaderSelect, this));
		u.bind('FileUploaded', Ext.bind(this.onUploaderComplete, this));
		this.uploader = u;
		this.callParent();
		
		this.addEvents('fileselected');
	},

	afterRender: function(ct) {
		this.callParent(arguments);
		this.uploader.init();
	},
	
	onUploaderInit: function(uploader, params) {
	},
	
	onUploaderError: function(uploader, err) {
//		console.log("Error: " + err.code +
//            ", Message: " + err.message +
//            (err.file ? ", File: " + err.file.name : ""));
	},
	
	onUploaderSelect: function(uploader, files) {
		setTimeout(Ext.bind(this.uploader.start, this.uploader), 100);
	},
	
	onUploaderComplete: function(up, file, response) {
		if(response.status == 200) {
			var content = Ext.decode(response.response);
			this.fireEvent('fileselected', content);
		}
	}

});
