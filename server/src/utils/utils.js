const precision = (value, precision = 2) => {
  switch (typeof value) {
    case 'string': {
      return parseFloat(parseFloat(value).toFixed(precision))
    }
    case 'number': {
      return parseFloat(value.toFixed(precision))
    }
  }
}

export {
  precision
}