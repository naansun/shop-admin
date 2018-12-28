<template>
  <div class="user">
    <!-- 面包屑   路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="selectfn"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAdd">用户添加</el-button>
    <!-- 表格组件 -->
    <el-table :data="userlist" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updatefn(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            plain
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="showEdit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delfn(scope.row.id)"
          ></el-button>
          <el-button type="success" plain icon="el-icon-check" size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="this.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
    ></el-pagination>
    <!-- 用户添加对话框 -->
    <el-dialog title="添加用户" :visible="showAddModal" width="40%" :before-close="handleClose">
      <el-form :model="userMessage" label-width="80px" ref="form" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userMessage.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userMessage.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="userMessage.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户编辑对话框 -->
    <el-dialog title="修改用户" :visible="showEditModal" width="40%" :before-close="handleClose">
      <el-form :model="editMessage" label-width="80px" ref="form" :rules="rules" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{editMessage.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editMessage.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditModal = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userlist: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      showAddModal: false,
      showEditModal: false,
      userMessage: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editMessage: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12个字符', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入合法的邮箱格式', type: 'email', trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入合法的手机格式', pattern: /^1[3-9]\d{9}$/, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getuserList()
  },
  methods: {
    getuserList() {
      this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        if (res.meta.status === 200) {
          // 说明响应成功
          this.userlist = res.data.users
          this.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getuserList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getuserList()
    },
    // 删除功能
    delfn(id) {
      this.$confirm('你确定要删除吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.axios({
          method: 'delete',
          url: 'users/' + id,
          data: {
            id: id
          }
        }).then((res) => {
          if (res.meta.status === 200) {
            if (this.userlist.length === 1 && this.pagenum > 1) {
              this.pagenum--
            }
            this.$message.success('删除成功')
            this.getuserList()
          }
        })
      }).catch(() => {
        // 点击取消
        this.$message.info('取消删除')
      })
    },
    // 查询
    selectfn() {
      this.pagenum = 1
      this.getuserList()
    },
    // 更新状态
    updatefn(info) {
      console.log(info)
      this.axios({
        method: 'put',
        url: 'users/' + info.id + '/' + 'state/' + info.mg_state
      }).then((res) => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('状态修改成功了~')
        } else {
          this.$message.error('状态修改失败')
        }
      })
    },
    // 显示对话框
    showAdd() {
      this.showAddModal = true
    },
    handleClose() {
      this.showAddModal = false
      this.showEditModal = false
    },
    // 添加功能
    addUsers() {
      // 当添加时对表单进行验证
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        // 验证成功 发送ajax请求
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: {
            username: this.userMessage.username,
            password: this.userMessage.password,
            email: this.userMessage.email,
            mobile: this.userMessage.mobile
          }
        })
        if (res.meta.status === 201) {
          this.showAddModal = false
          this.$refs.form.resetFields()
          // 显示最后一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getuserList()
          this.$message.success('用户添加成功')
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    // 显示编辑对话框
    showEdit(user) {
      this.showEditModal = true
      this.editMessage.username = user.username
      this.editMessage.email = user.email
      this.editMessage.mobile = user.mobile
      this.editMessage.id = user.id
    },
    edit() {
      // 表单校验
      this.$refs.form.validate(valid => {
        if (!valid) return false
        // 发送ajax请求
        this.axios({
          method: 'put',
          url: `users/${this.editMessage.id}`,
          data: this.editMessage
        }).then(res => {
          if (res.meta.status === 200) {
            this.$refs.form.resetFields()
            this.showEditModal = false
            this.getuserList()
            this.$message.success('修改用户信息成功')
          } else {
            this.$message.error(res.meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb {
  height: 30px;
}
.input-with-select {
  margin-bottom: 10px;
  width: 400px;
}
.el-table {
  margin-bottom: 10px;
}
</style>
