import { setTimeout, clearTimeout } from 'timers';

require('./com.scss');
/**
 * @author linj
 * @version 0.01
 * @description 通用函数
 */

// let doc = {
//     hideLog: '隐藏console.log，当localStorage.showLog有值时，显示',
//     changeTime: '转换时间为天、时、分、秒',
//     encodeHtml: '转义html标签',
//     decodeHtml: '反转义html标签',
//     getRegexp: '获取正则',
//     urlParam: '获取URL参数',
//     getCookie: '获取cookie',
//     setCookie: '设置cookie',
//     checkOS: '检测浏览器状态，系统状态',
//     clearFile: '重置当前element(上传图片用)',
//     safe: '数据安全访问',
//     closePage: '关闭当前页面（从其它页面进入才会关闭）',
// }
let COM = {
    // 隐藏console.log，当localStorage.showLog有值时，显示
    hideLog: () => {
        if (!localStorage.showLog) {
            window.console.log = function() {
                return;
            }
        }
    },
    tips: {
        // 数据配置
        msgObj: {},
        // 数据队列
        msgArray: [],
        // 是否正在运行
        running: false,
        /**
         * argMsg: 显示内容
         * argType: warn error info success
         * argTime: 显示时间 s
         */
        alert: function(argMsg, argType, argTime = 1) {
            // 默认3s后移动队列
            let temTime = 0;
            if (argTime <= 1) {
                argTime = 1;
                temTime = 3;
            }
            if (this.msgObj[argMsg]) {
                return;
            }
            this.msgObj[argMsg] = {
                msg: argMsg,
                type: argType,
                time: temTime || argTime
            };
            this.msgArray.push(argMsg);
            // 显示alert
            let showAlert = (argData) => {
                // console.log(document.getElementById('dyGTips'));
                if (!document.getElementById('dyGTips')) {
                    let dialog = document.createElement('div');
                    dialog.setAttribute('id', 'dyGTips');
                    dialog.setAttribute('class', 'dy-g-tips');
                    dialog.innerHTML = `
                    <div class="t-m animated"><i class="iconfont"></i>
                        <span class="msg">${argData.msg}</span>
                    <div>`;
                    document.body.appendChild(dialog);
                }
                let dialog = document.getElementById('dyGTips');
                let msg = dialog.querySelector('.msg');
                let iClass = '';
                switch (argData.type) {
                    case 'info':
                        iClass = 'iconfont i-jubaoguanli-selected c-theme';
                        break;
                    case 'error':
                        iClass = 'iconfont i-unpass1 c-error';
                        break;
                    case 'warn':
                        iClass = 'iconfont i-shelved c-warn';
                        break;
                    case 'success':
                        iClass = 'iconfont i-pass c-success';
                        break;
                    default:
                        iClass = 'iconfont';
                        break;
                }
                if (iClass && dialog.querySelector('i')) {
                    dialog.querySelector('i').setAttribute('class', iClass);
                }
                COM.rmClass(dialog.querySelector('.t-m'), 'bounceOutUp');
                COM.addClass(dialog.querySelector('.t-m'), 'bounceInDown');
                setTimeout(() => {
                    COM.rmClass(dialog.querySelector('.t-m'), 'bounceInDown');
                    COM.addClass(dialog.querySelector('.t-m'), 'bounceOutUp');
                }, (argTime - 1) * 1000 || 2000)
                msg.innerText = argData.msg;
            };
            // 运行队列
            let runAlert = () => {
                let temTimer = setTimeout(() => {
                    this.msgObj[this.msgArray[0]] = null;
                    clearTimeout(temTimer);
                    this.msgArray.splice(0, 1);
                    if (this.msgArray.length) {
                        showAlert(this.msgObj[this.msgArray[0]]);
                        runAlert();
                    } else {
                        this.running = false;
                    }
                }, (temTime || argTime) * 1000);
            }
            if (!this.running) {
                this.running = true;
                showAlert(this.msgObj[this.msgArray[0]]);
                runAlert();
            }
        }
    },
    /**
     * add class
     * @param  {[type]} argE [element]
     * @param  {[type]} argC  [class]
     * @return {[type]}      [description]
     */
    addClass: (argE, argC) => {
        if (!COM.hasClass(argE, argC)) {
            argE.className = argE.className || '';
            argE.className += ' ' + argC;
        }
    },
    /**
     * remove class
     * @param  {[type]} argE [element]
     * @param  {[type]} argC  [class]
     * @return {[type]}      [description]
     */
    rmClass: (argE, argC) => {
        if (COM.hasClass(argE, argC)) {
            let reg = new RegExp('(\\s|^)' + argC + '(\\s|$)');
            argE.className = argE.className.replace(reg, ' ');
        }
    },
    /**
     * 获取相关CSS属性
     * @param  {[type]} argE [element]
     * @param  {[type]} key  [style name]
     * @return {[type]}      [description]
     */
    getStyle: (argE, key) => {
        return window.getComputedStyle(argE, false)[key] || '';
    },
    /**
     * 是否存在class
     * @param  {[type]} argE [element]
     * @param  {[type]} argC  [class]
     * @return {[type]}      [description]
     */
    hasClass: (argE, argC) => {
        if (argE.className) {
            return argE.className.match(new RegExp('(\\s|^)' + argC + '(\\s|$)'));
        } else {
            return false;
        }
    },
    /**
     * 获取元素相对absolute/fixed绝对位置的坐标
     * @param  {[type]} argE [element]
     * @return {[type]}      [description]
     */
    getElementPosition: (argE) => {
        let actualLeft = argE.offsetLeft;
        let actualTop = argE.offsetTop;
        let rs = {
            left: argE.offsetLeft || 0,
            top: argE.offsetTop || 0
        }
        let current = argE.offsetParent;
        while (current !== null && COM.getStyle(current, 'position') !== 'absolute' && COM.getStyle(current, 'position') !== 'fixed') {
            rs.left += current.offsetLeft;
            rs.top += current.offsetTop;
            current = current.offsetParent;
            console.log(current, rs);
        }
        return rs;
    },
    /**
     * 转换时间为天、时、分、秒
     * @param  {[type]} argTime [时间（毫秒）]
     * @param  {[type]} argLang [默认不填，en：显示 d,h,min,s]
     * @param  {[type]} argType [默认不填，ns: argTime为纳秒]
     */
    changeTime: (argTime, argLang, argType) => {
        if (argType === 'ns') {
            argTime = argTime * 0.000000001;
        }
        let result = '';
        if (!argLang) {
            argLang = 'cn';
        }
        let lang = {
            en: ['d ', 'h ', 'min ', 's'],
            cn: ['天', '时', '分', '秒'],
        }
        if (Math.floor(argTime / 86400000) > 0) {
            result = Math.floor(argTime / 86400000) + lang[argLang][0];
        }
        if (Math.floor((argTime % 86400000) / 3600000) > 0) {
            result += Math.floor((argTime % 86400000) / 3600000) + lang[argLang][1];
        }
        if (Math.floor(((argTime % 86400000) % 3600000) / 60000) > 0) {
            result += Math.floor(((argTime % 86400000) % 3600000) / 60000) + lang[argLang][2];
        }
        if (Math.floor((((argTime % 86400000) % 3600000) % 60000) / 1000) > 0) {
            result += Math.floor((((argTime % 86400000) % 3600000) % 60000) / 1000) + lang[argLang][3];
        }
        return result;
    },
    /**
     * [encodeHtml 转义html标签]
     * @param  {[type]} argHtml [string]
     * @return {[type]}         [string]
     */
    encodeHtml: (argHtml) => {
        if (!argHtml || argHtml.length === 0) {
            return '';
        }
        argHtml = argHtml.replace(/&/g, '&amp;');
        argHtml = argHtml.replace(/</g, '&lt;');
        argHtml = argHtml.replace(/>/g, '&gt;');
        argHtml = argHtml.replace(/ /g, '&nbsp;');
        argHtml = argHtml.replace(/'/g, '&#39;');
        argHtml = argHtml.replace(/"/g, '&quot;');
        argHtml = argHtml.replace(/\n/g, '<br>');
        return argHtml;
    },
    /**
     * [decodeHtml 反转义html标签]
     * @param  {[type]} argHtml [string]
     * @return {[type]}         [string]
     */
    decodeHtml: (argHtml) => {
        if (!argHtml || argHtml.length === 0) {
            return '';
        }
        argHtml = argHtml.replace(/&amp;/g, '&');
        argHtml = argHtml.replace(/&lt;/g, '<');
        argHtml = argHtml.replace(/&gt;/g, '>');
        argHtml = argHtml.replace(/&nbsp;/g, ' ');
        argHtml = argHtml.replace(/&#39;/g, '\'');
        argHtml = argHtml.replace(/&quot;/g, '"');
        argHtml = argHtml.replace(/<br>/g, '\n');
        return argHtml;
    },
    // 获取正则
    getRegexp: () => {
        return {
            // 非负整数
            integer: /^([1-9]\d*|0)$/,
            // 判断http
            http: /http:\/\/|https:\/\//,
            // 大于等于0保留1位小数的分数
            score0: /^(([1-9])|([1-9]+[0-9]+)|(0)|([0-9]+.[0-9]{1}))$/,
            // 大于0保留1位小数的分数
            score: /^(([1-9])|([1-9]+[0-9]+)|([0-9]+.[0-9]{1}))$/,
            // 邮箱
            email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
            // 大小写+数字+中文+'_'+'-'
            account: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{2,50}$/,
            // 匹配真实姓名 中文或英文
            realName: /^([\u4e00-\u9fa5]{2,50}|[\u4e00-\u9fa5]{1,25}[\s][\u4e00-\u9fa5]{1,24}|[a-zA-Z_\-.]{2,50}|[a-zA-Z_\-.]{1,25}[\s][a-zA-Z_\-.]{1,24})$/,
            //  匹配数字
            num: /^[0-9]*$/,
            // 4个字母开头的 字母+数字+下划线或连字符
            no4: /^([a-zA-Z]{4}[0-9a-zA-Z_-]{1,46})$/,
            // 手机号
            tel: /^1[3|4|5|7|8][0-9]\d{8}$/,
            // 身份证号
            idCard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
            // 视频标签
            video: /<video(.*)>[^<]*<\/video>/ig,
            embed: /<embed(.*)>/ig,
            iframe: /<iframe(.*)>[^<]*<\/iframe>/ig,
        };
    },
    /**
     * [urlParam 获取URL参数]
     * @param  {string} name [参数名]
     * @return {string}      [解码后的值]
     */
    urlParam: (argName) => {
        let result = window.location.search.match(new RegExp('[?&]' + argName + '=([^&]+)', 'i'));
        if (!result) {
            return '';
        }
        return decodeURIComponent(result[1]);
    },
    // 获取cookie
    getCookie: (argName) => {
        let cookie = document.cookie.split('; ');
        for (let i = 0; i < cookie.length; i += 1) {
            let name = cookie[i].split('=');
            if (argName === name[0]) {
                return unescape(name[1] || '');
            }
        }
        return '';
    },
    // 设置cookie
    setCookie: (argName, argValue, argTime) => {
        let now = new Date();
        let offset = 8;
        let utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        let nd = utc + (3600000 * offset);
        let exp = new Date(nd);
        let domain = document.domain;
        exp.setTime(exp.getTime() + argTime * 60 * 60 * 1000);
        document.cookie = argName + "=" + escape(argValue) + ";path=/;expires=" + exp.toGMTString() + ";domain=" + domain + ";"
    },
    /** 检测浏览器状态，系统状态
     * OS{
     * ua: ua,
     * platform: platform,
     * isMobile: 移动端,
     * isWin: winPC端,
     * isIphone: iphone,
     * isIpad: ipad,
     * isMac: mac,
     * isAppleMobile: 苹果移动端webview
     * isSafari: Safari浏览器,
     * isIE: 显示8 9 10, true为11以上     
     * }
     */
    checkOS: () => {
        let ua = navigator.userAgent.toLowerCase(),
            platform = navigator.platform.toLowerCase();
        let OS = {
            ua: ua,
            platform: platform,
            isMobile: ua.match(/mobile/) && true,
            isWin: platform.match('win') && true,
            isIphone: ua.match(/iphone/) && true,
            isIpad: ua.match(/ipad/) && true,
            isMac: platform.match('mac') && true,
            isSafari: ua.indexOf('safari') > -1 && ua.indexOf('chrome') < 1,
            isIE: !!window.ActiveXObject || 'ActiveXObject' in window
        }
        if (OS.ua.match('msie')) {
            let IE = OS.ua.match(/msie\s([0-9]*)/);
            if (IE.length >= 2) {
                OS.isIe = IE[1];
            }
        }
        OS.isAppleMobile = OS.isMobile && ua.toLowerCase().indexOf('applewebkit') && ua.indexOf('chrome') < 1;
        return OS;
    },
    /**
     * [clearFile 重置当前element(上传图片用)]
     * @param  {[type]} argId [id]
     */
    clearFile: (argId) => {
        let e = document.getElementById(argId);
        if (!e) {
            return;
        }
        if (e.outerHTML) {
            e.outerHTML = e.outerHTML;
        } else {
            e.value = '';
        }
    },
    /**
     * 数据安全访问
     * @param  {object|Array} argData  [原始数据]
     * @param  {string} argCheck [要返回的数据，用'.'连接，数组用'.+数字表示']
     * @param  {*} [argValue] [如果数据有误，返回的值，选填]
     */
    safe: (argData, argCheck, argValue) => {
        var temKey = argCheck.toString().split('.'),
            temLen = temKey.length;
        if (!argData) {
            return argValue;
        }
        if (temLen > 1) {
            for (var i = 0; i < temLen - 1; i++) {
                if (typeof argData[temKey[i]] !== 'object') {
                    return argValue;
                }
                argData = argData[temKey[i]] || {};
            }
        }
        if (typeof argValue === 'undefined') {
            return argData[temKey[temLen - 1]];
        }
        return argData[temKey[temLen - 1]] || argValue;
    },
    // 关闭当前页面（从其它页面进入才会关闭）
    closePage: () => {
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/msie/)) {
            if (ua.match(/msie 6.0/)) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        } else if (ua.match(/firefox/)) {
            window.open('about:blank', '_self', '');
            window.opener = null;
            window.close();
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    },
}
export default COM;