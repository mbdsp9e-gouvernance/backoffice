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
  CPagination,
  CPaginationItem,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilInfo } from "@coreui/icons";
import Loading from "../Loading";
// import api from "../../../const/api";
// import Moment from "moment";

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageList: 1,
      pageNumber: 20,
      pagination: [1, 2, 3],
      totalPage: 3,
      typeFilter: 0,
      registrations: [],
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        registrations: [
          {
            name: "cedric004",
            type: "Personne",
            fullName: "Rakotomaharo Cedric",
            date: "20/07/2023",
          },
          {
            name: "bici",
            type: "Entreprise",
            fullName: "BICI",
            date: "21/07/2023",
          },
          {
            name: "cedric004",
            type: "Personne",
            fullName: "Rakotomaharo Cedric",
            date: "20/07/2023",
          },
          {
            name: "bici",
            type: "Entreprise",
            fullName: "BICI",
            date: "21/07/2023",
          },
          {
            name: "cedric004",
            type: "Personne",
            fullName: "Rakotomaharo Cedric",
            date: "20/07/2023",
          },
          {
            name: "bici",
            type: "Entreprise",
            fullName: "BICI",
            date: "21/07/2023",
          },
        ],
        loading: false,
      });
    }, 1000);
  }

  setTypeFilter = (e) => {
    this.setState({
      typeFilter: e.target.value,
    });
  };

  render() {
    const {
      pageList,
      pageNumber,
      pagination,
      totalPage,
      loading,
      typeFilter,
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
                  <CInputGroup style={{ width: "300px" }}>
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
                  </CInputGroup>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        Nom d'utilisateur
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Type de compte
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Personne ou Entreprise
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Date d'inscription
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Détails et validation
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {registrations.map((data, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{data.name}</CTableDataCell>
                        <CTableDataCell>{data.type}</CTableDataCell>
                        <CTableDataCell>{data.fullName}</CTableDataCell>
                        <CTableDataCell>{data.date}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color={"light"}
                            onClick={() =>
                              this.props.history.push(
                                `/registration/${data.type}`
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
                <CPagination aria-label="Page navigation example">
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
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}
