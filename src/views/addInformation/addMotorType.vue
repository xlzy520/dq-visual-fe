<template>
  <div class="app-container">
    <!--    搜索栏-->
    <div class="header">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="formInline.productName" placeholder="商品名称" />
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
      <el-table-column prop="productName" label="商品名称"> </el-table-column>
      <el-table-column prop="power" label="功率" />
      <el-table-column prop="exportValue" label="出口额/万美金" />
      <el-table-column prop="importValue" label="进口额/万美金" />
      <el-table-column prop="exportShare" label="出口占比" />
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
    <!--    新增栏/编辑栏 是2.几版本的和3,。几的不一样 :visible.sync和v-model-->
    <el-dialog title="信息编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" :model="form" label-width="80px" class="form" :rules="rules">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功率" prop="power">
          <el-input v-model="form.power" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出口额/万美金" prop="exportValue">
          <el-input v-model="form.exportValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进口额/万美金 " prop="importValue">
          <el-input v-model="form.importValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出口占比 " prop="exportShare">
          <el-input v-model="form.exportShare" autocomplete="off"></el-input>
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
        productName: '',
      },
      //新增栏
      type: 'add', // edit
      dialogFormVisible: false,
      form: {
        productName: '', //商品名称
        power: '', //功率
        exportValue: '', //出口额/万美金
        importValue: '', //进口额/万美金
        exportShare: '', //出口占比
      },
      loading: false,
      tableData: null,
      currentPage: 1,
      total: 0,
      rules: {
        productName: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' },
        ],
        power: [{ required: true, message: '请填写功率', trigger: 'blur' }],
        exportValue: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        importValue: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        exportShare: [{ required: true, message: '请填写价格', trigger: 'blur' }],
      },
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
          productName: this.formInline.productName,
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
          alert('提交成功');
          this.dialogFormVisible = false;
        } else {
          alert('提交失败');
          this.dialogFormVisible = true;
        }
      });
      request
        .post('order/' + this.type, {
          //发送的
          // productName: '', //商品名称
          // power: '', //功率
          // exportValue: '', //出口额/万美金
          // importValue: '', //进口额/万美金
          // exportShare: '', //出口占比
          productName: this.form.productName,
          power: this.form.power,
          exportValue: this.form.exportValue,
          importValue: this.form.importValue,
          exportShare: this.form.exportShare,
        })
        //发送成功，然后做什么，没有成功，不会做下面的方法
        .then((res) => {
          console.log(res, '===========打印的 ------ res');
          this.$message.success('提交成功');
          this.getData();
          this.dialogFormVisible = false;
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
  mounted() {
    this.getData();
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
