let lastId = 0

export let makeId = () => {
  lastId += 1
  return lastId + ''
}
