<template>
  <div class="dashboard-container">
    <div class="search">
      <search label="型号查询" @search="searchByInnerCode" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    searchByInnerCode(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  display: flex;
  align-items: center;
  height: 64px;
  margin-bottom: 20px;
  padding-left: 17px;
  background-color: #fff;

}
</style>
