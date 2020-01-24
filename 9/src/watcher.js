class Watcher {
    /**
     * 
     * @param {*} vm  vue实例
     * @param {*} exOrFn  渲染 watcher, 传入的就是渲染函数, 如果是 计算 watcher 传入的就是路径表达式, 暂仅考虑是渲染watcher
     */
    constructor(vm, exOrFn) {
        this.vm = vm;
        this.getter = exOrFn;
        this.deps = [];
        this.get();
    }
    /** 计算, 触发 getter */
    get() {
        this.getter.call(this.vm, this.vm);
    }
    /**
     * 执行, 并判断是懒加载, 还是同步执行, 还是异步执行: 
     * 我们现在只考虑 异步执行 ( 简化的是 同步执行 )
     */
    run() {
        this.get();
    }

    /** 对外公开的函数, 用于在 属性发生变化时触发的接口 */
    update() {
        this.run();
    }

    /** 清空依赖队列 */
    cleanupDep() {

    }
}