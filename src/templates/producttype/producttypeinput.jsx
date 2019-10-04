import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { producttype } from './producttypeview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class ProductTypeInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${producttype.title} | ${global.appname}`
            producttype.input = {}
        } else {
            document.title = `Ubah ${producttype.title} | ${global.appname}`
            producttype._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'producttype').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${producttype.title}`}
                            btnTooltip={`Kembali ke ${producttype.title}`}
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
                                                value={producttype.input.producttypeCode || ''}
                                                onChange={e => producttype.input.producttypeCode = e.target.value}
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
                                                value={producttype.input.producttypeName || ''}
                                                onChange={e => producttype.input.producttypeName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={producttype.loading}
                                            disabled={producttype.input.producttypeFullname === "" || producttype.input.producttypeEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? producttype._create() : producttype._update()}
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

export default observer(ProductTypeInput)