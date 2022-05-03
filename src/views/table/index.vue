<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="ID" prop="id">
          <el-input v-model="formInline.id" placeholder="ID" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="formInline.status" placeholder="支付状态">
            <el-option label="待支付" value="1" />
            <el-option label="支付成功" value="2" />
            <el-option label="已发货" value="3" />
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
    <el-table v-loading="loading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="id" align="center" label="ID" width="95"> </el-table-column>
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
            @confirm="remove(row)"
          >
            <template #reference>
              <el-button size="mini" type="danger" class="remove">移除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样-->
    <!--    :visible.sync和v-model-->
    <el-dialog title="信息编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" :model="form" label-width="80px" class="form">
        <el-form-item label="店铺名称">
          <el-input v-model="form.name1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="form.name2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单价格">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="form.PaymentStatus" placeholder="支付状态">
            <el-option label="待支付" value="1" />
            <el-option label="支付成功" value="2" />
            <el-option label="已发货" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="form.address2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="form.address1" autocomplete="off"></el-input>
        </el-form-item>
        <!--        <el-form-item label="备注">-->
        <!--          <el-input v-model="form.remarks" autocomplete="off" type="textarea"></el-input>-->
        <!--        </el-form-item>-->
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
        id: '',
        name: '',
        status: '',
      },
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        name1: '', //店铺名称
        name2: '', //用户名称
        address2: '', //店铺地址
        address1: '', //收货地址
        //price价格
        price: '',
        PaymentStatus: '', //支付状态
      },
      loading: false,
      //不知道有没有用
      tableData: null,
      currentPage: 1,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //搜索
    getData() {
      this.loading = true;
      //还未做
      axios
        .post('http://localhost:5000/users/page', {
          id: this.formInline.id,
          name: this.formInline.name,
          status: this.formInline.status,
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
          id: this.form.id,
          name: this.form.name,
          price: this.form.price,
          newStatus: this.form.newStatus,
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
    //编辑  未完成
    edit(row) {
      this.dialogFormVisible = true;
      this.type = 'edit';
      console.log(row, '===========打印的 ------ edit');
      // this.form=this.tableData
      this.form.id = row.id;
      this.form.name1 = row.name1;
      this.form.name2 = row.name2;
      this.form.address2 = row.address2;
      this.form.address1 = row.address1;
      // this.form.remarks = row.remarks;
      this.form.price = row.price;
      this.form.PaymentStatus = row.PaymentStatus;
      // this.form = this.tableData;
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
          this.tableData.splice(index, 1);
          this.getData();
        });
    },
    //不知道有没有用
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
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
