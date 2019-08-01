import { observable } from 'mobx';
import { Toaster } from '@blueprintjs/core';
import Cookies from 'js-cookie';
import history from '../components/history';
import { get, put, post } from '../components/xhr';
import { publicPath } from '../components/router';


const global = observable({
    appname: 'DS Sources',
    login: {
        email: 'renji.izaki@gmail.com',
        password: '123'
    },
    control: {
        isLogged: false,
        token: null,
        userid: null,
        email: null,
        fullname: null,
        clientId: null,
        clientname: null,
        branchId: null,
        branchname: null,
    },
    cookie: {
        client: null,
        branch: null,
        user: null,
    },
    menu: [],
    getMenuInfo(link) {
        const index = this.menu.findIndex(o => o.menuLink === link)
        return this.menu[index]
    },
    async _login() {
        post('in', this.login).then(res => {
            if (res.error === null) {
                Cookies.set('__ds_cookie_control', res.response.token)
                this.control = res.response
                this.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                }
                this.appname = res.response.clientname
                this._getMenuUser()
                history.replace('/')
            } else {
                const toast = Toaster.create({
                    position: 'top',
                });
                toast.show({ message: res.error, intent: 'warning', icon: 'warning-sign' })
            }
        }, (err) => {
            console.log(err)
            const toast = Toaster.create({
                position: 'top',
            })
            toast.show({ message: 'tidak dapat terhubung ke server', intent: 'danger', icon: 'ban-circle' })
        })
    },
    async _checkSession() {
        return get('checkSession', { token: Cookies.get('__ds_cookie_control') }).then(res => {
            console.log('[checkSessionPass]', res.response !== null)
            if (res.response !== null) {
                this.control = res.response
                this.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                }                
            }
            if (publicPath.indexOf(history.location.pathname) !== -1) {
                history.replace('/')
            }
        })
    },
    async _logout() {
        return put('out', { token: Cookies.get('__ds_cookie_control') }).then(res => {
            if (res.status === 200) {
                this.control = { 
                    isLogged: false,
                    token: null,
                    userid: null,
                    email: null,
                    fullname: null,
                    clientId: null,
                    clientname: null,
                    branchId: null,
                    branchname: null,
                }
                this.cookie = {
                    client: null,
                    branch: null,
                    user: null,
                }
                Cookies.remove('__ds_cookie_control')
                history.replace('/login')
            }
        })
    },

    async _getMenu() {
        return get('getMenu', {}).then(res => {
            if (res.error === null && res.response !== null) {
                this.menu = res.response
            }
        })
    },
    async _getMenuUser() {
        return get(`getMenuUser`, { token: Cookies.get('__ds_cookie_control') }).then(res => {
            if (res.error === null && res.response !== null) {
                this.menu = res.response
            }
        })
    }    
})

export default global