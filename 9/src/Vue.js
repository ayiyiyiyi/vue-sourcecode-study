function Nvue(options) {
    this._data = options.data;
    this._el = options.el;
    this._template = document.querySelector(this._el);
    this._parentDom = document.querySelector(this._el).parentNode; 
    this.initData();
    this.mount();
}