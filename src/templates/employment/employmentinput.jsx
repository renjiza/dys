import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { employment } from './employmentview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class EmploymentInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${employment.title} | ${global.appname}`
            employment.input = {}
        } else {
            document.title = `Ubah ${employment.title} | ${global.appname}`
            employment._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'employment').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${employment.title}`}
                            btnTooltip={`Kembali ke ${employment.title}`}
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
                                                value={employment.input.employmentCode || ''}
                                                onChange={e => employment.input.employmentCode = e.target.value}
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
                                                value={employment.input.employmentName || ''}
                                                onChange={e => employment.input.employmentName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={employment.loading}
                                            disabled={
                                                !employment.input.employmentCode || employment.input.employmentCode === "" ||
                                                !employment.input.employmentName || employment.input.employmentName === ""
                                            }
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? employment._create() : employment._update()}
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

export default observer(EmploymentInput)