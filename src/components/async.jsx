import React, { PureComponent } from 'react';


const LoadingIndicator = () => {
    document.title = 'Memuat halaman ...'
    return (
        <div className="ds-container" style={{ textAlign: 'center', paddingTop: '10%' }}>Memuat halaman ...</div>
    )
}

const PageNotFound = () => {
    document.title = '404 - Halaman tidak ditemukan'
    return (
        <div className="ds-container" style={{ textAlign: 'center', paddingTop: '10%' }}>
            <div style={{ fontSize: 50, fontWeight: 'bold' }}>404</div>
            Halaman tidak ditemukan
        </div>
    )
}

export const PageUnauthorized = () => {
    document.title = '401 - Halaman diblokir'
    return (
        <div className="ds-container" style={{ textAlign: 'center', paddingTop: '10%' }}>
            <div style={{ fontSize: 50, fontWeight: 'bold' }}>401</div>
            Halaman diblokir karena tidak mempunyai akses ke halaman ini
        </div>
    )
}

export class Async extends PureComponent {

    constructor (props) {
        super(props)
        this.state = {
            Module: null
        }
    }    

    async componentWillMount() {
        const { param } = this.props
        const { params } = param.match
        switch (true) {
            case (typeof params.module === 'undefined'):
                await import(`../templates/main`)
                    .then(Module => this.setState({ Module: Module.default }))
                    .catch((e) => { console.log(e); this.setState({ Module: PageNotFound }) })
            break;      
            case (typeof params.type === 'undefined'):
                await import(`../${params.module}/${params.module}`)
                    .then(Module => this.setState({ Module: Module.default }))
                    .catch((e) => { console.log(e); this.setState({ Module: PageNotFound }) })
            break;
            case (params.type === "view"):
                await import(`../templates/${params.module}/${params.module}view`)
                    .then(Module => this.setState({ Module: Module.default }))
                    .catch((e) => { console.log(e); this.setState({ Module: PageNotFound }) })
            break;
            case (params.type === "add" || params.type === "edit"):
                await import(`../templates/${params.module}/${params.module}input`)
                    .then(Module => this.setState({ Module: Module.default }))
                    .catch((e) => { console.log(e); this.setState({ Module: PageNotFound }) })
            break;
            default:
                await import(`../templates/${params.module}/${params.type}${params.module}`)
                    .then(Module => this.setState({ Module: Module.default }))
                    .catch((e) => { console.log(e); this.setState({ Module: PageNotFound }) })
        }
    }

    render () {
        const { Module } = this.state;
        return (
            <>
                {Module 
                ? <Module /> 
                : <LoadingIndicator />}
            </>
        )
    }
}