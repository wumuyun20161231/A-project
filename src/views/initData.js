export function getData (data) {
  let result = data.filter(item => (item.linkNodes && item.linkNodes.length > 0) || +item.parentId === 0)
  console.log(`initData`, result)
  return result
}
