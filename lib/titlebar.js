'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class TitleBar extends EventEmitter {

  constructor(options = {}) {
    super();

    const titlebarFile = fs.readFileSync(path.join(__dirname, '..', 'html', `titlebar-${this.getPlatform()}.html`), 'utf-8');

    this.options = {};
    this.options.color = options.color || '';
    this.options.backgroundColor = options.backgroundColor || '';
    this.options.title = options.title || '';
    this.options.draggable = options.draggable || true;
    this.options.fullscreen = options.fullscreen || false;
    this.options.context = options.context || document.body;

    this.titlebarElement = this.createNodes(titlebarFile);

    this.minimizeButton = this.titlebarElement.querySelector('.titlebar-minimize');
    this.resizeButton = this.titlebarElement.querySelector('.titlebar-resize');
    this.closeButton = this.titlebarElement.querySelector('.titlebar-close');
    this.titleText = this.titlebarElement.querySelector('.titlebar-title');

    this.init();
  }

  init() {
    const stylesheet = document.createElement('link');

    if(this.options.draggable) this.titlebarElement.classList.add('draggable');
    if(this.options.title) this.titleText.innerHTML = this.options.title;

    this.titlebarElement.addEventListener('dblclick', event => this.onDoubleclick(event));
    this.minimizeButton.addEventListener('click', event => this.onClickMinimize(event));
    this.resizeButton.addEventListener('click', event => this.onClickResize(event));
    this.closeButton.addEventListener('click', event => this.onClickClose(event));

    stylesheet.rel = 'stylesheet';
    stylesheet.href = path.join(__dirname, '..', 'css', 'titlebar.css');

    document.head.appendChild(stylesheet);
    this.options.context.insertBefore(this.titlebarElement, this.options.context.firstChild);
  }

  createNodes(str) {
    let el = document.createElement('div');
    el.innerHTML = str;

    return el.firstChild;
  }

  getPlatform() {
    const platform = os.platform();
    
    if(platform === 'win32') return 'windows';
    else if(platform === 'darwin') return 'windows';
    else return 'linux';
  }

  onClickClose() { this.emit('close'); }

  onClickMinimize() { this.emit('minimize'); }

  onClickResize() {
    this.titlebarElement.classList.toggle('fullscreen');
    console.log(this.options.fullscreen);
    (this.options.fullscreen) ? this.emit('unmaximize') : this.emit('maximize');

    this.options.fullscreen = !this.options.fullscreen;
  }

  onDoubleclick(event) {
    if (!(this.minimizeButton.contains(event.target) || this.resizeButton.contains(event.target) || this.closeButton.contains(event.target))) {
        this.onClickResize(event);
    }
  }

}

module.exports = TitleBar;