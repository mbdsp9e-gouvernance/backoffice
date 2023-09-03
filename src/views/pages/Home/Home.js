import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CFormTextarea,
  CCardTitle,
  CCardText,
  CFormCheck,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      isPurchasePage: match && match.params && match.params.debt ? true : false,
      formValues: [],
      debtOption: (match && match.params && match.params.debt) || "",
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
      otherMessage: "",
      load: false,
      total: 0,
      otherEntitled: "",
      otherPrice: 0,
      debtMessage: "",
    };
  }

  componentDidMount() {
    // if (this.state.debtOption === "0") {
    //   this.setDebtMessage("sans dette");
    // } else if (this.state.debtOption === "1") {
    //   this.setDebtMessage("avec dette");
    // }
    // this.getServices();
    // this.getCustomers();
  }

  speedButton(value, name, price) {
    let formValues = this.state.formValues;
    formValues[formValues.length] = {
      quantity: "",
      service: value,
      name: name,
      price: price,
    };
    this.setState({ formValues });
  }

  handleChange(i, e) {
    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    this.setState({ formValues });
    let total = 0;
    formValues.forEach(
      (element, index) =>
        (total = Number(element.quantity * element.price) + total)
    );
    this.setTotal(total);
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
    let total = 0;
    formValues.forEach(
      (element, index) =>
        (total = Number(element.quantity * element.price) + total)
    );
    this.setTotal(total);
  }

  async submit() {
    let option = this.state.debtOption;
    if (option === "" || null) {
      option = "0";
    }
    if (option === "0") {
      await this.addPurchase();
    } else if (option === "1") {
      await this.addDebt();
    }
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
          this.setState({
            formValues: [],
            total: 0,
          });
          if (this.state.isPurchasePage) this.props.history.push("/Home");
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

  async addPurchase() {
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

    await fetch(api("purchase"), {
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
          this.setMessage("Achat fait!");
          this.setState({
            formValues: [],
            total: 0,
          });
          if (this.state.isPurchasePage) this.props.history.push("/Home");
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
    fetch(api(`services`)).then((res) => {
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
    fetch(api(`customer`)).then((res) => {
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

  addOther() {
    const { otherEntitled, otherPrice } = this.state;
    if (otherEntitled === "") {
      this.setOtherMessage("Intitule vide");
    } else if (otherPrice <= 0) {
      this.setOtherMessage("Prix inférieur ou égale à 0");
    } else if (otherEntitled !== "" && otherPrice >= 0) {
      this.speedButton("other", otherEntitled, otherPrice);
      this.setOtherMessage();
    }
  }

  render() {
    const {
      loading,
      services,
      customers,
      message,
      load,
      formValues,
      total,
      otherMessage,
    } = this.state;
    return (
      <div className="bg-light min-vh-50 d-flex flex-row align-items-center">
        {loading ? (
          <>
            <Loading></Loading>
          </>
        ) : (
          // <CContainer>
          //   <CRow className="justify-content-center">
          //     <div className="row">
          //       <div className="col-7 button-service">
          //         <CCardText
          //         // style={{ display: "flex", justifyContent: "center" }}
          //         >
          //           Services
          //         </CCardText>
          //         <div className="row">
          //           {services &&
          //             services.map((service, index) => (
          //               <div key={index} className="col-3 mb-2 text-center">
          //                 <CButton
          //                   onClick={() =>
          //                     this.speedButton(
          //                       service.id,
          //                       service.entitled,
          //                       service.price
          //                     )
          //                   }
          //                 >
          //                   {service.entitled}
          //                 </CButton>
          //               </div>
          //             ))}
          //         </div>
          //       </div>
          //       <div className="col-5">
          //         <div className="mb-1">
          //           <CCard>
          //             <CCardTitle>
          //               <CCardText
          //                 style={{ display: "flex", justifyContent: "center" }}
          //               >
          //                 Ajout achat{" "}
          //                 {this.state.isPurchasePage && this.state.debtMessage}:{" "}
          //                 {total > 1000 ? (
          //                   <>{total.toLocaleString()} Ar</>
          //                 ) : (
          //                   <>{total} Ar</>
          //                 )}
          //               </CCardText>
          //             </CCardTitle>
          //             <CCardBody className="p-4">
          //               <CForm
          //                 onSubmit={(e) => {
          //                   e.preventDefault();
          //                 }}
          //               >
          //                 {formValues.map((element, index) => (
          //                   <div className="form-inline" key={index}>
          //                     <CInputGroup className="mb-2">
          //                       <CInputGroupText
          //                         component="label"
          //                         htmlFor="inputGroupSelect01"
          //                       >
          //                         {element.name}
          //                       </CInputGroupText>
          //                       <CInputGroupText
          //                         component="label"
          //                         htmlFor="inputGroup"
          //                       >
          //                         Quantité
          //                       </CInputGroupText>
          //                       <CFormInput
          //                         type="number"
          //                         name="quantity"
          //                         min={1}
          //                         value={element.quantity || ""}
          //                         onChange={(e) => this.handleChange(index, e)}
          //                         style={{ minWidth: "50px" }}
          //                         required
          //                       />

          //                       <button
          //                         type="button"
          //                         className="button remove"
          //                         onClick={() => this.removeFormFields(index)}
          //                       >
          //                         Remove
          //                       </button>
          //                     </CInputGroup>
          //                   </div>
          //                 ))}
          //                 <div
          //                   style={{
          //                     display: "flex",
          //                     justifyContent: "space-around",
          //                     alignItems: "center",
          //                     height: "68px",
          //                   }}
          //                 >
          //                   {!this.state.isPurchasePage && (
          //                     <>
          //                       <CFormCheck
          //                         inline
          //                         type="radio"
          //                         id="NoDette"
          //                         name="detteOption"
          //                         label="Pas de dette"
          //                         value="0"
          //                         onChange={this.setDebtOption}
          //                       />
          //                       <CFormCheck
          //                         inline
          //                         type="radio"
          //                         id="Dette"
          //                         name="detteOption"
          //                         label="Avec dette"
          //                         value="1"
          //                         onChange={this.setDebtOption}
          //                       />
          //                     </>
          //                   )}
          //                 </div>
          //                 <CInputGroup className="mb-3">
          //                   <CInputGroupText
          //                     component="label"
          //                     htmlFor="inputGroupSelect01"
          //                   >
          //                     Client
          //                   </CInputGroupText>
          //                   <CFormSelect
          //                     id="inputGroupSelect01"
          //                     onChange={this.setClient}
          //                   >
          //                     <option></option>
          //                     {customers &&
          //                       customers.map((c, index) => (
          //                         <option key={index} value={c.id}>
          //                           {c.name} {c.surname}
          //                         </option>
          //                       ))}
          //                   </CFormSelect>
          //                 </CInputGroup>
          //                 <CFormTextarea
          //                   onChange={this.setNotes}
          //                   type="text"
          //                   placeholder="notes"
          //                 />
          //                 <div className="d-grid" style={{ marginTop: "18px" }}>
          //                   {load ? (
          //                     <CButton
          //                       id="aim-color-green"
          //                       className="px-4"
          //                       disabled
          //                     >
          //                       <Loading></Loading>
          //                     </CButton>
          //                   ) : (
          //                     <CButton
          //                       color="success"
          //                       type="submit"
          //                       onClick={() => this.submit()}
          //                     >
          //                       Valider
          //                     </CButton>
          //                   )}

          //                   {message}
          //                 </div>
          //               </CForm>
          //             </CCardBody>
          //           </CCard>
          //         </div>
          //         <div className="other-service">
          //           <CCard>
          //             <CCardTitle>
          //               <CCardText
          //                 style={{ display: "flex", justifyContent: "center" }}
          //               >
          //                 Autre service
          //               </CCardText>
          //             </CCardTitle>
          //             <CCardBody className="p-4">
          //               <CForm
          //                 onSubmit={(e) => {
          //                   e.preventDefault();
          //                 }}
          //               >
          //                 <CInputGroup className="mb-3">
          //                   <CInputGroupText
          //                     component="label"
          //                     htmlFor="inputGroupSelect01"
          //                   >
          //                     Intitule
          //                   </CInputGroupText>
          //                   <CFormInput
          //                     type="text"
          //                     placeholder="Intitule"
          //                     autoComplete="Intitule"
          //                     onChange={this.setOtherEntitled}
          //                   />
          //                 </CInputGroup>
          //                 <CInputGroup className="mb-3">
          //                   <CInputGroupText
          //                     component="label"
          //                     htmlFor="inputGroupSelect01"
          //                   >
          //                     Prix
          //                   </CInputGroupText>
          //                   <CFormInput
          //                     type="number"
          //                     placeholder="Prix"
          //                     autoComplete="Prix"
          //                     onChange={this.setOtherPrice}
          //                   />
          //                 </CInputGroup>
          //                 <div className="d-grid" style={{ marginTop: "18px" }}>
          //                   <CButton
          //                     color="primary"
          //                     type="submit"
          //                     onClick={() => this.addOther()}
          //                   >
          //                     Ajouter
          //                   </CButton>
          //                   {otherMessage}
          //                 </div>
          //               </CForm>
          //             </CCardBody>
          //           </CCard>
          //         </div>
          //       </div>
          //     </div>
          //   </CRow>
          // </CContainer>
          <></>
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
  setOtherMessage(m) {
    this.setState({
      otherMessage: m,
    });
  }
  setLoad(l) {
    this.setState({
      load: l,
    });
  }
  setTotal(t) {
    this.setState({
      total: t,
    });
  }
  setNotes = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  setClient = (e) => {
    this.setState({
      client: e.target.value,
    });
  };

  setNote = (e) => {
    this.setState({
      note: e.target.value,
    });
  };

  setDebtOption = (e) => {
    this.setState({
      debtOption: e.target.value,
    });
  };

  setPending = (value) => {
    this.setState({
      pending: value,
    });
  };
  setOtherEntitled = (e) => {
    this.setState({
      otherEntitled: e.target.value,
    });
  };
  setOtherPrice = (e) => {
    this.setState({
      otherPrice: e.target.value,
    });
  };
  setDebtMessage(dm) {
    this.setState({
      debtMessage: dm,
    });
  }
}
