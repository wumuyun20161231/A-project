import * as config from './config.js'
import { getCallNameByCustomKeyForMe as relationship } from '../utils/relationship.js'

export function calcRelation (data) {
  // 已经渲染的节点并且记录节点位置
  let recordPosition = {}

  // 画布比例
  let _zoom = [1, 1]
  let _hierarchy = []

  // 组装节点信息
  let _saveNodes_ = []

  // 组装关系信息
  let _saveLinks_ = []

  let _centerNode = {}

  // 判断该节点是不是中心节点
  const isCenterNode = (data, id) => {
    for (let idx in data) {
      if (data[idx].id == id) {
        return 1
      }
    }
    return 0
  }
  // 转换数据
  for (let idx in data) {
    let itemData = data[idx]
    if (itemData.parentId === 0) {
      const w =
        document.documentElement.clientWidth || document.body.clientWidth
      const h =
        document.documentElement.clientHeight || document.body.clientHeight
      _centerNode = {
        sex: itemData.sex
      }
      let centerItem = {
        id: itemData.id,
        name: itemData.name,
        appellation: relationship(itemData.customKey, itemData, data, _centerNode),
        headerUrl: itemData.headerUrl,
        seniorityColor: getColor(itemData.hierarchy),
        hierarchy: itemData.hierarchy,
        isDeath: itemData.type,
        hideNickName: itemData.hideNickName,
        status: itemData.status,
        parentId: itemData.parentId,
        sex: itemData.sex,
        deleteFlag: itemData.deleteFlag,
        type: itemData.type,
        x: w / 2,
        y: h / 2
      }

      recordPosition[centerItem.id] = { x: centerItem.x, y: centerItem.y }

      let itemLinkData = itemData.linkNodes || []
      let _itemLinkData = itemLinkData.map(item => {
        let itemPotion = _offset_(
          {
            centerPoint: { x: centerItem.x, y: centerItem.y },
            dis: isCenterNode(data, item.id) ? 220 : 100, // 如果是中心节点（有子节点间距大点，保证节点位置计算完成之后节点不重复）
            type: item.relationship
          },
          item,
          recordPosition
        )

        // 存储下 位置信息
        recordPosition[item.id] = {
          customKey: item.customKey,
          x: itemPotion.x,
          y: itemPotion.y
        }

        let _linkItem = {
          id: item.id,
          name: item.name,
          appellation: relationship(item.customKey, item, data, _centerNode),
          headerUrl: item.headerUrl,
          seniorityColor: getColor(item.hierarchy),
          hierarchy: item.hierarchy,
          isDeath: item.type,
          status: item.status,
          hideNickName: item.hideNickName,
          sex: item.sex,
          parentId: item.parentId,
          deleteFlag: item.deleteFlag,
          type: item.type,
          x: itemPotion.x,
          y: itemPotion.y
        }
        return _linkItem
      })

      _itemLinkData.unshift(centerItem)
      _saveNodes_ = _saveNodes_.concat(_itemLinkData)
    } else {
      // 根据节点id去 该组中心节点的位置
      let nodeId = itemData.id
      let itemLinkData = itemData.linkNodes || []
      let _itemLinkData = itemLinkData.map(item => {
        console.log(`recordPosition`, recordPosition.hasOwnProperty(item.id))
        if (!recordPosition.hasOwnProperty(item.id) && recordPosition.hasOwnProperty(nodeId)) {
          // console.log(`nodeId计算`, nodeId)
          let itemPotion = _offset_(
            {
              centerPoint: {
                x: recordPosition[nodeId].x,
                y: recordPosition[nodeId].y
              },
              dis: isCenterNode(data, item.id) ? 220 : 100,
              type: item.relationship
            },
            item,
            recordPosition
          )
          // 存储下 位置信息
          recordPosition[item.id] = {
            customKey: item.customKey,
            x: itemPotion.x,
            y: itemPotion.y
          }

          let _linkItem = {
            id: item.id,
            name: item.name,
            appellation: relationship(item.customKey, item, data, _centerNode),
            headerUrl: item.headerUrl,
            seniorityColor: getColor(item.hierarchy),
            hierarchy: item.hierarchy,
            isDeath: item.type,
            hideNickName: item.hideNickName,
            status: item.status,
            parentId: item.parentId,
            deleteFlag: item.deleteFlag,
            type: item.type,
            sex: item.sex,
            x: itemPotion.x,
            y: itemPotion.y
          }
          return _linkItem
        } else {
          return null
        }
      })
      console.log(`nodeId计算`, nodeId, recordPosition, _itemLinkData)
      let arr = []
      for (let idx in _itemLinkData) {
        if (_itemLinkData[idx]) {
          arr.push(_itemLinkData[idx])
        }
      }
      _saveNodes_ = _saveNodes_.concat(arr)
    }
  }

  // 转换比例
  _saveNodes_.forEach((item, index) => {
    _hierarchy.push(item.hierarchy)
  })
  _hierarchy = Array.from(new Set(_hierarchy))
  console.log(`zoom`, _hierarchy)
  if (_saveNodes_.length > 10) {
    _zoom[0] = (_hierarchy.length / 4 - 1) * 10 * 0.1 + 1
  }
  if (_hierarchy.length > 5) {
    _zoom[1] = _hierarchy.length * 0.1 + 1
  }
  // 关系
  _saveNodes_.forEach((item, index) => {
    let _target = _saveNodes_.findIndex(sitem => sitem.id === item.parentId)
    _saveLinks_.push({
      target: _target > -1 && +item.deleteFlag === 1 ? _target : '',
      source: index
    })
  })

  return {
    zoom: _zoom,
    nodes: _saveNodes_,
    links: _saveLinks_.length
      ? _saveLinks_
      : [
        {
          source: 0,
          target: 1
        },
        {
          source: 0,
          target: 2
        },
        {
          source: 0,
          target: 3
        },
        {
          source: 0,
          target: 4
        },
        {
          source: 0,
          target: 5
        }
      ]
  }
}

