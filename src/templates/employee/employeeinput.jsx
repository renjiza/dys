import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { Select, HeaderView, DateGroup } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { employee } from './employeeview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class EmployeeInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "add") {
            document.title = `Tambah ${employee.title} | ${global.appname}`
            employee.input = {}
        } else {
            document.title = `Ubah ${employee.title} | ${global.appname}`
            employee._getById(path[3])
        }
        employee._getDepartment()
        employee._getEmployment()
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'employee').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"


        return (
            menu.indexOf(path[2]) !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${employee.title}`}
                            btnTooltip={`Kembali ke ${employee.title}`}
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
                                        label="NIK"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={employee.input.employeeCode || ''}
                                                onChange={e => employee.input.employeeCode = e.target.value}
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
                                                value={employee.input.employeeName || ''}
                                                onChange={e => employee.input.employeeName = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Departemen"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={employee.input.employeeDepartmentId}
                                            onChange={val => employee.input.employeeDepartmentId = val}
                                            items={employee.store.department}
                                            id="departmentId"
                                            label="departmentName"
                                            text={item => `${item.departmentName}`}
                                            textRight={item => `(${item.departmentCode})`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Jabatan"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={employee.input.employeeEmploymentId}
                                            onChange={val => employee.input.employeeEmploymentId = val}
                                            items={employee.store.employment}
                                            id="employmentId"
                                            label="employmentName"
                                            text={item => `${item.employmentName}`}
                                            rightText={item => `(${item.employmentCode})`}
                                        />
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
                                                value={employee.input.employeeEmail || ''}
                                                onChange={e => employee.input.employeeEmail = e.target.value}
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
                                                value={employee.input.employeePhone || ''}
                                                onChange={e => employee.input.employeePhone = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <FormGroup
                                        label="Jenis kelamin"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={employee.input.employeeGender}
                                            onChange={val => employee.input.employeeGender = val}
                                            items={employee.store.gender}
                                            id="id"
                                            label="label"
                                            text={item => `${item.label}`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Tanggal lahir"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <DateGroup                                                
                                                value={employee.input.employeeBirthDate}
                                                onChange={date => employee.input.employeeBirthDate = date }
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Tempat lahir"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={employee.input.employeeBirthPlace || ''}
                                                onChange={e => employee.input.employeeBirthPlace = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-8 col-md-8 col-sm-10 col-xs-12">
                                    <FormGroup
                                        label="Alamat lengkap"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>                                            
                                            <TextArea 
                                                fill
                                                value={employee.input.employeeAddress || ''} 
                                                onChange={e => employee.input.employeeAddress = e.target.value} 
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                    <FormGroup
                                        label="Jenis identitas"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={employee.input.employeeIdentityType}
                                            onChange={val => employee.input.employeeIdentityType = val}
                                            items={employee.store.identype}
                                            id="id"
                                            label="label"
                                            text={item => `${item.label}`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="No. identitas"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={employee.input.employeeIdentityNo || ''}
                                                onChange={e => employee.input.employeeIdentityNo = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Pendidikan terakhir"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={employee.input.employeeGraduate || ''}
                                                onChange={e => employee.input.employeeGraduate = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Masuk kerja"
                                    >
                                        <Observer>{() =>
                                            <DateGroup
                                                value={employee.input.employeeInDate}
                                                onChange={date => employee.input.employeeInDate = date}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>                                
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Observer>{() =>
                                        <Button
                                            loading={employee.loading}
                                            disabled={
                                                !employee.input.employeeCode || employee.input.employeeCode === "" ||
                                                !employee.input.employeeName || employee.input.employeeName === "" ||
                                                !employee.input.employeeDepartmentId || employee.input.employeeDepartmentId === "" ||
                                                !employee.input.employeeEmploymentId || employee.input.employeeEmploymentId === "" ||
                                                !employee.input.employeeEmail || employee.input.employeeEmail === "" ||
                                                !employee.input.employeePhone || employee.input.employeePhone === "" ||
                                                !employee.input.employeeGender || employee.input.employeeGender === "" ||
                                                !employee.input.employeeBirthDate || employee.input.employeeBirthDate === "" ||
                                                !employee.input.employeeBirthPlace || employee.input.employeeBirthPlace === "" ||
                                                !employee.input.employeeAddress || employee.input.employeeAddress === "" ||
                                                !employee.input.employeeIdentityType || employee.input.employeeIdentityType === "" ||
                                                !employee.input.employeeGraduate || employee.input.employeeGraduate === ""
                                            }
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? employee._create() : employee._update()}
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

export default observer(EmployeeInput)