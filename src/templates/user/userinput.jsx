import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, Switch } from '@blueprintjs/core';
import { Observer } from 'mobx-react-lite';

import history from '../../components/history';
import { user } from './userview';
import { HeaderView } from '../../components/mainview';
import { PageUnauthorized } from '../../components/async';


export default class UserInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        user._callPrivilege()
        if (path[2] === "add") {
            document.title = `Tambah ${user.menu.menuLabel}`
            user.input = {
                userFullname: '',
                userEmail: '',
                userPassword: '',
                userActive: 0,
            }
        } else {
            document.title = `Ubah ${user.menu.menuLabel}`
            user._getById(path[3])
        }
    }

    render() {
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"

        return (
            <Observer>{() =>
                user.access.indexOf(path[2]) !== -1 ?
                <div className="ds-container">
                <HeaderView 
                    title={`${isAdd ? "Tambah" : "Ubah"} ${user.menu.menuLabel}`} 
                    btnTooltip={`Kembali ke list view ${user.menu.menuLabel}`} 
                    btnIcon="delete" 
                    color={Colors.RED3}
                    intent="danger" 
                            btnShow={true}
                    btnLink={`${user.menu.menuLink}/view`} 
                />

                <form className="form">
                    <div className="grid">
                        <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">
                            <FormGroup 
                                label="Nama Lengkap" 
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
                        <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">
                            <Observer>{() =>
                                <Switch 
                                    label="Status User Aktif" 
                                    checked={user.input.userActive === 1} 
                                    onChange={() => user.input.userActive = user.input.userActive === 0 ? 1 : 0} 
                                />
                            }</Observer>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <Observer>{() =>
                                <Button 
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
                :
                <PageUnauthorized />
            }</Observer>
        )
    }
}