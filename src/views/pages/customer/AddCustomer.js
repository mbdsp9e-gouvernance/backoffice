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
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      name: "",
      surname: "",
      gender: "",
      address: "",
      numberPhone: "",
      email: "",
      message: "",
      load: false,
    };
  }

  componentDidMount() {}

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

  addClient() {
    this.setLoad(true);
    this.setPending(true);
    let email = this.state.email;
    if (this.state.email === "") {
      email = null;
    }
    fetch(api("customer"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        name: this.state.name,
        surname: this.state.surname,
        gender: this.state.gender,
        address: this.state.address,
        number_phone: parseInt(this.state.numberPhone),
        email: email,
      }),
    }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
         // console.log(data.customer);
          this.setMessage("Ajout réussi");
          this.setLoad(false);
          this.props.history.push("/Home");
        });
      else {
        res.json().then((res) => {
          if (res) {
            this.setMessage(res.message + ", la création a échoué");
            this.setLoad(false);
          }
        });
      }
    });
  }

  render() {
    const { message, name, surname, address, numberPhone, email, load } =
      this.state;
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
                    <h1>Ajout Client</h1>
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
                    <div className="d-grid">
                      {load ? (
                        <CButton id="aim-color-green" className="px-4" disabled>
                          <Loading></Loading>
                        </CButton>
                      ) : (
                        <CButton
                          color="success"
                          type="submit"
                          onClick={() => this.addClient()}
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
      </div>
    );
  }
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setPending(state) {
    this.setState({
      pending: state,
    });
  }
  setMessage(m) {
    this.setState({
      message: m,
    });
  }
  setError(message = null) {
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
}
