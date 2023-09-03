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
import { cilTrash, cilPencil, cilPlus } from "@coreui/icons";
import api from "../../../../const/api";
import Loading from "../../Loading";

export default class ListService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      services: null,
      error: "",
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
    this.getServiceData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getServiceData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`services/page/${page}/type`)).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            services: data.services,
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

  serviceToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  deleteService() {
    fetch(api(`services/${this.state.services[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.services];
        tmp.splice(this.state.id, 1);
        this.setState({
          services: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  serviceUpdate(id) {
    this.props.history.push("/service/update/" + id);
  }

  addService() {
    this.props.history.push("/service/insert");
  }

  render() {
    const {
      services,
      loading,
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
                  <strong>Liste des service</strong>
                  <CButton color={"primary"} onClick={() => this.addService()}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Intitule</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Prix</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {services &&
                      services.map((service, index) => (
                        <CTableRow key={service.id}>
                          <CTableDataCell>{service.entitled}</CTableDataCell>
                          <CTableDataCell>
                            {service.price > 1000 ? (
                              <>{service.price.toLocaleString()} Ar</>
                            ) : (
                              <>{service.price} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.serviceUpdate(service.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"danger"}
                              onClick={() => this.serviceToDelete(index)}
                            >
                              <CIcon icon={cilTrash} />
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
                      this.getServiceData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getServiceData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 ||
                      (services && services.length === 0)
                    }
                    onClick={() =>
                      this.getServiceData(pageList + 1, pageNumber)
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
              {services &&
                services.length > 0 &&
                id < services.length &&
                services[id].entitled}
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
            <CButton color="danger" onClick={() => this.deleteService()}>
              Supprimer
            </CButton>
          </CModalFooter>
        </CModal>
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
