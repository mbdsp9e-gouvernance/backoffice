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

export default class UpdateCustomer extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      customer_id: match && match.params && match.params.id,
      name: "",
      surname: "",
      number_phone: "",
      gender: "",
      address: "",
      email: "",
      customer: null,
      ready: false,
      error: "",
      load: false,
    };
  }

  componentDidMount() {
    this.getCustomer();
  }

  getCustomer() {
    this.setReady(false);
    fetch(api(`customer/${this.state.customer_id}`), { method: "GET" }).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data) {
              this.setState({
                customer: data,
                name: data.name,
                surname: data.surname,
                gender: data.gender,
                address: data.address,
                number_phone: data.number_phone,
                email: data.email,
                ready: true,
              });
              if (data.email === null) {
                this.setState({ email: "" });
              }
            }
          });
      }
    );
  }

  updateCustomer() {
    this.setLoad(true);
    fetch(api(`customer/${this.state.customer_id}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        name: this.state.name,
        surname: this.state.surname,
        gender: this.state.gender,
        address: this.state.address,
        number_phone: this.state.number_phone,
        email: this.state.email,
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
    const {
      name,
      surname,
      gender,
      customer,
      address,
      number_phone,
      email,
      ready,
      error,
      load,
    } = this.state;
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
                      <h1>Modification Customer</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Nom</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={customer.name}
                          autoComplete="Nom"
                          value={name}
                          onChange={this.setName}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Prénom</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={customer.surname}
                          autoComplete="Prénom"
                          value={surname}
                          onChange={this.setSurname}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Genre
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setGender}
                          value={gender}
                          required
                        >
                          <option value={"M"}>Homme</option>
                          <option value={"F"}>Femme</option>
                        </CFormSelect>
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Adresse</CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={customer.address}
                          autoComplete="Adresse"
                          value={address}
                          onChange={this.setAddress}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Numéro de téléphone</CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={customer.number_phone}
                          autoComplete="Numéro de téléphone"
                          value={number_phone}
                          onChange={this.setNumberPhone}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder={customer.email}
                          autoComplete="Email"
                          value={email}
                          onChange={this.setEmail}
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
                            onClick={() => this.updateCustomer()}
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
}
