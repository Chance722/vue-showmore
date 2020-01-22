<template>
  <div
    ref="vueShowMore"
    class="vue-showmore"
    :class="{'fold': isFold, 'animate': animate}">
    <slot name="before" />
    <span v-html="htmlText" />
    <span
      v-if="isShowMore"
      class="showmore"
      :style="{'color': btnColor}"
      @click="showHandler">{{ isFold ? btns[0] : btns[1] }}</span>
  </div>
</template>

<script>
export default {
  name: 'VueShowMore',
  props: {
    text: {
      type: String,
      default: '',
    },
    lines: {
      type: Number,
      default: 3,
    },
    maxLines: {
      type: Number,
      default: 5,
    },
    type: {
      type: String,
      default: 'expand',
    },
    animate: {
      type: Boolean,
      default: false,
    },
    btns: {
      type: Array,
      default: () => ['...展开', '收起'],
    },
    btnColor: {
      type: String,
      default: '#808080',
    },
  },
  data () {
    return {
      isFold: false,
      htmlText: '',
      totalLines: 0,
      finalLines: 0,
      lineHeight: 0,
      totalHeight: 0,
    }
  },
  computed: {
    isShowMore () {
      if (this.totalLines <= this.lines || this.finalLines === this.totalLines) return false
      return this.isFold || (!this.isFold && this.type === 'toggle')
    },
  },
  watch: {
    text () {
      this.init()
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.clearStatus()
      this.initText()
      this.$nextTick(() => {
        this.computeLines()
        this.setMaxHeight()
      })
    },
    clearStatus () {
      this.$refs.vueShowMore.removeAttribute('style')
    },
    initText () {
      let htmlText = this.text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
      this.htmlText = this.replaceUselessBr(htmlText)
    },
    replaceUselessBr (str) {
      if (str.indexOf('<br>') === 0) {
        return this.replaceUselessBr(str.replace('<br>', ''))
      }
      return str
    },
    computeLines () {
      const styles = window.getComputedStyle(this.$refs.vueShowMore, null)
      this.lineHeight = parseInt(styles.lineHeight, 10)
      this.totalHeight = parseInt(styles.height, 10)
      this.totalLines = Math.round(this.totalHeight / this.lineHeight)
    },
    setMaxHeight () {
      if (this.totalLines < this.lines) return
      const htmlArray = this.htmlText.split('<br>')
      this.finalLines = this.lines
      if (htmlArray.length > 1) {
        let contentLines = 0
        for (let i = 0; i < htmlArray.length; i++) {
          if (contentLines === this.lines) break
          htmlArray[i] ? contentLines++ : this.finalLines++
        }
      }
      // 控制最多行数
      let finalLines = this.finalLines <= this.maxLines ? this.finalLines : this.maxLines
      this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.lineHeight * finalLines}px`)
      this.isFold = true
    },
    showHandler () {
      if (this.isFold) {
        this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.totalHeight}px`)
        this.isFold = false
      } else {
        this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.lineHeight * this.finalLines}px`)
        this.isFold = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.vue-showmore {
  position: relative;

  &.animate {
    transition: all ease .3s;
  }

  &.fold {
    overflow: hidden;
  }

  .showmore {
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
    background: #fff;
    background: linear-gradient(to right,rgba(255,255,255,0),#fff, 1em);
  }
}
</style>
