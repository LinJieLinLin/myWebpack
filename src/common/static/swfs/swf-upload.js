/* eslint-disable */

console.log('this is swf-upload-------------------------');

window.SWFUP = {
    nowScope: {},
    swfCb: '',
    isResourceManager: false
};

window.SwfUpload = function(id, scope, cb, option) {
    SWFUP.nowScope[id] = scope;
    SWFUP.swfCb = cb;
    SWFUP.isResourceManager = 'isResourceManager' in option && option.isResourceManager;
    var defaultOption = {
        session: document.cookie,
        isAutoUploadAfterSelect: false, //whether auto start upload after select file or not.
        fileMaxSize: option.fileMaxSize || 10240000, //the max file allow to be uploaded.
        fileMinSize: 10, //the min file allow to be uploaded.
        uploadUrl: DYCONFIG.fs.upload, //the upload server path.
        filePostName: 'file', //the file post name.
        language: 'ch', //the language of the information.
        selectErrorFunction: 'uploadErr', //the function that will be call when select error file.
        postVarsFun: SWFUP.isResourceManager ? 'resourceManagerPostVal' : 'postVal', //the function that will be call before upload.return the name/value you want to post ,split by '&'.
        returnDataType: 'json', //the return data type from server.
        completeCallBack: 'uploadSu', //the upload complete call back method.
        selectFile: 'selectFile', //the select file call back method.
        beforeSelectFile: 'upImg', //the before select file call back method.
        imageMaxWidth: 100000, //the image maximal width can be upload.
        imageMaxHeight: 100000, //the image maximal heigth can be upload.
        imageMinWidth: 1, //the image minimal width can be upload.
        imageMinHeight: 1, //the image minimal height can be upload.
        imageExts: ['.jpg', '.png', '.bmp', '.gif', '.jpeg'], //the image extension to check the width and height.
        multiFile: true, //whether can be upload multi-files.
        buttonWidth: option.width || '70',
        buttonHeight: option.height || '30',
        //返回实例ID
        id: id,
    };
    if (typeof option == 'object') {
        defaultOption = $.extend(defaultOption, option);
    }
    var w = defaultOption.buttonWidth;
    var h = defaultOption.buttonHeight;
    defaultOption.buttonWidth = defaultOption.buttonWidth.replace('%', '');
    defaultOption.buttonHeight = defaultOption.buttonHeight.replace('%', '');

    console.log('this is the swfobject replaced id:', id);

    swfobject.embedSWF(
        '/swfs/SingleFlashUploader.swf',
        id,
        w,
        h,
        '10.0.0',
        '/swfs/playerProductInstall.swf',
        defaultOption, {
            quality: 'high',
            bgcolor: 'transparent',
            allowscriptaccess: 'sameDomain',
            allowfullscreen: 'false',
            wmode: 'transparent',
        }, {
            id: id,
            name: id,
            align: 'middle'
        });
    swfobject.createCSS('#' + id + '', 'display:block;text-align:left;');
    console.log('this is swfobject need version', swfobject.hasFlashPlayerVersion('10.0.0'));
};

//上传失败
window.uploadErr = function(err) {
    // console.log(err);
    jf.alert(err);
};

//选择后文件后
window.selectFile = function(fv, f) {
    // console.log(f);

    // 上传进度条 only support for resource-manager
    if (SWFUP.isResourceManager) {
        $('#resource-manager-upload-progress-bar').css('display', 'block');
    }
};

//上传成功
window.uploadSu = function(opt, ob) {
    // console.log('up success');
    // console.log(opt);
    if (opt.id) {
        try {
            SWFUP.nowScope[opt.id][SWFUP.swfCb](opt, ob);
            SWFUP.nowScope[opt.id].$digest();

            // 上传进度条 only support for resource-manager
            if (SWFUP.isResourceManager) {
                $('#resource-manager-upload-progress-bar').css('display', 'none');
            }
        } catch (e) {
            console.log(e);
        }
    }
};

//上传参数
window.postVal = function(args) {
    if (!args) {
        args = {};
    }
    var postData = {
        m: args.m || 'C',
        pub: args.pub || '1',
        picType: args.picType || '1',
        fileName: args.fileName || '1.png',
        token: rcpAid.getToken()
    };
    return $.param(postData);
};

/**
 * 上传参数
 * only support for resource-manager
 */
window.resourceManagerPostVal = function() {
    return $.param({
        folder: '',
        pub: 0,
        recorded: 1,
        token: rcpAid.getToken()
    });
};

window.upImg = function(fv) {
    return [{
        'name': '图片',
        'extensions': '*.jpg;*.bmp;*.png,*.gif,*.jpeg'
    }];
};

window.picFile = function(fv) {
    return [{
        'name': '图片',
        'extensions': '*.jpg;*.bmp;*.png,*.gif,*.jpeg'
    }];
};

window.allFile = function(fv) {
    return [{
        'name': '所有',
        'extensions': '*.*'
    }];
};

window.videoFile = function(fv) {
    return [{
        'name': '视频',
        'extensions': '*.wmv no support;'
    }];
};

window.attachFile = function(fv) {
    return [{
        'name': '附件',
        'extensions': '*.doc;*.docx;*.pdf;*.ppt;*.pptx;*.txt;*.xls;*.xlsx;*.jpg;*.bmp;*.png,*.gif,*.jpeg'
    }];
};

window.audioFile = function(fv) {
    return [{
        'name': '音频',
        'extensions': '*.mp3;*.amr;*.flac; *.wav; *.ape'
    }]
};
//upload process
window.onSupProcess = function(argP) {
    // console.log(argP);
    // 上传进度条 only support for resource-manager
    if (SWFUP.isResourceManager) {
        var percentage = (argP * 100).toPrecision(3) + '%';
        $('#resource-manager-upload-progress-bar > .upload-tips > span').html(percentage);
        $('#resource-manager-upload-progress-bar > .upload-progress-bar > div').width(percentage);
    }
};