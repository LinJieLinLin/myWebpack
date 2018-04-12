import B from './module/common.js';
import Login from './module/login.js';
import Course from './module/course.js';
describe("login", function() {
    var rootEl;
    beforeEach(function() {
        rootEl = browser.rootEl;
        browser.get("index.html");
    });

    Login.login();
    // Course.createCourse();
    Course.delCourse();
    // Login.logout();
});