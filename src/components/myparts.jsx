import React, { PureComponent, Component } from 'react';
import { Tooltip, Button, Icon, Colors, H5, HTMLTable, Popover, Menu, MenuItem, Toaster, FormGroup, InputGroup, Alert, NumericInput, TextArea, ButtonGroup } from '@blueprintjs/core';
import { Select as BpSelect } from "@blueprintjs/select";
import { Observer } from 'mobx-react-lite';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';
import _ from 'lodash';

import history from './history';
import { DateInput } from '@blueprintjs/datetime';
import { get } from './xhr';


export const toast = Toaster.create({
    position: 'top',
    // timeout: 5000,
})

export const toastSuccess = (msg, icon = 'tick-circle') => toast.show({
    message: msg,
    intent: 'success',
    icon: icon,
})

export const toastWarning = (msg, icon = 'warning-sign') => toast.show({
    message: msg,
    intent: 'warning',
    icon: icon,
})

export const toastError = (msg, icon = 'warning-sign') => toast.show({
    message: msg,
    intent: 'danger',
    icon: icon,
})

export const toastCatch = () => toast.show({
    message: 'Kesalahan saat memproses data, silakan hubungi developer',
    intent: 'danger',
    icon: 'warning-sign',
})

export function thousand(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : 0
}

const centering = { alignSelf: 'center' }

export class HeaderView extends PureComponent {
    render() {
        const { title, btnTooltip, btnIcon, btnShow, btnLink, intent } = this.props
        return (
            <div className="wrapHeader print-off">
                <H5 className="primary3" style={{ fontWeight: 600, marginTop: 5, marginBottom: 5 }}>{title}</H5>
                {btnShow && <Tooltip content={btnTooltip} position="left" usePortal={false}>
                    <Button onClick={() => history.replace(btnLink)} minimal intent={intent} icon={btnIcon} />
                </Tooltip>}
            </div>
        )
    }
}

// ===================================================================================================================

export class TableView extends PureComponent {    

    componentDidMount() {
        this.props.params._getAll()
    }

    _handleDelete(id, label, data) {
        const { title, _delete } = this.props.params        
        data.isHide = true
        data.isShowConfirm = false
        const toastDel = Toaster.create({
            position: 'top',
            timeout: 7000,
        })
        var deletion = _.debounce(() =>_delete(id, label), 6000)
        deletion()
        toastDel.show({
            message: `${title} "${label}" sedang dihapus`,
            intent: 'success',
            icon: 'tick-circle',
            action: {
                text: "Batalkan",
                onClick: () => {
                    deletion.cancel()
                    toastSuccess(`Hapus ${title} dibatalkan`)
                    data.isHide = false
                }
            }
        })                  
    }

    render() {        
        const { trProps, params } = this.props
        const { head, query, id, label, privilege } = params
        const display = head.map(o => o.render ? o.render : o.column)
        return (
            <div className="wrapTableview">                
                <HTMLTable interactive>
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}>#</th>
                            {head.map(o => (
                                <th key={o.column}>{o.label}</th>
                            ))}
                            <th style={{ width: "1%" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Observer>{() =>                            
                            <>                                    
                                {this.props.params.body
                                .filter(data => {
                                    return display.some(key => {
                                        const str = typeof (key) === 'function' ? key(data) : data[key]
                                        return str.toLowerCase().includes(query.filter.toLowerCase())
                                    })
                                })
                                .filter(o => !o.isHide)
                                .map((data, index) => (
                                    <tr key={data[id]} className="asd" { ...(trProps ? trProps(data) : {}) }>
                                        <td>{index + 1}</td>
                                        {head.map(x => (
                                            <td key={x.column}>{x.render ? x.render(data) : (data[x.column] ? data[x.column] : '-')}</td>
                                        ))}
                                        <td>
                                            <ButtonAction 
                                                icon="layout-linear" 
                                                intent="primary" 
                                                position="bottom-right"
                                                content={<ActionContext data={data} privilege={privilege} access={this.props.access} />} 
                                            />
                                            <Confirm 
                                                isOpen={data.isShowConfirm}
                                                text={<>Yakin tetap menghapus <b>{data[label]}</b> ?</>}
                                                icon="trash" 
                                                intent="danger" 
                                                confirmText="Hapus" 
                                                cancelText="Batal" 
                                                onConfirm={() => this._handleDelete(data[id], data[label], data)}
                                                onCancel={() => data.isShowConfirm = false} />
                                        </td>
                                    </tr>
                                ))}
                                {this.props.params.body
                                .filter(data => {
                                    return display.some(key => {
                                        const str = typeof (key) === 'function' ? key(data) : data[key]
                                        return str.toLowerCase().includes(query.filter.toLowerCase())
                                    })
                                })
                                .filter(o => !o.isdelete)
                                .length === 0 
                                &&  <tr style={{ backgroundColor: '#f4f8f9' }}>
                                        <td colSpan={head.length + 2} style={{ textAlign: 'center', color: Colors.RED3 }}>
                                            <Icon icon="database" /> No Data
                                        </td>
                                    </tr>
                                }
                            </>
                        }</Observer>
                    </tbody>
                </HTMLTable>
            </div>
        )
    }
}


export class TableDetail extends PureComponent {