function getColor (key) {
  // 显式转换
  return config.color[String(key)]
}

// 计算太阳图了连接节点的偏移量
function _offset_ (option, data, recordPosition) {
  /**
   * option = {
   *      centerPoint:{x:1,y:1}, 中心点
   *      dis:10,                距离中心点的距离
   *      **type:'f'             当前连接点的类型
   * }
   * */
  let piex = 0
  let cX = 0
  let cY = 0
  const w = document.documentElement.clientWidth || document.body.clientWidth
  const h = document.documentElement.clientHeight || document.body.clientHeight
  let x = option.hasOwnProperty('centerPoint') ? option.centerPoint.x : w / 2
  let y = option.hasOwnProperty('centerPoint') ? option.centerPoint.y : h / 2
  let dis = option.dis || 100
  let calRule = config.calRule
  let rotate = getRandomRotate(calRule[option.type].rotate)
  // 判断是否有重复关系的节点
  for (let key in recordPosition) {
    if (data.customKey === recordPosition[key].customKey) {
      console.log(`有重复的`, data.customKey, recordPosition)
      piex += 1
    } else {

    }
  }
  cX = (x + dis * Math.cos(((2 * Math.PI) / 360) * rotate))
  cY = (y + dis * Math.sin(((2 * Math.PI) / 360) * rotate))
  // console.log(`_offset_未换算`, rotate)
  if (option.type === 's') {
    cX -= piex * 120
  } else if (option.type === 'd') {
    cX += piex * 120
  }
  // console.log(`_offset_已换算`, rotate)
  return {
    x: cX,
    y: cY
  }
}

// 获取随机角度

function getRandomRotate (data) {
  const m = data[0]
  const n = data[1]
  const random = Math.random() * (m - n + 1) + n
  return random
}

// 从数组中获取某一项的索引
function getIndex (arr, id) {
  for (let i in arr) {
    if (arr[i].id == id) {
      return i
    }
  }
}
