/**
 * Created by LouGaZen on 2017-03-02.
 *                  ┌───┬─────────┬───┐
 *                  │ - │    0    │ + │
 *                  └───┴─────────┴───┘
 * 数字微调控件，大概长这样子ㄟ( ▔, ▔ )ㄏ
 */

/**
 * - Modified by ph2 on 2017/06/29
 *      1. 补充 valueChange 注释
 *      2. <button> 指定类型  type="button"，避免在表单中点击按钮触发表单的 submit
 */

// config = {
//    value: {Number} 实际值
//    max: {Number|Optional} 最大值
//    min: {Number|Optional} 最小值
//    valueChange: {Function} 回调函数
// }

let templateUrl = require('./dy-num-spinner.html');
require('./dy-num-spinner.scss');

DIR.component('numberSpinner', {
    restrict: 'E',
    template: templateUrl,
    bindings: {
        config: '='
    },
    controllerAs: 'vmP',
    controller: function (service) {
        // 为了方便以后扩展
        var vm = this;
        var tmpValue = ''; // vm.config.value;

        /**
         * 点击+
         */
        function addClick(e) {
            e.stopPropagation();
            vm.config.value++;
            valueCallback();
        }

        /**
         * 点击-
         */
        function subClick(e) {
            e.stopPropagation();
            vm.config.value--;
            valueCallback();
        }

        function inputClick(e) {
            e.stopPropagation();
        }

        /**
         * 输入框获取焦点，保存当前数值
         */
        function onFocus() {
            tmpValue = vm.config.value;
        }

        /**
         * 输入框失去焦点，检测数据是否合法
         */
        function onBlur() {
            if (!/^-?\d+$/.test(vm.config.value) || Number(vm.config.value) < vm.config.min || Number(vm.config.value) > vm.config.max) {
                service.dialog.alert('请输入正确的数字');
                vm.config.value = tmpValue;
            }
        }

        /**
         * 输入框值改变，检测数据是否合法
         */
        function onChange() {
            if (!/^-?\d+$/.test(vm.config.value) || Number(vm.config.value) < vm.config.min || Number(vm.config.value) > vm.config.max) {
                vm.config.value = tmpValue;
            } else {
                valueCallback();
            }
        }

        /**
         * 数据改变回调
         */
        function valueCallback() {
            if (vm.config.valueChange && typeof vm.config.valueChange === 'function') {
                vm.config.valueChange(vm.config.value);
            }
        }

        /**
         * 绑定需要的数据和方法
         */
        function initViewModelData() {
            !angular.isNumber(vm.config.max) && (vm.config.max = Number.MAX_VALUE);
            !angular.isNumber(vm.config.min) && (vm.config.min = Number.MIN_VALUE);

            vm.d = {
                hasErr: vm.config.max < vm.config.min || vm.config.value > vm.config.max || vm.config.value < vm.config.min
            };

            vm.f = {
                addClick: addClick,
                subClick: subClick,
                onFocus: onFocus,
                onBlur: onBlur,
                onChange: onChange,
                inputClick: inputClick
            }
        }

        /**
         * 初始化
         */
        function init() {
            initViewModelData();
        }

        this.$onInit = function() {
            console.log('组件初始比');
            tmpValue = vm.config.value;
            // ----------
            init();
        }
    }
});