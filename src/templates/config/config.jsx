import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, H5, Label, TextArea } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';
import { observable } from 'mobx';

import { PageUnauthorized } from '../../components/async';
import global from '../../stores/globalstore';
import { get, put } from '../../components/xhr';
import { toastSuccess, toastError, toastCatch } from '../../components/myparts';


export const config = observable({
    title: "Konfigurasi Perusahaan",
    loading: false,
    client: {},
    async _getClient() {
        get(`client/${global.cookie.client}`, {}).then(res => {
            config.client = res.response
        })
    },
    async _update() {
        config.loading = true
        return put(`client/${global.cookie.client}`, config.client)
            .then(res => {
                config.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                config.loading = false
            })
    },
})

class Config extends PureComponent {

    componentDidMount() {
        config._getClient()
    }

    render() {
        return (
            global.control.super === 1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <div className="wrapHeader">
                            <H5 style={{ color: Colors.INDIGO3, fontWeight: 600 }}>{config.title}</H5>
                        </div>

                        <div className="field" style={{ overflowY: 'auto', maxHeight: 'calc(100% - 34px)' }}>
                            <Label className="bold text-center" style={{ color: Colors.INDIGO3 }}>Data Perusahaan</Label>
                            <form>
                                <div className="grid">
                                    <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">
                                        <FormGroup
                                            label="Nama"
                                            labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                        >
                                            <Observer>{() =>
                                                <InputGroup
                                                    value={config.client.clientName || ''}
                                                    onChange={e => config.client.clientName = e.target.value}
                                                />
                                            }</Observer>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                        <FormGroup
                                            label="Email"
                                            labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                        >
                                            <Observer>{() =>
                                                <InputGroup
                                                    value={config.client.clientEmail || ''}
                                                    onChange={e => config.client.clientEmail = e.target.value}
                                                />
                                            }</Observer>
                                        </FormGroup>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                        <FormGroup
                                            label="Telp"
                                            labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                        >
                                            <Observer>{() =>
                                                <InputGroup
                                                    value={config.client.clientPhone || ''}
                                                    onChange={e => config.client.clientPhone = e.target.value}
                                                />
                                            }</Observer>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">
                                        <FormGroup
                                            label="Alamat"
                                            labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                        >
                                            <Observer>{() =>
                                                <TextArea
                                                    value={config.client.clientAddress || ''}
                                                    onChange={e => config.client.clientAddress = e.target.value}
                                                    fill
                                                />
                                            }</Observer>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                        <Observer>{() =>
                                            <Button
                                                loading={config.loading}
                                                icon="floppy-disk"
                                                intent="warning"
                                                text="Perbarui data perusahaan"
                                                onClick={() => config._update()}
                                            />
                                        }</Observer>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(Config)