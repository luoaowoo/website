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
        <span class="num">
          <span id="busuanzi_value_site_pv">0</span> 次
        </span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-account"></i>
          今日访问
        </span>
        <span class="num">
          <span id="busuanzi_value_site_uv">0</span> 人
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { daysFromNow } from "@/utils/helper";

const { theme } = useData();

// 加载卜算子脚本
const loadBusuanzi = () => {
  // 如果已经加载过，不再重复加载
  if (document.getElementById('busuanzi-script')) {
    // 重新初始化卜算子
    if (window.busuanzi) {
      window.busuanzi.reload();
    }
    return;
  }
  
  const script = document.createElement('script');
  script.id = 'busuanzi-script';
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

onMounted(() => {
  loadBusuanzi();
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
