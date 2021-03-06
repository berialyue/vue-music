<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll
        class="shortcut"
        ref="shortcut"
        :data="shortcut"
        :refreshDelay="refreshDelay"
      >
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.first)"
                class="item"
                v-for="(item, index) in hotKey"
                :key="index">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteOne"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest
        :query="query"
        @listScroll="blurInput"
        @select="saveSearch"
        ref="suggest"
      ></suggest>
    </div>
    <confirm
      ref="confirm"
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="deleteAll">
    </confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from 'base/searchBox/searchBox'
import suggest from 'components/suggest/suggest'
import searchAPI from 'api/search'
import {mapActions} from 'vuex'
import searchList from 'base/searchList/searchList'
import confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playListMixin, searchMixin} from 'common/js/mixin'

export default {
  name: 'search',
  data() {
    return {
      hotKey: []
    }
  },
  created() {
    this.getHotSearch()
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  mixins: [
    playListMixin,
    searchMixin
  ],
  methods: {
    getHotSearch() {
      searchAPI.getHotSearch().then(res => {
        if (res.data.code === 200) {
          this.hotKey = res.data.result.hots
          console.log(this.hotKey)
        }
      })
    },
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    deleteAll() {
      this.clearSearchHistory()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        })
      }
    }
  },
  components: {
    searchBox,
    suggest,
    searchList,
    confirm,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
