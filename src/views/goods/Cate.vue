<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <el-button type="primary" plain size="mini" v-if="scope.row.cat_level === 0">一级</el-button>
          <el-button type="success" plain size="mini" v-else-if="scope.row.cat_level === 1">二级</el-button>
          <el-button type="warning" plain size="mini" v-else>三级</el-button>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 底部分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 获取商品的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 列表总条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '商品名称',
          prop: 'cat_name',
        },
        // 模板列
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
    }
  },
  created() {
    // 获取商品分类列表
    this.getCateList()
  },
  methods: {
    // 发起网络请求，获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>