<template>
  <div>
    <el-card style="margin: 10px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="scence != 0"
      ></CategorySelect>
    </el-card>
    <el-card style="margin: 10px 0">
      <div v-show="scence == 0">
        <!-- 添加SPU按钮 -->
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <!-- table模块 -->
        <el-table border stripe :data="spuList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SUP描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 操作按钮 -->
              <!-- 添加sku -->
              <hint-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <!-- 修改spu -->
              <hint-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="udataSpu(row)"
              ></hint-button>
              <!-- 查看 -->
              <hint-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看spu全部sku列表"
                @click="lookOverSkuList(row)"
              ></hint-button>
              <!-- 删除按钮 -->
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
                ><hint-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->,sizes,total"
          :total="total"
          background
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="sizeChange"
        >
          pager-count="7">
        </el-pagination>
      </div>
      <SpuForm
        v-show="scence == 1"
        @spuScence="changeScence"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scence == 2"
        @skuScence="changeScence"
        ref="sku"
      ></SkuForm>
    </el-card>
    <!-- 查看sku对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="closeDialog"
    >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入spu，sku子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 三级分类列表id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 初始化数据
      page: 1,
      limit: 3,
      //数据总条数
      total: 0,
      // 列表数据
      spuList: [],
      // 显示不同的场景
      scence: 0, // 0为spu列表；1为添加spu模块；2为添加或修改sku模块
      // 显示对话框
      dialogTableVisible: false,
      // sku列表名称
      skuList: [],
      //保存spu的数据
      spu: {},
      // loading加载
      loading: true,
    };
  },
  methods: {
    //获取三级分类列表id
    getCategoryId({ CategoryId, level }) {
      // 根据level不同筛选出不同等级的id
      if (level == 1) {
        this.category1Id = CategoryId;
        // 清除2.3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = CategoryId;
        this.category3Id = "";
      } else {
        this.category3Id = CategoryId;
        // 三个id都获取了，可以发请求获取列表数据
        this.getSpuList();
      }
    },
    // 请求列表数据
    async getSpuList(pages = 1) {
      //  将页码变化的回调合并到这里
      this.page = pages;
      //  将参数从数据中解构出来
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器改变回调
    sizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu
    addSpu() {
      this.scence = 1;
      // 通知子组件发请求，同时将category3id送过去
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改spu
    udataSpu(row) {
      this.scence = 1;
      // 拿到子组件，让其调用自身函数发请求
      this.$refs.spu.initSpuData(row);
    },
    //子组件取消回到主页面修改scence值
    changeScence({ scence, flag }) {
      this.scence = scence;
      // 重新获取列表数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else if (flag == "添加") {
        this.getSpuList();
      } else {
        return;
      }
    },
    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功！" });
        // 重新获取列表数据，同时需要判断长度来决定停留在哪一页
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku
    addSku(row) {
      this.scence = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 查看skuList
    async lookOverSkuList(row) {
      this.spu = row;
      // 显示对话框
      this.dialogTableVisible = true;
      // 发请求
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框
    closeDialog(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>