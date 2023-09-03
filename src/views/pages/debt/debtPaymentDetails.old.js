import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import api from "../../../const/api";
import Loading from "../Loading";
import moment from "moment";

export default class DebtPayementDetail extends React.Component {
  constructor(props) {
    const { match } = props;
    super(props);
    this.state = {
      debt_id: match && match.params && match.params.id,
      loading: true,
      debtPayment: null,
      error: "",
      total: 0,
      total_amount: 0,
    };
  }

  componentDidMount() {
    this.getDebtPayment();
    this.getDebt();
  }

  getDebtPayment() {
    this.setLoading(true);
    fetch(api(`debtPayment/${this.state.debt_id}`), { method: "GET" }).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data && data.debtPayment) {
              this.setState({
                debtPayment: data.debtPayment,
                total: data.total.total,
                loading: false,
              });
            }
          });
        }
      }
    );
  }
  getDebt() {
    this.setLoading(true);
    fetch(api(`debtDetails/${this.state.debt_id}`), { method: "GET" }).then(
      (res) => {
        if (res.ok)
          res.json().then((data) => {
            if (data && data.debtDetail) {
              let t = 0;
              data.debtDetail.forEach((debt) => {
                t = debt.total_amount + t;
              });
              this.setState({
                total_amount: t,
              });
            }
          });
      }
    );
  }

  render() {
    const { loading, debtPayment, total, total_amount } = this.state;
    const style = {
      borderColor: "darkslategrey",
      borderStyle: "solid",
      borderWidth: "1px",
    };
    if (loading) {
      return <Loading />;
    }
    const remainder = total_amount - total;
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader></CCardHeader>
              <CCardBody>
                <div className="title">
                  <h1>Historique payement</h1>
                </div>
                <div className="detail-debtPayment">
                  {debtPayment && debtPayment ? (
                    <div className="customer-debtPayment">
                      <div className="customer-detail">
                        {debtPayment[0].customer_id ? (
                          <>
                            <h5>
                              {debtPayment[0].customer_id.name}{" "}
                              {debtPayment[0].customer_id.surname}
                            </h5>
                            <h5>{debtPayment[0].customer_id.address}</h5>
                            <h5>{debtPayment[0].customer_id.number_phone}</h5>
                          </>
                        ) : (
                          <>
                            <h5>Aucun client</h5>
                            <h5>Aucune adresse</h5>
                            <h5>Aucun contact</h5>
                          </>
                        )}
                      </div>
                      <div className="info-debtPayment">
                        <div className="div-display">
                          <div className="date-ref-title">
                            <h5>Dette#</h5>
                            <h5>Date et Heure# </h5>
                          </div>
                          <div className="date-ref">
                            <h5>{debtPayment[0].debt_id.id}</h5>
                            <h5>
                              {moment(
                                debtPayment[0].debt_id.created_date
                              ).format("YYYY-MM-DD HH:mm:ss")}
                            </h5>
                          </div>
                        </div>
                        <div className="info-received">
                          <h5>Reçu par :</h5>
                          <h5>
                            {debtPayment[0].received_by.name}{" "}
                            {debtPayment[0].received_by.surname}
                          </h5>
                        </div>
                        <div className="info-received">
                          <h5>Reste à payer :</h5>
                          <h5>{remainder} Ar</h5>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>

                <CTable>
                  <CTableHead style={{ backgroundColor: "grey", border: "1" }}>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Ref</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Libelle</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Quantité</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Prix unitaire
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant payé
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {debtPayment &&
                      debtPayment.map((detail, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell style={style}>
                            {detail.id}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {moment(debtPayment.date_payment).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.entry_debt_id.libelle}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.quantity}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.price_unit > 1000 ? (
                              <>{detail.price_unit.toLocaleString()} Ar</>
                            ) : (
                              <>{detail.price_unit} Ar</>
                            )}
                          </CTableDataCell>

                          <CTableDataCell style={style}>
                            {detail.total_amount_payed > 1000 ? (
                              <>
                                {detail.total_amount_payed.toLocaleString()} Ar
                              </>
                            ) : (
                              <>{detail.total_amount_payed} Ar</>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>

                <div className="total-div">
                  {total > 1000 ? (
                    <>
                      <b>Total :{total.toLocaleString()} Ar</b>
                    </>
                  ) : (
                    <>
                      <b>Total : {total} Ar</b>
                    </>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }

  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
  setId(id) {
    this.setState({
      id: id,
    });
  }
  setTotal(t) {
    this.setState({
      total: t,
    });
  }
}
