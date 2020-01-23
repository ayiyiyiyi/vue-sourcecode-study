// html Dom => vNode
function createVnode(node) {
    let vNode = null;
    let nodeType = node.nodeType;

    if (nodeType === 1) {
        let tag = node.nodeName;
        let value = undefined;
        let data = {};
        let attrs = node.attributes;
        for (let i = 0; i < attrs.length; i++) {
            // attrs[i]属性节点，type为2
            data[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        vNode = new Vnode(tag, value, data, nodeType);
        if (node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                let childVnode = createVnode(child);
                vNode.appendChild(childVnode);
            }
        }
    } else if (nodeType === 3) {
        vNode = new Vnode(undefined, node.nodeValue, undefined, nodeType);
    }
    return vNode
}

// Vnode => Vnode + data

let r = /\{\{(.+?)\}\}/g;

function createGetValueByPath(path) {
    let hasBracket = false;
    path = path.replace(r, function (_, g) {
        hasBracket = true;
        return g.trim();
    });
    let paths = path.split('.');
    return function (obj) {
        let result = obj;
        if(hasBracket) {
            let prop;
            while (prop = paths.shift()) {
                result = result[prop];
            }
        } else {
            result = path;
        }

        return result;
    }
}

function combineData(vnode, data) {
    let _type = vnode.type;

    let _attrData = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag;
    let _newVnode;
    if (_type === 3) {
        let _newVal = _value;
        if (_value.trim()) {
            let getvalueFn = createGetValueByPath(_value);
            _newVal = getvalueFn(data);
        }

        _newVnode = new Vnode(_tag, _newVal, _attrData, _type);
    } else if (_type === 1) {
        _newVnode = new Vnode(_tag, _value, _attrData, _type);
        if (vnode.children.length > 0) {
            vnode.children.forEach(child => {
                let childNode = combineData(child, data);
                _newVnode.appendChild(childNode);
            });
        }
    }
    return _newVnode;
}
// Vnode => Html Dom
function parseVnode(vnode) {
    let type = vnode.type;
    let _node = null;
    if (type === 1) {
        _node = document.createElement(vnode.tag);
        Object.keys(vnode.data).forEach((key) => {
            _node.setAttribute(key, vnode.data[key]);
        });
        if (vnode.children.length > 0) {
            vnode.children.forEach(child => {
                _node.appendChild(parseVnode(child));
            });
        }
    } else if (type === 3) {
        _node = document.createTextNode(vnode.value);
    }
    return _node;
}