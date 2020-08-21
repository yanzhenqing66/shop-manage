<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许第三级分类设置相关参数" type="warning" :show-icon="true" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_op">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isbtnDisabled">动态参数</el-button>
          <!-- 动态表格区域 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isbtnDisabled">静态属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类管理列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定到数组
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
    }
  },
  created() {
    // 商品分类管理列表
    this.getCateList()
  },
  methods: {
    // 商品分类管理列表
    async getCateList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类管理列表失败！')
      }
      this.cateList = res.data
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData()
    },
    // 切换tab选项
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数请求
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 根据所选的ID，以及展示的面板，获取对应的参数
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
  },
  computed: {
    isbtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.cat_op {
  margin: 15px 0;
}
</style>