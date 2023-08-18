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
