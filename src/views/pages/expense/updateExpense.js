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

export default class UpdateExpense extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      expenseId: match && match.params && match.params.id,
      libelle: "",
      price: "",
      user_id: "",
      expense: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  async componentDidMount() {
    this.getExpense();
    if (sessionStorage.getItem("user")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.setState({
        user_id: user.id,
      });
    }
  }

  getExpense() {
    this.setReady(false);
    fetch(api(`expense/${this.state.expenseId}`), { method: "GET" }).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data && data.Expense)
              this.setState({
                expense: data.Expense,
                libelle: data.Expense.libelle,
                price: data.Expense.price,
                user_id: data.Expense.user_id.id,
                ready: true,
              });
          });
      }
    );
  }

  updateExpense() {
    this.setLoad(true);
    fetch(api(`expense/${this.state.expenseId}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        libelle: this.state.libelle,
        price: parseInt(this.state.price),
        user_id: parseInt(this.state.user_id),
        modification_date: new Date(),
      }),
    }).then((res) => {
      if (res.ok) {
        console.log(res);
        this.setError("Modification réussie");
        this.setLoad(false);
        this.props.history.push("/Home");
      } else
        res.json().then((res) => {
          this.setError(res.message);
          this.setLoad(false);
        });
    });
  }
  render() {
    const { libelle, price, expense, ready, error, load } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {!ready ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={9} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm>
                      <h1>Modification Sortie</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Libelle
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={expense.libelle}
                          autoComplete="Libelle"
                          value={libelle}
                          onChange={this.setLibelle}
                          required
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
                          placeholder={expense.price}
                          autoComplete="Prix"
                          value={price}
                          onChange={this.setPrice}
                          required
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
                            onClick={() => this.updateExpense()}
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
  setReady = (load) => {
    this.setState({
      ready: load,
    });
  };

  setError = (err) => {
    this.setState({
      error: err,
    });
  };
}
