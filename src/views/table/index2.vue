<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="formInline.shopName" placeholder="店铺名称" />
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="formInline.name"></el-input>
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
    <el-table v-loading="loading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="numbering" align="center" label="ID" width="95"> </el-table-column>
      <el-table-column prop="name1" label="店铺名称" width="120" />
      <el-table-column prop="name2" label="用户名称" width="100" />
      <el-table-column prop="price" label="订单价格" width="100" />
      <el-table-column prop="PaymentStatus" label="支付状态" width="110" />
      <el-table-column prop="address2" label="店铺地址" width="250" />
      <el-table-column prop="address1" label="收货地址" width="250" />
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
    <!--    <el-pagination-->
    <!--      v-model:currentPage="currentPage"-->
    <!--      :page-size="10"-->
    <!--      layout="total, prev, pager, next"-->
    <!--      :total="total"-->
    <!--      @current-change="getData"-->
    <!--    />-->
    <div class="block">
      <!--      <span class="demonstration">页数较少时的效果</span>-->
      <el-pagination :page-size="10" layout="prev, pager, next" :total="50" @current-change="changePage">
      </el-pagination>
    </div>
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样-->
    <!--    :visible.sync和v-model-->
    <el-dialog title="客户信息编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" :model="form" label-width="80px" class="form">
        <el-form-item label="店铺名称">
          <el-input v-model="form.shopName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="form.shopAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="form.address1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <!--        当他为f的时候看不见，当他为T的时候出现-->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { getList } from '@/api/table';
import axios from 'axios';

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
        name: '',
      },
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        shopName: '', //店铺名称
        name: '', //用户名称
        shopAddress: '', //店铺地址
        address1: '', //收货地址
        phoneNumber: '', //电话号码
        remarks: '', //备注
      },
      loading: false,
      tableData: null,
      currentPage: 1,
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
      //还未做
      axios
        .post('http://localhost:5000/users/page', {
          shopName: this.formInline.shopName,
          name: this.formInline.name,
          pageNum: this.currentPage, //在第几页找
          pageSize: 10,
        })
        .then((res) => {
          console.log('===========打印的res对象 ---res2--- ', res);
          // todo 如何才能从res里面取到正确的属性，把需要的数组数据显示在表格上
          //tableData是数组，要求res1也是数组
          const mockData = [
            {
              id: 1,
              name1: 'aaa',
              name2: 'a',
              address2: '京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 2,
              name1: 'bbb',
              name2: 'b',
              address2: '上海',
              address1: '上海',
              price: 15.0,
              PaymentStatus: '待支付',
            },
            {
              id: 3,
              name1: 'ccc',
              name2: 'c',
              address2: '长沙',
              address1: '长沙',
              price: 10.0,
              PaymentStatus: '已发货',
            },
            {
              id: 4,
              name1: 'ddd',
              name2: 'd',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 5,
              name1: 'eee',
              name2: 'e',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 6,
              name1: 'fff',
              name2: 'f',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 7,
              name1: 'ggg',
              name2: 'g',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 8,
              name1: 'hhh',
              name2: 'h',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 9,
              name1: 'iii',
              name2: 'i',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 10,
              name1: 'jjj',
              name2: 'j',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 11,
              name1: 'lll',
              name2: 'l',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
            {
              id: 12,
              name1: 'mmm',
              name2: 'm',
              address2: '北京',
              address1: '北京',
              price: 18.0,
              PaymentStatus: '支付成功',
            },
          ];
          const data = res.data;
          this.tableData = mockData;
          this.total = data.total;
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
    submit() {
      this.dialogFormVisible = false;
      //还未做
      axios
        //，后台网站地址暂时不知道，网址虚的
        .post('http://localhost:5000/users/' + this.type, {
          //发送的
          shopName: this.form.shopName,
          name: this.form.name,
          shopAddress: this.form.shopAddress,
          address1: this.form.address1,
          phoneNumber: this.form.phoneNumber,
          remarks: this.form.remarks,
        })
        //发送成功，然后做什么，没有成功，不会做下面的方法
        .then((res) => {
          console.log(res, '===========打印的 ------ res');
          const success = res.data.success;
          if (success) {
            this.$message.success('提交成功');
            this.getData();
            this.dialogFormVisible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //编辑
    edit(row) {
      this.dialogFormVisible = true;
      this.type = 'edit';
      console.log(row, '===========打印的 ------ edit');
      this.form = row;
    },
    //删除
    remove(item) {
      console.log(item, '===========打印的 ------ remove');
      axios
        .post('http://localhost:5000/users/delete', {
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
