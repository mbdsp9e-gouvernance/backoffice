import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";

// sidebar nav config
import navigation from "../_nav";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  let nav = navigation;
  // if (sessionStorage.getItem("user")) {
  //   const user = JSON.parse(sessionStorage.getItem("user"));
  //   if (user.role_id.entitled === "Administrateur") {
  //     nav = navigation[0]['admin'];
  //   } else if (user.role_id.entitled !== "Administrateur") {
  //     nav = navigation[1]['employe'];
  //   }
  // }

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CImage className="sidebar-brand-full" src={""} height={35} />
        <span></span>
        <span className="">E-GOUVERNANCE</span>
      </CSidebarBrand>
      <CSidebarNav>
        {/* {<SimpleBar> */}
        <AppSidebarNav items={nav} />
        {/* </SimpleBar> } */}
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
        }
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
