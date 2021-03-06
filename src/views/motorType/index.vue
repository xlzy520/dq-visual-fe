<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="电机名称" prop="name">
          <el-input v-model="formInline.name" placeholder="电机名称" />
        </el-form-item>
        <el-form-item>
          <!--          搜索：先把要搜索的数据传给后台，后台反馈回来，把后台数据赋值给表格数据-->
          <el-button type="primary" @click="getData">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <!--      ref=form设置在表单开头el-form，方法内：this.$refs.form.resetFields(),要重置的加prop-->
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item>
          <!--          这里的新增，只是传了些数据-->
          <el-button @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--    列表栏-->
    <el-table v-loading="loading" :data="tableData" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column prop="name" label="电机名称"> </el-table-column>
      <el-table-column prop="desc" label="电机简介" />
      <el-table-column prop="imgUrl" label="电机照片">
        <template v-slot="{ row }">
          <img :src="row.imgUrl" alt="" class="imgUrl" />
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
        <template v-slot="{ row }">
          {{ formatTime(row.updateTime) }}
        </template>
      </el-table-column>

      <el-table-column prop="action" label="操作" align="center">
        <!--slot插槽，用#代替了并给了参数row，这里都用row来写        -->
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @onConfirm="remove(row)"
          >
            <a slot="reference" class="remove-btn">移除</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <div class="block">
      <el-pagination :page-size="10" layout="prev, pager, next" :total="total" @current-change="changePage">
      </el-pagination>
    </div>
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样 :visible.sync和v-model-->
    <el-dialog title="信息编辑" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dialogForm" :model="form" label-width="80px" class="form" :rules="rules">
        <el-form-item label="电机名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电机简介" prop="desc">
          <el-input v-model="form.desc" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="电机照片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:5001/common/upload"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <!--        当他为f的时候看不见，当他为T的时候出现-->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('dialogForm')">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request';

import dayjs from 'dayjs';
import { getToken } from '@/utils/auth';

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      //搜索栏
      formInline: {},
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        name: '', //电机名称
        desc: '', //简介
        imgUrl: '', //照片
      },
      loading: false,
      tableData: null,
      currentPage: 1,
      total: 0,
      rules: {
        name: [{ required: true, message: '请输入电机名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请填写电机简介', trigger: 'blur' }],
      },
      //  新增图片
      headers: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    close() {
      this.$refs.dialogForm.resetFields();
    },
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:MM:ss');
    },
    //分页，把value传过去
    changePage(val) {
      console.log(val, '===========打印的 ------ changePage');
      this.currentPage = val;
      this.getData();
    },
    //搜索
    getData() {
      this.loading = true;
      request
        .post('category/page', {
          name: this.formInline.name,
          pageNum: this.currentPage, //在第几页找
          pageSize: 10,
        })
        .then((res) => {
          console.log('===========打印的res对象 ---res2--- ', res);
          // todo 如何才能从res里面取到正确的属性，把需要的数组数据显示在表格上
          //tableData是数组，要求res1也是数组
          this.tableData = res.list;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields();
    },
    // 新增
    add() {
      this.type = 'add';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields();
      });
    },
    //提交
    submit(formName) {
      //表单校验---有前台做了，后台还未修改
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          request.post('category/' + this.type, this.form).then((res) => {
            console.log(res, '===========打印的 ------ res');
            this.$message.success('提交成功');
            this.getData();
            this.dialogFormVisible = false;
          });
        }
      });
    },
    //编辑
    edit(row) {
      this.dialogFormVisible = true;
      this.type = 'edit';
      this.form = { ...row };
    },
    //删除
    remove(item) {
      request
        .post('category/delete', {
          //把item.id传过去，并赋值为id
          id: item.id,
        })
        .then((res) => {
          this.$message.success('删除成功');
          this.getData();
        });
    },
    handleAvatarSuccess(res, file) {
      this.form.imgUrl = res.path;
    },
    beforeAvatarUpload(file) {},
  },
  mounted() {
    this.getData();
    //  新增图片

    this.headers = {
      Authorization: 'Bearer ' + getToken(),
    };
  },
};
</script>
<style>
.imgUrl {
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload {
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
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.remove {
  margin-left: 20px;
}
</style>
