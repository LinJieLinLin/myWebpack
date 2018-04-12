/**
 * Created by Fox2081 on 2016/11/28.
 */
DYC.factory('fullScreenImage', function(request) {
    var urlRcp = '';
    var style = '.full-screen-image{position:fixed;width:100%;height:100%;top:0;left:0;z-index:10000;overflow:auto;background-color:rgba(0,0,0,.6)}.full-screen-image .close{position:fixed;top:6px;right:10px;font-size:50px;z-index:2}.full-screen-image .close:hover{color:#c3c3c3}.full-screen-image>img{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:1;max-width:100%;max-height:100%}';
    return {

        /**
         * 显示大图
         * @param url
         * @param ext
         * @returns {*}
         */
        show: function(url, ext) {
            var tpl =
                '<div><style>' + style + '</style>' +
                '<div class="full-screen-image">' +
                '<i class="fa fa-times color-gray close"></i>' +
                '<img src="' + url + '" alt="">' +
                '</div></div>';

            var image = $(tpl);
            image.off('click').on('click', function() {
                image.remove();
                rcpAid.toggleHtmlOverflowHidden(false);
            });
            image.find('i.close').one('click', function() {
                image.remove();
                rcpAid.toggleHtmlOverflowHidden(false);
            });

            rcpAid.toggleHtmlOverflowHidden(true);
            $('body').append(image);
        }
    };
});

DYC.run(function(service, fullScreenImage) {
    service.expand('fullScreenImage', function() {
        return fullScreenImage;
    });
});