import React, { Component } from 'react';
import { MsalContext } from "@azure/msal-react";
import { apiRequest } from "../authConfig";

export class FetchData extends Component {
    static displayName = FetchData.name;
    static contextType = MsalContext;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true };
  }

    componentDidMount() {
        this.requestData();
        //this.populateWeatherData();
    }

  requestData() {
      const msalInstance = this.context.instance;
      const accounts = msalInstance.getAllAccounts();
        msalInstance.acquireTokenSilent({
            ...apiRequest,
            account: accounts[0]
        }).then((response) => {
            this.populateWeatherData(response.accessToken);
        });
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

    async populateWeatherData(accessToken) {

      const headers = new Headers();
      const bearer = `Bearer ${accessToken}`;

      headers.append("Authorization", bearer);

      const options = {
          method: "GET",
          headers: headers
      };

      const response = await fetch('weatherforecast', options);
      const data = await response.json();
      this.setState({ forecasts: data, loading: false });
  }
}
