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
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPencil, cilPlus } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class ListCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      customers: null,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      error: "",
      role: "",
      id: 0,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setRole(user.role_id.entitled);
    }
    this.getCustomerData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getCustomerData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`customer/page/${page}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            customers: data.customers,
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

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  deleteCustomer() {
    fetch(api(`customer/${this.state.customers[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.customers];
        tmp.splice(this.state.id, 1);
        this.setState({
          customers: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  customerToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  customerUpdate(id) {
    this.props.history.push("/customer/update/" + id);
  }

  addCustomer() {
    this.props.history.push("/addCustomer");
  }

  render() {
    const {
      customers,
      loading,
      deleteModalState,
      id,
      pageList,
      pageNumber,
      pagination,
      totalPage,
      role,
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
                  <strong>Liste des Clients</strong>
                  <CButton color={"primary"} onClick={() => this.addCustomer()}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Name </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Genre</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Adresse</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Numero</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {customers &&
                      customers.map((customer, index) => (
                        <CTableRow key={customer.id}>
                          <CTableDataCell>{customer.name}</CTableDataCell>
                          <CTableDataCell>{customer.surname}</CTableDataCell>
                          <CTableDataCell>{customer.gender}</CTableDataCell>
                          <CTableDataCell>{customer.address}</CTableDataCell>
                          <CTableDataCell>
                            {customer.number_phone}
                          </CTableDataCell>
                          <CTableDataCell>{customer.email}</CTableDataCell>
                          {role === "Administrateur" ? (
                            <>
                              <CTableDataCell>
                                <CButton
                                  color={"light"}
                                  onClick={() =>
                                    this.customerUpdate(customer.id)
                                  }
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton
                                  color={"danger"}
                                  onClick={() => this.customerToDelete(index)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </CTableDataCell>
                            </>
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
                      this.getCustomerData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getCustomerData(page, pageNumber)}
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
                      this.getCustomerData(pageList + 1, pageNumber)
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
              {customers &&
                customers.length > 0 &&
                id < customers.length &&
                customers[id].entitled}
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
            <CButton color="danger" onClick={() => this.deleteCustomer()}>
              Supprimer
            </CButton>
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
  setId(id) {
    this.setState({
      id: id,
    });
  }
  setDeleteModalState(modal) {
    this.setState({
      deleteModalState: modal,
    });
  }
  setRole(r) {
    this.setState({
      role: r,
    });
  }
}
