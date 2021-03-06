<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formInline.name" placeholder="企业名称" />
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
      <!--      <el-table :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">-->
      <el-table-column prop="name" label="企业名称" />
      <el-table-column prop="address" label="企业地址" />
      <el-table-column prop="profit" label="企业利润" />
      <el-table-column prop="phone" label="电话号码" />
      <el-table-column prop="year" label="利润年份" />
      <el-table-column prop="createTime" label="创建时间" width="180px">
        <template v-slot="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180px">
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
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样-->
    <!--    :visible.sync和v-model-->
    <el-dialog title="信息编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" :model="form" label-width="120px" class="form" :rules="rules">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="address" placeholder="请填写地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业利润" prop="profit">
          <el-input v-model="form.profit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="利润年份" prop="year" placeholder="请选择年份">
          <el-date-picker v-model="form.year" value-format="yyyy" type="year" placeholder="选择年"> </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('dialogForm')">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getList } from '@/api/table';
import axios from 'axios';
import request from '@/utils/request';
import dayjs from 'dayjs';

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
      formInline: {
        name: '',
      },
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        name: '', //企业名称
        profit: '', //企业利润
        address: '', //企业地址
        year: '', //利润年份
        phone: '', //电话号码
      },
      loading: false,
      tableData: null,
      currentPage: 1,
      total: 0,
      rules: {
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        profit: [{ required: true, message: '请输入企业利润', trigger: 'blur' }],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        year: [{ required: true, message: '请填写利润年份', trigger: 'blur' }],
        phone: [
          { required: true, message: '请填写电话号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请填写符合要求的11位手机号',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
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
        .post('company/page', {
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
    // 新增G5
    add() {
      this.type = 'add';
      this.form = {};
      this.dialogFormVisible = true;
    },
    //提交
    submit(formName) {
      this.dialogFormVisible = false;
      //新增校验----不行
      console.log(formName, '===========打印的 ------ submit');
      console.log(this.$refs, '===========打印的 ------ 1');
      console.log(this.$refs[formName], '===========打印的 ------ 2');
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          request.post('company/' + this.type, this.form).then((res) => {
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
      console.log(row, '===========打印的 ------ edit');
      this.form = { ...row };
    },
    //删除
    remove(item) {
      console.log(item, '===========打印的 ------ remove');
      request
        .post('company/delete', {
          //把item.id传过去，并赋值为id
          id: item.id,
        })
        .then((res) => {
          this.getData();
        });
    },
    // handleCurrentChange(val) {
    //   this.currentRow = val;
    // },
  },
};
</script>
<style>
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
