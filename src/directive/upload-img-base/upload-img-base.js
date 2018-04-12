require('cropper/dist/cropper.css');
require('./upload-img-base.scss');
let templateUrl = require('./upload-img-base.html');
require('cropper/dist/cropper.js');
if (!window.DIR) {
    window.DIR = angular.module('DIR', []);
}
//  uploadConfig：
//  $scope.uploadConfig = {
//      showEdit: false,  // 显示编辑模式
//      uploadNum: 0,     // 上传图片位置
//      upCancel: false,  // 是否取消上传
//   *  id: '123',        // 上传input ID
//   *  mode: 'fixed',    // 组件样式： 'fixed': 浮动弹窗   , 'course': 创建课程封面
//      ratio: [16,9],    // 裁剪比例   默认   16 / 9
//      width: 550,       // 裁剪宽度,单位px   默认   550px
//      containerStyle:   // 参见框样式      {width: '300px', height: '300px'},
//      scope: {},        // 返回$scope
//      cb: function() {}
//  }
DIR.directive('uploadImgBase', function() {
    return {
        template: templateUrl,
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '='
        },
        controller: function($scope, $timeout, $http, service) {
            $scope.c.scope = $scope;
            $scope.c.aspectRatio = $scope.c.ratio ? $scope.c.ratio[0] / $scope.c.ratio[1] : (16 / 9);
            $scope.containerStyle = $scope.c.containerStyle || { width: '300px', height: '300px' };
            /**
             * 初始化
             */
            $scope.init = function() {
                //  上传input
                var uploadImg = $('#upload-img-' + $scope.c.id);
                var uploadInput = $('#upload-input-' + $scope.c.id);
                var imgView = $('#img-view-' + $scope.c.id);
                // 显示隐藏Loading
                $scope.upLoading = false;
                // 封面默认图
                $scope.newImg = '';
                /**
                 * [selectImg 选择要上传的图片]
                 * @return {[type]} [description]
                 */
                $scope.selectImg = function() {
                    uploadInput.trigger('click');
                };

                // 确认上传图片
                $scope.confirmImg = function() {
                    if ($scope.upLoading === true) {
                        return;
                    }
                    var _config = {
                        width: $scope.c.width || 550,
                        style: 'display:none',
                        //  fillColor: '#FFFFFF'
                    };
                    if ($scope.c.fillColor) {
                        _config.fillColor = $scope.c.fillColor;
                    }
                    var result = imgCropper.cropper('getCroppedCanvas', _config);
                    result.id = 'canvas' + $scope.c.id;
                    result.display = false;
                    imgView.html(result);
                    imgCropper.on({
                        'zoom.cropper': function(e) {

                        }
                    });
                    $timeout(function() {
                        var code = $('#canvas' + $scope.c.id)[0].toDataURL('img/png');
                        var arr = code.split(',');
                        if (arr.length !== 2) {
                            service.dialog.alert('图片转换失败，请重试');
                            return;
                        }
                        $scope.upLoading = true;
                        $scope.uploadBasePic({
                            baseCode: arr[1]
                        });
                    });
                };

                //  取消上传图片
                $scope.cancelImg = function() {
                    $scope.upLoading = false;
                    if (uploadImg.get(0).style.display === 'block') {
                        uploadImg.get(0).off();
                    }
                    $scope.c.upCancel = true;
                    $scope.c.showEdit = false;
                };
                //  base64图片上传
                $scope.uploadBasePic = function(args) {
                    var postData = {
                        m: args.m || 'C',
                        pub: args.pub || '1',
                        picType: args.picType || '1',
                        fileName: args.fileName || '1.png',
                        name: args.fileName || '1.png',
                        base64: 1,
                        token: rcpAid.getToken()
                    };
                    service.common.uploadBase(postData, { data: args.baseCode }).then((rs) => {
                        $scope.upLoading = false;
                        $scope.c.showEdit = false;
                        if (rs.code === 0) {
                            if (uploadImg.get(0).style.display === 'block') {
                                uploadImg.get(0).off();
                            }
                            $scope.c.cb(rs.data);
                        } else {
                            service.dialog.showErrorTip(rs, { moduleName: 'upload-img-base64', funcName: 'uploadBasePic' });
                        }
                    }, (err) => {
                        $scope.upLoading = false;
                        $scope.c.showEdit = false;
                        console.log(err);
                    });
                    // $http({
                    //     method: 'POST',
                    //     url: DYCONFIG.fs.upload + '?' + $.param(postData),
                    //     data: args.baseCode || '',
                    //     headers: {
                    //         'Content-Type': 'multipart/form-data'
                    //     }
                    // }).then(function(rs) {

                    // }, function(data) {

                    // });
                };
                //  切割组件功能初始化
                var imgCropper = uploadImg.find('.cropper-img-' + $scope.c.mode + ' > img');
                var $previews = $('.preview');
                imgCropper.cropper({
                    aspectRatio: $scope.c.aspectRatio,
                    autoCropArea: 0.85,
                    strict: false,
                    guides: true,
                    preview: '.img-preview',
                    highlight: true,
                    dragCrop: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    isImg: false,
                    build: function(e) {
                        var $clone = $(this).clone();
                        $clone.css({
                            display: 'block',
                            width: '100%',
                            minWidth: 0,
                            minHeight: 0,
                            maxWidth: 'none',
                            maxHeight: 'none'
                        });
                        $(e).removeClass('cropper-hidden');
                        $previews.css({
                            width: '100%',
                            overflow: 'hidden'
                        }).html($clone);
                    },
                    crop: function(e) {
                        var imageData = $(this).cropper('getImageData');
                        var previewAspectRatio = e.width / e.height;
                        $previews.each(function() {
                            var $preview = $(this);
                            var previewWidth = $preview.width();
                            var previewHeight = previewWidth / previewAspectRatio;
                            var imageScaledRatio = e.width / previewWidth;
                            $preview.height(previewHeight).find('img').css({
                                width: imageData.naturalWidth / imageScaledRatio,
                                height: imageData.naturalHeight / imageScaledRatio,
                                marginLeft: -e.x / imageScaledRatio,
                                marginTop: -e.y / imageScaledRatio
                            }).removeClass('cropper-hidden');
                        });
                    }
                });
                //  切割组件运行
                var imgCropCtrl = {
                    URL: window.URL || window.webkitURL,
                    blobURL: null,
                    inputImage: uploadInput
                };
                imgCropCtrl.inputImage.change(function() {
                    var files = this.files;
                    var file;
                    if (!imgCropper.data('cropper')) {
                        return;
                    }
                    if (files && files.length) {
                        console.log('step1');
                        file = files[0];
                        // 判断文件是否为空
                        if (file.size < 10) {
                            service.dialog.alert('文件过小，请选择其它文件！');
                            imgCropCtrl.blobURL = imgCropCtrl.URL.createObjectURL(file);
                            imgCropCtrl.inputImage.val('');
                        } else if (/^image\/\w+$/.test(file.type)) {
                            $timeout(function() {
                                $scope.c.showEdit = true;
                                imgCropCtrl.blobURL = imgCropCtrl.URL.createObjectURL(file);
                                imgCropper.one('built.cropper', function() {
                                    imgCropCtrl.URL.revokeObjectURL(imgCropCtrl.blobURL); //  Revoke when load complete
                                }).cropper('reset').cropper('replace', imgCropCtrl.blobURL);
                                imgCropCtrl.inputImage.val('');
                            });
                        } else {
                            service.dialog.alert('只支持以下格式图片上传：png,jpg,bmp,gif,jpeg。');
                            imgCropCtrl.blobURL = imgCropCtrl.URL.createObjectURL(file);
                            imgCropCtrl.inputImage.val('');
                        }
                    }
                });
            };
            $timeout(function() {
                $scope.init();
            });
            // destroy监听
            // $scope.$on('$destroy', function() {});
        }
    };
});