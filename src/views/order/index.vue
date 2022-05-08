<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="ID" prop="id">
          <el-input v-model="formInline.id" placeholder="ID" />
        </el-form-item>
        <el-form-item label="企业名称" prop="shopName">
          <el-input v-model="formInline.shopName"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="PaymentStatus">
          <el-select v-model="formInline.PaymentStatus" placeholder="支付状态">
            <el-option v-for="(item, index) in statusList" :key="item" :label="item" :value="index" />
          </el-select>
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
      <el-table-column prop="serial" label="序号" width="50">
        <template v-slot="{ $index, row }"> {{ serial($index) }} </template>
      </el-table-column>
      <el-table-column prop="id" align="center" label="ID" width="100">
        <template v-slot="{ row }">
          {{ row.id.substring(0, 8) }}
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="企业名称" width="120" />
      <el-table-column prop="username" label="联系人" width="90" />
      <el-table-column prop="price" label="订单价格" width="90" />
      <el-table-column prop="PaymentStatus" label="支付状态" width="90">
        <template v-slot="{ row }">
          {{ formatStatus(row.PaymentStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="shopAddress" label="企业地址" width="120" show-tooltip-when-overflow />
      <el-table-column prop="address" label="收货地址" width="160" show-tooltip-when-overflow />
      <el-table-column prop="updateTime" label="更新时间" width="">
        <template v-slot="{ row }">
          {{ formatTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="120" align="center">
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
      <el-form ref="dialogForm" :model="form" label-width="80px" class="form" :rules="rules">
        <el-form-item label="企业名称" prop="shopName">
          <el-input v-model="form.shopName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="PaymentStatus">
          <el-select v-model="form.PaymentStatus" placeholder="支付状态">
            <!--            <el-option label="PaymentStatus" value="PaymentStatus.value" />-->
            <el-option v-for="(item, index) in statusList" :key="item" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业地址 " prop="shopAddress">
          <el-input v-model="form.shopAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <!--        <el-form-item label="备注">-->
        <!--          <el-input v-model="form.remarks" autocomplete="off" type="textarea"></el-input>-->
        <!--        </el-form-item>-->
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
      formInline: {},
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        serial: '',
        shopName: '', //企业名称
        username: '', //联系人
        shopAddress: '', //企业地址
        address: '', //收货地址
        price: '', //price价格
        PaymentStatus: '', //支付状态
      },
      loading: false,
      tableData: null,
      currentPage: 1,
      total: 0,
      rules: {
        shopName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        shopAddress: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        price: [{ required: true, message: '请填写价格', trigger: 'blur' }],
        PaymentStatus: [{ required: true, message: '请填写支付状态', trigger: 'blur' }],
        phone: [
          { required: true, message: '请填写电话号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请填写符合要求的11位手机号',
            trigger: 'blur',
          },
        ],
      },
      statusList: ['待支付', '支付成功', '已发货', '已取消'],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    serial(index) {
      return (this.currentPage - 1) * 10 + index + 1;
    },
    //时间
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:MM:ss');
    },
    formatStatus(status) {
      return this.statusList[status];
    },
    //分页，把value传过去
    changePage(val) {
      this.currentPage = val;
      this.getData();
    },
    //搜索
    getData() {
      this.loading = true;
      request
        .post('order/page', {
          ...this.formInline,
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
      this.formInline = {};
    },
    // 新增
    add() {
      this.type = 'add';
      this.form = {};
      this.dialogFormVisible = true;
    },
    //提交
    submit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          request
            .post('order/' + this.type, this.form)
            //发送成功，然后做什么，没有成功，不会做下面的方法
            .then((res) => {
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
        .post('order/delete', {
          //把item.id传过去，并赋值为id
          id: item.id,
        })
        .then((res) => {
          this.getData();
        });
    },
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
