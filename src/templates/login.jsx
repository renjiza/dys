import React from 'react';
import { InputGroup, FormGroup, Tooltip, Button, Colors, H4, Intent } from '@blueprintjs/core';
import { observable } from 'mobx';
import { Observer, useObserver } from 'mobx-react-lite';

import global from '../stores/globalstore';

const containerStyle = {
    height: '95%',
    fontSize: 16,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
}

const login = observable({
    isShowPassword: false
})

const EmailInput = () => {
    return useObserver(() => (
        <FormGroup label="Email">
            <Observer>{() =>
                <InputGroup
                    type="email"
                    large
                    value={global.login.email || ''}
                    onChange={e => global.login.email = e.target.value}
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
                    value={global.login.password || ''}
                    onChange={e => global.login.password = e.target.value}
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
            <Button onClick={() => global._login()} large fill icon="log-in" text="Masuk" intent={Intent.PRIMARY} />
        </div>
    </div>
)

export default Login