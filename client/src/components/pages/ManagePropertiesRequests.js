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
import { format } from 'date-fns';

class ManagePropertiesRequests extends Component {

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
                key: "createdAt",
                text: "Date & Time",
                className: "name",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock d-flex align-items-center">
                                {format(n.createdAt, 'YYYY/M/d hh:mm A')}
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "",
                text: "Requested By:",
                className: "email",
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
                                    <p>{n.phone}</p>
                                    <p>{n.email}</p>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "",
                text: "Property Information",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock">
                                <img src={n.image} onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=='; }}/>
                                <div class="profilenamedetail">
                                    <h6>{n.name}</h6>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "message",
                text: "Message",
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
                    return (
                        <Fragment>
                            <div class="tblbtn d-flex align-items-start flex-column align-items-center">
                                <button class="shortbtn grey-btn">Mark as Completed</button>
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
                key: "createdAt",
                text: "Date & Time",
                className: "name",
                align: "left",
                sortable: true
            },
            {
                key: "",
                text: "Requested By:",
                className: "email",
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
                                    <p>{n.phone}</p>
                                    <p>{n.email}</p>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "",
                text: "Property Information",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock">
                                <img src={n.image} width="150px" onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=='; }}/>
                                <div class="profilenamedetail">
                                    <h6>{n.name}</h6>
                                </div>
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "message",
                text: "Message",
                className: "date",
                align: "left",
                sortable: true
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
            pagetitle: 'Manage Properties Requests'
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData('pending')
    };

    loadingAPI(){
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }

    getData(status) {
        this.setState({ isLoading: true });
        const tabStatus = (status =='pending')?true:false;
        this.setState({tabStatus:tabStatus });
        if (this.props.auth.isAuthenticated) {
            axios.get("/api/properties_requests/"+status)
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
                     <div class="subcatagorysearch d-md-flex justify-content-between align-items-center">
                        <div class="searchdropblock d-flex">
                           <div class="searchblock position-relative">
                              <span class="fa fa-search"></span>
                              <input placeholder="Search by Name/Id" value={searchValue} onChange={this.handleSearchChange} />
                           </div>
                        </div>
                     </div>
                     <div class="tabtableblock mt-3">
                    <nav class="d-flex">
                        <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">

                        <a class="nav-item nav-link active" onClick={() => this.getData('pending')} id="nav-home-tab" data-toggle="tab" href="#new-requests"
                        role="tab" aria-controls="nav-home" aria-selected="true">New Requests</a>

                        <a class="nav-item nav-link" onClick={() => this.getData('completed')} id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab"
                        aria-controls="nav-profile" aria-selected="false">Completed</a>
                        </div>
                    </nav>
                    </div>

                    </div>
                    {this.state.isLoading ? (
                        <div className="loader"><img src={loading}/></div>
                    ) : (
                        <div>
                        </div>
                    )}
                     <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="new-requests" role="tabpanel"
                                    aria-labelledby="nav-home-tab">
                                    <div class="customerstbl table-responsive">
                                        <div id="page-content-wrapper">
                                            <div className="container-fluid">
                                                <ReactDatatable
                                                    config={this.config}
                                                    records={dataToDisplay}
                                                    columns={this.state.tabStatus?this.columns:this.columns2}
                                                    onPageChange={this.pageChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                            </div>
                     </div>
                  </div>
               </div>
               <div class="modal fade" id="subcate" role="dialog">
                  <div class="modal-dialog modal-lg">
                     <div class="modal-content">
                        <div class="modal-body">
                           <div class="row">
                              <div class="col-lg-2 col-md-2 col-cm-12">
                                 <button class="backbtn d-flex" data-dismiss="modal"><img src="assests/image/image--008.png"/><span>Back</span></button>
                              </div>
                              <div class="col-lg-8 col-md-8 col-sm-12">
                                 <div class="sersubimg text-center">
                                    <h3 class="text-center">Add New Category & Sub-Category</h3>
                                 </div>
                              </div>
                              <div class="col-lg-2 col-md-2 col-cm-12"></div>
                           </div>
                           <div class="mcsmodelwrap">
                              <div class="imgplumbing submodel"><img src="assests/image/cross.jpg"/></div>
                              <div class="addnewcateg">
                                 <form class="mt-3 mb-5">
                                    <div class="form-group ">
                                       <div class="row">
                                          <label class="control-label col-sm-4 catename" for="categoryname">Category name</label>
                                          <div class="col-sm-5">
                                             <input type="text" class="form-control" id="categoryname" placeholder="" name="categoryname"/>
                                          </div>
                                       </div>
                                    </div>
                                    <div class="form-group">
                                       <div class="row">
                                          <label class="control-label col-sm-4 catename" for="type">Type</label>
                                          <div class="col-sm-5">
                                             <input type="text" class="form-control" id="type" placeholder="" name="type"/>
                                          </div>
                                          <div class="col-sm-3">
                                             <div class="addmore">
                                                <button class="tenbutton btncolor modelul"> <i class="fa fa-plus-circle"></i><span class="addtext  subh3">ADD More</span></button>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div class="submitflex mt-4">
                                       <button type="submit" class=" addnew dab trim  ">Create</button>
                                    </div>
                                 </form>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="modal fade" id="ManagePropertiesRequestsModal" role="dialog">
                  <div class="modal-dialog modal-lg">
                     <div class="modal-content">
                        <div class="modal-body">
                           <div class="row">
                              <div class="col-lg-4 col-md-4 col-cm-12">
                                 <button class="backbtn d-flex" data-dismiss="modal"><img src="assests/image/image--008.png"/><span>Back</span></button>
                              </div>
                              <div class="col-lg-4 col-md-4 col-sm-12">
                                 <div class="sersubimg text-center">
                                    <img src="assests/image/companidetail-logo.jpg"/>
                                    <h3 class="text-center">Plumbing</h3>
                                 </div>
                              </div>
                              <div class="col-lg-4 col-md-4 col-cm-12">
                                 <div class="modelbtnback flex-column d-flex align-items-center align-items-md-end align-items-sm-center mb-4">
                                    <button class="shortbtn grey-btn">Edit</button>
                                    <button class="shortbtn grey-btn">Delete</button>
                                    <button class="shortbtn grey-btn">Activate</button>
                                 </div>
                              </div>
                           </div>
                           <div class="addmoremainblock">
                              <div class="typewrap d-flex justify-content-between align-items-center mb-2">
                                 <h3>Types: 8</h3>
                                 <div class="addmorea" onclick="addRow()">
                                    <button id="addNewRow" class=""> <i class="fa fa-plus-circle"></i>Add More</button>
                                 </div>
                              </div>
                              <div class="addcontentdiv">
                                 <div class="addmoreinner d-flex flex-wrap" id="content"></div>
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

ManagePropertiesRequests.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(ManagePropertiesRequests);
