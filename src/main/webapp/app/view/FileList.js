Ext.define('tvedit.view.FileList', {
    extend: 'Ext.view.View',
    alias: 'widget.filelist',
	store: 'Files',
	selectedItemCls: 'tv-file-selected',
	tpl: [	'<ul class="tv-file-list">',
				'<tpl for=".">',
					'<li>{label}</li>',
				'</tpl>',
			'</ul>'],
	itemSelector: 'li'
});
