Array.prototype.isSorted = function () {
  return (function (direction) {
    return this.reduce(function (prev, next, i, arr) {
      if (direction === undefined)
        return (direction = prev <= next ? 1 : -1) || true;
      else
        return (direction + 1 ?
          (arr[i - 1] <= next) :
          (arr[i - 1] > next));
    }) ? Number(direction) : false;
  }).call(this);
}