    render() {
        const { head, action } = this.props
        return (
            <div className="wrapTableDetail">
                <HTMLTable className="nosticky" interactive bordered>
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}>#</th>
                            {head.map(o => (
                                <th key={o.column}>{o.label}</th>
                            ))}
                            <th style={{ width: "1%" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Observer>{() => 
                            <>
                                {this.props.data.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {head.map(x => {
                                            const rdZeroRed = (data[x.column] === 0 ? <span style={{ color: Colors.RED3 }}>0</span> : '-')
                                            const renderView = x.render ?
                                                (x.render(data) ?
                                                    x.render(data)
                                                    :
                                                    <span style={{ color: Colors.RED3 }}>0</span>
                                                )
                                                :
                                                (data[x.column] ?
                                                    data[x.column]
                                                    :
                                                    rdZeroRed
                                                )
                                            return (
                                            <td key={x.column}>{
                                                !data['isEdit'] ?
                                                    renderView
                                                    :
                                                    (!x.editable && renderView)
                                            }
                                            {
                                                data['isEdit'] && x.editable &&
                                                (x.editType === 'number' ?
                                                    <NumberGroup
                                                        value={data[x.column] || 0}
                                                        onChange={val => {
                                                            x.onChange ? x.onChange(val, data) : data[x.column] = val
                                                        }}
                                                    />
                                                    :
                                                    x.editType === 'textarea' ?
                                                        <TextArea
                                                            value={data[x.column] || ''}
                                                            onChange={e => {
                                                                x.onChange ? x.onChange(e.target.value, data) : data[x.column] = e.target.value
                                                            }}
                                                            fill
                                                        />
                                                        :
                                                        <InputGroup
                                                            value={data[x.column] || ''}
                                                            onChange={e => {
                                                                x.onChange ? x.onChange(e.target.value, data) : data[x.column] = e.target.value
                                                            }}
                                                        />
                                                )
                                            }</td>
                                        )})}
                                        <td>
                                            <ButtonGroup minimal={true} intent="primary">
                                                {this.props.data.length > 0 && action.length > 0 && 
                                                action.map((o, i) => (
                                                    <Button 
                                                        key={i} 
                                                        icon={typeof(o.icon) === 'function' ? o.icon(data) : o.icon } 
                                                        onClick={() => o.action(data, index)} 
                                                        disabled={o.disabled && o.disabled(data)}
                                                    />
                                                ))}
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))}
                                {this.props.data.length === 0
                                    && <tr style={{ backgroundColor: '#f4f8f9' }}>
                                        <td colSpan={head.length + 2} style={{ textAlign: 'center', color: Colors.RED3 }}>
                                            <Icon icon="database" /> No Data
                                        </td>
                                    </tr>
                                }
                            </>
                        }</Observer>
                    </tbody>
                </HTMLTable>
            </div>
        )
    }
}

