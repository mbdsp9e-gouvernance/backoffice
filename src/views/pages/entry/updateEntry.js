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
import api from "../../../const/api";
import Loading from "../Loading";

export default class UpdateEntry extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      entryId: match && match.params && match.params.id,
      libelle: "",
      quantity: "",
      unit_price: "",
      total_amount: "",
      customer_id: "",
      note: "",
      entry: null,
      ready: false,
      load: false,
      error: "",
      customers: null,
    };
  }

  async componentDidMount() {
    this.getEntry();
    this.getCustomers();
  }

  getEntry() {
    this.setReady(false);
    fetch(api(`entry/${this.state.entryId}`)).then((res) => {
      if (res.ok)
        res.json().then((data) => {
          if (data && data.entry) {
            if (data.entry.customer_id == null) {
              this.setState({
                entry: data.entry,
                libelle: data.entry.libelle,
                quantity: data.entry.quantity,
                unit_price: data.entry.unit_price,
                total_amount: data.entry.total_amount,
                note: data.entry.notes,
                customer_id: "",
                ready: true,
              });
            } else {
              this.setState({
                entry: data.entry,
                libelle: data.entry.libelle,
                quantity: data.entry.quantity,
                unit_price: data.entry.unit_price,
                total_amount: data.entry.total_amount,
                customer_id: data.entry.customer_id.id,
                note: data.entry.notes,
                ready: true,
              });
            }
          }
        });
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

  updateEntry() {
    let customId = this.state.customer_id;
    this.setLoad(true);
    if (this.state.customer_id == null || "") {
      if (this.state.entry.customer_id == null) {
        customId = null;
      } else {
        customId = this.state.entry.customer_id.id;
      }
    }
    fetch(api(`entry/${this.state.entryId}`), {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        libelle: this.state.libelle,
        quantity: parseInt(this.state.quantity),
        unit_price: parseInt(this.state.unit_price),
        total_amount:
          parseInt(this.state.quantity) * parseInt(this.state.unit_price),
        customer_id: parseInt(customId),
        notes: this.state.note,
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
      libelle,
      quantity,
      unit_price,
      entry,
      note,
      customer_id,
      customers,
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
                    <CForm>
                      <h1>Modification Entrée</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Libelle
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          placeholder={entry.libelle}
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
                          Quantité
                        </CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={entry.quantity}
                          autoComplete="Quantité"
                          value={quantity}
                          onChange={this.setQuantity}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText
                          component="label"
                          htmlFor="inputGroupSelect01"
                        >
                          Prix unitaire
                        </CInputGroupText>
                        <CFormInput
                          type="number"
                          placeholder={entry.unit_price}
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
                          value={customer_id}
                        >
                          <option value={""}> </option>
                          {customers &&
                            customers.map((c, index) => (
                              <option key={index} value={c.id}>
                                {c.name} {c.surname}
                              </option>
                            ))}
                        </CFormSelect>
                      </CInputGroup>
                      <CFormTextarea
                        type="text"
                        placeholder={entry.notes}
                        autoComplete="Notes"
                        value={note}
                        onChange={this.setNote}
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
                            onClick={() => this.updateEntry()}
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

  setNote = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  setTotalAmount = (e) => {
    this.setState({
      total_amount: e.target.value,
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
  setCustomerId = (e) => {
    this.setState({
      customer_id: e.target.value,
    });
  };
}
