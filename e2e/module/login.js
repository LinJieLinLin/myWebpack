'use strict'
import B from './common.js';
export default {
    login: function() {
        it('login', function() {
            B.w();
            let loginLink = browser.findElement(by.id('login'));
            loginLink.click();
            B.w();
            let name = element(by.model('lData.account'));
            let pwd = element(by.model('lData.password'));
            let loginFn = element(by.binding('loginText'));
            name.sendKeys('15920385215');
            pwd.sendKeys('123123');
            expect(loginFn.getText()).toEqual('登录');
            loginFn.click();
            B.s(2);
        });
    },
    logout: function() {
        it('logout', function() {
            B.w();
            B.a().
            mouseMove($$('.menber-link').get(1)).
            perform();
            B.s(1);
            let logout = element(by.css('.u-panel .card-exit')).all(by.tagName('a')).get(0);
            logout.click();
            B.s(5);
        });
    }
}