import React from 'react';
import { InputGroup, FormGroup, Tooltip, Button, Colors, H4, Intent, Toaster } from '@blueprintjs/core';
import { observable } from 'mobx';
import { Observer, useObserver } from 'mobx-react-lite';
import Cookies from 'js-cookie';


import { get, put, post, emit, socket } from '../components/xhr';
import { publicPath } from '../components/router';
import history from '../components/history';
import global from '../stores/globalstore';
import { toast } from '../components/myparts';

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
                socket.on('connected', msg => {
                    console.log('[connected]', msg)
                })
                socket.on('privilege updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._getMenuByToken()
                })
                socket.on('user updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._checkSession()
                })
                emit('connected', res.response)
                Cookies.set('__dys_cookie_control', res.response.token)
                global.control = res.response
                global.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                    fullname: res.response.fullname,
                }
                this._getMenuByToken()
                history.replace('/')
            } else {
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
                socket.removeAllListeners()
                global.control = {
                    userid: null,
                    email: null,
                    fullname: null,
                    clientId: null,
                    clientname: null,
                    branchId: null,
                    branchname: null,
                }
                global.cookie = {
                    client: null,
                    branch: null,
                    user: null,
                    fullname: null,
                }
                Cookies.remove('__dys_cookie_control')
                history.replace('/login')
            }
        })
    },
    async _checkSession() {
        return get('checkSession', { token: Cookies.get('__dys_cookie_control') }).then(res => {
            if (res.response !== null) {
                socket.on('connected', msg => {
                    console.log('[connected]', msg)
                })
                socket.on('privilege updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._getMenuByToken()
                })
                socket.on('user updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._checkSession()
                })
                emit('connected', res.response)
                global.control = res.response
                global.cookie = {
                    client: res.response.clientId,
                    branch: res.response.branchId,
                    user: res.response.userId,
                    fullname: res.response.fullname,
                }
                this._getMenuByToken()
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
            <H4 style={{ color: Colors.INDIGO3, textAlign: 'center' }}>Masuk</H4>
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