/**
 * @author linj 
 * @description 跨境电商首页
 * @type {[type]} 
 */
require('./kjds.scss');
window.DY = angular.module('RCP', [
    'COM',
    'DIR'
]);
// 轮播
function Carousel(argTaget, argItem, argKey, argTime, argStopPlay, argHover) {
    var wrap = $(argTaget);
    var item = wrap.find(argItem);
    var key = wrap.find(argKey);
    var time = argTime || 4500;
    var timer;
    var page = 0;

    function change(i) {
        page = i;
        item.removeClass('active').eq(i).addClass('active');
        key.removeClass('active').eq(i).addClass('active');
    }

    function next() {
        page++;
        page %= item.length;
        change(page);
    }

    function prev() {
        if (page === 0) {
            page = item.length;
        }
        page--;
        change(page);
    }

    function clearTimer() {
        clearInterval(timer);
    }

    function autoPlay() {
        clearTimer();
        if (argStopPlay) {
            return;
        }
        timer = setInterval(next, time);
    }

    wrap.on({
        'mouseenter': clearTimer,
        'mouseleave': autoPlay
    });
    wrap.find('.prev').on({
        'click': prev,
    });
    wrap.find('.next').on({
        'click': next,
    });
    key.each(function(index) {
        $(this).on({
            'click': function() {
                change(index);
            },
            'mouseover': function() {
                if (argHover) {
                    change(index);
                }
            }
        });
    });
    autoPlay();
}
// 左右轮播
function LRCarousel(argTime) {
    var wrap = $('#lrc');
    var item = wrap.find('.course-0');
    var scroll = wrap.find('.c-x');
    var before = wrap.find('.prev-0');
    var after = wrap.find('.next-0');
    var time = argTime || 6000;
    var timer;
    var page = 0;
    if (!item.length) {
        return;
    }
    var w = item.eq(0).outerWidth(true);
    scroll.css({ 'width': w * item.length });

    function change(i) {
        page = i;
        scroll.css({
            'transform': 'translate(' + -(page * w) + 'px, 0px)'
        });
    }

    function next() {
        page++;
        page %= (5);
        change(page);
    }

    function prev() {
        page--;
        page = page < 0 ? (4) : page;
        change(page);
    }

    function clearTimer() {
        clearInterval(timer);
    }

    function autoPlay() {
        clearTimer();
        timer = setInterval(next, time);
    }
    wrap.on({
        'mouseenter': clearTimer,
        'mouseleave': autoPlay
    });
    before.on({
        'click': prev
    });
    after.on({
        'click': next
    });
    autoPlay();
}
/**
 * 右菜单监听
 * @param {[type]} args [description]
 */
function OnTop(args) {
    var lock;
    var timer;
    // 监听滚动元素
    var w;
    var now = 0;
    if (args.scrollTarget) {
        w = args.scrollTarget;
    } else {
        w = window;
    }

    function handler() {
        var e = $(args.node);
        if (!$(e).length || lock) {
            return;
        }
        w = $(w);
        var wt = w.scrollTop();
        var et = e.offset().top;
        // 判断是否在顶部
        var bf = et <= wt && wt > 0;
        if (args.type === 'normal') {
            if (bf) {
                if (typeof args.callback === 'function') {
                    args.callback();
                }
            } else {
                var temRight = (document.body.clientWidth - $('#to-0').width()) / 2 - 130;
                if (temRight < 15) {
                    temRight = 15;
                }
                $('.c-menu').removeClass('c-menu-1').css('right', temRight + 'px');
            }
        }
    }

    function setMenu() {
        var e = $(args.node);
        if (!$(e).length || lock) {
            return;
        }
        w = $(w);
        var wt = w.scrollTop();
        var et = e.offset().top;

        // 设置菜单
        var bf = et <= wt && wt > 0;
        if (args.type === 'normal' && bf) {
            for (var i = 0; i < 9; i++) {
                if (wt < $('#to-' + i).offset().top + $('#to-' + i).height() - 1) {
                    if (i === now) {
                        break;
                    }
                    now = i;
                    //  console.log(i, wt, $('#to-' + i).offset().top, $('#to-' + i).height());
                    var menu = $('.list-0 .m');
                    var nowMenu = $(menu[i]);
                    var activeMenu = $('.list-0 .m.active');
                    activeMenu.find('i').attr('class', activeMenu.find('i').attr('class').replace('-1', ''));
                    menu.removeClass('active');
                    nowMenu.find('i').attr('class', nowMenu.find('i').attr('class') + '-1');
                    nowMenu.addClass('active');
                    break;
                }
            }
        }
    }

    function callback() {
        handler();
        clearTimeout(timer);
        timer = setTimeout(setMenu, 200);
    }
    handler();
    callback();
    $(window).on({
        'scroll': callback,
        'resize': callback,
    });
}
(function() {
    setTimeout(function() {
        Carousel('#index-banner', '.mban-container .mban-item', '.mban-key .key', 4500);
    }, 0);
    setTimeout(function() {
        Carousel('#car-0', '.mban-item', '.key', 4500, true, true);
    }, 50);
    setTimeout(function() {
        Carousel('#car-1', '.mban-item', '.key', 3000);
    }, 100);
    LRCarousel(3000);
    setTimeout(function() {
        OnTop({
            scrollTarget: '',
            type: 'normal',
            node: '#top-menu',
            callback: function() {
                var temRight = (document.body.clientWidth - $('#to-0').width()) / 2 - 130;
                if (temRight < 15) {
                    temRight = 15;
                }
                $('.c-menu').addClass('c-menu-1').css('right', temRight + 'px');
            }
        });
    }, 0);
    setTimeout(function() {
        var target = '.show-2 .block .js';
        var temH0 = $($(target)[0]).height();
        var temH1 = $($(target)[1]).height();
        if (temH1 >= temH0) {
            $($(target)[0]).height(temH1);
        } else {
            $($(target)[1]).height(temH0);
        }
    }, 500);
    $(window).on({
        'resize': function() {
            var target = '.show-2 .block .js';
            var temH0 = $($(target)[0]).height();
            var temH1 = $($(target)[1]).height();
            if (temH1 >= temH0) {
                $($(target)[0]).height(temH1);
            } else {
                $($(target)[1]).height(temH0);
            }
        }
    });
    var menu = $('.list-0 .m');
    menu.each(function(argIndex) {
        $(this).on({
            'click': function() {
                //  console.log(argIndex);
                var activeMenu = $('.list-0 .m.active');
                activeMenu.find('i').attr('class', activeMenu.find('i').attr('class').replace('-1', ''));
                menu.removeClass('active');
                $(this).find('i').attr('class', $(this).find('i').attr('class') + '-1');
                $(this).addClass('active');
                if ($('#to-' + argIndex).length) {
                    $('html,body').stop().animate({ scrollTop: $('#to-' + argIndex).offset().top }, 'normal');
                }
            },
        });
    });
    $('.back-0').on({
        'click': function() {
            var activeMenu = $('.list-0 .m.active');
            activeMenu.find('i').attr('class', activeMenu.find('i').attr('class').replace('-1', ''));
            menu.removeClass('active');
            $(menu[0]).addClass('active');
            $(menu[0]).find('i').attr('class', $(menu[0]).find('i').attr('class') + '-1');
            $('html,body').stop().animate({ scrollTop: 0 }, 'normal');
        },
    });
})();
// 在线资询
function contact() {
    document.querySelector('#ranchen').src = 'tencent://message/?uin=2853772713&Site=&menu=yes';
}