const Confirm = ({ isOpen, text, icon, intent, confirmText, cancelText, onConfirm, onCancel }) => (
    <Alert
        canEscapeKeyCancel
        canOutsideClickCancel
        cancelButtonText={cancelText}
        confirmButtonText={confirmText}
        icon={icon}
        intent={intent}
        isOpen={isOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
    >
        <p>{text}</p>
    </Alert>
)

const Context = ({ context }) => (
    <Menu>
        {context.map((o, i) => (
            <MenuItem key={i} onClick={() => o.action()} icon={o.icon} text={o.label} />
        ))}
    </Menu>
)

const ActionContext = ({ data, privilege, access = [] }) => (
    <Menu>
        {privilege.length > 0 && privilege.map((o, i) => (
            <MenuItem key={i} onClick={() => o.action(data)} icon={o.icon} text={o.label} disabled={access.findIndex(x => x.menuKey === o.key && x.menuAction === o.act) === -1 || (o.disabled && o.disabled(data))} />
        ))}
    </Menu>
)

const ButtonAction = ({ position, content, icon, color, intent }) => (
    <Popover minimal content={content} position={position || "bottom"} usePortal={false}>
        <Button minimal small intent={intent}>
            <Icon icon={icon} color={color} iconSize={13} />
        </Button>
    </Popover>
)


export class ToolView extends PureComponent {
    render() {
        const { head, query, _getAll } = this.props.params
        const display = head.map(o => o.render ? o.render : o.column)
        const sort = [
            { label: "asc", column: "asc", action: () => { query.sort = "asc"; _getAll()} },
            { label: "desc", column: "desc", action: () => { query.sort = "desc"; _getAll()} },
        ]        
        return (
            <div className="grid" style={{color: Colors.GRAY3}}>
                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12" style={centering}>
                    <Observer>{() =>
                        thousand(this.props.params.body.filter(data => {                            
                            return display.some(key => {
                                const str = typeof (key) === 'function' ? key(data) : data[key]
                                return str.toLowerCase().includes(query.filter.toLowerCase())
                            })
                        }).length)
                    }</Observer> Total
                </div>
                <div className="col-lg-7 col-md-7 col-sm-5 col-xs-12" style={centering}>
                    Diurutkan dari: &nbsp;
                    <Observer>{() =>
                        <Popover content={<Context context={head} />} position="bottom" usePortal={false}>
                            <Button minimal>
                                {query.orderLabel} &nbsp; <Icon icon="caret-down" />
                            </Button>
                        </Popover>
                    }</Observer>
                    <Observer>{() =>
                        <Popover content={<Context context={sort} />} position="bottom" usePortal={false}>
                            <Button minimal>
                                {query.sort} &nbsp; <Icon icon="caret-down" />
                            </Button>
                        </Popover>
                    }</Observer>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12" style={{ ...centering, ...{ float: "right" }}}>
                    <FormGroup>
                        <Observer>{() =>
                            <InputGroup
                                rightElement={<Button minimal icon="search-text" onClick={() => _getAll()} />}
                                placeholder="Cari"
                                value={query.filter || ""}
                                onChange={e => query.filter = e.target.value}
                            />
                        }</Observer>
                    </FormGroup>
                </div>
            </div>
        )
    }
}

export class Select extends PureComponent {

    state = {
        item : null,
    }

    componentDidMount() {
        const { id, items, value } = this.props
        const index = items.findIndex(o => o[id] === value)
        const item = items[index]
        if (this.state.item !== item) {
            this.setState({ item: item })
        }
    }

    componentDidUpdate() {
        const { id, items, value } = this.props
        if (items) {
            const index = items.findIndex(o => o[id] === value)
            const item = items[index]
            if (this.state.item !== item) {
                this.setState({ item: item })
            }
        }
    }

    render() {
        const { items, label, disabled, placeholder } = this.props
        const { item } = this.state
        return (
            <BpSelect
                items={items || []}
                itemPredicate={(query, item, index, exactMatch) => this.filterItem(query, item, index, exactMatch)}
                itemRenderer={(item, handler) => this.itemRendererHandler(item, handler)}
                noResults={<MenuItem disabled={true} text="Tidak ditemukan data." />}
                onItemSelect={item => this.itemSelectHandler(item)}
                popoverProps={{ usePortal: false, inline: true, minimal: true, className: "myselectitem" }}
                className="myselect"
            >                
                <Button
                    fill
                    rightIcon="double-caret-vertical"
                    text={item ? item[label] : <div style={{ color: Colors.GRAY2 }}>{(placeholder ? placeholder : '  ')}</div>}
                    disabled={disabled}
                />
            </BpSelect>
        )
    }    

    filterItem = (query, item, _index, exactMatch) => {
        const { text, textRight } = this.props
        const label = `${text(item)} ${textRight && textRight(item)}`.toLowerCase()
        const normalizedLabel = label.toLowerCase()
        const normalizedQuery = query.toLowerCase()

        if (exactMatch) {
            return normalizedLabel === normalizedQuery
        } else {
            return label.indexOf(normalizedQuery) !== -1
        }
    }

    itemSelectHandler = item => {
        const { id, onChange } = this.props
        onChange(item[id], item)
        this.setState({ item })
    }

    itemRendererHandler = (item, { handleClick, modifiers, query }) => {
        const { id, text, textRight } = this.props
        const label = text(item)
        const rightLabel = textRight && <i>{textRight(item)}</i>
        return (
            <MenuItem
                disabled={modifiers.disabled}
                label={rightLabel}
                key={item[id]}
                onClick={handleClick}
                text={highlightText(label, query)}
            />
        )
    }
}

function highlightText(text, query) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars(text) {
    return text.replace(/([.*+?^=!:${}()|\\[\\])/g, "\\$1");
}

export class Autocomplete extends Component {

    state = {
        keyword: '',
        items: [],
        isOpen: false,
        reset: false,
        isLoading: false,
    }

    componentDidMount() {
        const { value, placer } = this.props
        if (value && placer) {
            this.setState({
                keyword: placer
            })
        }
    }

    componentDidUpdate() {
        const { value } = this.props
        if (!value && this.state.reset) {
            this.setState({ keyword: '', reset: false })
        }
    }

    render() {
        const { placeholder, disabled } = this.props

        return (
            <Popover 
                isOpen={this.state.isOpen}
                content={this._autocompleteList()} 
                position="bottom-left" 
                className="autocomplete"
                usePortal={false}
                minimal
                inline
                fill
            >
                <InputGroup
                    value={this.state.keyword}
                    onChange={e => this._handleChange(e)}
                    onKeyDown={e => this._handleKeyDown(e)}
                    onClick={e => e.target.select()}
                    disabled={disabled}
                    placeholder={placeholder ? placeholder : 'Ketik lalu enter untuk mencari ...'}
                    rightElement={
                        <Button
                            loading={this.state.isLoading}
                            disabled={this.state.keyword.length === 0}
                            icon="search"
                            intent="primary"
                            minimal
                            onClick={() => this._handleSearch()}
                        />
                    }
                    onBlur={e => this._handleBlur(e)}
                />
            </Popover>
        )
    }     
    
    _handleChange = (e) => {
        return this.setState({ keyword: e.target.value })
    }

    _handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this._handleSearch()
        }
        if (e.target.value.length < 2) this.setState({ isOpen: false })
    }

    _handleSearch = () => {
        if (this.state.keyword !== "") {
            this.setState({ isLoading: true })
            const { remoteUrl, search, id, column } = this.props
            let params = {}
            params.column = column ? `${id}, ${column.join(', ')}` : `${id}, ${search.join(', ')}`
            params.filter = `( ${search.map(o => o + " LIKE '%" + this.state.keyword + "%'").join(' OR ')} )`
            get(remoteUrl, params).then(res => {
                const items = res.response
                this.setState({ items, isOpen: true, isLoading: false })
            })
        }
    }

    _autocompleteList = () => {
        const { id, label, text, blacklist } = this.props
        const { items } = this.state        
        const notFound = <Menu><MenuItem text="Tidak ditemukan data, ketik lalu enter" /></Menu>
        return (
            items.length > 0 ?            
                blacklist && blacklist.length > 0 ?
                    items.filter(o => blacklist.indexOf(o[id]) === -1).length > 0 ?
                        <Menu>
                            {items.filter(o => blacklist.indexOf(o[id]) === -1).map((item, i) => (
                                <MenuItem key={i} onClick={() => this._handleClickList(item)} text={text ? text(item) : item[label]} />
                            ))}
                        </Menu>
                        :
                        notFound
                    :
                    <Menu>
                        {items.map((item, i) => (
                            <MenuItem key={i} onClick={() => this._handleClickList(item)} text={text ? text(item) : item[label]} />
                        ))}
                    </Menu>
                :     
                notFound           
        )
    }    

    _handleClickList = item => {
        const { onChange, id, text, label } = this.props
        onChange(item[id], item)
        this.setState({ 
            // isOpen: false,
            keyword: text ? text(item) : item[label],
            reset: true,
        })
    }

    _handleBlur = () => {
        setTimeout(() => this.setState({ isOpen: false }), 250)        
    }
}

export class DateGroup extends PureComponent {
    render() {
        const { value, onChange, placeholder, disabled } = this.props
        const today = new Date()
        const maxdate = new Date((today.getFullYear() + 5), 5, 5);
        const mindate = new Date(1945, 7, 17);
        return (
            <DateInput
                formatDate={date => this.formatDateHandler(date)}
                parseDate={string => this.parseDateHandler(string)}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                disabled={disabled}
                popoverProps={{ position: "bottom" }}
                locale="en"
                showActionsBar={true}
                localeUtils={MomentLocaleUtils}                
                className="datefill"
                dayPickerProps={{
                    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                    weekdaysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
                }}
                minDate={mindate}
                maxDate={maxdate}
            />
        )
    }
 
    formatDateHandler(date) {
        return moment(date).format('DD MMM YYYY')
    }
    
    parseDateHandler(string) {
        return moment(string, 'DD MMM YYYY').toDate()
    }
}

export class NumberGroup extends PureComponent {


    render() {
        const { value, onChange, disabled, min, max } = this.props
        return (
            <NumericInput
                value={value}
                onClick={e => e.target.select()}
                onValueChange={onChange}
                fill
                buttonPosition="none"
                disabled={disabled}
                min={min}
                max={max}
            />
        )
    }

}