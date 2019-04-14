import request from './request'
import qs from 'qs'

// export function getAdverts(data) {
//   return request({
//     url: '/web/index/getAdverts',
//     method: 'post',
//     data:qs.stringify(data)
//   })
// }

export function getAdverts() {
  return request({
    url: '/web/index/getAdverts',
    method: 'post',
    // data: qs.stringify(data)
  })
}

// 获取我的族谱信息
export function getPedigreeData () {
  return request({
    url: 'genealogyDetail/getMyGenealogy',
    // url: '/static/data/test.1.json',
    method: 'get'
    // data: qs.stringify(data)
  })
}

// 获取我的族谱信息
export function getPedigreeDataPreview(_id) {
  return request({
    admin: true,
    url: 'genealogyDetail/getGenealogyById/' + _id,
    method: 'get'
  })
}

// 获取我的节点信息
export function getRelationshipNode() {
  return request({
    url: 'genealogyDetail/getRelationshipNode',
    method: 'get',
    // data: qs.stringify(data)
  })
}

// 创建节点
export function createNodes(data) {
  return request({
    url: 'genealogyDetail/addRelationship',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}

// 删除节点信息
export function delNodeInfo(data) {
  return request({
    url: 'genealogyDetail/deleteNodeInfo/' + data,
    method: 'post'
    // data: qs.stringify(data)
  })
}

// 删除节点
export function delNode(data) {
  return request({
    url: 'genealogyDetail/deleteRelationship',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}

// 替换节点
export function replaceNodes(data) {
  return request({
    url: 'genealogyDetail/changeNodeInfo',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}

// 转为纪念堂
export function setMemorialConversion(data) {
  return request({
    url: 'genealogyDetail/memorialConversion',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}

// 重新建立
export function relationship(data) {
  return request({
    url: 'genealogyDetail/reconstructionRelationship',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}


// 合并关系
export function getMergeNodeInfo(data) {
  return request({
    url: 'genealogyDetail/mergeNodeInfo',
    method: 'post',
    data: data
    // data: qs.stringify(data)
  })
}
