Nvue.prototype.mount = function () {
    this.render = this.createRenderFn();
    // 生成虚拟DOM
    this.mountComponent();
}
Nvue.prototype.mountComponent = function () {
    let mount = () => { //函数调用模式
        this.update(this.render());
    }
     // 这个 Watcher 是全局的 Watcher, 目的是在任何一个位置都可以访问到
    Dep.target = new Watcher(this, mount);
}

/**
 * vue中使用的是二次提交，生成新的虚拟DOM与旧的DOM比较
 */

// 生成render函数，目的是为了缓存抽象语法树，先暂时用虚拟DOM模拟
Nvue.prototype.createRenderFn = function () {
    let ast = createVnode(this._template);
    // render函数目的是生成已经将{{}}中内容替换为data内数值的虚拟DOM
    return function () {
        let tmp = combineData(ast, this._data);
        return tmp;
    }
}
// diff 算法在这里实现，先暂时用替换HTMLDOM元素来模拟
Nvue.prototype.update = function (tmp) {
    let node = parseVnode(tmp);
    this._parentDom.replaceChild(node, document.querySelector(this._el));
}
