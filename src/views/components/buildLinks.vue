<template>
  <div class="sheet-wrapper" :class="{'active':show}">
    <div class="bg" @click="hideModel"></div>

    <div class="node center-node">
      <img :src="centerNodes._Image" alt>
      <div class="infro">{{centerNodes.nickName}}</div>
    </div>

    <div class="node f-node" @click="handleBuildLink('f', 1)">
      <img :src="require('../../../static/images/node_f.png')" alt>
      <div class="infro">父亲</div>
    </div>

    <div class="node m-node" @click="handleBuildLink('m', 2)">
      <img :src="require('../../../static/images/node_m.png')" alt>
      <div class="infro">母亲</div>
    </div>


    <div class="node po-node" @click="handleBuildLink('sp', 3)">
      <img :src="require('../../../static/images/node_po.png')" alt>
      <div class="infro">配偶</div>
    </div>


    <div class="node s-node" @click="handleBuildLink('s', 1)">
      <img :src="require('../../../static/images/node_s.png')" alt>
      <div class="infro">儿子</div>
    </div>



    <div class="node d-node" @click="handleBuildLink('d', 2)">
      <img :src="require('../../../static/images/node_d.png')" alt>
      <div class="infro">女儿</div>
    </div>


  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  data() {
    return {
      show: false,
      linkNode:null,
      centerNodes: {
        name: "",
        headerUrl: "",
        _Image:""
      },


    };
  },
  beforeMount() {},
  methods: {
    showModel(data) {
      console.log('showModel', data)

      this.centerNodes = data.data.testNode;
      this.linkNode = data.data.drapNode;
      this.show = true;
    },
    hideModel() {
      this.show = false;
    },

    handleBuildLink(linkType, gender){
      let _this = this
      // console.log('centerNodes', this.linkNode)
      const param = {        
        cNodeId:_this.centerNodes._ID,
        addNodeID:_this.linkNode.id,
        sex:_this.linkNode.sex,
        name:_this.linkNode.name,
        source:_this.linkNode.source,
        sourceNodeId:_this.linkNode._ID,
        userId: _this.linkNode.userId,
        type:linkType,
        _type: _this.linkNode._type,
        gender: gender
      }
      console.log(_this.centerNodes)
      console.log(_this.linkNode)
      const data = {
        _sex: this.centerNodes._sex
      }
      let string = `${param.name}是【${_this.getSex(param.sex)}】不能建立【${
        _this.getRelation(param.type)
        }】关系`;



      if (param.sex) {
        if (param.gender === 3 && data._sex === param.sex) {
          this.show = false;
          Dialog.alert({
            title: '添加异常',
            message: string
          }).then(() => {
            // on close
          });
        } else if (param.gender === 3 && data._sex !== param.sex){
          this.$emit('emitBuildLink',param)
        }
        if (param.sex !== param.gender && param.gender !== 3) {
          this.show = false;
          Dialog.alert({
            title: '添加异常',
            message: string
          }).then(() => {
            // on close
          });
          // Toast('性别异常，请重新添加');
        } else {
          this.$emit('emitBuildLink',param)
        }
      } else {
        console.log('param', param)
        this.$emit('emitBuildLink',param)
      }
    },
    getSex(sex) {
      if (sex === 1) {
        return '男性'
      } else if (sex === 2){
        return '女性'
      }
    },
    getRelation(n) {
      let relation = '';
      switch(n)
      {
        case 'f':
          relation = '父亲';
          break;
        case 'm':
          relation = '母亲';
          break;
        case 's':
          relation = '儿子';
          break;
        case 'd':
          relation = '女儿';
          break;
        case 'sp':
          relation = '配偶';
          break;
      }
      return relation
    }
  }
};
</script>


<style lang="less" scoped>
.sheet-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000001;
  display: none;
  .bg {
    width: 100%;
    height: 100%;
    background: rgba(#000, 0.6);
  }
  .node {
    position: absolute;
    width: 66px;
    height: 66px;
    left: 50%;
    top: 50%;
    img {
      display: block;
      width: 100%;
    }
    .infro {
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
  }
  .center-node {
    margin-left: -80px;
    margin-top: -33px;
  }

  .f-node{
    margin-left: -126px;
    margin-top: -128px;
  }

  .m-node{
    margin-left: -20px;
    margin-top: -128px;
  }

  .po-node{
    margin-left: 34px;
    margin-top: -33px;
  }

  .s-node{
    margin-left: -126px;
    margin-top: 64px;
  }

  .d-node{
    margin-left: -20px;
    margin-top: 64px;
  }

  &.active {
    display: block;
    // .bg{
    //     display: block
    // }
  }
}
</style>

