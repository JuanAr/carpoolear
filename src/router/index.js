/* jshint esversion: 6 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes.js';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
  // esto hay que atarlo a si estoy en cordova o no
    mode: process.env.HISTORY_MODE,
    base: process.env.ROUTE_BASE

});

router.beforeEach((to, from, next) => {
    let actionbar = to.meta.actionbar || {};
    let background = to.meta.background || {};
    let user = store.getters['auth/checkLogin'];
    if (user && actionbar.footer) {
        if (actionbar.footer.show) {
            store.dispatch('actionbars/showFooter', true);
        } else {
            store.dispatch('actionbars/showFooter', false);
        }
        if (actionbar.footer.active_id) {
            store.dispatch('actionbars/setActiveFooter', actionbar.footer.active_id);
        }
    } else {
        store.dispatch('actionbars/showFooter', false);
    }

    if (actionbar.header) {
        store.dispatch('actionbars/setSubTitle', '');
        if (actionbar.header.title) {
            store.dispatch('actionbars/setTitle', actionbar.header.title);
        } else {
            store.dispatch('actionbars/setTitle', 'Carpoolear');
        }
        if (actionbar.header.buttons) {
            store.dispatch('actionbars/setHeaderButtons', actionbar.header.buttons);
        } else {
            store.dispatch('actionbars/setHeaderButtons', []);
        }
        if (actionbar.header.logo) {
            store.dispatch('actionbars/showHeaderLogo', actionbar.header.logo.show);
        } else {
            store.dispatch('actionbars/showHeaderLogo', true);
        }
    } else {
        store.dispatch('actionbars/setTitle', 'Carpoolear');
        store.dispatch('actionbars/setHeaderButtons', []);
        store.dispatch('actionbars/showHeaderLogo', true);
    }
    if (background.style) {
        store.dispatch('background/setBackgroundStyle', background.style);
    } else {
        store.dispatch('background/setBackgroundStyle', 'gray');
    }
    window.scrollTo(0, 0);
    next();
});

router.stack = [];
router._push = router.push;
router._replace = router.replace;
router._go = router.go;

router.push = function (data) {
    console.log(router.stack);
    router.stack.push(data);
    router._push(data);
};

router.replace = function (data) {
    router.stack.pop();
    router.stack.push(data);
    router._push(data);
};

router.go = function (number) {
    console.log(router.stack);
    router.stack.slice(0, number);
    router._go(number);
};

export default router;
