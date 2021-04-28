<template>
  <Navbar />
  <main>
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <transition
          :name="route.meta.transition || 'fade'"
          appear
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </keep-alive>
    </router-view>
  </main>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  components: { Navbar }
}
</script>

<style>
.slide-right-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all .3s linear;
}
.slide-right-leave-to,
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
</style>
