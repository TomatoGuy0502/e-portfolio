<template>
  <nav class="navbar">
    <h1 class="navbar__brand">
      <a href="/" class="navbar__brand__link">E-portfolio</a>
    </h1>
    <ul class="navbar__links">
      <li>
        <router-link class="navbar__links__link tab-link" :to="{ name: 'Experience' }">
          學習歷程
        </router-link>
      </li>
      <li>
        <router-link class="navbar__links__link tab-link" :to="{ name: 'Portfolio' }">
          Portfolio
        </router-link>
      </li>
      <li>
        <a class="navbar__links__link tab-link" @click="handleLogout">
          登出
        </a>
      </li>
    </ul>
    <ConfirmModal
      v-if="showConfirmModal"
      message="確定要登出？"
      confirmMessage="登出"
      confirmType="customize"
      @confirm="logout"
      @cancel="showConfirmModal = false"
    />
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  name: 'Navbar',
  components: {
    ConfirmModal
  },
  setup () {
    const store = useStore()
    const logout = () => store.dispatch('auth/logout')

    const showConfirmModal = ref(false)
    const handleLogout = () => {
      showConfirmModal.value = true
    }

    return { showConfirmModal, logout, handleLogout }
  }
}
</script>

<style lang="scss">
@import '~@/scss/variables';
@import '~@/scss/mixins';

.navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $navbar-height;
  padding: 2px 24px 0;
  box-shadow: 0 2px 5px rgba(255, 155, 160, 0.1), 2px 2px 15px 0px rgba(255, 155, 160, 0.15);
  background-color: #fff;
  z-index: 10;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: $red;
  }
}

.navbar__brand {
  margin: 0;
  &__link {
    display: block;
    height: 40px;
    width: 200px;
    background-image: url('../assets/brand_icon.svg');
    text-indent: 101%;
    overflow: hidden;
  }
}

.navbar__links {
  @include grid(column, 0, 10px);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 767px) {
  .navbar__links__link[href='/portfolio'] {
    display: none;
  }
}
</style>
