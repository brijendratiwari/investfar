import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getAllUser } from "../../actions/userActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { Link } from "react-router-dom";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import Axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';
import loading from "../../../src/icons/loading.gif";

class Dashboard extends Component {

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
                                    <img src={n.profilePic}
                                        onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg==';}} alt="Profile"/>
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
                key: "property",
                text: "Property Posted",
                className: "date",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    const userid = record.userid;
                    return (
                        <Fragment>
                            <div class="profleblock d-flex align-items-center propertyviews">
                                {n.property > 0 && (
                                    <a href="#" onClick={() => this.showProperty(userid)} data-toggle="modal" data-target="#totalproperties">{n.property|''}</a>
                                )}
                                {n.property <= 0 && (
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
                            <div class="tblbtn d-flex align-items-start flex-column align-items-center">
                                <button onClick={() => this.handleDelete(userid)} class="shortbtn grey-btn" data-toggle="modal" data-target="#deletecustomer">Delete</button>
                                {statusButton === 'inactive' && (
                                    <button onClick={() => this.handleActive(userid, 'active')} class="shortbtn grey-btn">Activate</button>
                                )}
                                {statusButton === 'active' && (
                                    <button onClick={() => this.handleActive(userid, 'inactive')} className="shortbtn grey-btn">Back</button>
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
        };


        this.state = {
          userList: []
        };

        this.state = {
            pagetitle: 'Manage Customers',
            dataRecords:[]
        }
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    
    async componentDidMount() {
      this.fetchUsers();
    };

    loadingAPI(){
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }

    fetchUsers = async () => {
        this.setState({ isLoading: true });
        if (this.props.auth.isAuthenticated) {
            Axios.get("/api/get_all_user")
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
    };

    showProperty = async (userId) => {
        this.setState({ dataRecords: ''});
        if (this.props.auth.isAuthenticated) {
        await Axios.get("/api/get_owner_property/"+userId)
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

    handleDelete = (userid) => {
        const id=userid;
        const shouldDelete = window.confirm("Are you sure you want to delete this user?");
        if (shouldDelete) {
            if (this.props.auth.isAuthenticated) {
                Axios.delete("/api/delete_users_status/"+id)
                .then(res => {
                    this.fetchUsers()
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    }

    handleActive = (userId, status) => {
        if (this.props.auth.isAuthenticated) {
            Axios.put("/api/update_users_status/"+userId+'/'+status)
            .then(res => {
                this.fetchUsers()
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

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
    
    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {
        const itemsPerPage = 10;
        const { records, filteredRecords, searchValue } = this.state;
        const dataToDisplay = searchValue ? filteredRecords : records;

        return (
            <div>
                <Navbar pagetitle={this.state.pagetitle} />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                            
                            {/* <div class="rightbar"> */}
                            <div class="">
                                <div class="content">
                                    <div class="container-fluid">
                                    <div class="searchdropblock d-flex">
                                        <div class="searchblock position-relative">
                                            <span class="fa fa-search"></span>
                                            <input placeholder="Search by Customer Name/Id" value={searchValue} onChange={this.handleSearchChange} />
                                        </div>
                                    </div>
                                    </div>

                                    {this.state.isLoading ? (
                                        <div className="loader"><img src={loading}/></div>
                                    ) : (
                                        <div>
                                        </div>
                                    )}
                                    <div class="customerstbl table-responsive">
                                        <div id="page-content-wrapper">
                                            <div className="container-fluid">
                                                <ReactDatatable
                                                    config={this.config}
                                                    records={dataToDisplay}
                                                    columns={this.columns}
                                                    onPageChange={this.pageChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>

                <div class="modal fade total_properitespop" id="totalproperties" tabindex="-1" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content border-0">
                            <div class="modheader p-2 text-center">
                                <h3 class="mb-0">Total Properties ({this.state.dataRecords.length})</h3>
                            </div>
                            <div class="modal-body p-0">
                                {this.state.dataRecords.length > 0 ? (
                                this.state.dataRecords.map((property, index) => (
                                <div class="propertypopmain">
                                    <div class="propertyimage position-relative">
                                        {property.images.length > 0 ? (
                                        <img src={property.images[0]} alt="Property" />
                                        ) : (
                                        <p></p>
                                        )}  
                                        <a href="#"><i
                                        class="fa fa-heart" aria-hidden="true"></i></a></div>
                                    <div class="detailblock d-flex justify-content-between pt-3 pr-2 pl-2">
                                        <div class="propertyproduct w-50">
                                            <h3 class="propertyname">{property.title}</h3>
                                            <p class="locationpro"><i class="fa fa-map-marker" aria-hidden="true"></i> {property.city},{property.country}</p>
                                            <h4 class="priceblock">${property.price}</h4>
                                        </div>
                                        <div class="propertyreview w-50 d-flex flex-column justify-content-end">
                                            <h5 class="text-right mb-0"> {property.owner}</h5>
                                            <ul class="d-flex justify-content-end mb-0">
                                                <li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li>
                                                <li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li>
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
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getAllUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser, getAllUser }
)(Dashboard);
