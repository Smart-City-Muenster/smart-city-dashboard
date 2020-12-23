import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MeasurementTile, Status } from './MeasurementTile';
import { ComponentWrapper, HeadingWrapper } from './styles';

const TilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const AaseeComponent = () => {
  const aaseeData: ServiceState = useSelector(
    (state: RootStateOrAny) => state.aasee
  );

  const [temperature, setTemperature] = useState(0);
  const [ph, setPh] = useState(0);
  const [oxygen, setOxygen] = useState(0);

  useEffect(() => {
    if (aaseeData.data.data) {
      const sensorWithTempPh = aaseeData.data.data.packets.filter(
        (p: any) => 'water_temperature' in p.parsed
      )[0];

      if (sensorWithTempPh && sensorWithTempPh.parsed) {
        setTemperature(sensorWithTempPh.parsed.water_temperature);
        setPh(sensorWithTempPh.parsed.pH);
      }

      const sensorWithOxygen = aaseeData.data.data.packets.filter(
        (p: any) => 'dissolved_oxygen' in p.parsed
      )[0];

      if (sensorWithOxygen && sensorWithOxygen.parsed) {
        setOxygen(sensorWithOxygen.parsed.dissolved_oxygen);
      }
    }
  }, [aaseeData]);

  return (
    <ComponentWrapper>
      <HeadingWrapper>
        <p className="is-size-5">Wasserqualität Aasee</p>
      </HeadingWrapper>
      <TilesWrapper>
        <MeasurementTile
          header="Sauerstoff"
          value={oxygen}
          footer="in mg/L"
        ></MeasurementTile>
        <MeasurementTile
          header="Temperatur"
          value={temperature}
          footer="in °C"
          status={Status.bad}
        ></MeasurementTile>
        <MeasurementTile
          header="pH-Wert"
          value={ph}
          footer="pH"
          status={Status.good}
        ></MeasurementTile>
      </TilesWrapper>
    </ComponentWrapper>
  );
};

export default AaseeComponent;
