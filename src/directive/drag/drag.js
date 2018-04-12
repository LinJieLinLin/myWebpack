/**
eg: drag="title"只对title元素有效，为空则对整个元素有效,默认drag的元素position应为absolute or fixed;
<div drag="title" class="drag-1">
    <div class="title">我是title</div>
    <div>我是body</div>
 </div>
 */
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
DIR.directive('drag', function($document) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            // 鼠标移动x
            let mouseX = 0,
                // 鼠标移动y
                mouseY = 0,
                // 移动x距离
                moveX = 0,
                // 移动y距离
                moveY = 0,
                // 要移动的元素
                dragElement = element,
                // 元素的位置top,left
                elementTL = {},
                // 元素的position属性
                position = element.css('position'),
                // 窗口宽高
                windowSize = {},
                // 元素宽高
                elementSize = {},
                // 元素父元素宽高
                parentSize = {};

            function init() {
                element.css({ '-webkit-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', 'user-select': 'none' });
                if (position === 'static' || !position) {
                    console.log(position);
                    attr.position = 'absolute';
                    position = 'absolute';
                    dragElement.css({ 'position': 'absolute', 'left': 0, 'top': 0 });
                }
                if (attr.drag) {
                    let temElement = $(element).find('.' + attr.drag);
                    if (temElement.length) {
                        dragElement = temElement;
                    }
                }
                dragElement.css({
                    cursor: 'all-scroll'
                });
                dragElement.on('mousedown', function(event) {
                    elementTL = element.position();
                    event.preventDefault();
                    if (position === 'fixed') {
                        mouseX = event.clientX;
                        mouseY = event.clientY;
                        windowSize.width = angular.element(window).width();
                        windowSize.height = angular.element(window).height();
                    } else if (position === 'absolute') {
                        mouseX = event.pageX;
                        mouseY = event.pageY;
                        parentSize.height = $(element).parent()[0].clientHeight;
                        parentSize.width = $(element).parent()[0].clientWidth;
                    }
                    elementSize.width = element[0].clientWidth;
                    elementSize.height = element[0].clientHeight;
                    if (windowSize.height - elementSize.height < 0) {
                        element.css('min-height', windowSize.height + 'px');
                    }
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
            }

            function mousemove(event) {
                let left, top, x, y, temSize;
                if (position === 'fixed') {
                    x = event.clientX;
                    y = event.clientY;
                    temSize = windowSize;
                } else {
                    x = event.pageX;
                    y = event.pageY;
                    temSize = parentSize;
                }
                moveY = y - mouseY;
                moveX = x - mouseX;
                left = elementTL.left + moveX;
                top = elementTL.top + moveY;
                // 不能超出底部
                top = top >= (temSize.height - elementSize.height) ? (temSize.height - elementSize.height) : top;
                // 不能超出右边
                left = left >= (temSize.width - elementSize.width) ? (temSize.width - elementSize.width) : left;
                // 不能超出顶部
                top = top <= 0 ? 0 : top;
                // 不能超出左边
                left = left <= 0 ? 0 : left;
                element.css({
                    left: left + 'px',
                    top: top + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
            init();
        }
    };
});