import React, { Component } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      loading: false,
    };
  }

  componentDidMount() {
    // if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
    //   window.location.replace("/Home");
    // }
  }

  onChangeUserName = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  onChangepassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  setLoad(load) {
    this.setState({
      loading: load,
    });
  }

  loginFunction = (event) => {
    // this.setLoad(true);
    // const option = {
    //   headers: { "Content-Type": "application/json" },
    //   method: "POST",
    //   body: JSON.stringify({
    //     username: this.state.username,
    //     password: this.state.password,
    //   }),
    // };
    // fetch(api("users/login"), option).then((res) => {
    //   if (res.ok) {
    //     res.json().then((data) => {
    //       sessionStorage.setItem("token", data.token);
    //       sessionStorage.setItem("user", JSON.stringify(data.user));
    //       this.props.history.push("/Home");
    //     });
    //     this.setLoad(false);
    //   } else {
    //     this.setLoad(false);
    //     res.json().then((res) => {
    //       console.log(res.message);
    //       this.setState({
    //         error: "mot de passe ou nom d'utilisateur incorrect",
    //       });
    //     });
    //   }
    // });
    this.props.history.push("/Home");
  };
  render() {
    const { loading } = this.state;
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.loginFunction}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">
                        Se connecter à votre compte
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Nom d'utilisateur"
                          autoComplete="Nom d'utilisateur"
                          value={this.state.username}
                          onChange={this.onChangeUserName}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Mot de passe"
                          autoComplete="current-password"
                          value={this.state.password}
                          onChange={this.onChangepassword}
                        />
                      </CInputGroup>
                      <CRow>
                        <center>
                          <p> {this.state.error} </p>{" "}
                        </center>
                        <center>
                          {" "}
                          {loading ? (
                            <CButton
                              id="aim-color-green"
                              className="px-4"
                              disabled
                            >
                              <Loading></Loading>
                            </CButton>
                          ) : (
                            <CButton
                              id="aim-color-green"
                              className="px-4"
                              type="submit"
                              onClick={this.loginFunction}
                            >
                              Se connecter
                            </CButton>
                          )}
                        </center>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}
