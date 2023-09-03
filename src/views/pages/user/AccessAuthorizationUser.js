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
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";
import BackButton from "../../../components/BackButton";

export default class AccessAuthorizationUser extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      user_id: match && match.params && match.params.id,
      role_id: null,
      role: null,
      user: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  componentDidMount() {
    // this.getUser();
    // this.getRole();
    const userTemp = {
      id: 1,
      name: "User",
      surname: "Default",
      gender: "H",
      address: "Tana",
      number_phone: "033313516",
      email: "defaul@gmail.com",
      activated: "Activer",
      role_id: 1,
    };
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
    this.setState({
      user: userTemp,
      role_id: userTemp.role_id,
      role: roleTemp,
      ready: true,
    });
  }

  getUser() {
    this.setReady(false);
    fetch(api(`users/${this.state.user_id}`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data) {
            this.setState({
              user: data.user,
              role_id: data.user.role_id.id,
              ready: true,
            });
            if (data.user.email === null) {
              this.setState({ email: "" });
            }
          }
        });
    });
  }

  getRole() {
    this.setLoad(true);
    fetch(api(`role`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.roles)
            this.setState({
              role: data.roles,
            });
        });
    });
    this.setLoad(false);
  }

  updateUser() {
    this.setLoad(true);
    fetch(api(`users/${this.state.user_id}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        name: this.state.user.name,
        surname: this.state.user.surname,
        username: this.state.user.username,
        gender: this.state.user.gender,
        address: this.state.user.address,
        number_phone: this.state.user.number_phone,
        email: this.state.user.email,
        role_id: this.state.role_id,
        modification_date: new Date(),
      }),
    }).then((res) => {
      if (res.ok) {
        console.log(res);
        this.setError("Modification réussie");
        this.setLoad(false);
        this.props.history.push("/user/list");
      } else
        res.json().then((res) => {
          this.setError(res.message);
          this.setLoad(false);
        });
    });
  }
  render() {
    const { user, role_id, role, ready, error, load } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {!ready ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            <BackButton to={"/user/list"} />
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    {" "}
                    <h1 style={{ color: "green" }}>Autorisation d'accès</h1>
                    <h6>
                      Utilisateur: {user.name} {user.surname}
                    </h6>
                    <h6> Adresse: {user.address}</h6>
                    <h6> Numéro de téléphone: {user.number_phone}</h6>
                    <h6> Email : {user.email}</h6>
                    <br />
                    {role &&
                      role.map((c, index) => (
                        <>
                          <h5 style={{ color: "red" }}>
                            Autorisation {index + 1} : {c.entitled}
                          </h5>
                          <h6>Description: {c.description}</h6>
                          <ul>
                            {c.access.map((acces) => (
                              <li>{acces}</li>
                            ))}
                          </ul>
                        </>
                      ))}
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Autorisation (Role)
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setRoleId}
                          value={role_id}
                          required
                        >
                          <option> </option>
                          {role &&
                            role.map((c, index) => (
                              <option key={index} value={c.id}>
                                {c.entitled}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      <div className="d-grid">
                        {load ? (
                          <CButton
                            id="aim-color-green"
                            className="px-4"
                            disabled
                          >
                            <Loading></Loading>
                          </CButton>
                        ) : (
                          <CButton
                            color="success"
                            type="submit"
                            onClick={() => this.updateUser()}
                          >
                            Modifier
                          </CButton>
                        )}
                        <label>{error}</label>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        )}
      </div>
    );
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
      number_phone: e.target.value,
    });
  };
  setEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setReady(load) {
    this.setState({
      ready: load,
    });
  }

  setError = (err) => {
    this.setState({
      error: err,
    });
  };

  setUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  setRoleId = (e) => {
    this.setState({
      role_id: e.target.value,
    });
  };
}
