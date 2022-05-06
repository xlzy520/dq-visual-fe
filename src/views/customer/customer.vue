<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="formInline.shopName" placeholder="店铺名称" />
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item>
          <!--          搜索：先把要搜索的数据传给后台，后台反馈回来，把后台数据赋值给表格数据-->
          <el-button type="primary" @click="getData">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <!--      ref=form设置在表单开头el-form，方法内：this.$refs.form.resetFields(),要重置的加prop-->
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          &lt;!&ndash;          这里的新增，只是传了些数据&ndash;&gt;-->
        <!--          <el-button @click="add">新增</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <!--    列表栏-->
    <el-table v-loading="loading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row>
      <!--      <el-table :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">-->
      <el-table-column prop="shopName" label="店铺名称" />
      <el-table-column prop="shopAddress" label="店铺地址" />
      <el-table-column prop="username" label="用户名称" />
      <el-table-column prop="phoneNumber" label="电话号码" />
      <el-table-column prop="address" label="收货地址" />
      <!--      <el-table-column prop="action" label="操作" align="center">-->
      <!--        &lt;!&ndash;slot插槽，用#代替了并给了参数row，这里都用row来写        &ndash;&gt;-->
      <!--        <template v-slot="{ row }">-->
      <!--          <el-button type="text" @click="edit(row)">编辑</el-button>-->
      <!--          <el-popconfirm-->
      <!--            title="确定删除吗?"-->
      <!--            confirm-button-text="确定"-->
      <!--            cancel-button-text="取消"-->
      <!--            @onConfirm="remove(row)"-->
      <!--          >-->
      <!--            <el-button slot="reference" size="mini" type="danger" class="remove">移除</el-button>-->
      <!--          </el-popconfirm>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <!--    分页-->
    <div class="block">
      <el-pagination :page-size="10" layout="prev, pager, next" :total="total" @current-change="changePage">
      </el-pagination>
    </div>
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样-->
    <!--    :visible.sync和v-model-->
    <!--    <el-dialog title="客户信息编辑" :visible.sync="dialogFormVisible">-->
    <!--      <el-form ref="dialogForm" :model="form" label-width="80px" class="form" :rules="rules">-->
    <!--        <el-form-item label="店铺名称" prop="shopName">-->
    <!--          <el-input v-model="form.shopName" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="店铺地址" prop="shopAddress" placeholder="请填写地址">-->
    <!--          <el-input v-model="form.shopAddress" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="用户名称" prop="username">-->
    <!--          <el-input v-model="form.username" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="联系电话" prop="phoneNumber">-->
    <!--          <el-input v-model="form.phoneNumber" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="收货地址" prop="address" placeholder="请填写地址">-->
    <!--          <el-input v-model="form.address" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="备注">-->
    <!--          <el-input v-model="form.remarks" autocomplete="off" type="textarea"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        &lt;!&ndash;        当他为f的时候看不见，当他为T的时候出现&ndash;&gt;-->
    <!--        <el-button @click="dialogFormVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="submit('dialogForm')">确 定</el-button>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getList } from '@/api/table';
import axios from 'axios';
import request from '@/utils/request';

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
        shopName: '',
        username: '',
      },
      //新增栏
      // type: 'add', // edit
      dialogFormVisible: false,
      // form: {
      //   shopName: '', //店铺名称
      //   username: '', //用户名称
      //   shopAddress: '', //店铺地址
      //   address: '', //收货地址
      //   phoneNumber: '', //电话号码
      //   remarks: '', //备注
      // },
      loading: false,
      tableData: null,
      currentPage: 1,
      total: 0,
      // rules: {
      //   shopName: [
      //     { required: true, message: '请输入店铺名称', trigger: 'blur' },
      //     { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
      //   ],
      //   username: [
      //     { required: true, message: '请输入用户名称', trigger: 'blur' },
      //     { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
      //   ],
      //   shopAddress: [{ required: true, message: '请填写地址', trigger: 'blur' }],
      //   address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
      //   phoneNumber: [{ required: true, message: '请填写电话号码', trigger: 'blur' }],
      // },
    };
  },
  created() {
    this.getData();
  },
  methods: {
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
        .post('order/page', {
          shopName: this.formInline.shopName,
          username: this.formInline.username,
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
    // add() {
    //   this.type = 'add';
    //   this.form = {};
    //   this.dialogFormVisible = true;
    // },
    // //提交
    // submit(formName) {
    //   this.dialogFormVisible = false;
    //   //新增校验----不行
    //   console.log(formName, '===========打印的 ------ submit');
    //   console.log(this.$refs, '===========打印的 ------ 1');
    //   console.log(this.$refs[formName], '===========打印的 ------ 2');
    //   this.$refs.dialogForm.validate((valid) => {
    //     if (valid) {
    //       alert('提交成功');
    //     } else {
    //       alert('提交失败');
    //       this.dialogFormVisible = true;
    //       return;
    //     }
    //   });

    // this.$refs[dialogForm].validate((valid) => {

    //   request
    //     .post('order/page', {
    //       //发送的
    //       shopName: this.form.shopName,
    //       username: this.form.username,
    //       shopAddress: this.form.shopAddress,
    //       address: this.form.address,
    //       phoneNumber: this.form.phoneNumber,
    //       remarks: this.form.remarks,
    //     })
    //     .then((res) => {
    //       // if (this.shopName && this.username && this.shopAddress && this.address && this.phoneNumber) {
    //       //   alert('新增成功');
    //       // } else {
    //       //   alert('请输入完整信息!');
    //       //   this.dialogFormVisible = true;
    //       // }
    //
    //       this.dialogFormVisible = false;
    //     });
    // },
    // //编辑
    // edit(row) {
    //   this.dialogFormVisible = true;
    //   this.type = 'edit';
    //   console.log(row, '===========打印的 ------ edit');
    //   this.form = row;
    // },
    // //删除
    // remove(item) {
    //   console.log(item, '===========打印的 ------ remove');
    //   request
    //     .post('order/delete', {
    //       //把item.id传过去，并赋值为id
    //       id: item.id,
    //     })
    //     .then((res) => {
    //       this.getData();
    //     });
    // },
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
