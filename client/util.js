let _nextId = -1

export const nextId = () => {
  return _nextId--
}

