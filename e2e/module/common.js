let B = {
    s: (argTime, argRate) => {
        return browser.sleep(argTime * 1000 * (argRate || 1));
    },
    w: (argTime) => {
        return browser.waitForAngular();
    },
    a: () => {
        return browser.actions();
    }
};
export default B;