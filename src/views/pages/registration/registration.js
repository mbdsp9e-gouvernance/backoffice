import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CButton,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilInfo } from "@coreui/icons";
import Loading from "../Loading";
import api from "../../../const/api";
// import api from "../../../const/api";
// import Moment from "moment";

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registrations: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    let wheres = [`valide=0`];
    wheres = wheres.join("&");
    if (wheres !== "") wheres = `?${wheres}`;
    this.setLoading(true);
    fetch(api(`users${wheres}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            registrations: data,
          });
          this.setLoading(false);
        });
      }
    });
  };

  setTypeFilter = (e) => {
    this.setState({
      typeFilter: e.target.value,
    });
  };

  setLoading = (e) => {
    this.setState({
      loading: e,
    });
  };

  render() {
    const {
      loading,
      registrations,
    } = this.state;
    if (loading) return <Loading />;
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Validation des inscriptions</strong>
                  {/* <CInputGroup style={{ width: "300px" }}>
                    <CInputGroupText
                      component="label"
                      htmlFor="inputGroupSelect01"
                    >
                      Type de compte
                    </CInputGroupText>
                    <CFormSelect
                      id="accountType"
                      onChange={this.setTypeFilter}
                      value={typeFilter}
                      required
                    >
                      <option value={0}>Tout</option>
                      <option value={1}>Personne</option>
                      <option value={2}>Entreprise</option>
                    </CFormSelect>
                  </CInputGroup> */}
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        Nom
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Prénom
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Email
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Détails et validation
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {registrations.map((data, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{data.NOM}</CTableDataCell>
                        <CTableDataCell>{data.PRENOM}</CTableDataCell>
                        <CTableDataCell>{data.EMAIL}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color={"light"}
                            onClick={() =>
                              this.props.history.push(
                                `/registration/${data.ID}`
                              )
                            }
                          >
                            <CIcon icon={cilInfo} /> Détails
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                {/* <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pageList === 1}
                    onClick={() => this.getUserData(pageList - 1, pageNumber)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getUserData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={totalPage - pageList === 0}
                    onClick={() => this.getUserData(pageList + 1, pageNumber)}
                  >
                    <span aria-hidden="true"> &raquo; </span>
                  </CPaginationItem>
                </CPagination> */}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}
