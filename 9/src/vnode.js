class Vnode {
    constructor(tag, value, data, type) {
        this.tag = tag && tag.toLowerCase();
        this.value = value;
        this.data = data;
        this.type = type;
        this.children = [];
    }
    appendChild(vnode) {
        this.children.push(vnode);
    }
}