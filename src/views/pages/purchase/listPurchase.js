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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import api from "../../../const/api";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPlus } from "@coreui/icons";
import moment from "moment";
import Loading from "../Loading";

export default class ListPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      purchase: null,
      purchaseDebt: null,
      formModalState: false,
      deleteModalState: false,
      deleteModalStateWithDebt: false,
      purchaseWithDebt: null,
      load: false,
      error: "",
      pagination: [],
      role: "",
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      paginationDebt: [],
      totalPageDebt: 0,
      pageListDebt: 1,
      pageNumberDebt: 10,
      id: 0,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setRole(user.role_id.entitled);
    }
    this.getPurchaseData(1);
    this.getPurchaseWithDebtData(1);
  }

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  deleteDebtPurchase() {
    this.setLoadButton(true);
    fetch(api(`debtPayment/${this.state.purchaseDebt[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.purchaseDebt];
        tmp.splice(this.state.id, 1);
        this.setState({
          purchaseDebt: tmp,
        });
        this.setDeleteModalStateWithDebt(false);
      }
    });
    this.setLoadButton(false);
  }

  deletePurchase() {
    this.setLoadButton(true);
    fetch(api(`purchase/${this.state.purchase[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.purchase];
        tmp.splice(this.state.id, 1);
        this.setState({
          purchase: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
    this.setLoadButton(false);
  }

  purchaseToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  purchaseWithDebtToDelete(index) {
    this.setId(index);
    this.setDeleteModalStateWithDebt(true);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getPurchaseData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`purchase/page/${page}`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            purchase: data.purchase,
            pageList: page,
            pageNumber: pageNumber,
            totalPage: data.pagination.totalPages,
          });
          this.pagination(data.pagination.totalPages);
        });
      }
    });
  };

  paginationDebt = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ paginationDebt: page });
  };

  getPurchaseWithDebtData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`purchase/debt/page/${page}`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            purchaseDebt: data.purchase,
            pageListDebt: page,
            pageNumberDebt: pageNumber,
            totalPageDebt: data.pagination.totalPages,
          });
          this.paginationDebt(data.pagination.totalPages);
          this.setLoading(false);
        });
      }
      this.setLoading(false);
    });
  };

  PurchaseDetail(id) {
    this.props.history.push("/Purchase/details/" + id);
  }

  addPurchase(debt) {
    this.props.history.push("/service/purchase/" + debt);
  }

  render() {
    const {
      loading,
      id,
      role,
      load,
      deleteModalState,
      deleteModalStateWithDebt,
      purchase,
      pageList,
      pageNumber,
      totalPage,
      pagination,
      purchaseDebt,
      pageListDebt,
      pageNumberDebt,
      totalPageDebt,
      paginationDebt,
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
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Liste des Achats sans dette</strong>
                  <CButton
                    color={"primary"}
                    onClick={() => this.addPurchase(0)}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Reçu par</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Note</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {purchase &&
                      purchase.map((Purchase, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {Purchase.received_by.name}{" "}
                            {Purchase.received_by.surname}
                          </CTableDataCell>
                          {Purchase.customer_id ? (
                            <CTableDataCell>
                              {Purchase.customer_id.name}{" "}
                              {Purchase.customer_id.surname}
                            </CTableDataCell>
                          ) : (
                            <CTableDataCell>Aucun</CTableDataCell>
                          )}

                          <CTableDataCell>
                            {Purchase.total_amount > 1000 ? (
                              <>{Purchase.total_amount.toLocaleString()} Ar</>
                            ) : (
                              <>{Purchase.total_amount} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {moment(Purchase.purchase_datetime).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{Purchase.notes}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.PurchaseDetail(Purchase.id)}
                            >
                              Details
                            </CButton>
                          </CTableDataCell>
                          {role === "Administrateur" ? (
                            <CTableDataCell>
                              <CButton
                                color={"danger"}
                                onClick={() => this.purchaseToDelete(index)}
                              >
                                <CIcon icon={cilTrash} />
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
                    onClick={() =>
                      this.getPurchaseData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getPurchaseData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 || (purchase && purchase.length === 0)
                    }
                    onClick={() =>
                      this.getPurchaseData(pageList + 1, pageNumber)
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
          visible={deleteModalState}
          onClose={() => this.setDeleteModalState(false)}
        >
          <CModalHeader>
            <CModalTitle>Supprimer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Voulez vous supprimer{" "}
              {purchase &&
                purchase.length > 0 &&
                id < purchase.length &&
                purchase[id].entitled}
              ?
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => this.setDeleteModalState(false)}
            >
              Annuler
            </CButton>
            {load ? (
              <CButton color="danger" disabled>
                <Loading></Loading>
              </CButton>
            ) : (
              <CButton color="danger" onClick={() => this.deletePurchase()}>
                Supprimer
              </CButton>
            )}
          </CModalFooter>
        </CModal>

        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Liste des Achats avec dette</strong>
                  <CButton
                    color={"primary"}
                    onClick={() => this.addPurchase(1)}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Reçu par</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Note</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {purchaseDebt &&
                      purchaseDebt.map((Purchase, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {Purchase.received_by.name}{" "}
                            {Purchase.received_by.surname}
                          </CTableDataCell>
                          {Purchase.customer_id ? (
                            <CTableDataCell>
                              {Purchase.customer_id.name}{" "}
                              {Purchase.customer_id.surname}
                            </CTableDataCell>
                          ) : (
                            <CTableDataCell>Aucun</CTableDataCell>
                          )}

                          <CTableDataCell>
                            {Purchase.total_amount > 1000 ? (
                              <>{Purchase.total_amount.toLocaleString()} Ar</>
                            ) : (
                              <>{Purchase.total_amount} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            {moment(Purchase.purchase_datetime).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{Purchase.notes}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.PurchaseDetail(Purchase.id)}
                            >
                              Details
                            </CButton>
                          </CTableDataCell>
                          {role === "Administrateur" ? (
                            <CTableDataCell>
                              <CButton
                                color={"danger"}
                                onClick={() => this.purchaseWithDebtToDelete(index)}
                              >
                                <CIcon icon={cilTrash} />
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
                    disabled={pageListDebt === 1}
                    onClick={() =>
                      this.getPurchaseWithDebtData(
                        pageListDebt - 1,
                        pageNumberDebt
                      )
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {paginationDebt.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageListDebt}
                      onClick={() =>
                        this.getPurchaseWithDebtData(page, pageNumberDebt)
                      }
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPageDebt - pageListDebt === 0 ||
                      (purchase && purchase.length === 0)
                    }
                    onClick={() =>
                      this.getPurchaseWithDebtData(
                        pageListDebt + 1,
                        pageNumberDebt
                      )
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
          visible={deleteModalStateWithDebt}
          onClose={() => this.setDeleteModalStateWithDebt(false)}
        >
          <CModalHeader>
            <CModalTitle>Supprimer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Voulez vous supprimer{" "}
              {purchaseDebt &&
                purchaseDebt.length > 0 &&
                id < purchaseDebt.length &&
                purchaseDebt[id].entitled}
              ?
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => this.setDeleteModalStateWithDebt(false)}
            >
              Annuler
            </CButton>
            {load ? (
              <CButton color="danger" disabled>
                <Loading></Loading>
              </CButton>
            ) : (
              <CButton color="danger" onClick={() => this.deleteDebtPurchase()}>
                Supprimer
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      </>
    );
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setLoadButton(state) {
    this.setState({
      load: state,
    });
  }
  setId(id) {
    this.setState({
      id: id,
    });
  }
  setRole(r) {
    this.setState({
      role: r,
    });
  }
  setDeleteModalState(modal) {
    this.setState({
      deleteModalState: modal,
    });
  }
  setDeleteModalStateWithDebt(modal) {
    this.setState({
      deleteModalStateWithDebt: modal,
    });
  }
}
