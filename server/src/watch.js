
function getValue( state, path ) {
    let parray = path.split(".")
    return state.getIn(parray);
}

function defaultCompare (a, b) {
    return a === b
}

export function watch (getState, objectPath) {
  var currentValue = getValue(getState().monobjects, objectPath)
  return function w (fn) {
    return function () {
      var newValue = getValue(getState().monobjects, objectPath)
      if (!defaultCompare(currentValue, newValue)) {
          var oldValue = currentValue
          currentValue = newValue
          fn(newValue, oldValue, objectPath)
      }
    }
  }
}
