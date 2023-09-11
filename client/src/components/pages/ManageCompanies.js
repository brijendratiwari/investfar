import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import ReactDatatable from '@ashvin27/react-datatable';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import UserAddModal from "../partials/UserAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer } from "react-toastify";
import icons from "../../../src/icons/Mike-Myers.jpg";
import loading from "../../../src/icons/loading.gif";
class ManageCompanies extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "sno",
                text: "S.No",
                className: "id",
                align: "left",
                sortable: true,
                cell: (row, index) => {
                    return <div>{index + 1}</div>;
                }
            },
            {
                key: "fullname",
                text: "Customer Name",
                className: "name",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock d-flex align-items-center">
                                <span className="rounded-0">
                                    { n.profilePic ? (
                                    <img
                                    src={n.profilePic}
                                    onError={(e) => {
                                    e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg==';
                                    }}
                                    alt="Profile"
                                    />
                                    ) : (
                                        <img alt="No Image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=="/>
                                    )}
                                </span>
                                <div class="profilenamedetail">

                                    <h6>{n.fullname}</h6>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "email",
                text: "Email Address",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "phone",
                text: "Phone Number",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "address",
                text: "Address",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "type",
                text: "Type",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "offerService",
                text: "Services Offered",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    const userid = record.userid;
                    return (
                        <Fragment>
                            <div class="profleblock d-flex align-items-center justify-content-center propertyviews">
                                {n.offerService > 0 && (
                                    <a href="#" onClick={() => this.showProperty(userid)} data-toggle="modal" data-target="#totalproperties">{n.offerService|''}</a>
                                )}
                                {n.offerService <= 0 && (
                                    <div></div>
                                )}
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    const userid = record.userid;
                    const statusButton = record.status;
                    return (
                        <Fragment>
                        <div className="tblbtn d-flex align-items-start flex-column align-items-center">
                          {statusButton === 'inactive' && (
                            <button onClick={() => this.handleActive(userid, 'active')} className="shortbtn grey-btn">Accept</button>
                          )}
                          {statusButton === 'active' && (
                            <button onClick={() => this.handleActive(userid, 'inactive')} className="shortbtn grey-btn">Decline</button>
                          )}
                        </div>
                      </Fragment>
                    );
                }
            }
        ];

        this.columns2 = [
            {
                key: "sno",
                text: "S.No",
                className: "id",
                align: "left",
                sortable: true,
                cell: (row, index) => {
                    return <div>{index + 1}</div>;
                }
            },
            {
                key: "fullname",
                text: "Customer Name",
                className: "name",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock d-flex align-items-center">
                                <span class="rounded-0">
                                    <img src={n.profilePic}  onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=='; }}/>
                                </span>
                                <div class="profilenamedetail">

                                    <h6>{n.fullname}</h6>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "email",
                text: "Email Address",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "phone",
                text: "Phone Number",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "address",
                text: "Address",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "type",
                text: "Type",
                className: "date",
                align: "left",
                sortable: true
            },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: record => {
                    const userid = record.userid;
                    const statusButton = record.status;
                    return (
                        <Fragment>
                        <div className="tblbtn d-flex align-items-start flex-column align-items-center">
                          {statusButton === 'inactive' && (
                            <button onClick={() => this.handleActive(userid, 'active')} className="shortbtn grey-btn">Accept</button>
                          )}
                          {statusButton === 'active' && (
                            <button onClick={() => this.handleActive(userid, 'inactive')} className="shortbtn grey-btn">Decline</button>
                          )}
                        </div>
                      </Fragment>
                    );
                }
            }
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Users",
            no_data_text: 'No user found!',
            button: {
                excel: false,
                print: false,
                csv: false
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: false,
            show_filter: false,
            show_pagination: true,
            show_info: true,
            paginationTotalBlocks: 100
        };

        this.state = {
            records: []
        };
        this.state = {
            tabStatus: false
        };
        this.state = {
            currentRecord: {
                id: '',
                name: '',
                email: '',
                phone: '',
                password:'',
                password2: '',
            },
            pagetitle: 'Manage Companies',
            dataRecords:[]
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        const isstatus = 'inactive';
        this.getData(isstatus);
    };

    loadingAPI(){
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }

    componentWillReceiveProps(nextProps) {
        const isstatus = 'active';
        this.getData(isstatus);
    }

    getData(status) {
        this.setState({ isLoading: true });
        const tabStatus = (status =='inactive')?true:false;
        this.setState({tabStatus:tabStatus });
        if (this.props.auth.isAuthenticated) {
            axios.get("/api/get_companies/"+status)
            .then(res => {
                this.setState({records:res.data.listing });
                if (res.status === 200) {
                    this.loadingAPI(); // Call this function only if response status is 200
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    handleActive = (userId, status) => {
        const statusTab = (status == 'active')?'inactive':'active';
        if (this.props.auth.isAuthenticated) {
            axios.put("/api/update_company_status/"+userId+'/'+status)
            .then(res =>
                this.getData(statusTab)
            ).catch(err =>
                console.log(err)
            );
        }
    };

    editRecord(record) {
        this.setState({ currentRecord: record });
    }

    deleteRecord(record) {
        axios
            .post("/api/user-delete", { _id: record._id })
            .then(res => {
                if (res.status === 200) {
                    toast(res.data.message, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                }
            })
            .catch();
        this.getData();
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }
    
    handleSearchChange = (event) => {
        const searchValue = event.target.value;
        this.setState({ searchValue }, () => {
        this.applySearchFilter();
        });
    };

    applySearchFilter = () => {
        const { records, searchValue } = this.state;
        if (!searchValue) {
        this.setState({ filteredRecords: [] });
        } else {
        const filteredRecords = records.filter((record) => {
            return (
                (record.fullname && record.fullname.toLowerCase().includes(searchValue.toLowerCase())) ||
                (record.email && record.email.toLowerCase().includes(searchValue.toLowerCase()))
            )
        });
        this.setState({ filteredRecords });
        }
    };


    showProperty = async (userId) => {
        this.setState({ dataRecords: ''});
        if (this.props.auth.isAuthenticated) {
        await axios.get("/api/get_offered_service/"+userId)
        .then(res => {
            this.setState({dataRecords:res.data.listing});
            if (res.status === 200) {
                this.loadingAPI(); // Call this function only if response status is 200
            }
        })
        .catch(err => {
            console.log(err);
        });
        }
    };

    render() {
        
        const { records, filteredRecords, searchValue } = this.state;
        const dataToDisplay = searchValue ? filteredRecords : records;

        return (
            <div>
                <Navbar pagetitle={this.state.pagetitle} />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div class="content">
                        <div class="container-fluid">
                        <div class="searchdropblock d-flex">
                            <div class="searchblock position-relative">
                                <span class="fa fa-search"></span>
                                <input placeholder="Search by Customer Name/Id" value={searchValue} onChange={this.handleSearchChange} />
                            </div>
                            <div class="dropblock">
                                <span>Sort By:</span>
                                <select>
                                    <option value="Company">Company</option>
                                    <option value="Company">New Company</option>
                                    <option value="Company">Old Company</option>
                                </select>
                            </div>
                        </div>
                        <div class="tabtableblock mt-3">
                            <nav class="d-flex">
                                <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                    <a class="nav-item nav-link active"  onClick={() => this.getData('inactive')} id="nav-home-tab" data-toggle="tab" href="#new-requests"
                                        role="tab" aria-controls="nav-home" aria-selected="true">New Requests</a>
                                    <a class="nav-item nav-link"  onClick={() => this.getData('active')} id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab"
                                        aria-controls="nav-profile" aria-selected="false">Verified Requests</a>
                                </div>
                            </nav>
                            {this.state.isLoading ? (
                                <div className="loader"><img src={loading}/></div>
                            ) : (
                                <div></div>
                            )}
                            <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="new-requests" role="tabpanel"
                                    aria-labelledby="nav-home-tab">
                                    <div class="customerstbl table-responsive">
                                        <div id="page-content-wrapper">
                                            <div className="">
                                                <ReactDatatable
                                                    config={this.config}
                                                    records={dataToDisplay}
                                                    columns={this.state.tabStatus?this.columns2:this.columns}
                                                    onPageChange={this.pageChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div></div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
             {/* <div class="modal fade companydetails_block" id="companydetailspop" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content border-0 rounded-0">
                        <div class="modheader p-4 text-center">
                            <h3 class="mb-0">Company Details</h3>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                            <div class="col-lg-10">
                                <div class="detaillistmain d-flex justify-content-start">
                                    <div class="detailprofile text-center mr-3">
                                        <img src="assests/image/companidetail-logo.jpg"/> 
                                        <h2>Mike Jhon</h2>
                                    </div>
                                    <div class="detailcontent">
                                        <div class="detaillistname">
                                        <ul>
                                            <li>mike@gmail.com</li>
                                            <li>wwww.abc.com</li>
                                            <li>+91-985555555</li>
                                            <li>NZ,USA</li>
                                            <li>Type: Company</li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="acceptbtnblock d-flex align-items-center flex-column">
                                    <button class="btn shortbtn">Accept</button>
                                    <button class="btn shortbtn">Decline</button>
                                </div>
                            </div>
                            </div>
                            <div class="uploadblock">
                            <h5>Uploaded Documents:</h5>
                            <div class="col-ting">
                                <div class="control-group file-upload" id="file-upload1">
                                    <div class="image-box text-center">
                                        <img src="/asstes/src/ionics/" alt=""/>
                                    </div>
                                    <div class="controls">
                                        <input type="file" name="contact_image_1"/>
                                    </div>
                                </div>
                                <div class="control-group file-upload" id="file-upload1">
                                    <div class="image-box text-center">
                                        <img src="/asstes/src/ionics/" alt=""/>
                                    </div>
                                    <div class="controls">
                                        <input type="file" name="contact_image_1"/>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
                                
            <div class="modal fade companydetails_block" id="totalproperties" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0 rounded-0">
                    <div class="modheader p-4 text-center">
                        <h3 class="mb-0">Company Details</h3>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4 align-items-center">
                        {this.state.dataRecords.length > 0 ? (
                                <div class="col-lg-10">
                                    <div class="detaillistmain d-flex justify-content-start">
                                        <div class="detailprofile text-center mr-3">
                                            <img src={this.state.dataRecords[0].profilePic}  onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=='; }}/>
                                            <h2>{this.state.dataRecords[0].company}</h2>
                                        </div>
                                        <div class="detailcontent">
                                            <div class="detaillistname">
                                                <ul>
                                                    <li>{this.state.dataRecords[0].email}</li>
                                                    <li>{this.state.dataRecords[0].phone}</li>
                                                    <li>{this.state.dataRecords[0].state},{this.state.dataRecords[0].country}</li>
                                                    <li>Type: Company</li>
                                                </ul>
                                                {/* <div class="detailshowblock d-flex">
                                                    <h5 class="mr-4">Uploaded Documents:</h5>
                                                    <div class="showuploadimgblock d-flex">
                                                        <div class="showimgupload"></div>
                                                        <div class="showimgupload"></div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading Properties...</p>
                            )}

                         <div class="col-lg-2">
                            <div class="acceptbtnblock d-flex align-items-center flex-column">
                                <button class="shortbtn grey-btn">Activate</button>
                                <button class="shortbtn grey-btn">Deactivate</button>
                                <button class="shortbtn grey-btn">Delete</button>
                            </div>
                        </div>
                        </div>
                        <div class="serviceOffersblock mt-3">
                        <h5 class="mb-4"><u>Services Offered:</u></h5>
                        <div class="row">
                            {this.state.dataRecords.length > 0 ? (
                                this.state.dataRecords.map((property, index) => (
                                <div class="col-lg-4 col-md-6 col-sm-12 mb-3">
                                    <div class="serviceinner d-flex justify-content-between h-100 p-2">
                                        <div class="serviceimg"><img src={property.serviceimage} /></div>
                                        <div class="serincontent">
                                        <ul class="mb-0">
                                            <li><strong>Service Name:</strong> <span>{property.name}</span></li>
                                            <li><strong>Price:</strong> <span>${property.price}</span></li>
                                            <li><strong>Category:</strong> <span>{property.category}</span></li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                            ))) : (
                                <p>Loading Properties...</p>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
        </div>
        );
    }
}

ManageCompanies.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(ManageCompanies);
