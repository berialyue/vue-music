<template>
  <div class="hot" ref="hot">
    <scroll ref="scroll" class="hot-content" :data="songSheet">
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <swiper
            :options="swiperOption"
            ref="mySwiper">
            <!-- slides -->
            <swiper-slide
              v-for="(item, index) of banners"
              :key="index">
              <a :href="item.url">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <!-- <button
          class="button"
          @click="startPlay"
        >开始</button> -->
        <!-- <button class="button" @click="stopPlay">停止</button> -->
        <div class="hot-list">
          <h1 class="list-title">热门歌单</h1>
          <ul>
            <li
              v-for="(item,index) in songSheet"
              :key="index"
              class="item"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img v-lazy="item.coverImgUrl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songSheet.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import api from 'api/hot.js'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'hot',
  data() {
    return {
      banners: [],
      swiperOption: {
        notNextTick: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        loop: true,
        observeParents: true
      },
      songSheet: [],
      checkLoaded: false
    }
  },
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading
  },
  created() {
    this.getBanner()
    this.getPersonalized()
    this.getSongSheet()
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    getBanner() {
      api.getBannerResource().then((res) => {
        if (res.data.code === 200) {
          this.banners = res.data.banners
        }
      })
    },
    getPersonalized() {
      api.getPersonalizedResource().then((res) => {
        if (res.data.code === 200) {
          console.log(res)
          console.log(res.data)
        }
      })
    },
    getSongSheet() {
      api.getSongSheet(10, 'hot').then((res) => {
        if (res.data.code === 200) {
          console.log(res)
          console.log(res.data)
          this.songSheet = res.data.playlists
        }
      })
    },
    selectItem(item) {
      console.log(item)
      this.$router.push({
        path: `/hot/${item.id}`
      })
      this.setSongSheet(item)
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.hot.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setSongSheet: 'SET_SONGSHEET'
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .slider-wrapper >>> .swiper-pagination-bullet-active
    background: #ffffff
  .hot
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .hot-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-bottom: 46%
        overflow: hidden
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
      .hot-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
.img
 width: 100%
.button
  background: #ffffff
  color:#000
</style>
