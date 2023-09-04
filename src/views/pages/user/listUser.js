import React from "react";
import {
  CCard,
  CCardBody,
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
  CForm,
  CFormInput,
  CInputGroup,
  CFormSelect,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked } from "@coreui/icons";
import api from "../../../const/api";

export default class ListUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModalState: false,
      deleteModalState: false,
      loading: true,
      users: null,
      roles: null,
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      error: "",
      activated: -1,
      name: "",
      id: 0,
    };
  }

  componentDidMount() {
    this.getUserData();
    const roleTemp = [
      {
        id: 1,
        entitled: "Role1",
        description: "Accès limité",
        access: ["Liste utilisateur", "Statistique apple d'offre"],
      },
      {
        id: 2,
        entitled: "Role2",
        description: "Accès complet",
        access: ["Tous"],
      },
    ];

    this.setState({ roles: roleTemp });
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getUserData = (nom = null, status = -1) => {
    let wheres = [`valide=1`];
    if (nom && nom !== "") wheres.push(`nom=${nom}`);
    if (status && status >= 0) wheres.push(`active=${status}`);
    wheres = wheres.join("&");
    if (wheres !== "") wheres = `?${wheres}`;
    this.setLoading(true);
    fetch(api(`users${wheres}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          this.setState({
            users: data,
          });
          this.setLoading(false);
        });
      }
    });
  };

  activatedUser(id) {
    fetch(api(`users/activate/${id}`), {
      method: "PUT",
    }).then((res) => {
      if (res.ok) {
        this.getUserData();
        this.setDeleteModalState(false);
      }
    });
  }

  deactivatedUser(id) {
    fetch(api(`users/deactivate/${id}`), {
      method: "PUT",
    }).then((res) => {
      if (res.ok) {
        this.getUserData();
        this.setDeleteModalState(false);
      }
    });
  }

  userActivation(index) {
    this.setId(index);
    this.setDeleteModalState(true);
  }

  cancelFormModal = () => {
    this.setFormModalState(false);
    this.clearFields();
    this.setError();
  };

  addUser() {
    this.props.history.push("/register");
  }
  accessAuthorization(id) {
    this.props.history.push("/user/accessAuthorization/" + id);
  }
  userUpdatePassword(id) {
    this.props.history.push("/user/update/password/" + id);
  }

  search() {
    const { activated, name } = this.state;
    this.getUserData(name, activated);
  }

  render() {
    const {
      users,
      deleteModalState,
      id,
    } = this.state;
    // if (loading) {
    //   return <Loading />;
    // }
    return (
      <>
        <CRow className="justify-content-center">
          <CCol md={9} lg={9} xl={6}>
            <CCard className="mx-4">
              <div style={{ overflowX: "auto" }}>
                <CForm
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <CInputGroup>
                    <CInputGroupText
                      component="label"
                      htmlFor="inputGroupSelect01"
                    >
                      Nom
                    </CInputGroupText>
                    <CFormInput
                      id="inputGroupSelect01"
                      onChange={this.setName}
                    ></CFormInput>
                  </CInputGroup>
                  <CInputGroup>
                    <CInputGroupText
                      component="label"
                      htmlFor="inputGroupSelect01"
                    >
                      Status
                    </CInputGroupText>
                    <CFormSelect
                      id="inputGroupSelect01"
                      onChange={this.setActivation}
                      value={this.state.activated}
                    >
                      <option value={-1}>Tous</option>
                      <option value={1}>Activé</option>
                      <option value={0}>Désactivé</option>
                    </CFormSelect>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      color="success"
                      type="submit"
                      onClick={() => this.search()}
                    >
                      voir
                    </CButton>
                  </div>
                </CForm>
              </div>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <div style={{ overflowX: "auto" }}>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Nom </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {users &&
                        users.map((user, index) => (
                          <CTableRow key={user.id}>
                            <CTableDataCell>{user.NOM}</CTableDataCell>
                            <CTableDataCell>{user.PRENOM}</CTableDataCell>
                            <CTableDataCell>{user.EMAIL}</CTableDataCell>
                            {user.ACTIVE === 0 ? (
                              <CTableDataCell style={{ color: "red" }}>
                                Désactivé
                              </CTableDataCell>
                            ) : (
                              <CTableDataCell style={{ color: "green" }}>
                                Activé
                              </CTableDataCell>
                            )}

                            {/* <CTableDataCell>
                              <CButton
                                color={"light"}
                                onClick={() =>
                                  this.accessAuthorization(user.id)
                                }
                              >
                                Autorisations d'accès <CIcon icon={cilPencil} />
                              </CButton>
                            </CTableDataCell> */}
                            <CTableDataCell>
                              <CButton
                                color={"danger"}
                                onClick={() => this.userActivation(index)}
                              >
                                Activation <CIcon icon={cilLockLocked} />
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                    </CTableBody>
                  </CTable>
                </div>
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
            <CModalTitle>Activer ou Désactiver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Voulez-vous activer ou désactiver{" "}
              {users &&
                users.length > 0 &&
                id < users.length &&
                `${users[id].NOM} ${users[id].PRENOM}`}
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
            <CButton color="danger" onClick={() => this.deactivatedUser(this.state.users[this.state.id].ID)}>
              Désactiver
            </CButton>
            <CButton color="success" onClick={() => this.activatedUser(this.state.users[this.state.id].ID)}>
              Activer
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

  setActivation = (e) => {
    this.setState({
      activated: e.target.value,
    });
  };

  setRoleId = (e) => {
    this.setState({
      role_id: e.target.value,
    });
  };

  setName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  setDeleteModalState(modal) {
    this.setState({
      deleteModalState: modal,
    });
  }
}
