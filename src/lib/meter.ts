import { AxiosInstance } from 'axios';
import { fromXML } from 'from-xml';

interface DeviceInformation {
  lFDI: string;
  swVer: string;
}

export const getDeviceInformation = async (
  session: Readonly<AxiosInstance>,
): Promise<DeviceInformation> => {
  const response = await session.get('/sdev/sdi');
  const xml = response.data;
  const { DeviceInformation: obj } = fromXML(xml);

  return obj;
};

interface DeviceTime {
  currentTime: number;
}

export const getDeviceTime = async (
  session: Readonly<AxiosInstance>,
): Promise<DeviceTime> => {
  const response = await session.get('/tm');
  const xml = response.data;
  const { Time: obj } = fromXML(xml);
  const currentTime = parseInt(obj.currentTime);

  return { currentTime };
};

interface MeterReading {
  value: number;
  timePeriod: {
    duration: number;
    start: number;
  };
}

const parseReading = (xml: string) => {
  const { Reading: obj } = fromXML(xml);

  const value = parseInt(obj.value);
  const timePeriod = {
    duration: parseInt(obj.timePeriod.duration),
    start: parseInt(obj.timePeriod.start),
  };

  return {
    value,
    timePeriod,
  };
};

export const getInstantaneousDemand = async (
  session: Readonly<AxiosInstance>,
): Promise<MeterReading> => {
  const response = await session.get('/upt/1/mr/1/r');
  const xml = response.data;

  return parseReading(xml);
};
