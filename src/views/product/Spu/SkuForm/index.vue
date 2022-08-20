<template>
  <div>
    <el-form label-width="80px" :inline="false" size="normal">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              clearable
              filterable
              v-model="attr.attrIdAndValueId"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              clearable
              filterable
              v-model="saleAttr.saleAttrIdAndValueId"
            >
              <el-option
                :label="saleValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleValue.id}`"
                v-for="saleValue in saleAttr.spuSaleAttrValueList"
                :key="saleValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          border
          stripe
          :data="SpuImgList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="col.id" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 80px; height: 80px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="col.id" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="default"
                v-if="row.isDefault == 0"
                @click="setDefault(row)"
                >设为默认</el-button
              >
              <el-button size="default" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="saveSkuInfo"
          >保存</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 图片数据
      SpuImgList: [],
      // 销售属性的数据
      spuSaleAttrList: [],
      // 平台属性的数据
      attrInfoList: [],
      // 收集sku字段的属性
      skuInfo: {
        // 第一类,父元素给的属性
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类,双向数据绑定的属性
        skuName: "",
        weight: "",
        price: 0,
        skuDesc: "",
        // 第三类,需要二次处理的属性
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        // 图片列表
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      // 收集父元素spu
      spu: {},
      // 收集复选框信息
      imageList: [],
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("skuScence", { scence: 0, flag: "" });
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 获取初始数据
    async getData(category1Id, category2Id, spu) {
      // 将父元素数据赋值
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 获取图片数据
      let result = await this.$API.spu.reqSpuImgList(spu.id);
      if (result.code == 200) {
        // 为SpuImgList加上isDefault字段
        let newReault = result.data;
        newReault.forEach((item) => {
          item.isDefault = 0;
        });
        this.SpuImgList = newReault;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // 设置默认
    setDefault(row) {
      // 排他
      this.SpuImgList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片信息
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 收集复选框信息
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    // 保存按钮
    async saveSkuInfo() {
      // 整理数据
      const { skuInfo, attrInfoList, imageList, spuSaleAttrList } = this;
      // 平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          let [attrId, valueId] = item.attrIdAndValueId.split(":");
          pre.push({ attrId, valueId });
        }
        return pre;
      }, []);
      // 销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, item) => {
        if (item.saleAttrIdAndValueId) {
          let [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndValueId.split(":");
          pre.push({ saleAttrId, saleAttrValueId });
        }
        return pre;
      }, []);
      // 图片列表
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqSaveSkuInfo(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功！" });
        this.cancel();
      }
    },
  },
};
</script>

<style>
</style>