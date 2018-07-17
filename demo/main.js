'use strict';

const {app, BrowserWindow} = require('electron');

app.on('ready', () => {

  let win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    width: 800,
    height: 600
  });

  win.on('closed', () => { win = null; });
  win.on('ready-to-show', () => {
    win.focus();
    win.show();
  });

  win.loadFile(__dirname + '/main.html');
});
