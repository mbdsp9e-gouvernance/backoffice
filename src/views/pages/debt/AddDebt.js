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

export default class AddDebt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: [{ quantity: "", service: "" }],
      loading: true,
      services: null,
      service: null,
      customers: null,
      note: "",
      user: null,
      client: null,
      pending: true,
      totalAmount: 0,
      message: "",
      load: false,
    };
  }

  componentDidMount() {
    this.getServices();
    this.getCustomers();
  }

  handleChange(i, e) {
    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    this.setState({ formValues });
  }

  addFormFields() {
    this.setState({
      formValues: [...this.state.formValues, { quantity: "", service: "" }],
    });
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  async submit() {
    await this.addDebt();
  }

  async addDebt() {
    this.setPending(true);
    this.setLoad(true);
    let total_amount = 0;
    let id = this.state.user.id;
    if (
      this.state.formValues[0].service === "" ||
      this.state.formValues[0].quantity === ""
    ) {
      total_amount = null;
      id = null;
    }
    if (this.state.client === null) {
      this.state.message = "Choisir un client.";
      this.setLoad(false);
      this.state.client = 0;
    }

    await fetch(api("debt"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        customer_id: parseInt(this.state.client),
        total_amount: total_amount,
        received_by: id,
        notes: this.state.note,
        formValues: this.state.formValues,
        services: this.state.services,
      }),
    }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          this.setLoad(false);
          this.setMessage("Dette effectuée!");
          this.props.history.push("/Home");
        });
      else {
        res.json().then((res) => {
          if (typeof res.message === typeof []) {
            console.log(res.message[0]);
            this.setLoad(false);
          } else {
            console.log(res.message);
            this.setLoad(false);
          }
        });
      }
    });

    this.setPending(false);
  }

  getServices() {
    this.setLoading(true);
    if (sessionStorage.getItem("user")) {
      this.setState({
        user: JSON.parse(sessionStorage.getItem("user")),
      });
    }
    fetch(api(`services`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.services)
            this.setState({
              services: data.services,
            });
        });
    });
    this.setLoading(false);
  }

  getCustomers() {
    fetch(api(`customer`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.customer)
            this.setState({
              customers: data.customer,
            });
        });
    });
    this.setLoading(false);
  }

  render() {
    const { loading, services, customers, message, load } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {loading ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm>
                      {this.state.formValues.map((element, index) => (
                        <div className="form-inline" key={index}>
                          <CInputGroup className="mb-2">
                            <CInputGroupText
                              component="label"
                              htmlFor="inputGroupSelect01"
                            >
                              Service
                            </CInputGroupText>
                            <CFormSelect
                              id="inputGroupSelect01"
                              name="service"
                              onChange={(e) => this.handleChange(index, e)}
                              required
                            >
                              <option value={element.service || ""}> </option>
                              {services &&
                                services.map((s, index) => (
                                  <option key={index} value={s.id}>
                                    {s.entitled}
                                  </option>
                                ))}
                            </CFormSelect>
                            <CInputGroupText
                              component="label"
                              htmlFor="inputGroup"
                            >
                              Quantité
                            </CInputGroupText>
                            <CFormInput
                              type="number"
                              name="quantity"
                              min={1}
                              value={element.quantity || ""}
                              onChange={(e) => this.handleChange(index, e)}
                              required
                            />

                            {index ? (
                              <button
                                type="button"
                                className="button remove"
                                onClick={() => this.removeFormFields(index)}
                              >
                                Remove
                              </button>
                            ) : null}
                          </CInputGroup>
                        </div>
                      ))}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#321fdb",
                        }}
                      >
                        <CButton
                          style={{ width: "100%" }}
                          onClick={() => this.addFormFields()}
                        >
                          +
                        </CButton>
                      </div>

                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Client
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setClient}
                        >
                          <option></option>
                          {customers &&
                            customers.map((c, index) => (
                              <option key={index} value={c.id}>
                                {c.name} {c.surname}
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
                            onClick={() => this.submit()}
                          >
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
        )}
      </div>
    );
  }
  setLoading(state) {
    this.setState({
      loading: state,
    });
  }

  setMessage(m) {
    this.setState({
      message: m,
    });
  }
  setLoad(l) {
    this.setState({
      load: l,
    });
  }

  setClient = (e) => {
    this.setState({
      client: e.target.value,
    });
  };
  setPending = (value) => {
    this.setState({
      pending: value,
    });
  };
}
