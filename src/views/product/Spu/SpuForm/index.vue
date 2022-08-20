<template>
  <!-- 添加SPU模块 -->
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMark"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <!-- file-list：照片墙需要展示的数据列表，数据必须有name，url属性
             on-preview：图片预览功能
             on-remove：删除图片
             on-success:图片上传成功的回调
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImage"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性模块 -->
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectAttr.length}未选`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border stripe :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="col.id" label="属性名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- " -->
              <!-- @keyup.enter.native="handleInputConfirm"
              -->

              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="col.id" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 删除销售属性 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdataSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      //存储spu信息
      spu: {
        //  spu名称
        spuName: "",
        // spu品牌id
        tmId: "",
        // spu描述
        description: "",
        category3Id: 0,
        //    spu图片
        spuImageList: [
          //   {
          //     id: 0,
          //     imgName: "",
          //     imgUrl: "",
          //     spuId: 0,
          //   },
        ],
        //   销售属性
        spuSaleAttrList: [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "string",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ],
      },
      //存储spu品牌信息
      tradeMark: [],
      //   spu图片信息
      spuImage: [],
      //  平台全部销售属性信息
      saleAttrList: [],
      //   收集未选择的销售属性的id及属性名称
      attrIdAndAttrName: "",
    };
  },
  methods: {
    // 修改scence值回到主页面
    changeScence() {
      this.$emit("spuScence", 0);
    },
    // 初始化数据
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //   获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMark = tradeMarkResult.data;
      }
      //   获取spu图片信息
      let spuImageResult = await this.$API.spu.reqSpuImage(spu.id);
      if (spuImageResult.code == 200) {
        // 因为elUI图片列表需要的是name和url字段，所以需要重新封装数据
        let elUiImage = spuImageResult.data;
        elUiImage.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImage = elUiImage;
      }
      //   获取销售属性信息
      let saleAttrListResult = await this.$API.spu.reqSaleAttrList();
      if (saleAttrListResult.code == 200) {
        this.saleAttrList = saleAttrListResult.data;
      }
    },
    // 删除图片的回调，file：删除的元素；fileList：剩余的元素列表
    handleRemove(file, fileList) {
      // 将删除后的列表重新赋值给列表储存
      this.spuImage = fileList;
    },
    // 图片预览的回调
    handlePictureCardPreview(file) {
      // 将选中图片地址赋值给dialog对话框
      this.dialogImageUrl = file.url;
      //   控制dialogo对话框的显示与隐藏
      this.dialogVisible = true;
    },
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      // 将图片上传成功后的列表重新赋值给列表储存
      this.spuImage = fileList;
    },
    // 添加销售属性
    addSaleAttr() {
      // 将收集到的数据拆分
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //  将数据添加到spuSaleAttrList中
      let newSaleAttr = {
        spuSaleAttrValueList: [],
        baseSaleAttrId,
        saleAttrName,
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
    },
    // 添加销售属性值
    addSaleAttrValue(row) {
      // 向销售属性值列表中添加inputVisible以控制显示
      this.$set(row, "inputVisible", true);
      // 并向其中添加inputValue以保存输入值
      this.$set(row, "inputValue", "");
      // 自动获取焦点
      // this.$nextTick(() => {
      //   this.$refs[row.addAttrValueFocus].focus();
      // });
    },
    // Input框失去焦点事件
    handleInputConfirm(row) {
      row.inputVisible = false;
      // 将inputValue和baseSaleAttrId结构出来
      const { inputValue, baseSaleAttrId } = row;
      // 将输入的值整理出来，放到下面的销售属性值列表中
      if (inputValue.trim() == "") {
        return;
      }
      // 判断属性是否重复
      let result = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });

      if (!result) {
        return this.$message("属性已存在");
      } else {
        let newSaleAttrValue = {
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        };
        row.spuSaleAttrValueList.push(newSaleAttrValue);
      }
    },
    // 删除tag标签
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 保存添加或更新
    async addOrUpdataSpu() {
      // 整理图片信息,  需要imgName和imgUrl字段
      this.spu.spuImageList = this.spuImage.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl,
        };
      });
      let result = await this.$API.spu.reqUpdataOrSaveSpu(this.spu);
      if (result.code == 200) {
        // 提示保存成功
        this.$message({ type: "success", message: "保存成功！" });
        // 返回主页面,需要判断是修改还是添加的保存
        this.$emit("spuScence", {
          scence: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清空数据
      Object.assign(this._data, this.$options.data());
    },
    // 添加Spu按钮
    async addSpuData(category3Id) {
      // 为category3id赋值
      this.spu.category3Id = category3Id;
      //   获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMark = tradeMarkResult.data;
      }
      //   获取销售属性信息
      let saleAttrListResult = await this.$API.spu.reqSaleAttrList();
      if (saleAttrListResult.code == 200) {
        this.saleAttrList = saleAttrListResult.data;
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("spuScence", { scence: 0, flag: "" });
      // 清空数据
      //object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //  计算出未选择的销售属性
    unSelectAttr() {
      // 整个平台就三个属性---尺寸、颜色、版本
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>