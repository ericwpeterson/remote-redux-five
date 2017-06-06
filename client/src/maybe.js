var Maybe = function(val) {
    this.__value = val;
};

Maybe.of = function(val) {
    return new Maybe(val);
};

Maybe.prototype.isNothing = function() {
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.value = function() {
    return this.__value;
};

Maybe.prototype.notValue = function() {
    return !this.__value;
};

Maybe.prototype.map = function(f) {
    if (this.isNothing()) {
        return Maybe.of(null);
    }
    return Maybe.of(f(this.__value));
};

Maybe.prototype.orElse = function(val) {
    if (this.isNothing()) {
        return Maybe.of(val);
    }
    return this;
};

export default Maybe;
