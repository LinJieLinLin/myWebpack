'use strict';
let path = require('path');
import B from './common.js';
export default {
    createCourse: function() {
        'use strict';
        it('createCourse', function() {
            // 进入创建页
            B.w();
            B.a().
            mouseMove($$('.menber-link').get(0)).
            perform();
            B.s(1);
            let newCourse = $$('.u-panel .card-sets').get(0).all(by.tagName('a')).get(1);
            newCourse.click();
            B.w();
            // set course info
            let I = {
                name: element(by.model('course.crs.title')),
                point: element(by.model('course.crs.credit')),
                time: element(by.model('course.crs.period')),
                people: element(by.model('course.crs.suitable'))
            };
            I.name.sendKeys('e2e-' + (+new Date()));
            I.point.sendKeys(1);
            I.time.sendKeys(10);
            I.people.sendKeys('小学生');
            // upload img
            let filePath = '../img/img-1.png',
                absPath = path.resolve(__dirname, filePath),
                upImg = element(by.id('upload-input-courseEdit'));
            console.log(absPath);
            browser.executeScript('$("#upload-input-courseEdit").show();');
            upImg.sendKeys(absPath);
            let upload = element(by.id('upload-img-courseEdit')).all(by.css('[ng-click="confirmImg()"]')).get(1);
            upload.click();
            browser.executeScript('$("#upload-input-courseEdit").hide();');
            // save course
            let save = $$('.save-b').get(0);
            save.click();
            B.s(4);
        });
    },
    delCourse: function() {
        it('delCourse', function() {
            // into teacher center
            B.w();
            B.a().
            mouseMove($$('.menber-link').get(0)).
            perform();
            B.s(1);
            let teaCenter = $$('.u-panel .card-sets').get(0).all(by.tagName('a')).get(0);
            teaCenter.click();
            B.w();
            // // set course info
            let manage = element(by.css('[ng-click="chgToManage()"]'));
            manage.click();
            B.s(1);
            let delBtn =$$('.course-item').get(0).all(by.css('.c-right')).get(0);
            delBtn.click();
            B.s(1);
            let submit = element(by.css('[config="garbageDialog"] [ng-click="ok()"]'));
            submit.click();
            B.s(2);
        });
    }
}