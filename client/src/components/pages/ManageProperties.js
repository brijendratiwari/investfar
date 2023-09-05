import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { Link } from "react-router-dom";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons/faUserAlt";
import Axios from "axios";
import bathImg from '../../../src/icons/image9.png';
import villaImg from '../../../src/icons/image7.png';
import schoolImg from '../../../src/icons/school.png';
import fireImg from '../../../src/icons/fire.png';
import acImg from '../../../src/icons/ac.png';
import seenImg from '../../../src/icons/image6.png';
import walkscoureImg from '../../../src/icons/walkscoure.png';
import calculatorImg from '../../../src/icons/calculator.png';
import compairImg from '../../../src/icons/compare.png';
import gradenImg from '../../../src/icons/graden.png';
import laundaryImg from '../../../src/icons/laundary.jpg';
import loading from "../../../src/icons/loading.gif";
import { format } from 'date-fns';


class ManageProperties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            searchInput: '',
            dataRecords:[],
            pagetitle: 'Manage Properties'
        };
    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    async componentDidMount() {
       this.fetchProperties();
    };

    fetchProperties = async () => {
        this.setState({ isLoading: true });
        if (this.props.auth.isAuthenticated) {
            const offerTypeid = 'For sale';
            Axios.get("/api/get_properties/"+offerTypeid)
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

    
    loadingAPI(){
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }
    
    async handleTabChange(offerTypeid) {
        this.setState({ isLoading: true });
        if (this.props.auth.isAuthenticated) {
        Axios.get("/api/get_properties/"+offerTypeid)
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

    handleInputChange = (event) => {
        this.setState({ searchInput: event.target.value });
    };

    getModelData = async (propertyId) => {
        this.setState({ dataRecords: ''});
        if (this.props.auth.isAuthenticated) {
        await Axios.get("/api/get_single_property/"+propertyId)
        .then(res =>
            this.setState({dataRecords:res.data.listing})  
        ).catch(err =>
            console.log(err)
        );
        }
    };
  
    handleDelete = (propertyId) => {
        const id=propertyId;
        const shouldDelete = window.confirm("Are you sure you want to delete this Property?");
        if (shouldDelete) {
            if (this.props.auth.isAuthenticated) {
                Axios.delete("/api/delete_properties/"+id)
                .then(res =>
                    this.fetchProperties()
                ).catch(err =>
                    console.log(err)
                );
            }
        }
    }

    handleActive = (propertyId, status) => {
        if (this.props.auth.isAuthenticated) {
            Axios.put("/api/update_properties_status/"+propertyId+'/'+status)
            .then(res =>
                this.getModelData(propertyId)
            ).catch(err =>
                console.log(err)
            );
        }
    };


    render() {
        const { records, searchInput  } = this.state;
        // Filter the data based on the searchInput value
        const filteredRecords = records.filter(property =>
            property.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        return (
            <div>
                <Navbar pagetitle={this.state.pagetitle} />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>
                                <div class="content">
                                    <div class="tabtableblock mt-3">
                                        <div class="managepropertysearch d-flex justify-content-between mb-3">
                                            <nav class="d-flex">
                                                <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                                    <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#new-requests"
                                                        role="tab" aria-controls="nav-home" aria-selected="true" onClick={() => this.handleTabChange("For sale")}>Buy</a>
                                                    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile"
                                                        role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => this.handleTabChange("Vacant")}>Rent</a>
                                                </div>
                                            </nav>
                                            <div class="searchdropblock d-flex">
                                                <div class="searchblock position-relative mr-0"><span class="fa fa-search"></span>
                                                <input placeholder="Search by Customer Name/Id"  value={searchInput} onChange={this.handleInputChange}/></div>
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
                                                <div class="properymangehouse">
                                                <div class="row">
                                                    {/* Check if records array is not empty before rendering */}
                                                    {filteredRecords.length > 0 ? (
                                                        filteredRecords.map((property, index) => (
                                                            <div key={index} class="col-lg-6 col-md-6 mb-4">
                                                                <div class="propertypopmain">
                                                                    <div class="propertyimage position-relative"  onClick={() => this.getModelData(property.id)}  data-toggle="modal" data-target="#propertydetails">
                                                                        {/* Check if property.image array is not empty before rendering */}
                                                                        {property.images.length > 0 ? (
                                                                            <img src={property.images[0]} alt="Property" />
                                                                        ) : (
                                                                            <p></p>
                                                                        )}
                                                                        <a href="#"><i class="fa fa-heart" aria-hidden="true"></i></a>
                                                                    </div>
                                                                    <div class="detailblock d-flex justify-content-between pt-3 pr-2 pl-2">
                                                                        <div class="propertyproduct w-50">
                                                                            <h3 class="propertyname">{property.title}</h3>
                                                                            <p class="locationpro"><i class="fa fa-map-marker" aria-hidden="true"></i> {property.country}</p>
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
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>Loading Data...</p>
                                                    )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <nav aria-label="Page navigation">
                                    <ul class="pagination mb-0 justify-content-center">
                                        <li class="page-item"><a class="page-link pre" href="#"><i class="fa fa-angle-double-left"></i></a></li>
                                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item"><a class="page-link active" href="#">4</a></li>
                                        <li class="page-item"><a class="page-link" href="#">5</a></li>
                                        <li class="page-item"><a class="page-link" href="#">6</a></li>
                                        <li class="page-item"><a class="page-link" href="#">7</a></li>
                                        <li class="page-item"><a class="page-link" href="#">8</a></li>
                                        <li class="page-item"><a class="page-link next" href="#"><i class="fa fa-angle-double-right"></i></a>
                                        </li>
                                    </ul>
                                </nav> */}
                            </div>
                    </div>
                </div>

                <div class="propertydetailspop">
                    <div class="modal fade" id="propertydetails" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                {/* Check if records array is not empty before rendering */}
                                {this.state.dataRecords.length > 0 ? (
                                this.state.dataRecords.map((property, index) => (
                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-lg-4"></div>
                                        <div class="col-lg-4">
                                            <h3 class="text-center">Property Details</h3>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="modelbtnback flex-column d-flex align-items-end">
                                                {property.propertyStatus === 'InActive' && (
                                                    <button onClick={() => this.handleActive(property.id, 'Active')} class="shortbtn grey-btn">Activate</button>
                                                )}
                                                {property.propertyStatus === 'Active' && (
                                                    <button onClick={() => this.handleActive(property.id, 'InActive')} className="shortbtn grey-btn">Block</button>
                                                )}
                                                <button onClick={() => this.handleDelete(property.id)} class="shortbtn grey-btn">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="propertyinfomain">
                                        <div class="row">
                                            <div class="col-lg-6 col-md-6">
                                                <h5><u>Property Info</u></h5>
                                                <div class="manageproimg mt-2">
                                                     {/* Check if property.image array is not empty before rendering */}
                                                     {property.images.length > 0 ? (
                                                            <img src={property.images[0]} alt="Property" />
                                                        ) : (
                                                            <p></p>
                                                        )}      
                                                </div>
                                                <div class="propertyinfoinner pt-4">
                                                    <div class="detailnameblock d-flex justify-content-between">
                                                        <div class="detailname">
                                                            <h3 class="d-flex align-items-center mb-0"><img src={villaImg} alt="home"/> {property.propertytype}</h3>
                                                            <h3 class="d-flex align-items-center"><img src={seenImg} alt="seenBy"/> {property.seenBy |'0'}</h3>
                                                            <h3 class="mb-1">{property.title}</h3>
                                                            <h3 class="mb-0 d-flex align-items-center"><i
                                                                class="fa fa-map-marker"></i>{property.city},{property.country}</h3>
                                                        </div>
                                                        <div class="proinforpro text-center">
                                                            <div class="infoprofile"><img src={property.profileImg}  onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAhCAYAAADOHBvaAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACL0lEQVR42mL8//8/w0AAgABiIldjc3OzIgiTqx8ggBiJ9XFBQQGrmpqaqYGBgSOQNhEREZEBib958+bJrVu3zly4cGE/kD49YcKE38SYBxBADCCLCeH8/HzWR48eLf1PAIDUgNQSYyZAABFl8fnz5zv/Ewlu3LgxnRgzAQKIoIKjR49WA+nT/4kHp4mxHCCAiPExKZbCLScU5AABxESj3GIiKyurhU8BQADRyuIz3759+4RPAUAA0SyoCZkLEEAEfUzQ5VjA48ePbxFSAxBAeC2uqqoSJsdiTk5OLlCBg08NQADhDY5NmzYl/ycTQPXiNBsggJgIBNl1clMXIb0AAYTX4rdv3z4HpVByUjVUL04AEEDEVBKnYXmTWEuhtCk+RQABREw+Nj127NgGYr0KrKX2EbIUBAACiKgCZMuWLTOIDPIzUIsJAoAAIqp2AmFiqsWvX7/uJdY8gAAiusgEVfKE1Bw/fnwzseYBBBDRDYHXr1+vJ+RjkBpiGwIAAUT1hgBULUEzAQIIa3YCFXegak1GRkbNysoqAMhWIyU7gcpqUE548uTJLSD7GrZ2GEAAobhi6tSpVtBEdPo/9cBpUBSAzEa2CyCAwERPT48+tLlCTQuxNolAdoHsBAggBqhLaGkhhgNAlgMEEAuwnXyUzp0IE6CdFwACiElYWJju3RdgomUACCAmYIqlu8UgzwIEECg7DUivDSCAmBgGCAAE0IBZDBBALL29vQNiMUCAAQBwIUp/mN/3KAAAAABJRU5ErkJggg==';}}/></div>
                                                            <h6>{property.owner}</h6>
                                                            {/* <h6>Property ID:<span class="proidinner"> 56</span></h6> */}
                                                        </div>
                                                    </div>
                                                    <div class="bathtub d-flex justify-content-between">
                                                        <div class="bathtub d-flex justify-content-start w-50">
                                                            <div class="bathtubicon d-flex align-items-center"><img src={bathImg} alt="bath" /><span>{property.bath}</span></div>
                                                            <div class="bathtubicon d-flex align-items-center"><img
                                                                src="assests/image/image9.png" /><span>{property.bed}</span></div>
                                                            <div class="bathtubicon d-flex align-items-center"><img src={villaImg} alt="rooms"/> 
                                                            <span>2</span></div>
                                                        </div>
                                                        <div class="rating d-flex justify-content-end w-50">
                                                            <div class="ratinginner">
                                                                <span class="fa fa-star checked"></span>
                                                                <span class="fa fa-star checked"></span>
                                                                <span class="fa fa-star checked"></span>
                                                                <span class="fa fa-star"></span>
                                                                <span class="fa fa-star"></span>
                                                                <span class="threepointone">{property.rating |'0'}/5</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="postedflex mt-1 mb-2">
                                                        <h3>Property Size: <span> {property.size} </span></h3>
                                                        <h3>Posted At : <span> {property.createdAt}
                                                            {format(new Date(property.createdAt), 'YYYY/M/d hh:mm A')}
                                                         </span></h3>
                                                    </div>
                                                    <div class="categoryhousemain d-flex justify-content-between">
                                                        <div class="categoryhouse d-flex justify-content-center">
                                                            <h3 class="d-flex align-items-center"><img src={calculatorImg} alt="calculator"/>
                                                                                            mortgage calculator</h3>
                                                        </div>
                                                        <div class="categoryhouse d-flex justify-content-center">
                                                            <h3 class="d-flex align-items-center"><img src={schoolImg} alt="school"/> School</h3>
                                                        </div>
                                                        <div class="categoryhouse d-flex justify-content-center">
                                                            <h3 class="d-flex align-items-center"><img src={walkscoureImg} alt="walkscoure" /> Walk scoure</h3>
                                                        </div>
                                                        <div class="categoryhouse d-flex justify-content-center">
                                                            <h3 class="d-flex align-items-center"><img src={compairImg} alt="compair" /> Compare</h3>
                                                        </div>
                                                    </div>
                                                    <div class="amenitiestop">
                                                        <div class="Amenities">
                                                            <h3>Amenities</h3>
                                                        </div>


                                                        
                                                        <div class="amenitiesblockmain mb-4 d-flex">
                                                            <div class="amenitiesinner d-flex justify-content-center">
                                                                <h3 class="d-flex flex-column justify-content-between align-items-center"><img
                                                                    src={fireImg} alt="Fire" /> FirePlace</h3>
                                                            </div>
                                                            <div class="amenitiesinner d-flex justify-content-center">
                                                                <h3 class="d-flex flex-column justify-content-between align-items-center"><img src={acImg} alt="AC"/> Air Conditioning</h3>
                                                            </div>
                                                            <div class="amenitiesinner d-flex justify-content-center">
                                                                <h3 class="d-flex flex-column justify-content-between align-items-center"><img
                                                                    src="assests/image/walkscoure.png" /> High Celing</h3>
                                                            </div>
                                                            <div class="amenitiesinner d-flex justify-content-center">
                                                                <h3 class="d-flex flex-column justify-content-between align-items-center"><img
                                                                    src={laundaryImg} alt="Laundary" /> Laundary</h3>
                                                            </div>
                                                            <div class="amenitiesinner d-flex justify-content-center">
                                                                <h3 class="d-flex flex-column justify-content-between align-items-center"><img
                                                                    src={gradenImg} alt="graden"/> Garden</h3>
                                                            </div>
                                                        </div>
                                                        <p>{property.user_description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 col-md-6">
                                                <h5><u>Floor Plan</u></h5>
                                                <div class="flppad">
                                                    <div class="row">
                                                    {property.images.length > 0 ? (
                                                        property.images.slice(1, 3).map((image, index) => (
                                                            <div key={index} className="col-lg-12 col-md-12">
                                                            <div className="floorplanimg mb-3">
                                                                <img src={image} alt={`Property Image ${index + 1}`} />
                                                            </div>
                                                            </div>
                                                        ))
                                                        ) : (
                                                            <p>No images available.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
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

ManageProperties.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(ManageProperties);