import React, { useState } from "react";
import { createContainer } from "unstated-next";
import apiClient from "./client/apiClient";
import { UserDto } from "./client/client";
function AuthedState() {
    const [activeUser, setActiveUser] = React.useState<UserDto>();
    React.useEffect(() => {
       
    }, [activeUser]) // run when user changes

    return { activeUser, setActiveUser }
  }


const GlobalContainer = createContainer(AuthedState);
export default GlobalContainer;
