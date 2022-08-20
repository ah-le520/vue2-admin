<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="el-icon-plus"
      @click="showDialog"
      >添加</el-button
    >

    <!-- 表格 -->
    <el-table style="width: 100%" border stripe :data="list">
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
        align="center"
        type="index"
      >
      </el-table-column
      ><el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column
      ><el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.logoUrl"
            alt="tmName"
            style="width: 100px; height: 60px"
          />
        </template> </el-table-column
      ><el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="upDataTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmForm" :rules="rules" ref="formTeadeMark">
        <el-form-item
          label="品牌名称"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <el-input
            autocomplete="off"
            style="width: 80%"
            v-model="tmForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <!-- 
            -这里收集数据:不能使用v-model，因为不是表单元素
            action:设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload:可以在上传图片之前,会执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdata">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 10px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      background
      @current-change="getPageList"
      @size-change="sizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 当前页码
      page: 1,
      // 当前分页显示条数
      limit: 3,
      // 数据总条数
      total: 0,
      // 展示数据
      list: [],
      // 对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 输入框宽度
      formLabelWidth: "100px",
      //收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          //自定义验证规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    //获取列表数据
    this.getPageList();
  },
  methods: {
    //  获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      // 结构出参数
      const { page, limit } = this;
      //获取品牌列表的接口
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    sizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //上传图片相关的回调
    //res:上传成功之后返回盯端数括
    //file:上传成功之后服务器返回前端数据
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加
    showDialog() {
      this.dialogFormVisible = true;
      //添加之前清理一下数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改
    upDataTrademark(row) {
      // row就是当前的品牌信息
      this.dialogFormVisible = true;
      // 这里使用浅拷贝，操作数据
      this.tmForm = { ...row };
    },
    // 确定请求添加或修改品牌
    addOrUpdata() {
      //验证表单数据
      this.$refs.formTeadeMark.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          // 发送请求
          const result = await this.$API.tradeMark.reqAddOrUpdataTradesMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出修改或添加成功的消息
            this.$message({
              message: this.tmForm.id ? "品牌修改成功！" : "品牌添加成功！",
              type: "success",
            });
            // 成功之后，要再重新请求数据
            // 如果是添加品牌，默认第一页，如果修改，则保持当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除数据
    deleteTradeMark(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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