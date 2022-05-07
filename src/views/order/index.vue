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
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="formInline.status" placeholder="支付状态">
            <el-option label="待支付" value="1" />
            <el-option label="支付成功" value="2" />
            <el-option label="已发货" value="3" />
            <el-option label="已取消" value="4" />
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
      <el-table-column prop="shopAddress" label="企业地址" width="180" />
      <el-table-column prop="address" label="收货地址" width="180" />
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
            <el-button slot="reference" size="mini" type="danger" class="remove">移除</el-button>
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
        <el-form-item label="订单价格" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="PaymentStatus">
          <el-select v-model="form.PaymentStatus" placeholder="支付状态">
            <!--            <el-option label="PaymentStatus" value="PaymentStatus.value" />-->
            <el-option label="待支付" value="1" />
            <el-option label="支付成功" value="2" />
            <el-option label="已发货" value="3" />
            <el-option label="已取消" value="4" />
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
      formInline: {
        id: '',
        shopName: '',
        status: '',
      },
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
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    serial(index) {
      console.log(this.currentPage, '===========打印的 ------ serial1');
      console.log(this.pageSize, '===========打印的 ------ serial2');
      console.log(index, '===========打印的 ------ serial3');

      return (this.currentPage - 1) * 10 + index + 1;
    },
    //时间
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD ');
    },
    formatStatus(staus) {
      if (staus === '1') {
        return '待支付';
      } else if (staus === '2') {
        return '支付成功';
      } else if (staus === '3') {
        return '已支发货';
      } else {
        return '已取消';
      }
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
        .post('order/page', {
          id: this.formInline.id,
          username: this.formInline.username,
          PaymentStatus: this.formInline.PaymentStatus,
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
      this.form = {};
      this.dialogFormVisible = true;
    },
    //提交
    submit(formName) {
      //表单校验---有前台做了，后台还未修改
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          request
            .post('order/' + this.type, this.form)
            //发送成功，然后做什么，没有成功，不会做下面的方法
            .then((res) => {
              console.log(res, '===========打印的 ------ res');
              this.$message.success('提交成功');
              this.getData();
              this.dialogFormVisible = false;
            });
        } else {
          alert('提交失败');
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
