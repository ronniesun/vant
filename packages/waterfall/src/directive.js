import Utils from './utils.js';

const CONTEXT = '@@Waterfall';
const OFFSET = 300;

// 绑定事件到元素上
// 读取基本的控制变量
function doBindEvent() {
  this.scrollEventListener = Utils.debounce(handleScrollEvent.bind(this), 200);
  this.scrollEventTarget = Utils.getScrollEventTarget(this.el);

  var disabledExpr = this.el.getAttribute('waterfall-disabled');
  var disabled = false;
  if (disabledExpr) {
    this.vm.$watch(disabledExpr, (value) => {
      this.disabled = value;
    });
    disabled = Boolean(this.vm[disabledExpr]);
  }
  this.disabled = disabled;

  var offset = this.el.getAttribute('waterfall-offset');
  this.offset = Number(offset) || OFFSET;

  this.scrollEventTarget.addEventListener('scroll', this.scrollEventListener);

  this.scrollEventListener();
}

// 处理滚动函数
function handleScrollEvent() {
  let element = this.el;
  let scrollEventTarget = this.scrollEventTarget;

  // 已被禁止的滚动处理
  if (this.disabled) return;

  let targetScrollTop = Utils.getScrollTop(scrollEventTarget);
  let targetBottom = targetScrollTop + Utils.getVisibleHeight(scrollEventTarget);

  // 判断是否到了底
  let needLoadMoreToLower = false;
  if (element === scrollEventTarget) {
    needLoadMoreToLower = scrollEventTarget.scollHeight - targetBottom < this.offset;
  } else {
    let elementBottom = Utils.getElementTop(element) - Utils.getElementTop(scrollEventTarget) + Utils.getVisibleHeight(element);
    needLoadMoreToLower = elementBottom - Utils.getVisibleHeight(scrollEventTarget) < this.offset;
  }
  if (needLoadMoreToLower) {
    this.cb['lower'] && this.cb['lower']({ target: scrollEventTarget, top: targetScrollTop });
  }

  // 判断是否到了顶
  let needLoadMoreToUpper = false;
  if (element === scrollEventTarget) {
    needLoadMoreToUpper = targetScrollTop < this.offset;
  } else {
    let elementTop = Utils.getElementTop(element) - Utils.getElementTop(scrollEventTarget);
    needLoadMoreToUpper = elementTop + this.offset > 0;
  }
  if (needLoadMoreToUpper) {
    this.cb['upper'] && this.cb['upper']({ target: scrollEventTarget, top: targetScrollTop });
  }
}

export default function(type) {
  return {
    bind(el, binding, vnode) {
      if (!el[CONTEXT]) {
        el[CONTEXT] = {
          el,
          vm: vnode.context,
          cb: {}
        };
      }
      el[CONTEXT].cb[type] = binding.value;

      vnode.context.$on('hook:mounted', function() {
        if (Utils.isAttached(el)) {
          doBindEvent.call(el[CONTEXT]);
        }
      });
    },

    update(el) {
      el[CONTEXT].scrollEventListener();
    },

    unbind(el) {
      const context = el[CONTEXT];
      context.scrollEventTarget.removeEventListener('scroll', context.scrollEventListener);
    }
  };
};