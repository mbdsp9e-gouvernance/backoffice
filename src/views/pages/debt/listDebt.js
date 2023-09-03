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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CPaginationItem,
  CPagination,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";

export default class ListDebt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      payedModalState: false,
      loading: true,
      debt: null,
      customers: null,
      libelle: "",
      error: "",
      load: false,
      id: 0,
      nbrPayed: "",
      amount: 0,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
    };
  }

  componentDidMount() {
    this.getCustomerWithDebtData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getCustomerWithDebtData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`customer/page/debt/${page}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            customers: data.customer,
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

  async payDebtSimpleAndGlobal(customer, method) {
    this.setLoad(true);
    this.setError("");
    this.setNbrPayed("");
    if (this.state.amount > 0) {
      let user;
      let amount;
      let libelle;
      if (sessionStorage.getItem("user")) {
        user = JSON.parse(sessionStorage.getItem("user"));
        amount = this.state.amount;
        libelle = this.state.libelle;
        await this.transactionSimpleOrGlobalPayment(
          customer,
          user,
          parseInt(amount),
          libelle,
          method
        );
      }
    } else {
      this.setLoad(false);
      this.setError("Montant invalide");
    }
  }

  async transactionSimpleOrGlobalPayment(
    customer,
    user,
    amount,
    libelle,
    method
  ) {
    this.setLoading(true);
    await fetch(api("debtPayment/advance"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        customer: customer,
        user: user,
        amount: amount,
        libelle: libelle,
        method: method,
      }),
    }).then((res) => {
      if (res.ok)
        return res.json().then((data) => {
          if (data) {
            const message = data.debtPayment.message;
            this.setError(`${message}`);
            this.getCustomerWithDebtData(1);
          }

          this.setLoad(false);
        });
      else {
        res.json().then((res) => {
          if (typeof res.message === typeof []) {
            this.setError(res.message[0]);
            this.setLoad(false);
          } else {
            this.setError(res.message);
            this.setLoad(false);
          }
        });
      }
    });
    this.setLoading(false);
  }

  debtToPayed(index) {
    this.setError("");
    this.setNbrPayed("");
    this.setId(index);
    this.setPayedModalState(true);
  }

  DebtDetail(id) {
    this.props.history.push("/debt/customer/details/" + id);
  }

  render() {
    const {
      customers,
      loading,
      payedModalState,
      id,
      amount,
      libelle,
      error,
      load,
      nbrPayed,
      pageNumber,
      pagination,
      totalPage,
      pageList,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Liste des clients avec dette</strong>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Prénom(s)</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total (dette)
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total (dû)
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Reste à payer
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {customers &&
                      customers.map((customer, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{customer.name}</CTableDataCell>
                          <CTableDataCell>{customer.surname}</CTableDataCell>
                          <CTableDataCell>
                            {Number(customer.total_amount_debt) > 1000 ? (
                              <>
                                {Number(
                                  customer.total_amount_debt
                                ).toLocaleString()}{" "}
                                Ar
                              </>
                            ) : (
                              <>{customer.total_amount_debt} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(customer.total_amount_payed) > 1000 ? (
                              <>
                                {Number(
                                  customer.total_amount_payed
                                ).toLocaleString()}
                                Ar
                              </>
                            ) : (
                              <>{customer.total_amount_payed} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(customer.to_payed) > 1000 ? (
                              <>
                                {Number(customer.to_payed).toLocaleString()} Ar
                              </>
                            ) : (
                              <>{customer.to_payed} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() =>
                                this.DebtDetail(customer.customer_id)
                              }
                            >
                              Voir
                            </CButton>
                          </CTableDataCell>

                          <CTableDataCell>
                            {Number(customer.to_payed) === 0 ? (
                              <CButton
                                color={"success"}
                                disabled={true}
                                onClick={() => this.debtToPayed(index)}
                              >
                                Payer
                              </CButton>
                            ) : (
                              <CButton
                                color={"danger"}
                                onClick={() => this.debtToPayed(index)}
                              >
                                Payer
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pageList === 1}
                    onClick={() =>
                      this.getCustomerWithDebtData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() =>
                        this.getCustomerWithDebtData(page, pageNumber)
                      }
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 ||
                      (customers && customers.length === 0)
                    }
                    onClick={() =>
                      this.getCustomerWithDebtData(pageList + 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true"> &raquo; </span>
                  </CPaginationItem>
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal
          alignment="center"
          visible={payedModalState}
          onClose={() => this.setPayedModalState(false)}
        >
          <CModalHeader>
            <CModalTitle>Paiement</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                {customers &&
                  customers.length > 0 &&
                  id < customers.length &&
                  customers[id].name}{" "}
                {customers &&
                  customers.length > 0 &&
                  id < customers.length &&
                  customers[id].surname}
              </CInputGroupText>
              <CFormInput
                type="number"
                placeholder="Montant"
                autoComplete="Montant"
                value={amount}
                min={0}
                onChange={this.setAmount}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>Libelle</CInputGroupText>
              <CFormInput
                type="text"
                placeholder="libelle"
                autoComplete="Libelle"
                value={libelle}
                onChange={this.setLibelle}
              />
            </CInputGroup>
            <b>{error}</b>
            <br></br>
            <b> {nbrPayed}</b>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => this.setPayedModalState(false)}
            >
              Annuler
            </CButton>
            {load ? (
              <CButton id="aim-color-green" className="px-4" disabled>
                <Loading></Loading>
              </CButton>
            ) : (
              <CButton
                color="danger"
                onClick={() =>
                  this.payDebtSimpleAndGlobal(customers[id], "global")
                }
              >
                Valider
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      </>
    );
  }
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setAmount = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };
  setLibelle = (e) => {
    this.setState({
      libelle: e.target.value,
    });
  };
  setPayedModalState(modal) {
    this.setState({
      payedModalState: modal,
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
  setId(id) {
    this.setState({
      id: id,
    });
  }

  setNbrPayed(n) {
    this.setState({
      nbrPayed: n,
    });
  }
}
