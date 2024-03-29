<template>
  <div class="portfolio__menu">
    <div class="portfolio__menu__header">
      <span>經驗列表</span>
      <div class="filter-btn" @click="showFilter = !showFilter">
        <svg viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.33333 7.42857C4.33333 7.27702 4.3904 7.13167 4.49198 7.02451C4.59357 6.91735 4.73134 6.85714 4.875 6.85714H8.125C8.26866 6.85714 8.40644 6.91735 8.50802 7.02451C8.6096 7.13167 8.66667 7.27702 8.66667 7.42857C8.66667 7.58012 8.6096 7.72547 8.50802 7.83263C8.40644 7.9398 8.26866 8 8.125 8H4.875C4.73134 8 4.59357 7.9398 4.49198 7.83263C4.3904 7.72547 4.33333 7.58012 4.33333 7.42857ZM2.16667 4C2.16667 3.84845 2.22374 3.7031 2.32532 3.59594C2.4269 3.48878 2.56467 3.42857 2.70833 3.42857H10.2917C10.4353 3.42857 10.5731 3.48878 10.6747 3.59594C10.7763 3.7031 10.8333 3.84845 10.8333 4C10.8333 4.15155 10.7763 4.2969 10.6747 4.40406C10.5731 4.51122 10.4353 4.57143 10.2917 4.57143H2.70833C2.56467 4.57143 2.4269 4.51122 2.32532 4.40406C2.22374 4.2969 2.16667 4.15155 2.16667 4ZM0 0.571429C0 0.419876 0.0570684 0.274531 0.158651 0.167368C0.260233 0.060204 0.398008 0 0.541667 0H12.4583C12.602 0 12.7398 0.060204 12.8414 0.167368C12.9429 0.274531 13 0.419876 13 0.571429C13 0.722981 12.9429 0.868326 12.8414 0.975489C12.7398 1.08265 12.602 1.14286 12.4583 1.14286H0.541667C0.398008 1.14286 0.260233 1.08265 0.158651 0.975489C0.0570684 0.868326 0 0.722981 0 0.571429Z"
            fill="#4F4F4F"
          />
        </svg>
      </div>
    </div>
    <MenuFilter
      v-show="showFilter"
      :filter="filter"
      @toggle-semester="toggleSemester"
      @toggle-tag="toggleTag"
      @toggle-type="toggleType"
      @select-all-tags="changeAllTags(true)"
      @un-select-all-tags="changeAllTags(false)"
    />
    <div ref="MenuShadowContainer" class="shadow-container" @scroll.capture="setShadows">
      <ul class="portfolio__menu__body">
        <draggable
          v-model="filteredExperienceArray"
          v-bind="draggableOptions"
          item-key="id"
        >
          <template #item="{ element }">
            <MenuCard :experience="element" />
          </template>
        </draggable>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, watchEffect, watch, computed } from 'vue'
import { useStore } from 'vuex'
import useScrollShadow from '@/composables/useScrollShadow'
import MenuFilter from '@/components/Portfolio/MenuFilter'
import MenuCard from '@/components/Portfolio/MenuCard'
import draggable from 'vuedraggable'
import { ExperienceTypes } from '@/config'

export default {
  name: 'PortfolioMenu',
  components: {
    draggable,
    MenuFilter,
    MenuCard
  },
  setup () {
    const store = useStore()

    const draggableOptions = {
      group: { name: 'experience', pull: 'clone', put: false },
      sort: false
    }

    // === 切換filter顯示 ===
    const showFilter = ref(true)

    // === 經驗列表 ===
    const experiencesArray = computed(() => store.getters['experiences/experiencesArray'])
    const semesters = computed(() => store.getters['experiences/semesters'])
    const tags = computed(() => store.getters['experiences/tags'])

    // 初始化filter
    const filter = reactive({
      semesters: {},
      tags: {},
      types: ExperienceTypes.reduce((obj, type) => ({ ...obj, [type]: true }), {})
    })
    watchEffect(() => {
      filter.semesters = semesters.value.reduce((obj, semester) => {
        return { ...obj, [semester]: true }
      }, {})
    })
    watchEffect(() => {
      filter.tags = tags.value.reduce((obj, tag) => ({ ...obj, [tag.name]: false }), {})
    })

    const someSemesterSelected = computed(() =>
      Object.keys(filter.semesters).some(key => filter.semesters[key] === true)
    )
    const someTagSelected = computed(() => Object.keys(filter.tags).some(key => filter.tags[key] === true))
    const someTypeSelected = computed(() => Object.keys(filter.types).some(key => filter.types[key] === true))

    const filteredExperienceArray = computed(() => {
      return experiencesArray.value.filter(experience => {
        // 如果學期都沒選，就不篩選
        if (someSemesterSelected.value) {
          for (const key in filter.semesters) {
            if (!filter.semesters[key] && experience.semester === key) {
              return false
            }
          }
        }
        // 如果類別都沒選，就不篩選
        if (someTypeSelected.value) {
          for (const key in filter.types) {
            if (!filter.types[key] && experience.type === key) {
              return false
            }
          }
        }
        // 如果 Tag 都沒選，就不篩選
        if (!someTagSelected.value) return true
        for (const key in filter.tags) {
          if (filter.tags[key] && experience.tags.some(tag => tag.name === key)) {
            return true
          }
        }
        return false
      })
    })

    // === 設定滾動容器的陰影 ===
    const { setShadows, initShadows } = useScrollShadow()
    const MenuShadowContainer = ref(null)
    // 列表開合時檢測是否加上列表陰影
    onMounted(() => {
      watch([showFilter, filteredExperienceArray], () => {
        requestAnimationFrame(() => initShadows(MenuShadowContainer.value))
      })
    })

    // === 打勾/取消篩選 ===
    const toggleSemester = semester => {
      filter.semesters[semester] = !filter.semesters[semester]
    }
    const toggleTag = tag => {
      filter.tags[tag] = !filter.tags[tag]
    }
    const toggleType = type => {
      filter.types[type] = !filter.types[type]
    }
    const changeAllTags = toStatus => {
      for (const tag in filter.tags) {
        filter.tags[tag] = toStatus
      }
    }

    return {
      draggableOptions,
      showFilter,
      experiencesArray,
      tags,
      filteredExperienceArray,
      filter,
      setShadows,
      MenuShadowContainer,
      toggleSemester,
      toggleTag,
      toggleType,
      changeAllTags
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

.portfolio__menu {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
  margin: 26px 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 30px rgba(241, 90, 96, 0.05), 0px 0px 25px rgba(241, 90, 96, 0.1);
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: $gray-1;
  }
  &__body {
    border-radius: 5px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.filter-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 5px;
  cursor: pointer;
}

.shadow-container {
  &::before {
    border-radius: 5px 5px 0 0;
  }
  &::after {
    border-radius: 0 0 5px 5px;
  }
}
</style>
