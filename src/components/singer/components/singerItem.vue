<template>
  <div class="singerItem" ref='singer'>
    <list-view
      @select="selectSinger"
      :data="singers"
      ref="singerList"
    ></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import api from '../../../api/singer.js'
import Singer from 'common/js/singer'
import getFirstLetter from 'common/js/getFirstLetter.js'
import ListView from 'base/listView/listView'
import {playListMixin} from 'common/js/mixin'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const OTHER_NAME = '其他'
const HOT_SINGER_LEN = 10

export default {
  name: 'singerItem',
  data() {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  mixins: [playListMixin],
  props: {
    cat: {
      type: Number
    },
    limit: {
      type: Number
    }
  },
  created() {
    this.getSingerList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/list/${singer.id}`
      })
      this.setSinger(singer)
    },
    getSingerList() {
      api.getSingerList(this.cat, this.limit).then((res) => {
        if (res.data.code === 200) {
          this.singers = this.normalizeSinger(res.data.artists)
        }
      })
    },
    normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.picUrl
          }))
        }
        const key = getFirstLetter(item.name)
        if (key === 'other') {
          if (!map[key]) {
            map[key] = {
              title: OTHER_NAME,
              items: []
            }
          }
        } else {
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
        }
        map[key].items.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.picUrl
        }))
      })
      // 处理map，得到有序列表
      let hot = []
      let other = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        } else if (val.title === OTHER_NAME) {
          other.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      this.sortListContent(ret)
      this.sortListContent(other)
      return hot.concat(ret, other)
    },
    sortListContent(list) {
      list.forEach((item, index) => {
        item.items.sort((a, b) => {
          return a.name.charCodeAt(0) - b.name.charCodeAt(0)
        })
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGERS'
    })
  }
}
</script>

<style lang="stylus" scoped>
.singerItem
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
