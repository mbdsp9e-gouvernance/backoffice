import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      users: [],
      roles: [],
      name: "",
      surname: "",
      gender: "",
      username: "",
      address: "",
      numberPhone: "",
      email: "",
      password: "",
      role: "",
      message: "",
      load: false,
    };
  }

  componentDidMount() {
    this.getAllRole();
  }

  getError(index) {
    const errors = {
      "Username already used.": "Ce nom d'utilisateur est déjà utilisé.",
      "Email address already used.": "Cette adresse mail est déjà utilisée.",
      "username should not be empty":
        " Le champ nom d'utilisateur est obligatoire ",
      "email should not be empty": " Le champ email est obligatoire",
      "email must be an email": " Email incorrect",
    };
    return errors[index];
  }

  getAllRole() {
    fetch(api(`role`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.roles)
            this.setState({
              roles: data.roles,
            });
        });
    });
  }

  addUser() {
    let email = this.state.email;
    if (this.state.email === "") {
      email = null;
    }
    this.setLoad(true);
    fetch(api("users/createUser"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        name: this.state.name,
        surname: this.state.surname,
        gender: this.state.gender,
        address: this.state.address,
        number_phone: parseInt(this.state.numberPhone),
        email: email,
        username: this.state.username,
        password: this.state.password,
        role_id: parseInt(this.state.role),
      }),
    }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          //console.log(data);
          this.setMessage("Ajout réussi");
          this.setLoad(false);
          this.props.history.push("/Home");
        });
      else {
        res.json().then((res) => {
          if (res) {
            this.setMessage(res.message + ", la création a échoué.");
            this.setLoad(false);
          }
        });
      }
    });
  }

  render() {
    const {
      roles,
      name,
      surname,
      password,
      username,
      address,
      numberPhone,
      email,
      message,
      load,
    } = this.state;
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <h1>Ajout Utilisateur</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Nom"
                        autoComplete="Nom"
                        value={name}
                        onChange={this.setName}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Prénom"
                        autoComplete="Prénom"
                        value={surname}
                        onChange={this.setSurname}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Adresse"
                        autoComplete="Adresse"
                        value={address}
                        onChange={this.setAddress}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        placeholder="Numéro de téléphone"
                        autoComplete="Numéro de téléphone"
                        value={numberPhone}
                        onChange={this.setNumberPhone}
                      />
                    </CInputGroup>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: "68px",
                      }}
                    >
                      <CFormCheck
                        inline
                        type="radio"
                        id="Homme"
                        name="gender"
                        label="Homme"
                        value="M"
                        onChange={this.setGender}
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        id="Femme"
                        name="gender"
                        label="Femme"
                        value="F"
                        onChange={this.setGender}
                      />
                    </div>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={this.setEmail}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Nom d'utilisateur"
                        autoComplete="Nom d'utilisateur"
                        value={username}
                        onChange={this.setUserName}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="Mot de passe"
                        value={password}
                        onChange={this.setPassword}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText
                        component="label"
                        htmlFor="inputGroupSelect01"
                      >
                        Role
                      </CInputGroupText>
                      <CFormSelect
                        id="inputGroupSelect01"
                        onChange={this.setRole}
                      >
                        <option> </option>
                        {roles &&
                          roles.map((r, index) => (
                            <option key={index} value={r.id}>
                              {r.entitled}
                            </option>
                          ))}
                      </CFormSelect>
                    </CInputGroup>
                    <div className="d-grid">
                      {load ? (
                        <CButton id="aim-color-green" className="px-4" disabled>
                          <Loading></Loading>
                        </CButton>
                      ) : (
                        <CButton type="submit" color="success" onClick={() => this.addUser()}>
                          Valider
                        </CButton>
                      )}

                      {message}
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
  setPending(state) {
    this.setState({
      pending: state,
    });
  }
  setMessage(ms) {
    this.setState({
      message: ms,
    });
  }

  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  setError(message) {
    if (message) {
      this.setState({
        error: message,
        message: message,
        hasError: true,
      });
    } else {
      this.setState({
        message: "",
        error: "",
        hasError: false,
      });
    }
  }
  setName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  setSurname = (e) => {
    this.setState({
      surname: e.target.value,
    });
  };
  setGender = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };
  setAddress = (e) => {
    this.setState({
      address: e.target.value,
    });
  };
  setNumberPhone = (e) => {
    this.setState({
      numberPhone: e.target.value,
    });
  };
  setEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  setPassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  setRole = (e) => {
    this.setState({
      role: e.target.value,
    });
  };
}
