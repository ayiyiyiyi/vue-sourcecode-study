Nvue.prototype.initData = function () {
    observer(this._data, this);
    let keys = Object.keys(this._data);
    keys.forEach(key => {
        proxy(this, '_data', key);
    });
}
// 响应式
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice',
];
let array_methods = Object.create(Array.prototype);
ARRAY_METHOD.forEach(method => {
    array_methods[method] = function () {
        // 调用原来的方法
        console.log('调用的是拦截的 ' + method + ' 方法');

        // 将数据进行响应式化
        for (let i = 0; i < arguments.length; i++) {
            observer(arguments[i]);
        }

        let res = Array.prototype[method].apply(this, arguments);
        return res;
    }
});

function observer(obj, vm) {
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            observer(item, vm);
        });
    } else {
        let keys = Object.keys(obj); //只有对象keys才不为空数组，所以判断了obj是对象时才进行之后操作
        keys.forEach(key => {
            let value = obj[key];
            if (Array.isArray(value)) {
                value.forEach(item => {
                    value.__proto__ = array_methods; // 数组原型指向array_methods
                    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                        observer(item, vm);
                    }
                });
            } else {
                defineReactive.call(vm, obj, key, value, true);
            }
        });
    }

}

function defineReactive(target, key, val, enumberable) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        observer(val);
    }
    let dep = new Dep();
    Object.defineProperty(target, key, {
        configurable: true,
        enumberable: !!enumberable,
        set(newVal) {
            console.log(`设置 ${key} 属性`);
            if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
                observer(newVal);
            }
            val = newVal;
            
            // 派发更新
            dep.notify();
        },
        get() {
            console.log(`读取 ${key} 属性`);
            // 依赖收集（因只有一个主watcher，暂时省略
            return val;
        }
    })
}

function proxy(target, prop, key) {
    Object.defineProperty(target, key, {
        get() {
            return target[prop][key];
        },
        set(val) {
            target[prop][key] = val;
        }
    })
}
