# xcelsior

(Unofficial) Interface with Itron smart meter via Xcel's Energy Launchpad program

These docs will (hopefully) improve

# Usage
```
  const discovered = await discoverMeter();
  // ^ sometimes this is instantaneous, sometimes it takes forever, cache this IP in your code if possible

  if (!discovered) return new Error('Meter not found');

  const { ipAddress, port } = discovered;

  const cert = fs.readFileSync('cert.pem', 'utf8');
  const key = fs.readFileSync('key.pem', 'utf8');

  const session = createSession(ipAddress, port, { cert, key });
  const response = await getDeviceInformation(session);

  console.log(response);
```

# Credits

This library would not have been possible without @zaknye's excellent [xcel_itron2mqtt](https://github.com/zaknye/xcel_itron2mqtt) to reference. Major props to him for doing the hard work.
