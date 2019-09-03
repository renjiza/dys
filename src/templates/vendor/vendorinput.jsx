import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { vendor } from './vendorview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class VendorInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${vendor.title} | ${global.appname}`
            vendor.input = {}
        } else {
            document.title = `Ubah ${vendor.title} | ${global.appname}`
            vendor._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'vendor').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${vendor.title}`}
                            btnTooltip={`Kembali ke list data ${vendor.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form">
                            <div className="grid">
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Kode"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={vendor.input.vendorCode || ''}
                                                onChange={e => vendor.input.vendorCode = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="Nama"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={vendor.input.vendorName || ''}
                                                onChange={e => vendor.input.vendorName = e.target.value}
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
                                                value={vendor.input.vendorEmail || ''}
                                                onChange={e => vendor.input.vendorEmail = e.target.value}
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
                                                value={vendor.input.vendorPhone || ''}
                                                onChange={e => vendor.input.vendorPhone = e.target.value}
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
                                                value={vendor.input.vendorAddress || ''}
                                                onChange={e => vendor.input.vendorAddress = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={vendor.loading}
                                            disabled={vendor.input.vendorFullname === "" || vendor.input.vendorEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? vendor._create() : vendor._update()}
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

export default observer(VendorInput)