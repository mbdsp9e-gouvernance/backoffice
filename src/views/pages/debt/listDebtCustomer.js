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
  CPaginationItem,
  CPagination,
} from "@coreui/react";
import api from "../../../const/api";
import moment from "moment";
import Loading from "../Loading";

export default class ListDebtCustomer extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      id_customer: match && match.params && match.params.id,
      loading: true,
      debt: null,
      error: "",
      role: "",
      load: false,
      history: false,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setRole(user.role_id.entitled);
    }
    this.getDebtPayment();
    this.getDebtData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getDebtData = (page, pageNumber) => {
    this.setLoading(true);
    const id_customer = this.state.id_customer;
    fetch(api(`debt/customer/${id_customer}/page/${page}`), {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            debt: data.debt,
            pageList: page,
            pageNumber: pageNumber,
            totalPage: data.pagination.totalPages,
          });
          this.pagination(data.pagination.totalPages);
          this.setLoading(false);
        });
      }
    });
  };

  getDebtPayment() {
    this.setLoading(true);
    const id_customer = this.state.id_customer;
    fetch(api(`debtPayment/history/${id_customer}`), { method: "GET" }).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data && data.total) {
              if (data.total.total != null) {
                this.setState({
                  history: false,
                  loading: false,
                });
              } else {
                this.setState({
                  history: true,
                  loading: false,
                });
              }
            }
          });
        }
      }
    );
  }

  DebtDetail(id) {
    this.props.history.push("/debt/details/" + id);
  }

  debtPayementDetailGlobal(id) {
    const { id_customer } = this.state;
    this.props.history.push("/debt/payment/" + id_customer);
  }

  render() {
    const {
      debt,
      role,
      loading,
      pageNumber,
      pagination,
      totalPage,
      pageList,
      history,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <strong>Liste des Dettes</strong>
                <CButton
                  color={"light"}
                  onClick={() => this.debtPayementDetailGlobal()}
                  disabled={history}
                >
                  Historique des paiements
                </CButton>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        Dernière modification
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Libelle</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total (dette)
                      </CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">
                        Montant total (dû)
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Reste à payer
                      </CTableHeaderCell> */}
                      {/* <CTableHeaderCell scope="col">Status</CTableHeaderCell> */}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {debt &&
                      debt.map((Debt, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {moment(Debt.modif_date).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{Debt.libelle}</CTableDataCell>
                          <CTableDataCell>
                            {Number(Debt.total_amount) > 1000 ? (
                              <>
                                {Number(Debt.total_amount).toLocaleString()} Ar
                              </>
                            ) : (
                              <>{Debt.total_amount} Ar</>
                            )}
                          </CTableDataCell>
                          {/* <CTableDataCell>
                            {Number(Debt.total_amount_payed) > 1000 ? (
                              <>
                                {Number(
                                  Debt.total_amount_payed
                                ).toLocaleString()}{" "}
                                Ar
                              </>
                            ) : (
                              <>{Debt.total_amount_payed} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(Debt.to_payed) > 1000 ? (
                              <>{Number(Debt.to_payed).toLocaleString()} Ar</>
                            ) : (
                              <>{Debt.to_payed} Ar</>
                            )}
                          </CTableDataCell> */}

                          {/* {Debt.status === 0 ? (
                            <CTableDataCell style={{ color: "red" }}>
                              Non payé
                            </CTableDataCell>
                          ) : Debt.status === 1 ? (
                            <CTableDataCell style={{ color: "green" }}>
                              Payé
                            </CTableDataCell>
                          ) : (
                            <></>
                          )} */}
                          {role === "Administrateur" ? (
                            <CTableDataCell>
                              <CButton
                                color={"light"}
                                onClick={() => this.DebtDetail(Debt.debt_id)}
                              >
                                Voir
                              </CButton>
                            </CTableDataCell>
                          ) : (
                            <></>
                          )}
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pageList === 1}
                    onClick={() => this.getDebtData(pageList - 1, pageNumber)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getDebtData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 || (debt && debt.length === 0)
                    }
                    onClick={() => this.getDebtData(pageList + 1, pageNumber)}
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
  setLoad(l) {
    this.setState({
      load: l,
    });
  }

  setError(m) {
    this.setState({
      error: m,
    });
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setRole(r) {
    this.setState({
      role: r,
    });
  }
}
