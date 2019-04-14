<template>
  <div class="tree-wrapper" id="treeWrapper">
    <div id="echarts"></div>
  </div>
</template>

<script>
import * as Util from "../../utils";
import { debug } from "util";
import { Toast } from "vant";

import * as config from "../config.js";

export default {
  props: ["treeData"],
  components: {},
  data() {
    return {
      chartsObj: null,
      nodeSize: 66,
      buildLoaded: true,
      drapNodeData: null
    };
  },
  watch: {
    treeData: {
      handler(val, oldVal) {
        // this.draw(val, () => {
        //   Toast.clear();
        // });
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true
    }
  },
  mounted() {
    this.draw(this.treeData, () => {
      Toast.clear();
    });
  },

  methods: {
    draw(data, cb) {
      let _echartZoom = data.zoom
      // 根据接口数据组装 echarts的数据
      const resizeParam = d => {
        let data = d.nodes;
        let arr = [];
        let i = 0;
        const loopData = i => {
          if (i < data.length) {
            // console.log(`i <= data.length`, `我运行了多次`, i)
            const itemData = data[i];
            // 画布渲染远程图片出现问题
            itemData.headerUrl = Util.resolveFilePath(itemData.headerUrl)
            // itemData.headerUrl = '/static/images/node_s.png'
            this.canvasDrawIcon(itemData, (url, dataUrl) => {
              let item = {
                appellation: itemData.appellation,
                _ID: itemData.id,
                _IsDeath: itemData.isDeath,
                _Image: dataUrl,
                // _Image: itemData.headerUrl,
                _Status:itemData.status,
                _type:itemData.type,
                _sex: itemData.sex,
                _parentId: itemData.parentId,
                _deleteFlag: itemData.deleteFlag,
                headerUrl: url,
                x: itemData.x,
                y: itemData.y,
                name: itemData.id,
                nickName: itemData.name,
                symbol: "circle",
                // symbol: "image://" + dataUrl,
                fixed: true,
                label: {
                  show: true,
                  position: "bottom",
                  distance: 5,
                  fontSize: 14,
                  fontWeight: "normal",
                  color: "#333",
                  align: "center",
                  formatter: () => {
                    if (itemData.status == 1) {
                      // 隐藏称呼
                      if (itemData.hideNickName) {
                        return `{a|${itemData.name}}`
                      } else {
                        return [
                          `{a|${itemData.appellation == undefined ? '未知' : itemData.appellation}}`,
                          `{b|${itemData.name}}`
                        ].join("\n");
                      }                      
                    }else if(itemData.status==2){
                      // 隐藏昵称
                      if (itemData.hideNickName) {
                        return `{a| }`
                      } else {
                        // 正常节点
                        return `{a|${itemData.appellation == undefined ? '未知' : itemData.appellation}}`
                      } 
                    }
                  },
                  rich: {
                    a: {
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: 14
                    },
                    b: {
                      color: "#666",
                      fontSize: 12,
                      padding: [0, 0, 0, 0]
                    }
                  }
                }
              };
              arr.push(item);
              i++;
              loopData(i);
            });
          } else {
            // console.log(`你麻痹`, `我运行了多次`, i)
            const nodeData = arr.map((item, idx) => {
              item.x = item.x || Math.random() * 500;
              item.y = item.y || Math.random() * 500;
              return item;
            });
            const linkData = d.links;
            this.initEcharts(_echartZoom, () => {
              this.renderEcharts({
                lineStyle: {
                  type: "dashed",
                  color: "#bbb"
                },
                itemStyle: {
                  color: "#fff"
                },
                series: [
                  {
                    type: "graph",
                    layout: "none",
                    force: {
                      initLayout: 'circular',
                      repulsion: 80,
                      edgeLength: [80, 400]
                    },
                    symbolSize: 66,
                    draggable: false,
                    roam: true,
                    nodeScaleRatio: config.scaleNum,
                    data: nodeData,
                    links: linkData,
                    lineStyle: {
                      normal: {
                        opacity: 0.9,
                        width: 1,
                        curveness: 0
                      }
                    }
                  }
                ]
              });
            });

            cb ? cb() : "";
            return;
          }
        };
        loopData(i);
      };

      resizeParam(data);
    },

    initEcharts(_zoom, cb) {
      console.log(`initEcharts`, _zoom)
      const wrapper = document.getElementById("treeWrapper");
      const infro = wrapper.getBoundingClientRect();
      const dom = document.getElementById("echarts");
      const _width = infro.width * (_zoom[0] >= 1 ? _zoom[0] : 1)
      const _height = infro.height * (_zoom[1] >= 1 ? _zoom[1] : 1)
      dom.style.width = _width + "px";
      dom.style.height = _height + "px";
      // dom.style.left = '50%'
      // dom.style.right = '50%'
      // dom.style.marginLeft = '-' + _width/2 + 'PX';
      // dom.style.marginLeft = '-' + _height/2 + 'PX';
      // 画布位置大小预设定
      // dom.style.width = infro.width*2 + "px";
      // dom.style.height = infro.height*2 + "px";
      // dom.style.marginTop= 0-infro.height/2+"px";
      // dom.style.marginLeft = 0-infro.width/2+"px"
      this.chartsObj = this.$echarts.init(dom);
      cb ? cb() : "";
    },

    renderEcharts(data) {
      const that = this;
      that.chartsObj.setOption(data);


      that.drapNodeData = data.series[0].data;
      console.log('that', that.drapNodeData)
      that.chartsObj.off("click");



      that.chartsObj.setOption({
        graphic: that.$echarts.util.map(
          that.drapNodeData,
          (dataItem, dataIndex) => {
            return {
              // 图形引入
              // type: "circle",
              // shape: {
              //   r: 33
              // },
              // style: {
              //   fill: "rgba(255,255,255,.5)",
              //   stroke: "#dedede"
              // },

              // 图片的引入
              type: "image",
              style: {
                image: dataItem._Image,
                width: that.nodeSize,
                height: that.nodeSize,
                x: -that.nodeSize / 2,
                y: -that.nodeSize / 2
                // x: -33,
                // y: -33
              },

              position: that.chartsObj.convertToPixel({ seriesIndex: 0 }, [
                dataItem.x,
                dataItem.y
              ]),

              // invisible: true,
              draggable: true,
              z: 100,

              // 点击节点
              onclick: that.$echarts.util.curry(function(idx) {
                const emitParam = data.series[0].data[idx];
                that.$emit("emitHandleSheet", emitParam);
              }, dataIndex),

              // 拖拽节点
              ondrag: that.$echarts.util.curry(onPointDragging, dataIndex),

              // 拖拽结束
              ondragend: that.$echarts.util.curry(onDrapEnd, dataIndex)
            };
          }
        )
      });

      // 画布移动或者方法

      that.chartsObj.on("graphRoam", function(data) {
        updatePosition({ zoom: data.zoom });
      });
      
      // this.chartsObj.hideLoading();

      function onPointDragging(dataIndex) {
        // const _XYPOINT = [nodes[dataIndex].x,nodes[dataIndex].y]
        // let tmpPos = _XYPOINT
        let tmpPos = that.chartsObj.convertFromPixel(
          { seriesIndex: 0 },
          this.position
        );
        that.drapNodeData[dataIndex].x = tmpPos[0];
        that.drapNodeData[dataIndex].y = tmpPos[1];
        that.drapNodeData[dataIndex].z = 1001;
        that.chartsObj.setOption({
          series: [
            {
              data: that.drapNodeData
            }
          ]
        });
        // 当节点位置改变时，就要更新拖拽节点的位置
        updatePosition({ drapIdx: dataIndex, drapPoint: tmpPos });
      }

      function updatePosition(option) {
        let _zoom = option.zoom || 1;

        // 根据echarts设置的缩放比例计算缩放后的节点大小
        let Dscal = _zoom - 1;
        let Ds = 1 + Dscal * config.scaleNum;
        that.nodeSize *= Ds;

        // 根据位置比例计算每个节点的位置（echarts位置关系）
        that.chartsObj.setOption({
          graphic: that.$echarts.util.map(that.drapNodeData, function(
            item,
            dataIndex
          ) {
            let tmpPos = that.chartsObj.convertToPixel({ seriesIndex: 0 }, [
              item.x,
              item.y
            ]);
            return {
              position: tmpPos,

              style: {
                width: that.nodeSize,
                height: that.nodeSize,
                x: -that.nodeSize / 2,
                y: -that.nodeSize / 2
                // x: -33,
                // y: -33
              }
            };
          })
        });
      }

      function onDrapEnd(idx) {
        let position = this.position;
        let param = {
          idx: idx,
          position: position,
          drapType: 1
        };
        that.handleEndDrap(param);
      }
    },

    handleEndDrap(opt) {
      let drapPoint = this.chartsObj.convertFromPixel(
        { seriesIndex: 0 },
        opt.position
      );
      this.$echarts.util.map(this.drapNodeData, (item, dataIndex) => {
        // 像素坐标
        let testPoint = this.chartsObj.convertToPixel({ seriesIndex: 0 }, [
          item.x,
          item.y
        ]);

        // 文档坐标
        let _testPoint = this.chartsObj.convertFromPixel(
          { seriesIndex: 0 },
          testPoint
        );
        if (opt.drapType === 1) {
          if (dataIndex !== opt.idx) {
            this.handleImpact({
              drapPoint: drapPoint,
              testPoint: _testPoint,
              drapType: opt.drapType,
              drapIdx: opt.idx,
              testIdx: dataIndex,
              success: () => {
                const param = {
                  drapNode: this.drapNodeData[opt.idx],
                  testNode: this.drapNodeData[dataIndex]
                };
                this.$emit("emitDrapSheet", param);
              }
            });
          }
        } else {
          this.handleImpact({
            drapPoint: drapPoint,
            testPoint: _testPoint,
            drapType: opt.drapType,
            success: () => {
              const param = {
                drapNode: opt.data,
                testNode: item
              };

              this.$emit("emitDrapELESheet", param);
            }
          });
        }
      });
    },

    // 检测碰撞
    handleImpact(opt) {
      const _MPoint = opt.drapPoint;
      const _TPoint = opt.testPoint;

      // 此处
      const _x = Math.abs(_MPoint[0] - _TPoint[0]);
      const _y = Math.abs(_MPoint[1] - _TPoint[1]);
      const dis = Math.sqrt(_x * _x + _y * _y);

      const isEvelDis =
        opt.drapType == 1 ? this.nodeSize : this.nodeSize / 2 + 66 / 2;
      console.log("检测碰撞的球之间的距离", opt.drapType, dis, isEvelDis);
      if (dis <= 50) {
        opt.success();
      }
    },

    // 用canvas生成图片（边框：同辈同色，是否有纪念堂图标）

    canvasDrawIcon(data, cb) {
      let vm = this
      let imgCanvas = document.createElement("canvas");
      imgCanvas.width = 700;
      imgCanvas.height = 700;
      let ctx = imgCanvas.getContext("2d");

      // 头像
      let imgEle = new Image();
      imgEle.setAttribute("crossOrigin",'Anonymous')
      imgEle.src =
        data.status === 1 && data.headerUrl
          ? data.headerUrl
          : require("../../../static/images/node_null.png");

      // 纪念堂图标
      let jntIcon = document.createElement("img");
      jntIcon.width = 100;
      jntIcon.height = 100;

      let iconSrc = require("../../../static/images/jnt_icon.png");
      jntIcon.setAttribute("crossOrigin", "Anonymous");
      jntIcon.src = iconSrc;

      imgEle.onload = () => {
        ctx.arc(350, 350, 330, 0, 2 * Math.PI);
        ctx.clip()
        if (data.isDeath === 2) {
          ctx.drawImage(imgEle, 20, 20, 660, 660);
          let myImageData = ctx.getImageData(20, 20, 660, 660);
          this.colorToGray(myImageData, grayImgData => {
            ctx.putImageData(grayImgData, 20, 20);
          });
        } else {
          ctx.drawImage(imgEle, 20, 20, 660, 660);
        }
        ctx.lineWidth = 30;
        ctx.strokeStyle = data.seniorityColor;  //描边颜色
        ctx.stroke();  //描边
        
        if (data.isDeath === 2) {
          ctx.beginPath();
          ctx.arc(480, 480, 100, 0, 2 * Math.PI);
          ctx.fillStyle = data.seniorityColor;
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
          ctx.drawImage(jntIcon, 390, 390, 180, 180);          
          const dataUrl = imgCanvas.toDataURL();
          ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
          // console.log(dataUrl)
          cb(data.headerUrl, dataUrl);
        } else {
          const dataUrl = imgCanvas.toDataURL();
          ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
          cb(data.headerUrl, dataUrl);
        }
      };
      imgEle.onerror = () => {
        data.headerUrl = require("../../../static/images/node_null.png");
        vm.canvasDrawIcon(data, cb);
      }
    },

    //  把彩色图片转化成黑白图片
    colorToGray(imgData, cb) {
      let _data = imgData;
      for (let i = 0; i < 660 * 660 * 4; i += 4) {
        let myRed = _data.data[i];
        let myGreen = _data.data[i + 1];
        let myBlue = _data.data[i + 2];
        let myGray = parseInt((myRed + myGreen + myBlue) / 3);

        _data.data[i] = myGray;
        _data.data[i + 1] = myGray;
        _data.data[i + 2] = myGray;
      }
      cb(_data);
    },
    // 响应拖拽事件，charts样式修改
    responseDrapFun(data) {
      let param = {
        data: data.data,
        position: [data.point.x, data.point.y],
        drapType: 2
      };
      this.handleEndDrap(param);
    },

    clear() {
      this.chartsObj.clear()
    },
    // 重新渲染
    reDraw() {}
  }
};
</script>


<style lang="less" scoped>
.tree-wrapper {
  width: 100%;
  height: 100%;
  //   background: #dedede;
  overflow: hidden;
}
</style>


