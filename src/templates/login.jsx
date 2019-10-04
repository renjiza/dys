import React from 'react';
import { InputGroup, FormGroup, Tooltip, Button, Colors, H4, Intent, Toaster } from '@blueprintjs/core';
import { observable } from 'mobx';
import { Observer, useObserver } from 'mobx-react-lite';
import Cookies from 'js-cookie';


import { get, put, post, emit, socket } from '../components/xhr';
import { publicPath } from '../components/router';
import history from '../components/history';
import global from '../stores/globalstore';


const containerStyle = {
    height: '90%',
    fontSize: 16,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
}

export const login = observable({
    isLoading: false,
    isShowPassword: false,
    input: {
        email: 'renji.izaki@gmail.com',
        password: '123'
    },
    async _login() {
        login.isLoading = true
        post('in', this.input).then(res => {
            login.isLoading = false
            if (res.error === null) {                                                
                Cookies.set('__dys_cookie_control', res.response.token)
                global.control = res.response
                global.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                    fullname: res.response.userFullname,
                }
                login._getMenuByToken().then(() => {
                    login._getNotification()
                    login._getNotificationPrivilegeById()
                })
                global._listener()
                emit('connected', res.response)
                history.replace('/')
            } else {
                login.input.password = ''
                const toast = Toaster.create({
                    position: 'top',
                });
                toast.show({ message: res.error, intent: 'warning', icon: 'warning-sign' })
            }
        }).catch((err) => {
            login.isLoading = false
            const toast = Toaster.create({
                position: 'top',
            })
            toast.show({ message: 'tidak dapat terhubung ke server', intent: 'danger', icon: 'ban-circle' })
        })
    },
    async _logout() {
        return put('out', { token: Cookies.get('__dys_cookie_control') }).then(res => {
            if (res.status === 200) {
                emit('logout', global.cookie)
                Cookies.remove('__dys_cookie_control')
                socket.removeAllListeners()
                global.control = {
                    userId: null,
                    userEmail: null,
                    userPassword: null,
                    userFullname: null,
                    userSuper: null,
                    userToken: null,
                    token: null,
                    clientId: null,
                    clientName: null,
                    clientEmail: null,
                    clientPhone: null,
                    clientAddress: null,
                    clientLogo: null,
                    branchId: null,
                    branchName: null,
                }
                global.cookie = {
                    client: null,
                    branch: null,
                    user: null,
                    fullname: null,
                }
                history.replace('/login')
            }
        })
    },
    async _checkSession() {
        return get('checkSession', { token: Cookies.get('__dys_cookie_control') }).then(res => {
            if (res.response !== null) {
                global.control = res.response
                global.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                    fullname: res.response.userFullname,
                }                
                global._listener()                
                emit('connected', res.response)
            } else {
                Cookies.remove('__dys_cookie_control')
                setTimeout(() => history.replace('/login'), 100)
            }
            if (publicPath.indexOf(history.location.pathname) !== -1) {
                history.replace('/')
            }
        })
    },
    async _getMenuByToken() {
        return get(`getMenuByToken`, { token: Cookies.get('__dys_cookie_control') }).then(res => {
            if (res.error === null && res.response !== null) {
                global.menu = res.response                
            }
        })
    },
    async _getNotification() {
        return get(`getNotification`, {}).then(res => {
            if (res.error === null && res.response !== null) {
                global.notification = res.response
            }
        })
    },

    async _getNotificationPrivilegeById() {
        if (global.menuNotificationOld.length > 0) {
            global.menuNotificationOld.map(o => socket.off(`${o.menuKey} ${o.menuAction}`))
        }
        return get(`getNotificationPrivilegeById`, {}).then(res => {
            if (res.error === null && res.response !== null) {
                global.menuNotificationOld = res.response
                res.response.map(o => {
                    console.log(`listening event ${o.menuKey} ${o.menuAction}`)
                    socket.off(`${o.menuKey} ${o.menuAction}`)
                    socket.on(`${o.menuKey} ${o.menuAction}`, msg => {
                        if (global.cookie.user !== msg.senderId) {
                            global.notification.unshift(msg)                            
                        }
                        return true
                    })
                    return true
                })
            }
        })
    },
})

const EmailInput = () => {
    return useObserver(() => (
        <FormGroup label="Email">
            <Observer>{() =>
                <InputGroup
                    type="email"
                    large
                    value={login.input.email || ''}
                    onChange={e => login.input.email = e.target.value}
                />
            }</Observer>
        </FormGroup>
    ))
}

const PasswordInput = () => {
    return useObserver(() => (
        <FormGroup label="Password">
            <Observer>{() =>
                <InputGroup
                    large
                    rightElement={<TogglePassword />}
                    type={login.isShowPassword ? "text" : "password"}
                    value={login.input.password || ''}
                    onChange={e => login.input.password = e.target.value}
                />
            }</Observer>
        </FormGroup>
    ))
}

const TogglePassword = () => (
    <Tooltip content={`${login.isShowPassword ? "Sembunyikan" : "Perlihatkan"} Password`} position="top-right">
        <Button
            minimal
            icon={login.isShowPassword ? "unlock" : "lock"}
            color={Colors.RED5}
            onClick={() => login.isShowPassword = !login.isShowPassword}
        />
    </Tooltip>
)

const Login = () => (
    <div style={containerStyle}>
        <div className="loginbox">
            <H4 className="primary3" style={{ textAlign: 'center' }}>Masuk</H4>
            <EmailInput />
            <PasswordInput />
            <br />
            <Observer>{() =>
                <Button onClick={() => login._login()} loading={login.isLoading} large fill icon="log-in" text="Masuk" intent={Intent.PRIMARY} />
            }</Observer>
        </div>
    </div>
)

export default Login