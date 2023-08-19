/* eslint-disable functional/no-return-void */

import { Bonjour } from 'bonjour-service';

const SERVICE_NAME = 'smartenergy';
const DEFAULT_TIMEOUT = 60;

interface DiscoveredMeter {
  ipAddress: string;
  port: number;
  fqdn: string | undefined;
  host: string | undefined;
}

export const discoverMeters = async (
  timeoutSeconds = DEFAULT_TIMEOUT,
  quick = false, // return as soon as we get a match
): Promise<DiscoveredMeter[]> =>
  new Promise((resolve) => {
    const instance = new Bonjour();
    const browser = instance.find({ type: SERVICE_NAME, protocol: 'tcp' });

    const intervalId = setInterval(() => {
      // send out a message every second telling network devices we're looking for them
      browser.update();
    }, 1000);

    const timeoutId = setTimeout(() => {
      // after n seconds, timeout and resolve the promise with the list of devices we've found so far
      stop();
    }, timeoutSeconds * 1000);

    browser.once('up', () => {
      if (quick) stop();
    });

    const stop = () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      browser.stop();
      instance.destroy();

      const output = browser.services
        .filter((s) => s?.addresses?.[0] && s?.port)
        .map((s) => ({
          ipAddress: s.addresses[0],
          port: s.port,
          name: s.name,
          fqdn: s?.fqdn,
          host: s?.host,
        }));

      resolve(output);
    };
  });

export const discoverMeter = async (timeoutSeconds = DEFAULT_TIMEOUT) => {
  const meters = await discoverMeters(timeoutSeconds, true);
  return meters?.[0];
};
