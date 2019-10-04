import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView, Select, NumberGroup } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { product } from './productview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class ProductInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${product.title} | ${global.appname}`
            product.input = {}
            product._getProducttype()
        } else {
            document.title = `Ubah ${product.title} | ${global.appname}`
            product._getById(path[3]).then(() => {
                product._getProducttype()
            })
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'product').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${product.title}`}
                            btnTooltip={`Kembali ke ${product.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form">
                            <div className="grid">
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Jenis Produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={product.input.productProducttypeId || null}
                                            onChange={val => product.input.productProducttypeId = val}
                                            items={product.store.producttype}
                                            id="producttypeId"
                                            label="producttypeName"
                                            text={item => `${item.producttypeName}`}
                                            rightText={item => `(${item.producttypeCode})`}
                                            disabled={!isAdd}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Kode"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productCode || ''}
                                                onChange={e => product.input.productCode = e.target.value}
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Barcode"
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productBarcode || ''}
                                                onChange={e => product.input.productBarcode = e.target.value}
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">                                
                                <div className="col-lg-5 col-md-5 col-sm-7 col-xs-12">
                                    <FormGroup
                                        label="Nama"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productName || ''}
                                                onChange={e => product.input.productName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">    
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Satuan 1"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}                                        
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productUnit1 || ''}
                                                onChange={e => product.input.productUnit1 = e.target.value}
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>                        
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Rasio 1"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <InputGroup
                                            value={1}
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">    
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Satuan 2"
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productUnit2 || ''}
                                                onChange={e => product.input.productUnit2 = e.target.value}
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Rasio 2"
                                        helperText="Rasio terhadap rasio 1"
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={product.input.productRatio2 || 0}
                                                onChange={val => product.input.productRatio2 = val}
                                                disabled={!isAdd}
                                            />                                            
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">    
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Satuan 3"
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={product.input.productUnit3 || ''}
                                                onChange={e => product.input.productUnit3 = e.target.value}
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Rasio 3"
                                        helperText="Rasio terhadap rasio 1"
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={product.input.productRatio3 || 0}
                                                onChange={val => product.input.productRatio3 = val}                                                
                                                disabled={!isAdd}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-6 col-md-6 col-sm-10 col-xs-12">
                                    <FormGroup
                                        label="Deskripsi"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={product.input.productDescription || ''}
                                                onChange={e => product.input.productDescription = e.target.value}
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
                                            loading={product.loading}
                                            disabled={product.input.productFullname === "" || product.input.productEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? product._create() : product._update()}
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

export default observer(ProductInput)