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

# Todo

- more endpoints
- helper functions for loading/autoloading certs
- potentially export an abstraction in additional to all the utility methods
- rewrite discoverMeters() to use our own retry/timeout logic
- script to generate cert ([this](https://github.com/zaknye/xcel_itron2mqtt/blob/main/scripts/generate_keys.sh), in js)
- move the agent code out of crypt and into it's own file

# Credits

This library would not have been possible without @zaknye's excellent [xcel_itron2mqtt](https://github.com/zaknye/xcel_itron2mqtt) to reference. Major props to him for doing the hard work.

Also want to shout out @bitjson's [typescript-starter](https://github.com/bitjson/typescript-starter) that served as a great jumping off point
