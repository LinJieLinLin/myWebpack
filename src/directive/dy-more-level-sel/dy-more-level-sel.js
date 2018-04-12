/**
 * Created by zdz on 2017/2/18.
 */

// config = {
//     disable: false(true时不可点击)
//     cityRoot: ['广东'] //第一级的城市
//     allCity: {        //城市详情
//     '广东': ['广州']
//     '广东@广州': ['天河区','白云区']
//     '广东@广州@天河区@xx路': ['xxx','xxxx']
//      }
// }
// clickedCity = []    //选中的城市 如 ['广东','广州'] 不能直接引用
// clickCb           //选中的回调函数
//

let templateTmp = require('./dy-more-level-sel.html');
require('./dy-more-level-sel.scss');

DIR.directive('moreLevelSel', function () {
    return {
        template: templateTmp,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            config: '=',
            clickedCity: '=',
            placeholder: '@',
            clickCb: '=',
            othStyle: '='
        },
        controller: function ($scope, service, $timeout) {
            let vm = $scope;

            vm.showClick = () => {
                if (vm.config.disable) {
                    return;
                }
                vm.isShow = !vm.isShow;
            };

            // 进入下拉列表的事件
            vm.enterDiv = (i) => {
                if (!vm.isShow) return;
                $timeout(function () {
                    vm.isShow = true;
                });
            };

            // 离开下拉列表的事件
            vm.leftDiv = (i) => {
                if (!vm.isShow) return;
                vm.isShow = false;
            };

            /**
             * 确定回调事件
             */
            vm.sureClick = () => {
                vm.clickedShow = vm.clickedShowTmp;
                if (typeof (vm.clickCb) === 'function') vm.clickCb(vm.realAns);
                vm.isShow = false;
            };

            /**
             * 取消回调事件
             */
            vm.cancelClick = () => {
                vm.isShow = false;
                vm.clickedShowTmp = vm.clickedShow;
                vm.clickedAns = vm.clickedShowTmp.split(',');
            };

            /**
             * 每一项的点击事件
             * @param target
             * @param curIndex 当前选中的列（根数据为第一列-1）
             */
            vm.recordClicked = (target, curIndex) => {
                let clickedIndex = vm.clickedAns.indexOf(target);
                if (clickedIndex === curIndex + 1) return;

                vm.clickedAns = vm.clickedAns.slice(0, curIndex + 1);
                vm.realAns = vm.realAns.slice(0, curIndex + 1);
                vm.realAns.push(target);

                let targetTemp = vm.clickedAns.join('@');
                if (curIndex !== -1) {
                    target = targetTemp + '@' + target;
                }
                vm.clickedAns.push(target);

                if (vm.othStyle === 2) {
                    vm.clickedShowTmp = arrJoin(vm.realAns);
                } else {
                    if (typeof (vm.clickCb) === 'function') vm.clickCb(vm.realAns);
                    vm.clickedShow = arrJoin(vm.realAns); // vm.realAns.join(',');
                }
            };

            /**
             * 将[广东，广州] 转成 [广东，广东@广州]
             */
            function choseCityChange(inArr) {
                let tempArr = [];
                let tempItem;
                for (let i = 0; i < inArr.length; i++) {
                    tempArr.push(inArr[i]);
                    tempItem = tempArr.join('@');
                    tempArr[i] = tempItem;
                }
                return tempArr;
            }

            /**
             * 将数组转化成字符串 （为了解决[].join()当数组元素内存在空值得情况）
             * @param arrTemp 目标数组
             * @param joinTemp 链接的字符
             * @returns {string}
             */
            function arrJoin(arrTemp, joinTemp) {
                let strTemp = '';
                if (!joinTemp) {
                    joinTemp = ',';
                }
                for (let i = 0; i < arrTemp.length; i++) {
                    if (!arrTemp[i]) {
                        continue;
                    }
                    if (strTemp) {
                        strTemp += joinTemp + arrTemp[i];
                    } else {
                        strTemp += arrTemp[i];
                    }
                }
                return strTemp;
            }

            /**
             * 参数初始化
             */
            function argsInit() {
                // 用于存放根数据
                vm.allcityRoot = [];

                // 用于存放非跟数据
                vm.allcity = {};

                // 用于存放选中的数据
                vm.clickedAns = [];

                // [a,b,c]格式的选中项，提供给外部
                vm.realAns = [];

                // 搜索列表默认显示的值
                vm.placeholder = vm.placeholder || '请选择';

                // 是否展开下拉列表
                vm.isShow = false;

                // 选中的内容显示（string）
                vm.clickedShow = '';

                // 选中的内容临时显示
                vm.clickedShowTmp = '';
            }

            function init() {
                if (!vm.config) {
                    console.error('传入参数错误，config必须是个obj');
                    return;
                }
                argsInit();
                vm.allcityRoot = vm.config.cityRoot || [];
                vm.allcity = vm.config.allCity || [];
                vm.realAns = vm.clickedCity || [];
                vm.clickedShow = arrJoin(vm.realAns);
                vm.clickedAns = choseCityChange(vm.realAns);
                vm.config.reset = init;
            }

            init();

            // vm.$watch('config', function (value) {
            //     if (!value) return;
            //     init();
            //     console.log('this is config has value', value);
            //     vm.config.reset = init;
            // });
            //
            // vm.$watch('clickedCity', function (value) {
            //     if (!value) return;
            //     console.log('this is clickedcity has value', vm.clickedCity);
            //     init();
            // })
        }
    }
});