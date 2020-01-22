let method = ['push', 'pop', 'shift'];
let newPrototype = Object.create(Array.prototype);
method.forEach(item => {
    newPrototype[item] = function () {
        console.log(`intercept ${item} methods`);
        let res = Array.prototype[item].apply(this, arguments);
        return res;
    }
});
let arr = [];
arr.__proto__ = newPrototype;
arr.push(1);