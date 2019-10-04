import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, Checkbox, TextArea } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { warehouse } from './warehouseview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class WarehouseInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${warehouse.title} | ${global.appname}`
            warehouse.input = {}
        } else {
            document.title = `Ubah ${warehouse.title} | ${global.appname}`
            warehouse._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'warehouse').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${warehouse.title}`}
                            btnTooltip={`Kembali ke ${warehouse.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form">
                            <div className="grid">                                
                                <div className="col-lg-3 col-md-3 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Kode"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={warehouse.input.warehouseCode || ''}
                                                onChange={e => warehouse.input.warehouseCode = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-5 col-md-5 col-sm-7 col-xs-12">
                                    <FormGroup
                                        label="Nama"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={warehouse.input.warehouseName || ''}
                                                onChange={e => warehouse.input.warehouseName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>                                
                            </div>
                            <div className="grid">
                                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="PIC"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                        <InputGroup
                                                value={warehouse.input.warehousePic || ''}
                                                onChange={e => warehouse.input.warehousePic = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>                                
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <Observer>{() =>
                                        <Checkbox
                                            label="Apakah gudang ini virtual (tidak nyata)"
                                            checked={warehouse.input.warehouseIsVirtual === 1}
                                            onChange={() => warehouse.input.warehouseIsVirtual = warehouse.input.warehouseIsVirtual === 1 ? 0 : 1}
                                            className="checkbox"
                                        />
                                    }</Observer>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                    <FormGroup
                                        label="Alamat"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={warehouse.input.warehouseAddress || ''}
                                                onChange={e => warehouse.input.warehouseAddress = e.target.value}
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
                                            loading={warehouse.loading}
                                            disabled={warehouse.input.warehouseFullname === "" || warehouse.input.warehouseEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? warehouse._create() : warehouse._update()}
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

export default observer(WarehouseInput)