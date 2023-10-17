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
import imageIcon from "../../../src/icons/image--008.png";
import cross from "../../../src/icons/cross.jpg";
import loading from "../../../src/icons/loading.gif";

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class ManageCategory extends Component {
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
                key: "name",
                text: "Image",
                className: "name",
                align: "left",
                sortable: true,
                cell: record => {
                    let newr = JSON.stringify(record)
                    let n = JSON.parse(newr)
                    return (
                        <Fragment>
                            <div class="profleblock">
                                <img src={n.image} onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg=='; }} />
                            </div>
                        </Fragment>
                    );
                }
            },
            {
                key: "title",
                text: "Title",
                className: "email",
                align: "left",
                sortable: true
            },
            {
                key: "description",
                text: "Description",
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
                                <button class="shortbtn grey-btn">Edit</button>
                                <button class="shortbtn grey-btn">Delete</button>
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
            editorState: EditorState.createEmpty(),
        };

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            title: '',
            description: '', // Assuming you have a state variable for the editor content
            file: null, // Assuming you have a state variable for the selected file
        };


        this.state = {
            currentRecord: {
                id: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                password2: '',
            },
            pagetitle: 'Manage Blog'
        };

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    loadingAPI() {
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }

    componentWillReceiveProps(nextProps) {
        this.getData()
    }

    getData() {
        this.setState({ isLoading: true });
        if (this.props.auth.isAuthenticated) {
            axios.get("/api/get-blog")
                .then(res => {
                    this.setState({ records: res.data.listing });
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
                    (record.category && record.category.toLowerCase().includes(searchValue.toLowerCase()))
                )
            });
            this.setState({ filteredRecords });
        }
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    onEditorStateChange = (editorState) => {
        // Assuming you have a separate function to handle rich text editor changes
        // this.setState({ description: editorState });
        const content = editorState.getCurrentContent().getPlainText();

        this.setState({
            description: editorState,
            content: content,
        });
    };

    handleFileChange = (event) => {
        const file = event.target.files[0];
        this.setState({ file });
    };


    handleSubmit = (event) => {
        event.preventDefault();
        const userdata = {
            title:this.state.title,
            description:this.state.content
            // title:this.state.title
        };
        // const { title, description, file } = this.state;
        // const formData = new FormData();
        // formData.append('title', title);
        // formData.append('description', description);
        // formData.append('file', file);
        axios.post('/api/add-blog', userdata, {
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
        })
            .then((data) => {
                console.log('Server Response:', data);
                this.setState({
                    title: '',
                    editorState: '',
                    file: null,
                });
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch request
                console.error('Error:', error);
            });
    }


    render() {
        const { records, filteredRecords, searchValue } = this.state;
        const dataToDisplay = searchValue ? filteredRecords : records;
        const { editorState, title, description, file } = this.state;
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
                                        <input placeholder="Search" value={searchValue} onChange={this.handleSearchChange} />
                                    </div>
                                </div>
                                <div class="leftbtn">
                                    <a href="#" class="thamebtn" data-toggle="modal" data-target="#addBlog">Add Blog</a>
                                </div>
                            </div>
                        </div>
                        {this.state.isLoading ? (
                            <div className="loader"><img src={loading} /></div>
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
                <div class="modal fade" id="addBlog" role="dialog">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-lg-2 col-md-2 col-cm-12">
                                        <button class="backbtn d-flex" data-dismiss="modal"><img src={imageIcon} /><span>Back</span></button>
                                    </div>
                                    <div class="col-lg-8 col-md-8 col-sm-12">
                                        <div class="sersubimg text-center mb-4">
                                            <h3 class="text-center">Add Blog</h3>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-cm-12"></div>
                                </div>
                                <div class="mcsmodelwrap">
                                    <div class="addnewcateg">
                                        <form class="mt-3 mb-5" onSubmit={this.handleSubmit}>
                                            <div class="form-group ">
                                                <div class="row justify-content-center">
                                                    <label class="control-label col-sm-3 catename text-right" for="title">Title</label>
                                                    <div class="col-sm-8">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="title"
                                                            value={title}
                                                            name="title"
                                                            onChange={this.handleChange}
                                                        />                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="row justify-content-center">
                                                    <label class="control-label col-sm-3 catename text-right" for="type">Description</label>
                                                    <div class="col-sm-8">
                                                        <Editor
                                                            name="description"
                                                            editorState={description}
                                                            onEditorStateChange={this.onEditorStateChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <div class="row justify-content-center">
                                                    <label class="control-label col-sm-3 catename text-right" for="type">Image</label>
                                                    <div class="col-sm-8">
                                                        <input
                                                            type="file"
                                                            name="file"
                                                            id="file"
                                                            onChange={this.handleFileChange}
                                                            className="form-control"
                                                            accept=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="row justify-content-center">
                                                    <div class="col-sm-3"></div>
                                                    <div class="col-sm-8">
                                                        <div class="submitflex mt-4">
                                                            <button type="submit" class="addnew dab trim btn grey-btn">Create</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
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

ManageCategory.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(ManageCategory);
