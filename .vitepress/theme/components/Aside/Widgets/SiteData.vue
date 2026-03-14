<!-- 侧边栏 - 站点数据 -->
<template>
  <div class="site-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">站点数据</span>
    </div>
    <div class="all-data">
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-article"></i>
          文章总数
        </span>
        <span class="num">{{ theme.postData?.length || 0 }} 篇</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-date"></i>
          建站天数
        </span>
        <span class="num">{{ daysFromNow(theme.since) }} 天</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-visibility"></i>
          总访问量
        </span>
        <span class="num">{{ statisticsData?.["总访问量"] || 0 }} 次</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-account"></i>
          今日访问
        </span>
        <span class="num">{{ statisticsData?.["今日访问"] || 0 }} 次</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStatistics } from "@/api";
import { daysFromNow } from "@/utils/helper";

const { theme } = useData();
const statisticsData = ref(null);

const getStatisticsData = async () => {
  if (theme.value.tongji?.["51la"]) {
    const result = await getStatistics(theme.value.tongji["51la"]);
    statisticsData.value = result;
  }
};

onMounted(() => {
  getStatisticsData();
});
</script>

<style lang="scss" scoped>
.site-data {
  .all-data {
    .data-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.2rem;
      .name {
        display: flex;
        flex-direction: row;
        align-items: center;
        .iconfont {
          margin-right: 8px;
          opacity: 0.6;
          font-size: 18px;
        }
      }
      .num {
        opacity: 0.8;
        font-size: 15px;
      }
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
}
</style>
