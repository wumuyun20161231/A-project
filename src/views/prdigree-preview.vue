<template>
  <div class="prdigree">
    <template v-if="loading">
      <tree
        v-if="treeData"
        ref="treeComponent"
        :treeData="treeData"
      ></tree>
    </template>
  </div>
</template>
<script>
  import Tree from "./components/tree";
  import { Toast } from "vant";
  import { calcRelation } from "./calcRelation.js";

  import * as home from "../api/home";
  import { setTimeout } from "timers";

  export default {
    components: {
      Tree
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

    mounted() {
      
    },

    methods: {
      // 获取纪念堂的列表的数据
      getPrdigree() {
        this.loading = false
        return new Promise((resolve, reject) => {
          home.getPedigreeDataPreview(this.$route.params.id).then(res => {
            this.loading = true
            let data = getData(res.data)
            resolve(data);
          })
        })
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
            nodes: data.nodes,
            links: data.links
          }
        })
      }
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
