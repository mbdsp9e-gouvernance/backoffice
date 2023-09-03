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
      id_customer: match && match.params && match.params.id,
      loading: true,
      debtPayment: null,
      error: "",
      totalAmountPayed: 0,
      totalAmountToPayed: 0,
      remainder: 0,
    };
  }

  componentDidMount() {
    this.getDebtPayment();
  }

  getDebtPayment() {
    this.setLoading(true);
    const id_customer = this.state.id_customer;
    fetch(api(`debtPayment/history/${id_customer}`), { method: "GET" }).then(
      (res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data) {
              this.setState({
                debtPayment: data.debtPayment,
                totalAmountPayed: parseInt(data.total.total),
                totalAmountToPayed: data.totalAmountToPayed,
                remainder: data.remainder,
                loading: false,
              });
            }
          });
        }
      }
    );
  }

  render() {
    const {
      loading,
      debtPayment,
      totalAmountPayed,
      totalAmountToPayed,
      remainder,
    } = this.state;
    const style = {
      borderColor: "darkslategrey",
      borderStyle: "solid",
      borderWidth: "1px",
    };
    if (loading) {
      return <Loading />;
    }
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
                            <h5>Ref#</h5>
                            <h5>Date et Heure# </h5>
                          </div>
                          <div className="date-ref">
                            <h5>
                              {debtPayment[0].customer_id.id +
                                debtPayment[0].customer_id.gender}
                            </h5>
                            <h5>
                              {moment(debtPayment[0].modification_date).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </h5>
                          </div>
                        </div>
                        <div className="info-received">
                          <h5>Montant total dette:</h5>
                          <h5>
                            {totalAmountToPayed > 1000 ? (
                              <>{totalAmountToPayed.toLocaleString()} Ar</>
                            ) : (
                              <>{totalAmountToPayed} Ar</>
                            )}
                          </h5>
                        </div>
                        <div className="info-received">
                          <h5>Payer :</h5>
                          <h5>
                            {totalAmountPayed > 1000 ? (
                              <>{totalAmountPayed.toLocaleString()} Ar</>
                            ) : (
                              <>{totalAmountPayed} Ar</>
                            )}
                          </h5>
                        </div>
                        <div className="info-received">
                          <h5>Reste à payer :</h5>
                          <h5  style={{color:'red'}}>
                            {remainder > 1000 ? (
                              <>{remainder.toLocaleString()} Ar</>
                            ) : (
                              <>{remainder} Ar</>
                            )}
                          </h5>
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
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Libelle</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant payer
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">Reçu par</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {debtPayment &&
                      debtPayment.map((detail, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell style={style}>
                            {moment(detail.date_payment).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </CTableDataCell>
                          <CTableDataCell style={style}>
                            {detail.libelle !== "" ? (
                              <>{detail.libelle}</>
                            ) : (
                              <>{detail.entry_debt_id.libelle}</>
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
                          <CTableDataCell style={style}>
                            {detail.received_by.name}{" "}
                            {detail.received_by.surname}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
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
