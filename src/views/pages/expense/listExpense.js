import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CButton,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import api from "../../../const/api";
import Loading from "../Loading";

export default class ListExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      expense: null,
      error: "",
      pagination: [],
      totalPage: 0,
      pageList: 1,
      pageNumber: 10,
      offset: 0,
      limit: 0,
    };
  }

  componentDidMount() {
    this.getExpenseData(1);
  }

  pagination = (totalPages) => {
    let page = [];
    for (let i = 1; i <= totalPages; i++) {
      page.push(i);
    }
    this.setState({ pagination: page });
  };

  getExpenseData = (page, pageNumber) => {
    this.setLoading(true);
    fetch(api(`expense/page/month/${page}`), { method: "GET" }).then((res) => {
      if (res.ok) {
        return res.json().then((data) => {
          let expenseData = [];
          // data.expense.forEach((expense) => {
          //   if (expense.month == 1) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Janvier",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 2) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Fevrier",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 3) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Mars",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 4) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Avril",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 5) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Mai",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 6) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Juin",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 7) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Juillet",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 8) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Août",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 9) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Septembre",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 10) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Octobre",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 11) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Novembre",
          //       totalAmount: expense.total_expense,
          //     });
          //   } else if (expense.month == 12) {
          //     expenseData.push({
          //       month: expense.month,
          //       label: "Décembre",
          //       totalAmount: expense.total_expense,
          //     });
          //   }
          // });
          this.setState({
            expense: expenseData,
            pageList: page,
            pageNumber: pageNumber,
            totalPage: data.pagination.totalPages,
          });
          this.pagination(data.pagination.totalPages);
          this.setLoading(false);
        });
      }
    });
  };

  addExpense() {
    this.props.history.push("/expense/insert");
  }

  expenseMonthDetails(month) {
    this.props.history.push("/expense/month/" + month);
  }

  render() {
    const { expense, loading, pageList, pageNumber, pagination, totalPage } =
      this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <span className="d-grid gap-2 d-md-flex justify-content-between">
                  <strong>Liste des Sorties</strong>
                  <CButton color={"primary"} onClick={() => this.addExpense()}>
                    <CIcon icon={cilPlus} className="me-2" />
                    Ajouter
                  </CButton>
                </span>
              </CCardHeader>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Mois</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Montant total
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {expense &&
                      expense.map((e, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{e.label}</CTableDataCell>
                          <CTableDataCell>
                            {Number(e.totalAmount) > 1000 ? (
                              <>{Number(e.totalAmount).toLocaleString()} Ar</>
                            ) : (
                              <>{Number(e.totalAmount)} Ar</>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color={"light"}
                              onClick={() => this.expenseMonthDetails(e.month)}
                            >
                              Voir
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={pageList === 1}
                    onClick={() =>
                      this.getExpenseData(pageList - 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {pagination.map((page, index) => (
                    <CPaginationItem
                      key={index}
                      active={page === pageList}
                      onClick={() => this.getExpenseData(page, pageNumber)}
                    >
                      {` ${page} `}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={
                      totalPage - pageList === 0 ||
                      (expense && expense.length === 0)
                    }
                    onClick={() =>
                      this.getExpenseData(pageList + 1, pageNumber)
                    }
                  >
                    <span aria-hidden="true"> &raquo; </span>
                  </CPaginationItem>
                </CPagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
  setOffset = (o) => {
    this.setState({
      offset: o,
    });
  };
  setLimit = (l) => {
    this.setState({
      limit: l,
    });
  };
  setLoading(state) {
    this.setState({
      loading: state,
    });
  }
}
