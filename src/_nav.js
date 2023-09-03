import React from "react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCreditCard } from "@coreui/icons";
import { CNavItem, CNavTitle } from "@coreui/react";

// NAVIGATION ADMIN
const nav = [
  [
    {
      component: CNavTitle,
      name: "Statistique",
      menu: [
        {
          component: CNavItem,
          name: "Tableau de bord",
          to: "/statistique/global",
          icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
        },
      ],
    },
  ],
  [
    {
      component: CNavTitle,
      name: " Gestion des inscription ",
      menu: [
        {
          component: CNavItem,
          name: "Validation",
          to: "/registration",
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
      ],
    },
  ],
  [
    {
      component: CNavTitle,
      name: " Gestion utilisateur ",
      menu: [
        {
          component: CNavItem,
          name: "Utilisateur",
          to: "/user/list",
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
        // {
        //   component: CNavItem,
        //   name: "Client",
        //   to: "/Customer/list",
        //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        // },
      ],
    },
  ],
];

export default nav;
