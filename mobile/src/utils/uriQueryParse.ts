export default (query: string) => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g
  const params: {[key: string]: string} = {}
  let match

  while ((match = regex.exec(query))) {
    params[match[1]] = match[2]
  }

  return params
}
