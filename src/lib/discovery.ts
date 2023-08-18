import DnsSd from 'node-dns-sd';

const SERVICE_NAME = '_smartenergy._tcp.local';
const DEFAULT_TIMEOUT = 60;

export const discoverMeters = async (
  timeoutSeconds = DEFAULT_TIMEOUT,
  quick = false, // return as soon as we get a match
) => {
  // todo: consider implementing code-level timeout/retry
  // seems like if I kill the process after a long hang and call .discover()
  // it immediately finds the device

  const results = await DnsSd.discover({
    name: SERVICE_NAME,
    wait: timeoutSeconds,
    quick,
    filter: (d) => d.fqdn?.includes('itron') || false, // this doesn't appear to work so we double-filter below
  });

  console.log(JSON.stringify(results));

  return results
    .filter((d) => d.fqdn?.includes('itron') || false) // rare edge case: this will cause unexpected behavior when quick=true and there is a non-itron meter on the network
    .map((result) => ({
      ipAddress: result.address,
      port: result.service?.port,
    }));
};

export const discoverMeter = async (timeoutSeconds = DEFAULT_TIMEOUT) => {
  const meters = await discoverMeters(timeoutSeconds, true);
  return meters?.[0];
};
