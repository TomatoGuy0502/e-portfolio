<template>
  <li class="experience-list-item">
    <h4 class="experience-list-item__title">
      {{ experience.name }}
    </h4>
    <ul class="experience-list-item__tags">
      <li v-for="tag in experience.tags" :key="tag.id" class="tag">
        {{ tag.name }}
      </li>
    </ul>
    <div class="experience-list-item__btns">
      <button class="experience-list-item__btns__edit btn-pill" @click.stop="handleEditExperience">
        <PencilAltIcon />
        <span class="btn-pill__text">編輯</span>
      </button>
      <!-- TODO:  寫死的資料改掉-->
      <button
        class="experience-list-item__btns__delete btn-pill"
        :class="{ disabled: false }"
        :disabled="false"
        @click.stop="confirmDelete"
      >
        <TrashIcon />
        <span class="btn-pill__text">刪除</span>
      </button>
    </div>
    <ConfirmModal v-if="showConfirmModal" :message="experience.name" confirm-type="delete" @cancel="closeConfirmModal">
      <button v-show="!deleteStatus.isPending" class="btn" @click.stop="closeConfirmModal">
        取消
      </button>
      <button class="btn--red" :disabled="deleteStatus.isPending" @click.stop="handleDeleteExperience">
        {{ deleteStatus.isPending ? '刪除中' : '確定刪除' }}
      </button>
    </ConfirmModal>
  </li>
</template>

<script>
import ConfirmModal from '@/components/ConfirmModal'
import { deleteExperience } from '@/api/experiences'
import { PencilAltIcon, TrashIcon } from '@heroicons/vue/outline'
import { useDeleteModal } from '@/composables/useDeleteModal'

export default {
  components: {
    ConfirmModal,
    PencilAltIcon,
    TrashIcon
  },
  props: {
    experience: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  emits: ['delete', 'edit'],
  setup (props, { emit }) {
    // === 刪除經歷 ===
    const { showConfirmModal, deleteStatus, closeConfirmModal, confirmDelete } = useDeleteModal()
    // TODO: 用vuex去處理
    const handleDeleteExperience = async () => {
      try {
        deleteStatus.isPending = true
        deleteStatus.error = null
        await deleteExperience(props.experience.id)
        showConfirmModal.value = false
        emit('delete')
      } catch (error) {
        deleteStatus.error = error
      } finally {
        deleteStatus.isPending = false
      }
    }

    const handleEditExperience = async () => {
      emit('edit', props.experience.id)
    }

    return {
      showConfirmModal,
      closeConfirmModal,
      confirmDelete,
      deleteStatus,
      handleDeleteExperience,
      handleEditExperience
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';
@import '~@/scss/mixins';

.experience-list-item {
  display: flex;
  align-items: center;
  gap: 0 10px;
  padding: 10px 5px 10px 10px;
  border-radius: 5px;
  transition: background 0.3s;
  &:hover {
    background-color: #f8f8f8;
  }
  &__title {
    font-weight: $weight-medium;
    flex-shrink: 0;
    max-width: 200px;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  &__btns {
    @include grid(column, 0, 10px);
    margin-left: auto;
    flex-shrink: 0;
    &__edit {
      color: $gray-2;
      background-color: #fff;
    }
    &__delete {
      color: #fff;
      background-color: $gray-2;
      &.disabled {
        background-color: $gray-4;
        border: 1px solid $gray-4;
      }
    }
  }
}

@media (max-width: 767px) {
  .experience-list-item__tags {
    display: none;
  }
  .btn-pill__text {
    display: none;
  }
}
</style>
