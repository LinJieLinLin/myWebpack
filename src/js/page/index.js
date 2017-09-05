import LinPlayer from '../common/lin-video.js';
require('../common/test.js');
require('../../css/lib/reset.css');
require('../../css/common/global.css');
require('../../css/common/grid.css');
require('../../css/page/index.scss');
require('font-awesome/css/font-awesome.css');
$('.g-bd').append('<p class="text">这是由js生成的一句话。</p>');
let temId = 'linVideo';
let option = {
    // autoPlay: true,
    type: 'video',
    src: 'http://kuxiao.jxzy.com/Act-ss-mp4-hd/59142851e27ce1253d36da3c.mp4?OSSAccessKeyId=STS.MWgVXMKErUNk8Qpqxv7aVXT6z&Expires=1499281948000&security-token=CAIS%2FwF1q6Ft5B2yfSjIrJTSHeL5pppT4oyAOnfBlXgjO%2B56t5GdmDz2IHBMdXdrCeEev%2F82nmhU5%2FwZlrEuGsJJH0ecPMIpsZldrVj9bdSbt5TosrZcGA9m0NHQWXDBx8b3T7jTbrG0I4WACT3tkit03sGJF1GLVECkNpukkINuas9tMCCzcTtBAqU9RGIg0rh4U0HcLvGwKBXnr3PNBU5zwGpGhHh49L60z7%2F3iHOcriWjmrNN%2F96gf8H8NpM3bMoiabrvgrwqLJim%2BTVL9h1H%2BJ1xiKF54jrdtrmfeQIBu0TYaLqFqow0dVUhOvlgQLQksvnwmPpjpvfDMG5QKYqK94oagAFJ0a2cQh6aso5bjZRC486I22Bpsirh6ZGuvE1m%2FPw7ClmLr8YtzJXM25B5v3%2BXfMjeaBoH84B8sy%2BNkVRHY72E6Y6YfWL8VLtr3a7T1Jx64RW6Hfr9%2FgW9hmBCj0DFBFVc2aCYq1BlRR8tRim%2BnxfxJzq3dEwOPQJXRI5DaZoOMg%3D%3D&Signature=hdZJRfiKmjkwdYEtDNMqEZ7X8Mk%3D',
    id: temId
};
var linPlayer = LinPlayer(option);
window.linPlayer = linPlayer;
console.log(linPlayer);
