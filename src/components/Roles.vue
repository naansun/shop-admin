<template>
  <div>
    <!-- 面包屑   路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="btn" @click="showRoles">添加角色</el-button>
    <!-- 表格区域 -->
    <el-table :data="RolesList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-show="row.children.length===0">暂无数据~~</span>
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag type="primary" closable @close="delRights(row,l1.id)">{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRights(row,l2.id)">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    type="danger"
                    class="l3"
                    closable
                    @close="delRights(row,l3.id)"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="30px"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delRole(row.id)"></el-button>
          <el-button
            type="success"
            round
            icon="el-icon-check"
            plain
            size="mini"
            @click="show(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限  对话框 -->
    <el-dialog title="分配权限" :visible.sync="showRights" width="40%">
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRights = false">取 消</el-button>
        <el-button type="primary" @click="updateRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="showAdd" width="50%">
      <el-form :model="dataForm" :rules="rules" ref="form" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="authName">
          <el-input v-model="dataForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="dataForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      showRights: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      showAdd: false,
      dataForm: {
        authName: '',
        desc: ''
      },
      rules: {
        authName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRolesList() {
      let res = await this.axios.get('roles')
      console.log(res)
      if (res.meta.status === 200) {
        this.RolesList = res.data
      }
    },
    // 删除权限
    async delRights(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status === 200) {
        // 删除成功
        role.children = res.data
        this.$message.success('删除权限成功了~')
      }
    },
    // 显示对话框
    async show(role) {
      this.roleId = role.id
      this.showRights = true
      let res = await this.axios.get('rights/tree')
      this.rightList = res.data
      let ids = []
      role.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    // 修改权限
    async updateRight() {
      // 获取分配的权限
      // 对话框隐藏
      // 重新渲染
      let rids = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      if (res.meta.status === 200) {
        this.showRights = false
        this.getRolesList()
      }
    },
    // 删除角色
    async delRole(id) {
      try {
        await this.$confirm('您确定要删除这个角色吗？', '温馨提示', { type: 'warning' })
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.getRolesList()
          this.$message.success('删除角色成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 显示添加角色对话框
    showRoles() {
      this.showAdd = true
    },
    // 添加角色
    async addRoles() {
      try {
        await this.$refs.form.validate()
        let res = await this.axios.post('roles', {
          roleName: this.dataForm.authName,
          roleDesc: this.dataForm.desc
        })
        if (res.meta.status === 201) {
          this.showAdd = false
          this.$refs.form.resetFields()
          this.getRolesList()
          this.$message.success('添加角色成功')
        }
      } catch (e) {
        return false
      }
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang='less' scoped>
.btn {
  margin-bottom: 10px;
}
.l1 {
  margin-bottom: 10px;
}
.l3 {
  margin-right: 6px;
  margin-bottom: 10px;
}
</style>
