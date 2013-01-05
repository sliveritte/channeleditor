Ext.define('tvedit.controller.Channels', {
    extend: 'Ext.app.Controller',
	requires: ['tvedit.model.DigitalChannel', 
				'tvedit.model.AnalogChannel', 
				'tvedit.model.SatChannel',
				'tvedit.model.CloneInfo',
				'tvedit.model.Satellites',
			'tvedit.view.EditPanel'],
	stores: ['Files'],
	refs: [{ref: 'viewport', selector: 'mainview'},
			{ref: 'channelList', selector: 'channellist'},
			{ref: 'fileList', selector: 'filelist'}],

	lastMoveIndex: 1,
	
    init: function() {
		this.fileConfig = {
			'map-CableD': {
				label: 'Digital Cable Channels',
				columns: [{xtype: 'rownumberer'},
//							{dataIndex: 'ordinal', header: '№'},
							{dataIndex: 'index', header: 'Channel'},
							{dataIndex: 'name', header: 'Name', width: 250}],
				model: 'tvedit.model.DigitalChannel',
				recordLength: [292,320]
			},
			'map-CableA': {
				label: 'Analog Cable Channels',
				columns: [{xtype: 'rownumberer'},
//							{dataIndex: 'ordinal', header: '№'},
							{dataIndex: 'name', header: 'Name', width: 250}],
				model: 'tvedit.model.AnalogChannel',
				recordLength: [40,64]
			},
			'map-AirD': {
				label: 'Digital Air Channels',
				columns: [{xtype: 'rownumberer'},
//							{dataIndex: 'ordinal', header: '№'},
							{dataIndex: 'index', header: 'Channel'},
							{dataIndex: 'name', header: 'Name', width: 250}],
				model: 'tvedit.model.DigitalChannel',
				recordLength: [292,320]
			},
			'map-AirA': {
				label: 'Analog Air Channels',
				columns: [{xtype: 'rownumberer'},
//							{dataIndex: 'ordinal', header: '№'},
							{dataIndex: 'name', header: 'Name', width: 250}],
				model: 'tvedit.model.AnalogChannel',
				recordLength: [40,64]
			},
			'map-SateD': {
				label: 'Satellite Digital Channels',
				columns: [{xtype: 'rownumberer'},
//							{dataIndex: 'ordinal', header: '№'},
							{dataIndex: 'index', header: 'Channel'},
							{dataIndex: 'name', header: 'Name', width: 250}],
				model: 'tvedit.model.SatChannel',
				recordLength: [144,168,172,194]
			},
			'CloneInfo': {
				label: 'TV Information',
				columns: [{dataIndex: 'country', header: 'Country'},
							{dataIndex: 'model', header: 'Model'}],
				model: 'tvedit.model.CloneInfo',
				recordLength: [68]
//			},
//			'SatDataBase.dat': {
//				label: 'Satellites',
//				columns: [{dataIndex: 'name', header: 'Name', width: 250}],
//				model: 'tvedit.model.Satellites',
//				recordLength: 145
			}
		};
		
		
		this.control({
			'channellist': {
				'channelmove': this.onChannelMoveRequest,
				'smartchannelmove': this.onSmartChannelMoveRequest,
				'datachanged': this.onDataChanged
			},
			'filelist': {
				'select': this.onFileSelect
			},
			'editpanel': {
				'save': this.onSave
			}
		});
		
		this.application.on('load', this.onLoadContent, this);
		
		this.dataCache = {};
    },
	
	onLoadContent: function(content) {
		this.getViewport().add({xtype: 'editpanel'});
		this.data = this.parseContent(content);
		this.loadFilesList();
		this.updateSmartMoveActionText();
		this.selectTvInfo();
	},
	
	loadFilesList: function() {
		var files = [];
		for(var p in this.data) {
			var fCfg = this.fileConfig[p];
			if(fCfg) {
				files.push({value: p, label: fCfg.label});
			}
		}
		
		files.sort(function(f1, f2) {
			var l1 = f1.label, l2 = f2.label;
			if(l1 < l2) return -1;
			else if(l1 > l2) return 1;
			else return 0;
		});
		var fileStore = this.getFilesStore();
		fileStore.loadData(files);
	},

	onFileSelect: function(view, rec, opt) {
		this.updateData();
		var fileName = rec.get('value');
		var fCfg = this.fileConfig[fileName];
		this.activeName = fileName;
		this.channelStore = this.getFileStore(fileName);
		this.getChannelList().reconfigure(this.channelStore, fCfg.columns);
		this.lastMoveIndex = 1;
		this.updateSmartMoveActionText();
	},
	
	getFileStore: function(fileName) {
		var cachedStore = this.dataCache[fileName];
		if(cachedStore) {
			return cachedStore;
		}
		
		var fCfg = this.fileConfig[fileName];
		var data = this.splitFile(this.data[fileName], fCfg.recordLength);
		var store = new Ext.data.Store({
			model: fCfg.model
		});
		store.loadData(data);
		var recIdx = 0;
		store.each(function(rec) {
			recIdx++;
			rec.setOrdinal(recIdx);
		});
		this.dataCache[fileName] = store;
		
		var emptyRecs = [];
		store.each(function(rec) {
			if(rec.isEmptyChannel()) {
				emptyRecs.push(rec);
			}
		});
		store.remove(emptyRecs);
		
		store.on('add', this.onChannelMoved, this);
		store.on('datachanged', this.onDataChanged, this);

		return store;
	},
	
	parseContent: function(content) {
		var data = {};
		for(var p in content) {
			data[p] = atob(content[p]);
		}
		return data;
	},

	splitFile: function(file, len) {
		for(var i = 0; i < len.length; i++) {
			var recLen = len[i];
			if(file.length % recLen != 0) continue;
			
			var channels = [];
			var pos = 0;
			while(pos < file.length) {
				var buffer = file.substr(pos, recLen)
				channels.push(buffer);
				pos += recLen;
			}
			return channels;
		}
		throw 'Unknown format, length is ' + file.length
	},
	
	selectTvInfo: function() {
		var store = this.getFilesStore();
		var sel = store.findExact('value', 'CloneInfo');
		if(!sel) {
			sel = store.getAt(0);
		}
		this.getFileList().getSelectionModel().select(sel);
	},
	
	onDataChanged: function() {
		this.dirty = true;
	},
	
	onChannelMoveRequest: function() {
		Ext.MessageBox.prompt("Move Channels", "Enter new channel number.", this.onChannelMoveConfirmed, this);
	},
	
	onChannelMoveConfirmed: function(btnId, msg) {
		if(btnId == 'ok') {
			var newIndex = parseInt(msg);
			if(!isNaN(newIndex)) {
				this.moveSelectedChannels(newIndex);
			}
			this.getChannelListStore();
		}
	},
	
	moveSelectedChannels: function(newIndex) {
		var cl = this.getChannelList();
		var sl = cl.getSelectionModel();
		var sel = sl.getSelection();
		var store = this.getChannelListStore();
		
		if(newIndex > 0 && newIndex <= store.getCount()) {
			newIndex--;//0 based index
			store.remove(sel);
			store.insert(newIndex, sel);
			sl.select(sel);
//			this.getChannelList().getView().refresh();
		}
	},
	
	getChannelListStore: function() {
		return this.getChannelList().getStore();
	},
	
	onChannelMoved: function(store, records, idx) {
//		for(var i = 0; i < records.length; i++) {
//			records[i].setIndex(idx+i+1);
//		}
		this.lastMoveIndex = idx+1 + records.length;
		this.updateSmartMoveActionText();

		var cl = this.getChannelList();
		setTimeout(function() {
			cl.getView().refresh();
		}, 10);
	},
	
	onSmartChannelMoveRequest: function() {
		this.moveSelectedChannels(this.lastMoveIndex);
	},
	
	updateSmartMoveActionText: function() {
		var actionSmartMove = this.getChannelList().actionSmartMove;
		actionSmartMove.setText(actionSmartMove.initialConfig.tpl.replace('{0}', this.lastMoveIndex));
	},
	
	updateData: function() {
		if(this.dirty) {
			var buff = new Array(1000);
			cIdx = 0;
			this.channelStore.each(function(rec) {
				rec.setIndex(cIdx+1);
				buff[cIdx] = rec.getData();
				cIdx++;
			});
			var recLen = buff[0].length;
			var emptyRecArr = new Array(recLen);
			var zero = String.fromCharCode(0);
			for(var i = 0; i < recLen; i++) emptyRecArr[i] = zero;
			var emptyRec = emptyRecArr.join('');
			for(var i = cIdx; i < 1000; i++) {
				buff[i] = emptyRec;
			}
			this.data[this.activeName] = buff.join('');
		}
		this.dirty = false;
	},
	
	onSave: function() {
		this.updateData();

		var f = document.createElement('form');
		f.style.position = 'absolute';
		f.style.left = -1000;
		f.style.top = -1000;
		f.method = 'POST';
		f.action = 'save.jsp';
//		f.target = '_blank';
		for(var p in this.data) {
			var t = document.createElement('textarea');
			t.name = p;
			t.value = btoa(this.data[p]);
			f.appendChild(t);
		}
		document.body.appendChild(f);
		f.submit();
	}
	
});
