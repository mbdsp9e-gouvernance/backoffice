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
import { cilTrash, cilPencil } from "@coreui/icons";
import api from "../../../const/api";
import moment from "moment";
import Loading from "../Loading";

export default class ListExpenseMonth extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      month: match && match.params && match.params.month,
      formModalState: false,
      deleteModalState: false,
      loading: true,
      expense: null,
      error: "",
      role: "",
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      id: 0,
      offset: 0,
      limit: 0,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setRole(user.role_id.entitled);
    }
    this.getExpenseData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getExpenseData = (page, pageNumber) => {
    this.setLoading(true);
    const month = this.state.month;
    fetch(api(`expense/page/${month}/${page}`), { method: "GET" }).then(
      (res) => {
        if (res.ok) {
          return res.json().then((data) => {
            this.setState({
              expense: data.expense,
              pageList: page,
              pageNumber: pageNumber,
              totalPage: data.pagination.totalPages,
            });
            this.pagination(data.pagination.totalPages);
            this.setLoading(false);
          });
        }
      }
    );
  };

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  deleteexpense() {
    fetch(api(`expense/${this.state.expense[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.expense];
        tmp.splice(this.state.id, 1);
        this.setState({
          expense: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  expenseToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  expenseUpdate(id) {
    this.props.history.push("/expense/update/" + id);
  }

  return() {
    this.props.history.push("/expense/list");
  }

  render() {
    const {
      expense,
      loading,
      role,
      deleteModalState,
      id,
      pageList,
      pageNumber,
      pagination,
      totalPage,
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
                  <strong>Liste des Sorties</strong>
                  <CButton color={"primary"} onClick={() => this.return()}>
                    Retour
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">
                        created_date
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">libelle</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Utilisateur
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {expense &&
                      expense.map((e, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {moment(e.created_date).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{e.libelle}</CTableDataCell>
                          <CTableDataCell>
                            {e.name} {e.surname}
                          </CTableDataCell>
                          <CTableDataCell>
                            {e.price > 1000 ? (
                              <>{e.price.toLocaleString()} Ar</>
                            ) : (
                              <>{e.price} Ar</>
                            )}
                          </CTableDataCell>
                          {role === "Administrateur" ? (
                            <>
                              <CTableDataCell>
                                <CButton
                                  color={"light"}
                                  onClick={() => this.expenseUpdate(e.id)}
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton
                                  color={"danger"}
                                  onClick={() => this.expenseToDelete(index)}
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
                      this.getExpenseData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getExpenseData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 ||
                      (expense && expense.length === 0)
                    }
                    onClick={() =>
                      this.getExpenseData(pageList + 1, pageNumber)
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
              {expense &&
                expense.length > 0 &&
                id < expense.length &&
                expense[id].libelle}
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
            <CButton color="danger" onClick={() => this.deleteexpense()}>
              Supprimer
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
  setRole(r) {
    this.setState({
      role: r,
    });
  }
  setOffset = (o) => {
    this.setState({
      offset: o,
    });
  };
  setLimit = (l) => {
    this.setState({
      limit: l,
    });
  };
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
}
