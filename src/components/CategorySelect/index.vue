<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="isShow"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="isShow"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="isShow"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["isShow"],
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      //收集一二三级分类的Id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    // 当组件挂载完毕就获取一级分类的数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类的数据
    async getCategory1List() {
      let result = await this.$API.attr.Category1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类发生改变之后获取二级分类数据
    async handler1() {
      //清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      // 解构出一级分类的Id
      const { category1Id } = this.cForm;
      //将Id发送给父组件
      this.$emit("getCategoryId", { CategoryId: category1Id, level: 1 });
      let result = await this.$API.attr.Category2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类发生改变之后获取三级分类数据
    async handler2() {
      //清除数据
      this.list3 = [];
      this.cForm.category3Id = "";
      // 解构出二级分类的Id
      const { category2Id } = this.cForm;
      //将Id发送给父组件
      this.$emit("getCategoryId", { CategoryId: category2Id, level: 2 });
      let result = await this.$API.attr.Category3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    handler3() {
      // 解构出三级分类的Id
      const { category3Id } = this.cForm;
      //将Id发送给父组件
      this.$emit("getCategoryId", { CategoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>