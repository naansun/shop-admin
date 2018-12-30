<template>
  <div>
    <!-- 面包屑   路径导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <el-table :data="RightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template slot-scope="{row}">
          <span v-if="row.level==='0'">一级</span>
          <span v-else-if="row.level==='1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RightList: []
    }
  },
  methods: {
    async getRightList() {
      let res = await this.axios.get(`rights/list`)
      console.log(res)
      if (res.meta.status === 200) {
        this.RightList = res.data
      }
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style lang="less">
</style>
