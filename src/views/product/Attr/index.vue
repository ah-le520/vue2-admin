<template>
  <div>
    <el-card style="margin: 10px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="!isShowTab"
      ></CategorySelect>
    </el-card>
    <!-- 列表 -->
    <el-card style="margin: 10px 0">
      <div v-show="isShowTab">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border stripe :data="attrList">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="属性值" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                size="normal"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="操作" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <!-- 编辑按钮 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="updataAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加编辑模块 -->
      <div v-show="!isShowTab">
        <el-form label-width="80px" :inline="true" size="normal">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button size="default">取消</el-button>
        <el-table
          border
          stripe
          style="margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="col.id" label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <!-- input添加属性值 -->
              <el-input
                placeholder="请输入属性值"
                size="mini"
                v-model="row.valueName"
                v-show="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-show="!row.flag" @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="col.id" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 删除按钮 这里的ui组件版本问题，确认事件需要用onConfirm-->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 保存按钮 -->
        <el-button
          type="primary"
          size="default"
          @click="addAttrOrUpdata"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button size="default" @click="isShowTab = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的字段
      attrList: [],
      //判断是否展示数据
      isShowTab: true,
      // 收集新增|修改属性所用数据
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 自定义事件的回调，获取三个Id
    getCategoryId({ CategoryId, level }) {
      // 区分三级分类相应的Id，并在父组件中储存
      if (level == 1) {
        // 清理二三级Id
        this.category2Id = "";
        this.category3Id = "";
        this.category1Id = CategoryId;
      } else if (level == 2) {
        // 清理三级id
        this.category3Id = "";
        this.category2Id = CategoryId;
      } else {
        // 代表三个分类的id都有了，可以发请求
        this.category3Id = CategoryId;
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    //当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      //获取属性列表的数据
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性按钮
    addAttr() {
      this.isShowTab = false;
      //清空残留数据同时获取三级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId, //三级分类的id
        categoryLevel: 3,
      };
    },
    //编辑按钮
    updataAttr(row) {
      this.isShowTab = false;
      // 深拷贝数据
      this.attrInfo = cloneDeep(row);
      // 遍历每个属性，并为其加上flag属性
      this.attrInfo.attrValueList.forEach((item) => {
        //使用$set('给谁加'，'key'，'value')每个遍历出来的属性加上flag属性
        this.$set(item, "flag", false);
      });
    },
    //添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //属性名对应的id
        valueName: "",
        // 给每个属性值添加一个flag，用于切换编辑查看模式
        flag: true,
      });
      //浏览器渲染需要时间，不可以一点击就能立即获得input框
      // 这里需要用$nextTick
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // input添加属性值时blur事件
    toLook(row) {
      // 判断input中文本框中是否为空
      if (row.valueName === "") {
        this.$message("请输入内容");
        return;
      }
      //判断属性是否已经存在，这里判断的时候要将新增的这个属性从数组中去除，不能自己跟自己比
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //将自身从数组中去除
        if (row !== item) {
          //在这里添加some方法的判断条件
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) return;
      //切换显示input框
      row.flag = false;
    },
    // input中span编辑属性
    toEdit(row, index) {
      row.flag = true;
      //浏览器渲染需要时间，不可以一点击就能立即获得input框
      // 这里需要用$nextTick
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 添加属性中的删除按钮
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮
    async addAttrOrUpdata() {
      this.isShowTab = true;
      //数据过滤
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤空数据，以及将flag字段删除
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddAttrOrUpdata(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功后需要再次获取列表
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style>
</style>