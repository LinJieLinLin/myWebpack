/* eslint-disable */
DYC.factory('dialog', function() {
    /**
     * 显示错误提示
     * error: 'request().then(sucCallBack, errCallBack)' errCallBack的参数
     * 1.
     * a. 必选
     * service.dialog.showErrorTip(error, {moduleName: '模块1', funcName: 'func1'});
     * 提示为: '[模块1(func1)] 错误码：1, 原因：xxxxxx'
     * b. 必选 + 可选
     * service.dialog.showErrorTip(error, {moduleName: '模块1', funcName: 'func1', text: '获取列表失败', alertOptions: {mask: true}});
     * 提示为: '[模块1(func1)] 获取列表失败, 错误码：1, 原因：xxxxxx'
     *
     * 2.
     * var tipper = service.dialog.getErrorTipper({moduleName: '模块1'});
     * console.log(tipper.tip.setFuncName('func1').tip(error, {text: '获取列表失败'}));
     * 提示为: '[模块1(func1)] 获取列表失败, 错误码：1, 原因：xxxxxx'
     * @author panye
     * Created: 2016-07-15
     * Modified: 2016-07-18
     */
    var errorTip = (function() {
        // 特殊处理的 data code 的提示文本
        var dataCodeType = {
            // 301: '登录超时'
        };

        // 排除的 code
        var excludeCodes = [301];

        /**
         * @param options. 与 showErrorTip options 参数相同
         * 传递给 alert 的参数
         */
        var ErrorTip = function(options) {
            this.options = options = options || {};
            this.setModuleName(options.moduleName).setFuncName(options.funcName).setText(options.text);
            options.alertOptions = options.alertOptions || {};
        };

        // 设置模块名
        ErrorTip.prototype.setModuleName = function(moduleName) {
            this.options.moduleName = typeof moduleName === 'string' ? moduleName : '';
            return this;
        };

        // 设置函数名
        ErrorTip.prototype.setFuncName = function(funcName) {
            this.options.funcName = typeof funcName === 'string' ? funcName : '';
            return this;
        };

        // 设置提示语
        ErrorTip.prototype.setText = function(text) {
            this.options.text = typeof text === 'string' ? text.trim() : '';
            return this;
        };

        /**
         * 显示错误提示 参数解析见 showErrorTip
         * ps: 传进来的 options 仅用于本次 不保存
         * @returns {string}
         */
        ErrorTip.prototype.tip = function(error, options) {
            if (!error) {
                return '';
            }
            options = options || {};
            for (var key in this.options) {
                if (this.options.hasOwnProperty(key)) {
                    if (options[key] === undefined) {
                        options[key] = this.options[key];
                    }
                }
            }

            return ErrorTip.showErrorTip(error, options);
        };

        /**
         * 显示错误提示的静态方法
         * @param error 'request().then(sucCallBack, errCallBack)' errCallBack的参数
         *              {type: 1, data: {data: xhrResponse}}
         * @param options . {moduleName: '', funcName: '', text: '', alertOptions: {}}
         *                  text(可选), alertOptions(可选) 是传给 js.alert 的参数 {mask:boolean,maskOpts:{css:{},animate{tween:{}},css:{},speed:{}}}
         * @returns {string} e.g. [测试模块(MyFunction)] 提示语, 错误码: 2, 原因, arg-err LoadCourse error(not found)
         */
        ErrorTip.showErrorTip = function(error, options) {
            if (!error) {
                return '';
            }
            options = options || {};
            var moduleName = typeof options.moduleName === 'string' ? options.moduleName : '';
            var funcName = typeof options.funcName === 'string' ? options.funcName : '';
            var text = typeof options.text === 'string' ? options.text.trim() : '';
            var output = '';

            // type === 1 请求正常 业务逻辑错误
            if (error.type === 1) {
                var requestResponse = error.data || {};
                var xhrResponse = requestResponse.data || {};

                var code = typeof xhrResponse.code !== 'undefined' ? 　xhrResponse.code : '';

                // 部分 code 不显示提示
                if (excludeCodes.indexOf(code) > -1) {
                    return '';
                }

                var reason = xhrResponse.msg ? (xhrResponse.msg + ' ') : '';
                reason += xhrResponse.dmsg || '';

                // 出错原因加上特别的 code 对应的原因
                if (dataCodeType[code]) {
                    reason = dataCodeType[code] + reason;
                }

                output = ErrorTip.getFormatText(
                    moduleName,
                    funcName,
                    text,
                    code,
                    reason
                );
            }

            output && rcpAid.tips.alert(output, 'error');
            return output;
        };

        /**
         * 格式化文本
         * @param moduleName
         * @param funcName
         * @param text
         * @param code
         * @param reason
         * @returns {string} e.g. [测试模块(MyFunction)] 提示语, 错误码: 2, 原因, arg-err LoadCourse error(not found)
         */
        ErrorTip.getFormatText = function(moduleName, funcName, text, code, reason) {
            var list = [
                '[',
                moduleName || '',
                '(',
                funcName || '',
                ')] ',
                text ? (text + ', ') : '',
                '错误码：',
                code,
                ', 原因：',
                reason
            ];
            return list.join('');
        };

        /**
         * 获取 errorTip 实例
         * @param options 参数看构造函数
         * @returns {errorTip}
         */
        ErrorTip.getInstance = function(options) {
            return new ErrorTip(options);
        };

        return ErrorTip;
    })();
    return {
        alert: function(argMsg, artType, artTime) {
            rcpAid.tips.alert(argMsg, artType || 'info', artTime);
        },
        getErrorTipper: errorTip.getInstance,
        showErrorTip: errorTip.showErrorTip
    };
});

DYC.run(function(service, dialog) {
    service.expand('dialog', function() {
        return dialog;
    });
});