/**
 * [阿里云视频播放]
 * eg:
 * html:
 * <div id="我是id"></div>
 * js:
 * aliyunPlayer.getVideoData(fid,'我是id',{配置文件在https://help.aliyun.com/document_detail/43549.html});
 * //播放器API
 * play()，播放视频
 * pause()，暂停视频
 * replay()，重播视频
 * seek(time)，跳转到某个时刻进行播放，time的单位为秒
 * getCurrentTime()，获取当前的播放时刻，返回的单位为秒
 * getDuration()，获取视频总时长，返回的单位为秒
 * getVolume()，获取当前的音量，返回值为0-1的实数，ios和部分android会失效
 * setVolume(vol)，设置音量，vol为0-1的实数，ios和部分android会失效
 * loadByUrl(url,time)，直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换，暂不支持直播rtmp流切换
 * setPlayerSize(w,h)，设置播放器大小，w,h可分别为400px像素或60%百分比，chrome浏览器下flash播放器分别不能小于397x297
 * 使用方法
 * eg:aliyunPlayer.list['我是id'].player.play();
 * [获取阿里云视频播放地址]
 * eg:
 * aliyunPlayer.getVideoUrl(fid,function(data){
 *     console.log(data);
 *     videoUrl = data.videoUrl;
 * })
 * [阿里云视频下载]
 * eg:
 * js:
 * aliyunDownload.download('文件id','下载的文件名，不传为默认名');
 * [阿里云视频上传]
 * 通过传入jswf实例，额外设置put上传
 * eg:
 * js:
 * aliyunUpload.startUpload('选中文件数据','jswf实例')
 * 外部js变量：
 * moment,jf,rcpAid
 */
