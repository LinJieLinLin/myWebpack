require('./dy-upload.scss');
let templateUrl = require('./dy-upload.html');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
/**
 * create by linj at 2017-02-24
 * desc:新版文件上传
 * args:{
 *  c:{
 *      type: 上传文件类型 image图片，video视频,audio音频，不传为全部
 *      data: 上传文件数据{
 *          files,上传文件信息
 *          fileInfo:{}上传文件的信息
 *          num: 本次上传个数,
 *      }
 *      editorIds: string eg: 'i1,i2,titles'只针对编辑评测，编辑课程的上传(非必传)
 *      uploadParam: 默认不传 {}自定义~/usr/api/uload接口的请求参数 api-> https://api.gdy.io/module.html?key=File%20System/#github_com_Centny_gfs_gfsapi_FSH_Up
 *      swfWidth: num, 非
 *      swfHeight: num, 非
 *      max: 上传最大数据限制（不传不限制）; 非
 *      maxSize: 上传文件最大MB 非
 *      minSize: 上传文件最小byte, 非
 *      selectFile: function 调用时弹出文件选择框 
 *      private: 是否是私有（true,false） 非
 *      recorded: 是否记录到资源库（true 是，false 否）非
 *  }
 * }
 * eg:
 * <upload-file c="c.upload"></upload-file>
 * <button class="btn btn-lg" ng-click="c.upload.selectFile()">上传file</button>
 */

