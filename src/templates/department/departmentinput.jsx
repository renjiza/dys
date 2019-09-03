import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { department } from './departmentview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class DepartmentInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${department.title} | ${global.appname}`
            department.input = {}
        } else {
            document.title = `Ubah ${department.title} | ${global.appname}`
            department._getById(path[3])
        }
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'department').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${department.title}`}
                            btnTooltip={`Kembali ke list data ${department.title}`}
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
                                                value={department.input.departmentCode || ''}
                                                onChange={e => department.input.departmentCode = e.target.value}
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
                                                value={department.input.departmentName || ''}
                                                onChange={e => department.input.departmentName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={department.loading}
                                            disabled={department.input.departmentFullname === "" || department.input.departmentEmail === ""}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? department._create() : department._update()}
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

export default observer(DepartmentInput)