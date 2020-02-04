# vue-simple-showmore

<a href="https://www.npmjs.com/package/vue-simple-showmore"><img src="https://img.shields.io/npm/v/vue-simple-showmore.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/vue-simple-showmore"><img src="https://img.shields.io/npm/l/vue-simple-showmore.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vue-simple-showmore"><img src="https://img.shields.io/npm/dm/vue-simple-showmore.svg" alt="Downloads"></a>

Show more content in the paragraph with mutiple lines.

## 安装

```
yarn add vue-simple-showmore
```

## 使用

```
import Vue from 'vue'
import VueShowMore from 'vue-simple-showmore'

Vue.use(VueShowMore)

<VueShowMore :text="list" :btns="['...Show More', 'Hide']" />

```

## 属性

- text: 需要收合的段落文字
- lines: 展示的文字行数 超过该行数则展示收合按钮 默认3行 (注：空行不算入实际文字行数)
- maxLines: 针对输入空行情况 允许设置最大行数 最大行数会将空行纳入计算
- type: expand | toggle  默认 expand，则点击后不会有收起按钮
- animate: 是否支持收合动画 默认 false
- btns: 收合按钮文案 传入数组 默认 ['...展开', '收起']
- btnColor: 按钮颜色 暂不对展开和收起按钮做颜色区分

## 其他

 支持在段落前插入插槽 插槽命名 before 即可 

 example: 

```
  <VueShowMore :text="回复chance722的一段话..." :btns="['...Show More', 'Hide']">
    <span slot="before" class="remind">@chance722</span>
  </VueShowMore>
```

  输出 `@chance722 回复chance722的一段话`

## Demo

- [https://chance722.github.io/vue-showmore-demo/](https://chance722.github.io/vue-showmore-demo/)