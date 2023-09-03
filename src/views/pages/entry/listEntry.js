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
  CPaginationItem,
  CPagination,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPlus } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";
import moment from "moment/moment";

export default class ListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      entry: null,
      error: "",
      role: "",
      id: 0,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      customer: "",
      option: "none",
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setRole(user.role_id.entitled);
    }
    this.getEntryData(1, null, "none", "customer", 0, "service");
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getEntryData = (page, pageNumber, option, group, customer, service) => {
    this.setLoading(true);
    fetch(api(`entry/${group}/${option}/${customer}/${service}/page/${page}`), {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            entry: data.entry,
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

  deleteEntry() {
    fetch(api(`entry/${this.state.entry[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.entry];
        tmp.splice(this.state.id, 1);
        this.setState({
          entry: tmp,
        });
        this.setDeleteModalState(false);
        this.props.history.push("/entry/list");
      }
    });
  }

  entryToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  entryDetails(name, surname, id_customer, option, service, condition) {
    let id = 0;
    if (condition === "customer") {
      if (id_customer != null) {
        this.setCustomer(`${name}${" "}${surname}`);
        id = id_customer;
      } else {
        id = 0;
        this.setCustomer(`Inconnu`);
      }
    } else if (condition === "service") {
      this.setCustomer(`${surname}`);
      if (id_customer != null) {
        id = id_customer;
      } else {
        id = 0;
      }
    }

    this.reload(option, "service", id, service);
  }

  reload(option, group, customer, service) {
    this.setOption(option);
    this.getEntryData(1, null, option, group, customer, service);
  }

  addEntry() {
    this.props.history.push("/entry/insert");
  }

  render() {
    const {
      entry,
      role,
      loading,
      pagination,
      pageNumber,
      totalPage,
      pageList,
      option,
      customer,
      id,
      deleteModalState,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        {option === "none" ? (
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <span className="d-grid gap-2 d-md-flex justify-content-between">
                    <strong>Liste des entrées par client</strong>
                    <CButton color={"primary"} onClick={() => this.addEntry()}>
                      <CIcon icon={cilPlus} className="me-2" />
                      Ajouter
                    </CButton>
                  </span>
                </CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Prénom(s)
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Montant Total
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {entry &&
                        entry.map((e, index) => (
                          <CTableRow key={index}>
                            {!e.name && !e.surname ? (
                              <>
                                <CTableDataCell>Inconnu</CTableDataCell>
                                <CTableDataCell>Inconnu</CTableDataCell>
                              </>
                            ) : (
                              <>
                                <CTableDataCell>{e.name}</CTableDataCell>
                                <CTableDataCell>{e.surname}</CTableDataCell>
                              </>
                            )}

                            <CTableDataCell>
                              {Number(e.total_amount) > 1000 ? (
                                <>
                                  {Number(e.total_amount).toLocaleString()} Ar
                                </>
                              ) : (
                                <>{e.total_amount} Ar</>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color={"light"}
                                onClick={() =>
                                  this.entryDetails(
                                    e.name,
                                    e.surname,
                                    e.id,
                                    "findCustomer",
                                    "service",
                                    "customer"
                                  )
                                }
                              >
                                Voir
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
                      onClick={() =>
                        this.getEntryData(pageList - 1, pageNumber)
                      }
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </CPaginationItem>
                    {pagination.map((page, index) => (
                      <CPaginationItem
                        key={index}
                        active={page === pageList}
                        onClick={() => this.getEntryData(page, pageNumber)}
                      >
                        {` ${page} `}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      aria-label="Next"
                      disabled={
                        totalPage - pageList === 0 || entry.length === 0
                      }
                      onClick={() =>
                        this.getEntryData(pageList + 1, pageNumber)
                      }
                    >
                      <span aria-hidden="true"> &raquo; </span>
                    </CPaginationItem>
                  </CPagination>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        ) : option === "findCustomer" ? (
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <span className="d-grid gap-2 d-md-flex justify-content-between">
                    <strong>
                      Liste des entrées par service de : {customer}
                    </strong>
                    <CButton color={"primary"} onClick={() => this.addEntry()}>
                      <CIcon icon={cilPlus} className="me-2" />
                      Ajouter
                    </CButton>
                  </span>
                </CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">libelle</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Quantité total
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Prix unitaire
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Montant total
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {entry &&
                        entry.map((e, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{e.libelle}</CTableDataCell>
                            <CTableDataCell>{e.sum_quantity}</CTableDataCell>
                            <CTableDataCell>
                              {Number(e.unit_price) > 1000 ? (
                                <>{Number(e.unit_price).toLocaleString()} Ar</>
                              ) : (
                                <>{e.unit_price} Ar</>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {Number(e.total_amount) > 1000 ? (
                                <>
                                  {Number(e.total_amount).toLocaleString()} Ar
                                </>
                              ) : (
                                <>{e.total_amount} Ar</>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color={"light"}
                                onClick={() =>
                                  this.entryDetails(
                                    "",
                                    e.libelle,
                                    e.customer_id,
                                    "findService",
                                    e.libelle,
                                    "service"
                                  )
                                }
                              >
                                Voir
                              </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color={"light"}
                                onClick={() =>
                                  this.reload("none", "customer", 0, "service")
                                }
                              >
                                Retour
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
                      onClick={() =>
                        this.getEntryData(pageList - 1, pageNumber)
                      }
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </CPaginationItem>
                    {pagination.map((page, index) => (
                      <CPaginationItem
                        key={index}
                        active={page === pageList}
                        onClick={() => this.getEntryData(page, pageNumber)}
                      >
                        {` ${page} `}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      aria-label="Next"
                      disabled={
                        totalPage - pageList === 0 || entry.length === 0
                      }
                      onClick={() =>
                        this.getEntryData(pageList + 1, pageNumber)
                      }
                    >
                      <span aria-hidden="true"> &raquo; </span>
                    </CPaginationItem>
                  </CPagination>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        ) : option === "findService" ? (
          <>
            <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>
                    <span className="d-grid gap-2 d-md-flex justify-content-between">
                      <strong>Détails entrée du service : {customer}</strong>
                      <CButton
                        color={"primary"}
                        onClick={() => this.addEntry()}
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
                          <CTableHeaderCell scope="col">
                            Date de creation
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Libelle
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Quantité
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Prix unitaire
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Montant Total
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {entry &&
                          entry.map((e, index) => (
                            <CTableRow key={index}>
                              <CTableDataCell>
                                {moment(e.created_date).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}
                              </CTableDataCell>
                              <CTableDataCell>{e.libelle}</CTableDataCell>
                              <CTableDataCell>{e.quantity}</CTableDataCell>
                              <CTableDataCell>
                                {Number(e.unit_price) > 1000 ? (
                                  <>
                                    {Number(e.unit_price).toLocaleString()} Ar
                                  </>
                                ) : (
                                  <>{e.unit_price} Ar</>
                                )}
                              </CTableDataCell>
                              <CTableDataCell>
                                {Number(e.total_amount) > 1000 ? (
                                  <>
                                    {Number(e.total_amount).toLocaleString()} Ar
                                  </>
                                ) : (
                                  <>{e.total_amount} Ar</>
                                )}
                              </CTableDataCell>
                              {role === "Administrateur" ? (
                                <>
                                  <CTableDataCell>
                                    <CButton
                                      color={"danger"}
                                      onClick={() => this.entryToDelete(index)}
                                    >
                                      <CIcon icon={cilTrash} />
                                    </CButton>
                                  </CTableDataCell>
                                </>
                              ) : (
                                <></>
                              )}
                              <CTableDataCell>
                                <CButton
                                  color={"light"}
                                  onClick={() =>
                                    this.reload(
                                      "none",
                                      "customer",
                                      0,
                                      "service"
                                    )
                                  }
                                >
                                  Retour
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
                        onClick={() =>
                          this.getEntryData(pageList - 1, pageNumber)
                        }
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </CPaginationItem>
                      {pagination.map((page, index) => (
                        <CPaginationItem
                          key={index}
                          active={page === pageList}
                          onClick={() => this.getEntryData(page, pageNumber)}
                        >
                          {` ${page} `}
                        </CPaginationItem>
                      ))}
                      <CPaginationItem
                        aria-label="Next"
                        disabled={
                          totalPage - pageList === 0 ||
                          (entry && entry.length === 0)
                        }
                        onClick={() =>
                          this.getEntryData(pageList + 1, pageNumber)
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
                  {entry &&
                    entry.length > 0 &&
                    id < entry.length &&
                    entry[id].libelle}
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
                <CButton color="danger" onClick={() => this.deleteEntry()}>
                  Supprimer
                </CButton>
              </CModalFooter>
            </CModal>
          </>
        ) : (
          <></>
        )}
      </>
    );
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
  setOption(op) {
    this.setState({
      option: op,
    });
  }
  setCustomer(custom) {
    this.setState({
      customer: custom,
    });
  }
  setRole(r) {
    this.setState({
      role: r,
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
