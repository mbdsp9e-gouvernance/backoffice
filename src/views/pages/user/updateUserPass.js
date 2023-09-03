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
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";

export default class UpdateUserPass extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      user_id: match && match.params && match.params.id,
      username: "",
      precedent_pass: "",
      new_pass: "",
      conf_pass: "",
      ready: false,
      error: "",
      button: true,
      load: false,
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    this.setReady(false);
    fetch(api(`users/${this.state.user_id}`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data) {
            this.setState({
              username: data.user.username,
              ready: true,
            });
          }
        });
    });
  }

  updatePass = () => {
    const _new = this.state.new_pass;
    const conf = this.state.conf_pass;
    if (_new !== conf) {
      this.setButton(true);
      this.setError("Mot de passe non identique");
    } else {
      this.setLoad(true);
      const option = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.precedent_pass,
          new_pass: _new,
        }),
      };
      fetch(api("users/updatePass"), option).then((res) => {
        if (res.ok) {
          res.json().then((data) => {});
          this.setLoad(false);
          this.props.history.push("/Home");
        } else {
          this.setLoad(false);
          res.json().then((res) => {
            console.log(res);
            this.setState({
              error: "Ancien mot de passe incorrect",
            });
          });
        }
      });
    }
  };

  render() {
    const { ready, precedent_pass, new_pass, conf_pass, error, load, button } =
      this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {!ready ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            {" "}
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <h1>Modification mot de passe</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Ancien mot de passe</CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder={precedent_pass}
                          autoComplete="Ancien"
                          value={precedent_pass}
                          onChange={this.setPrecedent}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Nouveau</CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder={new_pass}
                          autoComplete="Nouveau"
                          value={new_pass}
                          onChange={this.setNew}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Confirmation</CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder={conf_pass}
                          autoComplete="Confirmation"
                          value={conf_pass}
                          onChange={this.setConfirmation}
                        />
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
                            onClick={() => this.updatePass()}
                            disabled={button}
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
  setButton = (b) => {
    this.setState({
      button: b,
    });
  };
  setPrecedent = (e) => {
    this.setState({
      precedent_pass: e.target.value,
    });
  };
  setNew = (e) => {
    if (e.target.value.length <= 8) {
      this.setError("Mot de passe trop court");
    } else {
      this.setError("");
    }
    this.setState({
      new_pass: e.target.value,
    });
  };
  setConfirmation = (e) => {
    if (e.target.value !== this.state.new_pass) {
      this.setError("Mot de passe non identique");
    } else {
      this.setButton(false);
      this.setError("");
    }
    this.setState({
      conf_pass: e.target.value,
    });
  };
}
