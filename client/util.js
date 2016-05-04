let _nextId = -1

export const nextId = () => {
  return _nextId--
}

export const findById = (id , haystack) => {
  for (let row of haystack) {
    if(row.id == id) {
      return row
    }
  }
  return undefined
}

