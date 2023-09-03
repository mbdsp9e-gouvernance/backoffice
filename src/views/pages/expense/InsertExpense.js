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
  CCardHeader,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";

export default class InsertExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libelle: "",
      price: "",
      user_id: "",
      message: "",
      ready: false,
      offset: 0,
      limit: 0,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setState({
        user_id: user.id,
        ready: true,
      });
    }
  }

  addExpense() {
    this.setLoad(true);
    fetch(api("expense"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        libelle: this.state.libelle,
        price: parseInt(this.state.price),
        user_id: parseInt(this.state.user_id),
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
          if (typeof res.message === typeof []) {
            this.setMessage(res.message[0]);
            this.setLoad(false);
          } else {
            this.setMessage(res.message);
            this.setLoad(false);
          }
        });
      }
    });
  }
  listExpense() {
    this.props.history.push("/expense/list");
  }

  render() {
    const { libelle, price, message, ready, load } = this.state;
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
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <CButton color={"primary"} onClick={() => this.listExpense()}>
                    Liste sortie
                  </CButton>
                </span>
              </CCardHeader>
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <h1>Ajout Sortie</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Libelle
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder="Libelle"
                          autoComplete="Libelle"
                          value={libelle}
                          onChange={this.setLibelle}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Prix
                        </CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder="Prix"
                          autoComplete="Prix"
                          value={price}
                          onChange={this.setPrice}
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
                            onClick={() => this.addExpense()}
                          >
                            Ajouter
                          </CButton>
                        )}

                        <label>{message}</label>
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
  setLibelle = (e) => {
    this.setState({
      libelle: e.target.value,
    });
  };
  setPrice = (e) => {
    this.setState({
      price: e.target.value,
    });
  };
  setMessage = (m) => {
    this.setState({
      message: m,
    });
  };
  setReady = (load) => {
    this.setState({
      ready: load,
    });
  };
}
