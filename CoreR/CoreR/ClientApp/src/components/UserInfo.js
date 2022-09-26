import React, { Component } from 'react';
import { MsalContext } from "@azure/msal-react";
import { graphRequest } from "../authConfig";
import { graphConfig } from "../authConfig";

export class UserInfo extends Component {
    static displayName = UserInfo.name;
    static contextType = MsalContext;

  constructor(props) {
    super(props);
      this.state = {
          graphData: {}, graphDataRoles: {}, graphDataMembers: {}, loading: true };
  }

    componentDidMount() {
        this.requestData();
        //this.populateWeatherData();
    }

  requestData() {
      const msalInstance = this.context.instance;
      const accounts = msalInstance.getAllAccounts();
        msalInstance.acquireTokenSilent({
            ...graphRequest,
            account: accounts[0]
        }).then((response) => {
            this.callMsGraph(response.accessToken);
        });
  }

    static renderUserInfo(graphData, graphDataRoles, graphDataMembers) {
    return (
        <div>
        <h2 id="tabelLabel" >User data</h2>
        <p><strong>First Name: </strong> {graphData.givenName}</p>
        <p><strong>Last Name: </strong> {graphData.surname}</p>
        <p><strong>Display Name: </strong> {graphData.displayName}</p>
        <p><strong>Email: </strong> {graphData.userPrincipalName}</p>
        <p><strong>Id: </strong> {graphData.id}</p>
        <h2 id="tabelLabel" >AppRole data</h2>
        <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Created</th>
                    <th>AppRoleId</th>
                    <th>PrincipalType</th>
                </tr>
            </thead>
            <tbody>
              {graphDataRoles.map(appRole =>
                    <tr key={appRole.createdDateTime}>
                        <td>{appRole.createdDateTime}</td>
                        <td>{appRole.appRoleId}</td>
                        <td>{appRole.principalType}</td>
                    </tr>
                )}
            </tbody>
        </table>
        <h2 id="tabelLabel" >Membership data</h2>
        <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
               {graphDataMembers.map(member =>
                   <tr key={member.id}>
                       <td>{member.id}</td>
                       <td>{member["@odata.type"]}</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    );
  }

  render() {
    let contents = this.state.loading
        ? <p><em>Loading...</em></p>
        : UserInfo.renderUserInfo(this.state.graphData, this.state.graphDataRoles.value, this.state.graphDataMembers.value);

    return (
      <div>
        <h1 id="tabelLabel" >GraphAPI</h1>
        <p>This component demonstrates fetching data from graphapi.</p>
        {contents}
      </div>
    );
  }

    async callMsGraph(accessToken) {

      const headers = new Headers();
      const bearer = `Bearer ${accessToken}`;

      headers.append("Authorization", bearer);

      const options = {
          method: "GET",
          headers: headers
      };

      const response = await fetch(graphConfig.graphMeEndpoint, options);
      const data = await response.json();

      const responseRoles = await fetch(graphConfig.graphMeEndpoint+"/appRoleAssignments", options);
      const dataRoles = await responseRoles.json();

      const responseMembers = await fetch(graphConfig.graphMeEndpoint + "/memberOf", options);
      const dataMembers = await responseMembers.json();

      this.setState({ graphData: data, graphDataRoles: dataRoles, graphDataMembers: dataMembers, loading: false });
    }

}