DIR.directive('uploadFile', function() {
    return {
        restrict: 'AE',
        template: templateUrl,
        scope: {
            c: '=',
        },
        controller: function($scope, $rootScope, $timeout, service) {
            $scope.d = {};
            $scope.f = {
                byte2size: '数据容量单位转换',
                checkLength: '检查是否超出文件限制',
                filter: '处理判断选择的文件',
            };
            var d = $scope.d,
                f = $scope.f,
                // 初始化上传
                defaultParam = {
                    m: 'C',
                    pub: $scope.c.private ? 0 : 1,
                    recorded: $scope.c.recorded ? 1 : 0,
                },
                requestParam = $scope.c.uploadParam || defaultParam;
            // using bas64 upload mode, default is 0.
            // defaultParam.base64 = $scope.c.private ? 0 : 1;
            // the file description
            // defaultParam.desc = $scope.c.private ? 0 : 1;
            // special the folder where the fill will be stored.
            // defaultParam.folder = $scope.c.private ? 0 : 1;
            // add mark to file.
            // defaultParam.mark = $scope.c.private ? 0 : 1;
            // specie the file name.
            // defaultParam.name = $scope.c.private ? 0 : 1;
            // whether create public path
            defaultParam.pub = $scope.c.private ? 0 : 1;
            // whether record file to user file list or not, 1 is recorded, default 0
            defaultParam.recorded = $scope.c.recorded ? 1 : 0;
            // add tag to file, split by comma
            // defaultParam.tags = $scope.c.private ? 0 : 1;
            requestParam.token = rcpAid.getToken();
            // 获取文件类型对应后缀结构体
            var fileType = rcpAid.getFileType();
            var uer = new window.jswf.Uer(DYCONFIG.fs.upload, requestParam, true);
            // 转成ie9下过滤格式
            var type2ie = {
                'audio': 'audioFile',
                'image': 'picFile',
                'video': 'videoFile'
            };
            $scope.init = function() {
                d.id = +new Date();
                if (!angular.isObject($scope.c.data)) {
                    $scope.c.data = {};
                }
                // 返回的文件信息
                if (!angular.isArray($scope.c.data.files)) {
                    $scope.c.data.files = [];
                }
                // 初始化文件信息
                if (!$scope.c.data.fileInfo) {
                    $scope.c.data.fileInfo = {};
                }
                $scope.c.type = $scope.c.type || 'attach';
                $scope.c.minSize = $scope.c.minSize || 10;
                // 本次上传个数（选择后计算）
                $scope.c.data.num = 0;
                // 上传限制个数 无限制为空
                $scope.c.max = $scope.c.max;
                d.isIE9 = $rootScope.G.isIE9;
                // ie9上传
                if (d.isIE9) {
                    $scope.swfUpCb = function(opt, rs) {
                        if (rs.code === 0) {
                            var temFileInfo = {
                                name: rs.base.name,
                                size: f.byte2size(rs.base.size),
                                fid: rs.base.id || '',
                                status: 'success',
                            };
                            switch ($scope.c.type) {
                                case 'image':
                                    // 检查是否超出上传限制
                                    if ($scope.c.max && f.checkLength($scope.c.max, '张图片！')) {
                                        return;
                                    }
                                    temFileInfo.url = rs.data;
                                    $timeout(function() {
                                        $scope.c.data.files.push(temFileInfo);
                                    });
                                    $scope.c.onSuccess(f, rs);
                                    break;
                                case 'video':
                                    // 检查是否超出上传限制
                                    if ($scope.c.max && f.checkLength($scope.c.max, '个视频！')) {
                                        return;
                                    }
                                    temFileInfo.url = rs.data;
                                    $timeout(function() {
                                        $scope.c.data.files.push(temFileInfo);
                                    });
                                    $scope.c.onSuccess(f, rs);
                                    break;
                                default:
                                    // 检查是否超出上传限制
                                    if ($scope.c.max && f.checkLength($scope.c.max, '个文件！')) {
                                        return;
                                    }
                                    temFileInfo.url = rs.data;
                                    $timeout(function() {
                                        $scope.c.data.files.push(temFileInfo);
                                    });
                                    $scope.c.onSuccess(f, rs);
                                    break;
                            }
                        }
                    };
                    $timeout(function() {
                        $scope.showMsg = true;
                        var option = {
                            width: $scope.c.swfWidth || '',
                            height: $scope.c.swfHeight || '',
                        };
                        // 文件限制类型转换
                        var typeTmp = $scope.c.type;
                        option.beforeSelectFile = type2ie[typeTmp] || 'allFile';
                        if ($scope.c.maxSize) {
                            // 文件大小限制
                            var maxSizeTmp = $scope.c.maxSize ? ($scope.c.maxSize * 1024 * 1024) : 20971520;
                            option.fileMaxSize = maxSizeTmp;
                        }
                        option.width = option.width.toString();
                        option.height = option.height.toString();
                        window.SwfUpload('swfUploader-' + d.id, $scope, 'swfUpCb', option);
                    }, 1000);
                }
            };
            // func
            /**
             * 数据容量单位转换
             * @param argSize
             * @returns {string}
             */
            $scope.f.byte2size = function(argSize) {
                if (!argSize) {
                    return 0 + 'B';
                }

                var k = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(argSize) / Math.log(k));

                return (argSize / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i];
            };
            /**
             * [检查是否超出文件限制]
             * @param  {[type]} argMax [最大上传数]
             * @param  {[type]} argMsg [显示信息]
             * @return {[type]} [description]
             */
            $scope.f.checkLength = function(argMax, argMsg) {
                var msg = '个文件！';
                if (argMsg) {
                    msg = argMsg;
                }
                if (argMax < $scope.c.data.files.length + 1) {
                    service.dialog.alert('最多只能添加' + $scope.c.max + msg);
                    return true;
                }
                return false;
            };
            /**
             * 选择文件
             * @return {[type]} [description]
             */
            $scope.c.selectFile = function() {
                // 初始化上传
                uer.AddI('uploader-' + d.id, {}, {});
                uer.OnSelect = function(argItem) {
                    var item = f.filter(argItem);
                    $timeout(function() {
                        if (item.length) {
                            $scope.c.status = 'select';
                        } else {
                            $scope.c.status = 'cancel';
                        }
                        $scope.c.data.num = item.length;

                        if ($scope.c.onSelectFile && typeof $scope.c.onSelectFile === 'function') {
                            $scope.c.onSelectFile(item, uer);
                        }
                        rcpAid.clearFile('uploader-' + d.id);
                    });
                    return item;
                };
                uer.OnProcess = function(f, rate, speed) {
                    rate = '' + rate.toFixed(2).substr(0, 4) * 100;
                    if ($scope.c.data.fileInfo[f.ext.id] && $scope.c.data.fileInfo[f.ext.id].id) {
                        var temFile = $scope.c.data.fileInfo[f.ext.id];
                        temFile.speed = speed;
                        temFile.status = 'uploading';
                        temFile.fid = f.fid;
                        temFile.percent = rate;
                        if (temFile.percent.length > 6) {
                            return;
                        }
                    } else {
                        uer.Abort(f.fid);
                    }
                    $timeout(function() {
                        if ($scope.c.onProcess && typeof $scope.c.onProcess === 'function') {
                            $scope.c.onProcess(f, rate, speed, uer);
                        }
                    });
                    console.info(f, rate, speed);
                };
                uer.OnSuccess = function(f, data) {
                    if ($scope.c.data.fileInfo[f.ext.id] && $scope.c.data.fileInfo[f.ext.id].id) {
                        var temFile = $scope.c.data.fileInfo[f.ext.id];
                        temFile.status = 'success';
                        temFile.fid = data.base && data.base.id;
                        temFile.percent = 100;
                        rcpAid.clearFile('uploader-' + d.id);
                        console.log('up success', f, data);
                    } else {
                        uer.Abort(f.fid);
                    }
                    $timeout(function() {
                        if ($scope.c.onSuccess && typeof $scope.c.onSuccess === 'function') {
                            $scope.c.onSuccess(f, data);
                        }
                    });
                };
                uer.OnErr = function(f, data) {
                    if (!(--$scope.c.data.num)) {
                        console.log('up error $scope.c.data.num:', $scope.c.data.num);
                    }
                    if ($scope.c.data.fileInfo[f.ext.id] && $scope.c.data.fileInfo[f.ext.id].id) {
                        var temFile = $scope.c.data.fileInfo[f.ext.id];
                        temFile.status = 'error';
                        temFile.fid = data.base && data.base.id;
                        temFile.speed = 0;
                        console.log('up success', f, data);
                        rcpAid.clearFile('uploader-' + d.id);
                    } else {
                        uer.Abort(f.fid);
                    }
                    $timeout(function() {
                        if ($scope.onErr && typeof $scope.onErr === 'function') {
                            $scope.onErr(f);
                        }
                    });
                };
                if (!d.isIE9) {
                    $timeout(function() {
                        $('#uploader-' + d.id).trigger('click');
                    });
                    return;
                }
            };
            /**
             * [处理判断选择的文件]
             * @param  {[type]} argItem [选择的文件]
             * @return {[type]}         [description]
             */
            $scope.f.filter = function(argItem) {
                var temLen = rcpAid.safe(argItem, 'files', []).length,
                    // 视频列表
                    videoFiles = [],
                    // 其它文件列表
                    files = [],
                    errMsg = '';
                let time = +new Date();
                // 检查是否超出上传限制
                if ($scope.c.max && f.checkLength($scope.c.max - temLen, '个文件！')) {
                    rcpAid.clearFile('uploader-' + d.id);
                    return [];
                }
                angular.forEach(argItem.files, function(file, key) {
                    var temFileInfo = {
                        name: file.name,
                        size: f.byte2size(file.size),
                        status: 'select',
                        percent: 0,
                        speed: '',
                        ext: file.name.split('.').pop().toLowerCase(),
                        id: ($scope.c.editorIds || '') + '-' + time + '-' + key,
                        type: $scope.c.type || 'attach',
                    }
                    var temFileType = fileType[$scope.c.type] || [$scope.c.type];
                    if (file.size < $scope.c.minSize) {
                        errMsg = '文件过小，请选择其它文件！';
                        service.dialog.alert(errMsg);
                        return;
                    }
                    if ($scope.c.maxSize && file.size > $scope.c.maxSize * 1024 * 1024) {
                        errMsg = '上传文件大小不能超过' + f.byte2size($scope.c.maxSize * 1024 * 1024) + '!';
                        service.dialog.alert(errMsg);
                        return;
                    }
                    if ($scope.c.type !== 'attach' && $scope.c.type && temFileType.indexOf(temFileInfo.ext) === -1) {
                        errMsg = '只支持以下格式文件上传：' + temFileType.join(',') + '!';
                        service.dialog.alert(errMsg);
                        return;
                    }
                    // 文件
                    file.ext = {
                        ext: temFileInfo.ext,
                        id: temFileInfo.id,
                        type: $scope.c.type || 'attach',
                        name: temFileInfo.name,
                    };
                    // 分离视频
                    if ($.inArray(temFileInfo.ext, rcpAid.getFileType().video) !== -1) {
                        videoFiles.push(file);
                    } else {
                        files.push(file);
                    }
                    $scope.c.data.fileInfo[temFileInfo.id] = temFileInfo;
                });
                // 上传到阿里云
                if (videoFiles.length) {
                    if ($scope.c.onSelectFile && typeof $scope.c.onSelectFile === 'function') {
                        $scope.c.onSelectFile(videoFiles, uer);
                    }
                    window.aliyunUpload.startUpload(videoFiles, uer);
                }
                if (errMsg) {
                    rcpAid.clearFile('uploader-' + d.id);
                    return [];
                } else {
                    return files;
                }
            };
            $scope.init();
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});