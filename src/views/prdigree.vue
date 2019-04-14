<template>
  <div class="prdigree">
    <div class="btn-wrapper">
      <!-- <div class="h5-btn" @click="handleContect">联系人</div> -->
      <!-- <div class="h5-btn" @click="handleJNTFun">纪念堂</div> -->
    </div>

    <template v-if="loading">
      <tree
        v-if="treeData"
        ref="treeComponent"
        :treeData="treeData"
        @emitHandleSheet="handleSheet"
        @emitDrapSheet="drapSheet"
        @emitDrapELESheet="drapELESheet"
      ></tree>

      <drap-node :data="drapNodeData" @emitDrap="drapEnd"></drap-node>

      <van-actionsheet
        v-if="actions"
        v-model="show"
        :actions="actions"
        @select="onSelect"
        :close-on-click-overlay="false"
        cancel-text="取消"
      ></van-actionsheet>

      <build-links ref="buildLinks" @emitBuildLink="handleBuildLink"></build-links>
    </template>
  </div>
</template>


<script>
  import Tree from "./components/tree";
  import DrapNode from "./components/drapNode";
  import BuildLinks from "./components/buildLinks";
  import { Toast } from "vant";
  import { Actionsheet } from "vant";
  import { Dialog } from "vant";
  import { calcRelation } from "./calcRelation.js";
  import {getData} from "./initData";
  import relationData from "./data.js";

  import * as home from "../api/home";
  import { setTimeout } from "timers";

  export default {
    components: {
      Tree,
      DrapNode,
      Actionsheet,
      Dialog,
      BuildLinks
    },
    data() {
      return {
        telType: new Number(),

        treeData: null,
        drapNodeData: [],

        show: false,
        actions: null,

        loading: false,
        buildLinkLoaded: true,

        result: [],

        inData: null
      };
    },
    beforeMount() {
      this.initFun()
    },

    mounted() {},

    methods: {
      // 点击的sheet弹框
      handleSheet(data) {
        console.log(`handleSheet`, data)
        if (data._IsDeath === 1) { // 1在世
          if (data._Status === 1) { // 1正常
            if (data._parentId === 0) { //是否为根节点
              this.actions = [
                {
                  name: "查看节点信息",
                  id: data._ID,
                  data: data,
                  handle: "check"
                }
              ];
            } else {
              this.actions = [
                {
                  name: "删除节点信息",
                  id: data._ID,
                  data: data,
                  handle: "del"
                },
                {
                  name: "转变为纪念堂",
                  id: data._ID,
                  data: data,
                  handle: "change"
                },
                {
                  name: "查看节点信息",
                  id: data._ID,
                  data: data,
                  handle: "check"
                }
              ];
            }
          } else if (data._Status === 2) {
            this.actions = [
              {
                name: "查看节点信息",
                id: data._ID,
                data: data,
                handle: "check"
              }
            ];
          }
        } else if (data._IsDeath === 2) { // 2纪念堂
          if (data._Status === 1) {
            this.actions = [
              {
                name: "删除节点信息",
                id: data._ID,
                data: data,
                handle: "del"
              },
              {
                name: "查看节点信息",
                id: data._ID,
                data: data,
                handle: "check"
              }
            ];
          } else if (data._Status === 2) {
            this.actions = [
              {
                name: "查看节点信息",
                id: data._ID,
                data: data,
                handle: "check"
              }
            ];
          }
        }
        // if (data) {
        //
        // }
        //  else {
        //   if (data._IsDeath === 2) {
        //     this.actions = [
        //       {
        //         name: "删除节点信息",
        //         id: data._ID,
        //         data: data,
        //         handle: "del"
        //       },
        //       {
        //         name: "查看节点信息",
        //         id: data._ID,
        //         data: data,
        //         handle: "check"
        //       }
        //     ];
        //   } else {
        //     this.actions = [
        //       {
        //         name: "删除节点信息",
        //         id: data._ID,
        //         data: data,
        //         handle: "del"
        //       },
        //       {
        //         name: "转变为纪念堂",
        //         id: data._ID,
        //         data: data,
        //         handle: "change"
        //       },
        //       {
        //         name: "查看节点信息",
        //         id: data._ID,
        //         data: data,
        //         handle: "check"
        //       }
        //     ];
        //   }
        // }

        this.show = true;
      },

      // 拖拽发生碰撞之后的sheet
      drapSheet(data) {
        console.log('data', data)
        const ids = data.drapNode._ID + "#-#" + data.testNode._ID;
        if (data.drapNode._deleteFlag === 2) {
          this.actions = [
            {
              name: "建立关系",
              data: data,
              handle: "buildLink"
            }
          ];
          this.show = true;
        } else {
          // 只有是父子节点关系才可以进行删除操作
          if (data.testNode._parentId === data.drapNode._ID || data.drapNode._parentId === data.testNode._ID) {
            this.actions = [
              {
                name: "删除关系",
                id: ids,
                data: data,
                handle: "delLink"
              }
            ];
            this.show = true;
          } else {
            // this.actions = [
            //   {
            //     name: "删除关系",
            //     id: ids,
            //     data: data,
            //     handle: "delLink"
            //   }
            // ];
          }
        }
      },

      drapELESheet(data) {
        if (+data.testNode._parentId === 0) {
          this.actions = [
            {
              name: "建立关系",
              data: data,
              handle: "buildLink"
            }
          ];
        } else {
          this.actions = [
            {
              name: "替换节点信息",
              data: data,
              handle: "combindInfro"
            },
            {
              name: "建立关系",
              data: data,
              handle: "buildLink"
            }
          ];
        }
        
        this.show = true;
      },

      onSelect(item) {
        this.show = false;
        // this.actions = null;
        this[item.handle](item);
      },

      del(item) {
        Dialog.confirm({
          title: "删除节点信息",
          closeOnClickOverlay: true,
          message: "确定要删除这个节点信息吗？"
        })
          .then(() => {
            console.log(item)
            home.delNodeInfo(item.id).then(res => {
              if (res.code === 1) {
                Toast("删除节点信息成功");
                this.emptyInit()
              }
              console.log(res)
            }).catch((error) => {
              window.location.reload()
            })
            // console.log(item)
            // on confirm
            // Toast("删除成功了");
            // window.location.reload()
          })
          .catch(() => {
            // on cancel
            Toast("操作取消了");
          });
      },

      check(item) {
        console.log(`查看节点信息`, item)
        Toast(`${item.data.appellation} ${item.data.name}`);
        window.location.href = `memorialHall://?handleName=checkNodeInfro&nodeId=${
          item.id
          }`;
      },

      change(item) {
        Dialog.confirm({
          title: "请选择联系人转化纪念堂方式",
          message:
            "方式1：逝者短信验证死亡后，手动创建纪念堂；<div></div>方式2：直接转为纪念堂，系统将为共同好友推送去世通知",
          cancelButtonText: "逝者短信验证死亡",
          confirmButtonText: "直接转为纪念堂",
          overlay: true,
          closeOnClickOverlay: true
        })
          .then(() => {
            home.setMemorialConversion({targetNodeId:item.data._ID}).then(res => {
              if (res.code === 1) {
                Toast("成功转为纪念堂");
                this.emptyInit()
              } else {
                Toast(res.msg)
              }
              console.log(res)
            }).catch((error) => {
              window.location.reload()
            })
            // Toast("方式一");
            // window.location.href = `memorialHall://?handleName=commonFriend&nodeId=${
            //   item.id
            // }`;
            // Toast("直接转为纪念堂" + JSON.stringify(item));
          })
          .catch(() => {
            // Toast("方式二");
            window.location.href = `memorialHall://?handleName=sendMessage&nodeId=${
              item.id
              }`;

          });
      },

      delLink(item) {
        console.log('item321', item)
        const paramIds = {
          sourceNodeId: item.data.drapNode._ID,
          targetNodeId: item.data.testNode._ID
        };
        const tipStr = `确定要删除和【${
          item.data.testNode.name
          }】的关系吗？`;

        Dialog.confirm({
          title: "删除节点关系",
          message: tipStr,
          closeOnClickOverlay: true
        })
          .then(() => {
            home.delNode(paramIds).then(res => {
              if (res.code === 1) {
                Toast("删除节点信息成功");
                this.emptyInit()
              }
            }).catch((error)=> {
              window.location.reload()
            })
            // on confirm
            // Toast("删除成功了" + JSON.stringify(paramIds));
            // window.location.reload()
          })
          .catch(() => {
            // on cancel
            Toast("操作取消了");
            // window.location.reload()
          });
      },

      // 合并信息
      mergeInfro(item) {
        const paramIds = {
          drapId: item.data.drapNode._ID,
          testId: item.data.testNode._ID
        };
        if (item.data.drapNode._sex !== item.data.testNode._sex) {
          let tipStr = `【${item.data.drapNode.name}】的性别和【${
            item.data.testNode.name
            }】的性别不同，不能合并!`;
          Dialog.alert({
            title: "合并节点异常",
            message: tipStr,
            closeOnClickOverlay: true
          })
            .then(() => {
              // on confirm
              // window.location.reload()
            })

        } else {
          if (!item.data.testNode.name) {
            const tipStr = `确定把【${item.data.drapNode.name}】的信息合并入【${
              item.data.testNode.name
              }】的信息中吗？`;

            Dialog.confirm({
              title: "合并节点信息",
              message: tipStr,
              closeOnClickOverlay: true
            })
              .then(() => {
                console.log(item)
                let data = {
                  sourceNodeId: item.data.drapNode._ID,
                  targetNodeId: item.data.testNode._ID
                }
                console.log()
                home.getMergeNodeInfo(data).then(res => {
                  if(res.code === 1) {
                    Toast('合并信息成功')
                    this.emptyInit()
                  } else {
                    Toast(res.msg)
                  }
                }).catch((error)=> {
                  window.location.reload()
                })
                // on confirm
                // Toast("合并成功了" + JSON.stringify(paramIds));
                // window.location.reload()
              })
              .catch(() => {
                // on cancel
                Toast("操作取消了");
                // window.location.reload()
              });
          } else {
              Toast('不能将节点合并入有信息的节点')
          }
        }

      },

      // 拖拽节点后合并---(替换信息??)
      combindInfro(item) {

        if (item.data.drapNode.name === '空节点') {
          let tipStr = '不能使用空节点替换节点'
          Dialog.alert({
            title: "合并节点异常",
            message: tipStr,
            closeOnClickOverlay: true
          })
            .then(() => {
              // on confirm
              // window.location.reload()
            })
        } else if (item.data.drapNode.sex !== item.data.testNode._sex) {
          let tipStr = '性别不同，不能替换节点信息'
          Dialog.alert({
            title: "合并节点异常",
            message: tipStr,
            closeOnClickOverlay: true
          })
            .then(() => {
              // on confirm
              // window.location.reload()
            })
        } else {
          const tipStr = `确定把【${item.data.testNode.appellation}】的信息替换为【${
            item.data.drapNode.name
            }】的信息吗？`;
          Dialog.confirm({
            title: "替换节点信息",
            closeOnClickOverlay: true,
            message: tipStr
          })
            .then(() => {
              console.log('item', item)
              const param = {
                nodeType: 1,
                source: item.data.drapNode.source,
                sourceNodeId: item.data.drapNode.id,
                targetNodeId: item.data.testNode._ID
              }
              home.replaceNodes(param).then(res => {
                if (res.code === 1) {
                  Toast("替换节点信息成功");
                  this.emptyInit()
                }
              }).catch((error)=> {
                window.location.reload()
              })
            })
            .catch(() => {
              // on cancel
              Toast("操作取消了");
            });

          // Dialog.confirm({
          //   title: "替换节点信息",
          //   message: tipStr,
          //   closeOnClickOverlay: true
          // })
          //   .then(() => {
          //     console.log(item)
          //     let data = {
          //       nodeType: 1,
          //       source: item.drapNode.source,
          //       sourceNodeId: item.drapNode.userId,
          //       targetNodeId: item.testNode._ID
          //     }
          //     console.log(data)
          //     home.replaceNode(data).then(res => {
          //       if (res.code === 1) {
          //         Toast("替换节点信息成功");
          //         this.initFun()
          //       }
          //     })
          //     // on confirm
          //     // Toast("替换成功了" + JSON.stringify(paramIds));
          //     // window.location.reload()
          //   })
          //   .catch(() => {
          //     // on cancel
          //     Toast("操作取消了");
          //     // window.location.reload()
          //   });
        }
      },

      // 拖拽节点后建立关系
      buildLink(item) {
        // Toast("建立关系"+item.data.drapNode.id);
        this.$refs.buildLinks.showModel(item);
        // console.log(item)
        // const param = {
        //   sourceNodeId: item.data.drapNode._ID,
        //   targetNodeId: item.data.testNode._ID
        // }
        //
        // home.relationship(param).then(res => {
        //
        // })
      },

      // 选择完了添加人员信息结束之后
      handleBuildLink(data) {
        console.log(`handleBuildLink`, data, new Date())
        if (!this.buildLinkLoaded) {
          return
        }
        console.log(`handleBuildLink`, !data.addNodeID && data.cNodeId, !data.sourceNodeId)
        let param = null
        if ((data.addNodeID === '' || (data.userId && data.cNodeId)) && !data.sourceNodeId) {
          param = {
            nodeType: data.userId ? 1 : 2,
            source: data.source,
            relationship:data.type,
            targetNodeId: data.cNodeId,
            sourceNodeId: data.addNodeID
          }
        } else {
          param = {
            nodeType: 1,
            relationship: data.type,
            source: data.source,
            // type: data._type,
            sourceNodeId: data.sourceNodeId,
            targetNodeId: data.cNodeId
          }
        }
        this.$refs.buildLinks.hideModel();
        console.log(`createNodes-params`, param)
        this.buildLinkLoaded == false
        if ((data.addNodeID === '' || (data.userId && data.cNodeId)) && !data.sourceNodeId) {
          home.createNodes(param).then(res=> {
            this.buildLinkLoaded == true
            if (res.code === 1) {
              Toast("节点创建成功");
              this.emptyInit()
            }
          }).catch(e=> {
            this.buildLinkLoaded == true
            window.location.reload()
          })
        } else {
          home.relationship(param).then(res=> {
            this.buildLinkLoaded == true
            if (res.code === 1) {
              Toast("节点关系建立成功");
              this.emptyInit()
            }
          }).catch(e=> {
            window.location.reload()
            this.buildLinkLoaded == true
          })
        }        
        // Toast("添加成功" + JSON.stringify(data));
      },

      // handleContect() {
      //   if (this.telType == 1) {
      //     alert("安卓：去联系人方法");
      //   } else {
      //     alert("ios：去联系人方法");
      //   }

      // },
      // handleJNTFun() {
      //   if (this.telType == 1) {
      //     alert("安卓：去纪念堂方法");
      //   } else {
      //     alert("ios：去纪念堂方法");
      //   }
      // },

      // 获取纪念堂的列表的数据
      getPrdigree() {
        this.loading = false
        return new Promise((resolve, reject) => {
          home.getPedigreeData().then(res => {
            this.loading = true
            if (res.code === 1) {
              let data = getData(res.data)
              resolve(data);
            } else {
              Toast("登录超时，请重新登录");
            }
            // 初始话数据
            console.log('data123456', res.data)
          }).catch((error) => {
            this.loading = true
            Toast("登录超时，请重新登录");
            console.log(`getPrdigree`, error)
            // window.location.reload()
          })
        })
      },

      // 获取关系节点
      getRelationshipNode() {
        return new Promise((resolve, reject) => {
          home.getRelationshipNode().then(res => {            
            if (res.code === 1) {
              // 初始话数据
              resolve(res.data);
            } else {
              Toast("登录超时，请重新登录");
            }
          }).catch((error) => {
            Toast("登录超时，请重新登录");
            // window.location.reload()
          })
        })
      },

      // 拖拽添加关系
      drapEnd(data) {
        this.$refs.treeComponent.responseDrapFun(data);
      },

      // 初始化
      initFun() {
        Toast.loading({
          forbidClick: true,
          message: "加载中...",
          loadingType: "spinner",
          duration: 0
        });

        this.getPrdigree().then(res => {
          console.log('初始化数据', res)
          const data = calcRelation(res);
          console.log('calcRelation', data)
          this.treeData = {
            zoom: data.zoom,
            nodes: data.nodes,
            links: data.links
          };
          // console.log(this.treeData)
          this.getRelationshipNode().then(request => {
            console.log('request', request)
            this.drapNodeData = request || [];
            this.loading = true;
          })
        })
      },

      // 置空数据
      empty() {
        this.treeData = null
        this.drapNodeData = []
      },

      // 置空Fun
      emptyInit() {
        this.empty();
        this.$refs.treeComponent.clear();
        this.loading = false;
        this.treeData = null;
        this.initFun();
      },

      // 整合数据
      // processData(data) {
      //
      //   data.parentId = 0
      //   let nodes = data.linkNodes
      //   let arr = []
      //   for(let i = 0; i < nodes.length; i++) {
      //     let element = nodes[i]
      //     let linkNodes = element.linkNodes
      //
      //     if(linkNodes) {
      //       this.processData(element)
      //     }
      //     element.linkNodes = null
      //     arr.push(element)
      //   }
      //
      //   data.linkNodes = arr
      //   this.result.push(data)
      //
      // }
    }
  };
</script>

<style lang="less" scoped>
  .prdigree {
    position: relative;
    width: 100%;
    height: 100%;
    .btn-wrapper {
      position: absolute;
      top: 10px;
      left: 16px;
      z-index: 10000;
      .h5-btn {
        background: rgb(23, 151, 243);
        color: #fff;
        font-size: 12px;
        margin-top: 10px;
        padding: 6px 10px;
        border-radius: 6px;
      }
    }
  }
</style>
