<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['rowBottom', 'vcenter', v1 === 0 ? 'rowTop' : '']"
              v-for="(item1, v1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="v2===0?'':'rowTop'"
                  class="vcenter"
                  v-for="(item2, v2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTagById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限渲染 -->
                    <el-tag
                      type="warning"
                      v-for="(item3, v3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTagById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialog" width="50%" @close="sightsClosed">
      <!-- 树形结构展示 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 设置权限管理的显示和隐藏
      setRightsDialog: false,
      // 权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认被选中的节点id值数组
      defKeys: [],
      rolesId: "",
    };
  },
  created() {
    // 获取角色列表
    this.getRolesList();
  },
  methods: {
    // 发起网络请求，获取权限列表
    async getRolesList() {
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败！");
      }
      this.rolesList = res.data;
    },
    async removeTagById(role, rightId) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消了删除！");
      }
      // 发起网络请求。删除角色权限
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        this.$message.error("删除权限失败！");
      }
      this.$message.success("删除成功！");
      role.children = res.data;
    },
    async showRightsDialog(role) {
      this.rolesId = role.id;
      // 发起网络请求，获取所有权限列表
      const { data: res } = await this.$axios.get("rights/tree ");
      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败！");
      }
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setRightsDialog = true;
    },
    // 通过递归的方式，获取角色的三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果不包含children属性，则为三级权限
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    sightsClosed() {
      this.defKeys = [];
    },
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      // 发起角色分配权限的网络请求
      const {
        data: res,
      } = await this.$axios.post(`roles/${this.rolesId}/rights`, {
        rids: idStr,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightsDialog = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.rowTop {
  border-top: 1px solid #eee;
}

.rowBottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>