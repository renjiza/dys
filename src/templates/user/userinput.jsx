import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, Checkbox, Tooltip } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { user } from './userview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class UserInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${user.title} | ${global.appname}`
            user.input = {
                userFullname: '',
                userEmail: '',
                userPassword: '',
            }
        } else {
            document.title = `Ubah ${user.title} | ${global.appname}`
            user._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'user').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${user.title}`}
                            btnTooltip={`Kembali ke list data ${user.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form">
                            <div className="grid">
                                <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="Nama lengkap"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={user.input.userFullname || ''}
                                                onChange={e => user.input.userFullname = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">                                    
                                    <Tooltip content="User super akan diberikan akses ke menu konfigurasi perusahaan.">
                                        <Observer>{() =>
                                            <Checkbox
                                                checked={user.input.userSuper === 1 || 0}
                                                onChange={() => user.input.userSuper = user.input.userSuper === 0 ? 1 : 0}
                                                label="User super"
                                                className="checkbox"
                                            />
                                        }</Observer>
                                    </Tooltip>
                                </div>
                            </div>
                            {path[2] === "add" && <div className="grid">
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Email"
                                        helperText="Email ini dipakai untuk login"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={user.input.userEmail || ''}
                                                onChange={e => user.input.userEmail = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Password"
                                        helperText="Password ini dipakai untuk login"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                type="password"
                                                value={user.input.userPassword || ''}
                                                onChange={e => user.input.userPassword = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>}
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={user.loading}
                                            disabled={user.input.userFullname === "" || user.input.userEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? user._create() : user._update()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(UserInput)