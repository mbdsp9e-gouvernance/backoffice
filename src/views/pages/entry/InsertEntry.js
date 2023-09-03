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
  CFormTextarea,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class InsertEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libelle: "",
      quantity: "",
      unit_price: "",
      total_amount: "",
      customer_id: "",
      message: "",
      note: "",
      customers: null,
      ready: false,
      load: false,
    };
  }

  componentDidMount() {
    this.getCustomers();
  }

  addEntry() {
    this.setLoad(true);
    fetch(api("entry"), {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        libelle: this.state.libelle,
        quantity: parseInt(this.state.quantity),
        unit_price: parseInt(this.state.unit_price),
        total_amount:
          parseInt(this.state.quantity) * parseInt(this.state.unit_price),
        customer_id: parseInt(this.state.customer_id),
        notes: this.state.note,
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

  getCustomers() {
    this.setReady(false);
    fetch(api(`customer`), { method: "GET" }).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.customer)
            this.setState({
              customers: data.customer,
              ready: true,
            });
        });
    });
  }
  render() {
    const { libelle, quantity, unit_price, message, customers, ready, load } =
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
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <h1>Ajout Entrée</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPencil} />
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
                        <CFormInput
                          type="number"
                          placeholder="Quantité"
                          autoComplete="Quantité"
                          value={quantity}
                          onChange={this.setQuantity}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="number"
                          placeholder="Prix unitaire"
                          autoComplete="Prix unitaire"
                          value={unit_price}
                          onChange={this.setUnitPrice}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Client
                        </CInputGroupText>
                        <CFormSelect
                          id="inputGroupSelect01"
                          onChange={this.setCustomerId}
                        >
                          <option value={null}> </option>
                          {customers &&
                            customers.map((c, index) => (
                              <option key={index} value={c.id}>
                                {c.name} {c.surname}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      <CFormTextarea
                        onChange={this.setNotes}
                        placeholder="notes"
                      />
                      <div className="d-grid" style={{ marginTop: "18px" }}>
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
                            onClick={() => this.addEntry()}
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
  setQuantity = (e) => {
    this.setState({
      quantity: e.target.value,
    });
  };
  setUnitPrice = (e) => {
    this.setState({
      unit_price: e.target.value,
    });
  };
  setTotalAmount = (e) => {
    this.setState({
      total_amount: e.target.value,
    });
  };

  setNotes = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  setMessage = (m) => {
    this.setState({
      message: m,
    });
  };
  setCustomerId = (e) => {
    this.setState({
      customer_id: e.target.value,
    });
  };
  setReady = (load) => {
    this.setState({
      ready: load,
    });
  };
}
