import React, { Component } from 'react';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import mincienciaFetcher from '../clients/minciencia-fetcher';
import CVLineChart from '../components/CVLineChart';
import ChartContainer from '../components/ChartContainer';
import CenteredContainer from '../components/CenteredContainer';
import PlacesContainer from '../components/PlacesContainer';
import PlaceLink from '../components/PlaceLink';
import scrollToTop from '../utils/scrollToTop';
import formatter from '../utils/formatter';
import MetricsCards from '../components/MetricsCards';
import metricsIcons from '../assets/images/metrics';
import ChartTitle from '../components/ChartTitle';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPorComuna: {}, totalesNacionales: [], lastData: null };
  }

  async componentDidMount() {
    scrollToTop();
    const dataPorComuna = await mincienciaFetcher.getAllDataPorComuna();
    const totalesNacionales = await mincienciaFetcher.getTotalesNacionales();
    const lastData = totalesNacionales.slice(-1)[0];
    this.setState({ dataPorComuna, totalesNacionales, lastData });
  }

  render() {
    const { dataPorComuna, totalesNacionales, lastData } = this.state;
    const regiones = _.keys(dataPorComuna).map((region) => {
      const to = {
        pathname: `/regiones/${region}`,
        dataPorComuna,
      };
      return (
        <PlaceLink key={region} to={to}>
          {region}
        </PlaceLink>
      );
    });
    const indexMetropolitana = _.findIndex(regiones, ['key', 'Metropolitana']);
    const metropolitana = regiones.splice(indexMetropolitana, 1);
    regiones.unshift(metropolitana);
    return (
      <>
        {
          !!lastData && (
          <Helmet>
            <title>COVID-19 en tu comuna</title>
            <meta name="description" content={`En Chile se registran ${formatter.valueFormatter(lastData['Casos activos'])} casos activos al ${formatter.dateFormatter(lastData.date)}.`} />
          </Helmet>
          )
        }
        <CenteredContainer>
          {
            !!lastData && (
              <MetricsCards.Container>
                <MetricsCards.Card>
                  <MetricsCards.Icon src={metricsIcons.poblacion} />
                  <MetricsCards.TextContainer>
                    <MetricsCards.Label>Población</MetricsCards.Label>
                    <MetricsCards.Value>19.458.310</MetricsCards.Value>
                  </MetricsCards.TextContainer>
                </MetricsCards.Card>
                <MetricsCards.Card>
                  <MetricsCards.Icon src={metricsIcons.activos} />
                  <MetricsCards.TextContainer>
                    <MetricsCards.Label>Activos</MetricsCards.Label>
                    <MetricsCards.Value>
                      {formatter.valueFormatter(lastData['Casos activos'])}
                    </MetricsCards.Value>
                  </MetricsCards.TextContainer>
                </MetricsCards.Card>
                <MetricsCards.Card>
                  <MetricsCards.Icon src={metricsIcons.recuperados} />
                  <MetricsCards.TextContainer>
                    <MetricsCards.Label>Recuperados</MetricsCards.Label>
                    <MetricsCards.Value>
                      {formatter.valueFormatter(lastData['Casos recuperados'])}
                    </MetricsCards.Value>
                  </MetricsCards.TextContainer>
                </MetricsCards.Card>
                <MetricsCards.Card>
                  <MetricsCards.Icon src={metricsIcons.fallecidos} />
                  <MetricsCards.TextContainer>
                    <MetricsCards.Label>Fallecidos</MetricsCards.Label>
                    <MetricsCards.Value>
                      {formatter.valueFormatter(lastData.Fallecidos)}
                    </MetricsCards.Value>
                  </MetricsCards.TextContainer>
                </MetricsCards.Card>
              </MetricsCards.Container>
            )
          }
          <ChartContainer>
            <ChartTitle>
              Chile
            </ChartTitle>
            { !!totalesNacionales.length && <CVLineChart data={totalesNacionales} />}
          </ChartContainer>
          <PlacesContainer totalPlaces={regiones.length}>
            {regiones}
          </PlacesContainer>
        </CenteredContainer>
      </>
    );
  }
}

export default Home;
