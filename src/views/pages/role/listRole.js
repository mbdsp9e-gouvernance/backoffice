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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPencil, cilPlus } from "@coreui/icons";
import api from "../../../const/api";

export default class ListRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      role: null,
      error: "",
      id: 0,
      offset: 0,
      limit: 0,
    };
  }

  componentDidMount() {
    this.getRole();
  }

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  deleteRole() {
    fetch(api(`role/${this.state.role[this.state.id].id}`), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        const tmp = [...this.state.role];
        tmp.splice(this.state.id, 1);
        this.setState({
          role: tmp,
        });
        this.setDeleteModalState(false);
      }
    });
  }

  roleToDelete(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  getRole() {
    this.setLoading(true);
    fetch(api(`role`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.roles)
            this.setState({
              role: data.roles,
            });
        });
    });
    this.setLoading(false);
  }

  roleUpdate(id) {
    this.props.history.push("/role/update/" + id);
  }

  addRole() {
    this.props.history.push("/addRole");
  }

  render() {
    const { role, loading, deleteModalState, id } = this.state;
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Liste des roles </strong>
                  <CButton color={"primary"} onClick={() => this.addRole()}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Intitule</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loading ? (
                      <></>
                    ) : (
                      role &&
                      role.map((e, index) => (
                        <CTableRow key={e.id}>
                          <CTableDataCell>{e.id}</CTableDataCell>
                          <CTableDataCell>{e.entitled}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.roleUpdate(e.id)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"danger"}
                              onClick={() => this.roleToDelete(index)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
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
              {role && role.length > 0 && id < role.length && role[id].entitled}
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
            <CButton color="danger" onClick={() => this.deleteRole()}>
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
