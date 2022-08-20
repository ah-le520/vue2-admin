<template>
  <div>
    <el-card>
      <el-table border stripe :data="records">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column prop="col" label="默认图片" width="100">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.skuDefaultImg"
              style="width: 80px; height: 80px"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="80">
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <!-- 操作按钮 -->
            <!-- 上架sku -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-top"
              title="上架"
              v-if="row.isSale == 0"
              @click="onSale(row)"
            ></el-button>
            <!-- 下架sku -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-bottom"
              title="下架"
              v-else
              @click="cancelSale(row)"
            ></el-button>
            <!-- 修改spu -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              title="修改"
              @click="edit"
            ></el-button>
            <!-- 查看 -->
            <el-button
              type="info"
              size="mini"
              icon="el-icon-info"
              title="查看全部sku列表"
              @click="showInfo(row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-popconfirm title="这是一段内容确定删除吗？"
              ><el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除spu"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器  -->
      <el-pagination
        style="text-align: center"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        background
        :pager-count="5"
        @current-change="getSkuList"
        @size-change="sizeChange"
      >
      </el-pagination>
    </el-card>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" size="50%" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //当前页码
      limit: 10, //当前页面有几条数据
      // 储存SKU数据
      records: [],
      // 分页器一共展示的数据条数
      total: 0,
      // sku信息
      skuInfo: {},
      // 抽屉显示
      drawer: false,
    };
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // pageSize改变
    sizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        this.$message("上架成功");
        row.isSale = 1;
      }
    },
    // 下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        this.$message("下架成功");
        row.isSale = 0;
      }
    },
    // 编辑按钮
    edit() {
      this.$message("正在开发中...");
    },
    // 查看sku信息
    async showInfo(row) {
      let result = await this.$API.sku.reqGetSkuInfo(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      } else {
        this.$message("网络错误...");
      }
      this.drawer = true;
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>


<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  text-align: right;
  font-size: 20px;
  font-weight: 700;
}
.el-col {
  padding: 10px;
}
</style>