(function(win) {
    var urllib, ossW, sts;
    var fsUrl = DYCONFIG.fs.rUrl;
    var playerList = {
        // argId: {
        //     // 视频过期时间
        //     endTime: 0,
        //     // 文件id
        //     fid: null,
        //     // 配置
        //     option: {},
        //     // 播放器对象
        //     player: null,
        //     //过期重新请求次数 最多3次
        //     requestNum: 1,
        // }
    };

    /**
     * [记录上传下载错误]
     * @param  {[type]} argFile [文件信息 argFile.id=fid]
     * @param  {[type]} argXhr  [xhr,请求信息]
     * @param  {[type]} argData [上传时视频key等信息]
     * @return {[type]}         [description]
     */
    function recordErrorInfo(argFile, argXhr, argData) {
        //记录错误信息
        var reason = '';
        if (rcpAid.safe(argXhr, 'responseText')) {
            reason = argXhr.responseText.match(/<Message>(.*?)<\/Message>/) || argXhr.responseText || '';
        }
        if (typeof reason === 'object' && reason.length) {
            reason = reason.pop();
        }
        var data = {
            fid: rcpAid.safe(argData, 'fids.0') || argFile.id || '',
            url: argXhr.responseURL || '',
            ext: argXhr.responseText || '',
            reason: reason || '连接意外断开，请重新上传！',
            token: rcpAid.getToken(),
        };
        data.fid = data.url.split('/').pop();
        if (argData) {
            var temIndex = $.inArray(data.fid, rcpAid.safe(argData, 'videoKey', []));
            if (temIndex != -1) {
                data.fid = argData.fids[temIndex];
            }
        }
        if (jf && jf.alert) {
            jf.alert(data.reason);
        }
        $.post(fsUrl + 'usr/api/storeError', data).done(function(rs) {
            console.log(rs);
        }).fail(function(e) {
            console.log(e);
        });
    }
    win.aliyunPlayer = {
        //播放对象列表
        list: playerList,
        nowVideo: null,
        /**
         * 获取视频信息
         * @param  {[type]} argFid    [文件id]
         * @param  {[type]} argId     [元素id]
         * @param  {[type]} argOption [播放配置]
         * @param  {[type]} argReload [true强制重新加载]
         * @return {[type]}           [description]
         */
        getVideoData: function(argFid, argId, argOption, argReload) {
            var player;
            //设置其它视频播放状态
            for (var temKey in playerList) {
                playerList[temKey].isPlay = false;
                $('#' + temKey).html('');
            }
            if (!playerList[argId]) {
                playerList[argId] = {
                    // 视频过期时间
                    endTime: 0,
                    // 文件id
                    fid: argFid,
                    // 配置
                    option: argOption || {},
                    // 播放器对象
                    player: null,
                    //过期重新请求判断，为1时，重新请求
                    requestNum: 1,
                };
            }
            playerList[argId].isPlay = true;
            var data = {
                fid: argFid,
                token: rcpAid.getToken(),
            };
            $('#' + argId).html('<div class="aliyun-video-load" style="width:' + argOption.width + ';height:' + argOption.height + '"><div><div></div><div></div><div></div></div></div>');
            //获取视频地址
            getVideoInfo(argFid, function(rs) {
                //请求失败处理
                if (!rcpAid.safe(rs.data, 'Credentials.AccessKeyId') || !rcpAid.safe(rs.data, 'infoes.bucket')) {
                    $('#' + argId).html('<video id="v-' + argId + '" style="background-color: #000000;" src="" width="' + argOption.width + '" height="' + argOption.height + '" per="100%" autoplay="autoplay" controls="controls"></video>');
                    switch (rs.code) {
                        case 1001:
                            console.info('阿里云视频ID不存在');
                            break;
                    }
                    return;
                }
                if (!playerList[argId].isPlay) {
                    return;
                }
                //请求成功处理
                var data = rs.data,
                    //视频地址
                    url,
                    //
                    videoPlayerOption,
                    //签名
                    signature;
                url = getUrl(data);
                console.log('player addr:', url);
                $('#' + argId).html('<video id="v-' + argId + '" src="' + url + '" width="' + argOption.width + '" height="' + argOption.height + '"  style="background-color: #000000;" per="100%" autoplay="autoplay" controls="controls"></video>');
                playerList[argId].player = {
                    pause: function() {
                        $('#' + argId).html('<video id="v-' + argId + '" style="background-color: #000000;" src="" width="' + argOption.width + '" height="' + argOption.height + '" per="100%" autoplay="autoplay" controls="controls"></video>');
                    }
                };
            }, function(e) {
                $('#' + argId).html('<video id="v-' + argId + '" style="background-color: #000000;" src="" width="' + argOption.width + '" height="' + argOption.height + '" per="100%" autoplay="autoplay" controls="controls"></video>');
                if (e) {
                    console.error(e);
                    recordErrorInfo({ id: argFid }, { responseText: e.responseText, responseURL: fsUrl + 'usr/api/getVideoSTS' });
                }
                return;
            });
        },
        /**
         * 获取播放地址
         * @param  {[type]} argFid  [文件id]
         * @param  {[type]} argSucb [成功回调]
         * @return {[type]}         [description]
         */
        getVideoUrl: function(argFid, argSucb) {
            //获取视频地址
            getVideoInfo(argFid, function(rs) {
                //请求成功处理
                if (rs.code !== 0) {
                    console.log('返回数据有误！');
                    if (jf && jf.alert) {
                        jf.alert('视频地址失效！');
                    }
                    return;
                }
                var data = rs.data;
                data.playUrl = getUrl(data);
                console.log('video addr:', url);
                if (argSucb) {
                    argSucb(data);
                }
            }, function(e) {
                console.log(e);
                return;
            });
        },
        /**
         * 暂停正在播放的视频
         * @return {[type]} [description]
         */
        pauseNowVideo: function() {
            if (!aliyunPlayer || !aliyunPlayer.nowVideo) {
                return;
            }
            try {
                aliyunPlayer.nowVideo.player.pause();
            } catch (e) {
                console.error(e);
            }
        },
    };
    win.aliyunUpload = {
        client: null,
        /**
         * 开始上传到阿里去
         * @param  {[type]} argFiles [选中的文件信息]
         * @param  {[type]} argUer   [jswf实例]
         * @return {[type]}          [description]
         */
        startUpload: function(argFiles, argUer) {
            if (typeof OSS !== 'undefined') {
                ossW = OSS.Wrapper;
                urllib = OSS.urllib;
            }
            var url, data, fileNames = [],
                marks = [];
            url = fsUrl + 'usr/api/getUploadRole';
            argFiles.forEach(function(v, k) {
                fileNames.push(v.name);
                if (rcpAid.safe(v, 'args.mark')) {
                    marks.push(v.args.mark);
                }
            });
            data = {
                token: rcpAid.getToken(),
                fileNames: JSON.stringify(fileNames),
                recorded: rcpAid.safe(argUer, 'Args.recorded', 0),
            };
            if (marks.length) {
                data.marks = marks.join(',');
            }
            /**
             * 一个一个视频上传
             * @param  {[type]} argFile  [文件信息]
             * @param  {[type]} argIndex [索引]
             * @param  {[type]} 签名信息 [索引]
             * @return {[type]}          [description]
             */
            function uploadOne(argFile, argIndex, argData) {
                if (typeof OSS !== 'undefined') {
                    aliyunUpload.client.multipartUpload(argData.videoKey[argIndex], argFile, {
                        progress: function(rate) {
                            return function(done) {
                                console.log('aly progress:', rate);
                                argUer.OnProcess(argFile, rate);
                                done();
                            };
                        }
                    }).then(function(re) {
                        console.log('aly up sucess', re);
                        if (!argFile.base) {
                            argFile.base = {};
                        }
                        argFile.base.id = argData.fids[argIndex];
                        //后缀
                        argFile.base.ext = argFile.name.split('.').pop();
                        argFile.base.type = 'video';
                        argUer.OnSuccess(argFile, argFile);
                    }, function(err) {
                        console.log('aly up error', err);
                        recordErrorInfo(argFile, err, argData);
                        argUer.OnErr(argFile, argData);
                    });
                } else {
                    //生成head
                    function setHeader() {
                        moment.locale('en');
                        var header = {
                            'x-oss-date': moment(argData.serverTime || rcpAid.safe(UINFO, 'now') || +(new Date())).utc().format('ddd, DD MMM YYYY HH:mm:ss G\\MT'),
                            'x-oss-security-token': argData.Credentials.SecurityToken,
                            'x-oss-user-agent': navigator.userAgent ||
                                'aliyun-sdk-js/4.7.3 Chrome 58.0.3029.110 on Windows 10 64-bit',
                            'content-type': argFile.type || 'multipart/form-data',
                            //签名
                            authorization: null
                        };
                        moment.locale('zh-cn');
                        //生成签名
                        function signature(argStr) {
                            // var bytes = Crypto.HMAC(Crypto.SHA1, argStr, argData.Credentials.AccessKeySecret, {
                            //     asBytes: true
                            // });
                            // var signature = Crypto.util.bytesToBase64(bytes);
                            var signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(argStr, argData.Credentials.AccessKeySecret));
                            temP = argStr;
                            temS = signature;
                            return signature;
                        }
                        // 计算authorization
                        function authorization() {
                            var authorization = '',
                                ossHeaders = [],
                                params = ['PUT', '', header['content-type'], header['x-oss-date']],
                                stringToSign = '';
                            for (k in header) {
                                var temK = k.toLowerCase().trim();
                                if (temK.indexOf('x-oss-') === 0) {
                                    ossHeaders.push(temK + ':' + header[k]);
                                }
                            }
                            params = params.concat(ossHeaders);
                            params.push('/' + argData.bucket + '/' + argData.videoKey[argIndex]);
                            stringToSign = params.join('\n');
                            authorization = 'OSS ' + argData.Credentials.AccessKeyId + ':' + signature(stringToSign);
                            console.log(authorization);
                            return authorization;
                        }
                        header.authorization = authorization();
                        console.log(header);
                        return header;
                    }
                    var xhr = new XMLHttpRequest();
                    var upload = xhr.upload;
                    xhr.open('PUT', argData.host + argData.videoKey[argIndex]);
                    var header = setHeader();
                    for (var k in header) {
                        xhr.setRequestHeader(k, header[k]);
                    }
                    /**
                     * 上传是否成功
                     * @param  {[type]} re [description]
                     * @return {[type]}    [description]
                     */
                    xhr.onreadystatechange = function(re) {
                        if (xhr.readyState != 4) {
                            return;
                        }
                        if (xhr.status == 200) {
                            console.log('aly up sucess', re);
                            if (!argFile.base) {
                                argFile.base = {};
                            }
                            argFile.base.id = argData.fids[argIndex];
                            //后缀
                            argFile.base.ext = argFile.name.split('.').pop();
                            argFile.base.type = 'video';
                            argUer.OnSuccess(argFile, argFile);
                        } else {
                            console.log(xhr);
                            recordErrorInfo(argFile, xhr, argData);
                            argUer.OnErr(argFile, xhr.responseText, null);
                        }
                    };
                    //开始上传
                    upload.addEventListener('loadstart', function(e) {
                        console.log('aliyun up start:' + argFile.name);
                        argFile.Status = 'S';
                        argFile.speed = 0;
                        argFile.preloaded = 0;
                        argFile.pretime = new Date().getTime() / 1000;
                        argUer.sort();
                        argUer.OnStart(argFile, e);
                    }, false);
                    //上传百分比
                    upload.addEventListener('progress', function(data) {
                        rate = data.loaded / data.total;
                        console.log('aly progress:', data, rate);
                        argUer.OnProcess(argFile, rate || 0);
                    }, false);
                    xhr.send(argFile);
                }
            }
            //获取视频信息
            $.get(url, data).then(function(re) {
                var data = re.data;

                if (!data.videoKey || !data.fids) {
                    console.error('返回数据有误！', data);
                    return;
                }
                if (typeof OSS !== 'undefined') {
                    delete aliyunUpload.client;
                    aliyunUpload.client = new ossW({
                        secure: DYCONFIG.protocol === 'https:',
                        region: data.singleEndpoint,
                        accessKeyId: data.Credentials.AccessKeyId,
                        accessKeySecret: data.Credentials.AccessKeySecret,
                        stsToken: data.Credentials.SecurityToken,
                        bucket: data.bucket
                    });
                }
                data.host = data.endpoint.replace('http://', 'http://' + data.bucket + '.');
                data.host = data.host.replace('https://', 'https://' + data.bucket + '.') + '/';
                for (var i = 0; i < argFiles.length; i++) {
                    var file = argFiles[i];
                    uploadOne(file, i, data);
                }
            }, function(err) {
                console.log(err);
            });
            // urllib.request(url, {
            //     method: 'GET'
            // }).then(function(re) {
            //     delete aliyunUpload.client;
            //     var data = JSON.parse(re.data).data;
            //     aliyunUpload.client = new ossW({
            //         region: data.singleEndpoint,
            //         accessKeyId: data.AccessKeyId,
            //         accessKeySecret: data.AccessKeySecret,
            //         stsToken: data.SecurityToken,
            //         bucket: data.bucket
            //     });
            // }, function(err) {
            //     console.log(err);
            // });
            console.log(argFiles);
        },
    };
    win.aliyunDownload = {
        /**
         * 下载阿里云视频
         * @param  {[type]} argFid      [文件id]
         * @param  {[type]} argFileName [保存名称]
         * @return {[type]}             [description]
         */
        download: function(argFid, argFileName) {
            getVideoInfo(argFid, function(rs) {
                if (rs.code !== 0) {
                    console.log('返回数据有误！');
                    if (jf && jf.alert) {
                        jf.alert('获取下载地址失败！');
                    }
                    return;
                }
                var data = rs.data;
                // ossW = OSS.Wrapper;
                // urllib = OSS.urllib;
                // aliyunUpload.client = new ossW({
                //     region: data.infoes.locatin,
                //     accessKeyId: data.Credentials.AccessKeyId,
                //     accessKeySecret: data.Credentials.AccessKeySecret,
                //     stsToken: data.Credentials.SecurityToken,
                //     bucket: data.infoes.bucket
                // });
                // var url = aliyunUpload.client.signatureUrl(data.infoes.object);
                // console.log(url)
                // var url = aliyunUpload.client.signatureUrl(data.infoes.object, {
                //     response: {
                //         'content-disposition': 'attachment; filename="' + argFileName + '"'
                //     }
                // });
                // console.log(url);
                url = getUrl(data, true, argFileName);
                console.log(url);
                if (url) {
                    location.href = url;
                } else {
                    console.error('获取下载地址失败！');
                }
            }, function(err) {
                console.log(err);
            }, true);
        }
    };
    /**
     * 获取视频AccessKeyId等信息
     * @param  {[type]} argFid   [文件id]
     * @param  {[type]} argSucb  [成功回调]
     * @param  {[type]} argErrcb [失败回调]
     * @param  {[type]} argDl [是否下载]
     * @return {[type]}          [description]
     */
    function getVideoInfo(argFid, argSucb, argErrcb, argDl) {
        var data = {
            fid: argFid,
            token: rcpAid.getToken(),
        };
        if (argDl) {
            data.down = 1;
        }
        if (!data.fid) {
            if (jf && jf.alert) {
                recordErrorInfo({ id: argFid }, { responseText: '视频id不存在！', responseURL: fsUrl + 'usr/api/getVideoSTS' });
                return argErrcb();
            }
        }
        //获取视频地址
        $.get(fsUrl + 'usr/api/getVideoSTS', data).done(function(rs) {
            console.log(rs);
            if (rs.code !== 0) {
                console.log('返回数据有误！', rs);
                recordErrorInfo({ id: argFid }, { responseText: rcpAid.safe(rs, 'dmsg') || '获取视频地址失败！', responseURL: fsUrl + 'usr/api/getVideoSTS' });
                return argErrcb();
            }
            return argSucb(rs);
        }).fail(function(e) {
            //请求无响应
            return argErrcb(e);
        });
    }
    /**
     * 获取签名
     * argDl 是否为下载
     * argFileName 是否改名
     * @param  {[type]} argData   [eg:{
    "Credentials": {
      "AccessKeyId": "STS.La1t6xUjYqtcoqc3hFH4MYVLi",
      "AccessKeySecret": "59H99kWMcRgq8ZtjDGwaKt6X3WoqdojxAQpw7LTtFf8y",
      "Expiration": "2017-05-31T03:26:53Z",
      "SecurityToken": "CAIS/wF1q6Ft5B2yfSjIraKEP4zMuLV4xraIbVfS12gTRLthtpPnizz2IHBMdXdrCeEev/82nmhU5/wZlrEuGsVIHx3JYccutMhbqlv9PIOb4JG/5+1cbhhnlcXQWXDBx8b3T7jTbrG0I4WACT3tkit03sGJF1GLVECkNpukkINuas9tMCCzcTtBAqU9RGIg0rh4U0HcLvGwKBXnr3PNBU5zwGpGhHh49L60z7/3iHOcriWjmrNN/96gf8H8NpM3bMoiabrvgrwqLJim+TVL9h1H+J1xiKF54jrdtrmfeQIBu0TYaLqFqow0dVUhOvlgQLQksvnwmPpjpvfDMG5QKYqK94oagAEj24NBeytKAU1hmMYilF3PY6yMfDI1K2In6frzSjRGLfDaWU5PybWnsR7UyrqBT9Tqom8nuRG2HZf2pFjikVr5faljr20/qH3TC8TjFMQ8Sy2vq2TDx1kMKL6nE14StI4iJf+OVJfM5rVQZ8hlerh/sw7r3EQcCjRlXML4OlWIJQ=="
    },
    "fileUrl": "http://kuxiao-dev-output.oss-cn-shenzhen.aliyuncs.com/Act-ss-mp4-hd/59292027d624d30b247d172d.mp4",
    "infoes": {
      "bucket": "kuxiao-dev-output",
      "domain": "aliyuncs.com",
      "locatin": "oss-cn-shenzhen",
      "object": "Act-ss-mp4-hd/59292027d624d30b247d172d.mp4",
      "protocol": "http://",
      "state": "Success"
    }
  }]
     * @return {[type]} [description]
     */
    function getSignature(argData, argDl, argFileName) {
        var signature = '',
            options = {},
            infoes = argData.infoes || {},
            //url参数
            params;
        expires = (+new Date(rcpAid.safe(argData, 'Credentials.Expiration', null)));
        params = '/' + infoes.bucket + '/' + infoes.object + '?security-token=' + rcpAid.safe(argData, 'Credentials.SecurityToken');
        if (argDl) {
            if (argFileName) {
                params = '/' + infoes.bucket + '/' + infoes.object + '?response-content-disposition=attachment; filename="' + argFileName + '"&security-token=' + rcpAid.safe(argData, 'Credentials.SecurityToken');
            } else {
                params = '/' + infoes.bucket + '/' + infoes.object + '?response-content-disposition=attachment&security-token=' + rcpAid.safe(argData, 'Credentials.SecurityToken');
            }
        }
        password = [
            options.method || 'GET',
            // Content-MD5
            options['content-md5'] || '',
            // Content-Type
            options['content-type'] || '',
            expires,
            params
        ].join('\n');
        // console.log('signature params:', password);
        signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(password, rcpAid.safe(argData, 'Credentials.AccessKeySecret')));
        return signature || '';
    }
    /**
     * 获取签名后的url
     * @param  {[type]} argData [同getSignature()]
     * @param  {[type]} argDl [是否下载()]
     * @param {[type]} [argFileName] [是否改名]
     * @return {[type]}         [description]
     */
    function getUrl(argData, argDl, argFileName) {
        var url,
            signature,
            i;
        signature = getSignature(argData, argDl, argFileName);
        url = argData.fileUrl + '?OSSAccessKeyId=' + argData.Credentials.AccessKeyId + '&Expires=' + expires + '&security-token=' + encodeURIComponent(argData.Credentials.SecurityToken) + '&Signature=' + encodeURIComponent(signature);
        if (argDl) {
            if (argFileName) {
                url += '&response-content-disposition=' + encodeURIComponent('attachment; filename="' + argFileName + '"');
            } else {
                url += '&response-content-disposition=attachment';
            }
        }
        return url;
    }
})(window);