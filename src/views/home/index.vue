<script setup lang="ts">
defineOptions({ name: 'HomePage' });
</script>

<template>
  <section class="home-page">
    <div class="home-page__hero">
      <p class="home-page__eyebrow">WEB ELE</p>
      <h1 class="home-page__title">后台框架已精简完成</h1>
      <p class="home-page__description">
        当前项目只保留了最小可用后台框架、账号密码登录和登录后的基础工作台。
      </p>
    </div>
    <div class="home-page__cards">
      <div class="home-page__card">
        <h2>登录方式</h2>
        <p>仅保留账号密码登录，已去掉验证码、短信、二维码和第三方登录。</p>
      </div>
      <div class="home-page__card">
        <h2>运行形态</h2>
        <p>已去掉国际化、时区和 demo/mock 业务链路，路由为静态最小集合。</p>
      </div>
      <div class="home-page__card">
        <h2>后续扩展</h2>
        <p>你可以在当前框架页基础上继续添加菜单、页面和真实接口。</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  display: grid;
  gap: 24px;
}

.home-page__hero,
.home-page__card {
  border: 1px solid rgb(15 23 42 / 8%);
  border-radius: 20px;
  background: rgb(255 255 255 / 88%);
  box-shadow: 0 18px 50px rgb(15 23 42 / 8%);
  padding: 24px;
}

.home-page__eyebrow {
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  margin: 0 0 12px;
}

.home-page__title {
  color: #0f172a;
  font-size: 32px;
  line-height: 1.15;
  margin: 0 0 12px;
}

.home-page__description,
.home-page__card p {
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.home-page__cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.home-page__card h2 {
  color: #0f172a;
  font-size: 18px;
  margin: 0 0 10px;
}
</style>
