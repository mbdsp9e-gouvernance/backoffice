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

export default class UpdateExpenseCategory extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      expenseCategoryId: match && match.params && match.params.id,
      entitled: "",
      expenseCategory: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  async componentDidMount() {
    this.getExpenseCategory();
  }

  getExpenseCategory() {
    this.setReady(false);
    fetch(api(`expenseCategory/${this.state.expenseCategoryId}`)).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data && data.expenseCategory)
              this.setState({
                expenseCategory: data.expenseCategory,
                ready: true,
                entitled: data.expenseCategory.entitled,
              });
          });
      }
    );
  }

  updateExpense() {
    this.setLoad(true);
    fetch(api(`expenseCategory/${this.state.expenseCategoryId}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        entitled: this.state.entitled,
        modification_date: new Date(),
      }),
    }).then((res) => {
      if (res.ok) {
        console.log(res);
        this.setError("Modification réussie");
        this.setLoad(false);
      } else
        res.json().then((res) => {
          this.setError(res.message);
          this.setLoad(false);
        });
    });
  }
  render() {
    const { entitled, expenseCategory, ready, error, load } = this.state;
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
                    <CForm>
                      <h1>Modification category</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Intitule
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={expenseCategory.entitled}
                          autoComplete="Intitule"
                          value={entitled}
                          onChange={this.setEntitled}
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
  setEntitled = (e) => {
    this.setState({
      entitled: e.target.value,
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
