# xcelsior

**I have no association with Xcel or Itron. This is purely a hobby project.**

Xcel has been rolling out [Itron Gen5 Riva Smart Meters](https://www.itron.com/na/solutions/product-catalog/gen5-riva-meter) across Denver. These meters are [super neat](https://www.youtube.com/playlist?list=PLYlhncU2MojDY9gxU36pxNVkiylGGcbwq) and all act as part of a giant mesh network to send readings back to Xcel HQ. This is a step above the traditional "broadcast meter readings over RF so a passing trucks can pick up their values" approach- these things are individually addressable and commandable, all without ever sending a truck into the field. Fancy marketing docs [here](https://www.itron.com/-/media/feature/products/documents/brochure/gen5-network_web_pdf_3410.pdf). As we all know, nothing has ever gone wrong attaching our critical infrastructure to the internet!

The benefit of the *old* approach (to nerds) is that you can just pick up those RF transmissions with a $12 USB antenna, decode them with [rtlamr](https://github.com/bemasher/rtlamr), and have useful realtime-ish data about your power usage... and every neighbor within a few blocks.

These *new* meters use a proprietary mesh technology from Itron that hasn't been reverse engineered yet (afaik) so us nerds are out of luck. There's the shitty "Green Button" export in the Xcel portal, but that data is delayed and can't be easily automated.

Except the meters have WiFi! And Xcel finally decided to allow people to turn it on and access the inbuilt IEEE 2030.5 API server. They had the foresight to limit it to specific self-signed certs that you whitelist in the web portal, which is good. But it's also kind of a pain in the ass to get setup. Luckily, once you've done the initial legwork, everything seems to just... work? You can pull **realtime** and time-delineated usage data, including how much you're piping back into the system with solar. 

# Enroll In Xcel Energy Launchpad

1. [Fill out this form](https://co.my.xcelenergy.com/s/forms/sdk-access) and wait for a response. Mine took a couple of days tops. You'll get an email indicating you have access to the SDK codebase.
2. [Enroll your meter](https://my.xcelenergy.com/MyAccount/s/meters-and-devices/manage-meters-and-devices). This UI is still pretty buggy and the meter doesn't pick up the credentials immediately, but once it's on your network, you're all set. Xcel has been super responsive and is working to improve this UI.
3. Generate a cert [using this script](https://github.com/zaknye/xcel_itron2mqtt/blob/main/scripts/generate_keys.sh)- it will store them in `certs/.cert.pem and certs/.key.pem`\*. Copy the LFDI string it outputs.
4. Click [Add Device](https://my.xcelenergy.com/MyAccount/s/meters-and-devices/add-device)
5. Paste the LDFI from #3 and pick random values for Nickname/Manufacturer/Device Type


\* = At some point I plan to implement cert generation within the JS code and will have a corresponding npm script.

# Usage

## Find a meter on your WiFi network
```
  const { ipAddress, port } = await discoverMeter();
  // ^ sometimes this is instantaneous, sometimes it takes forever, cache this IP in your code if possible
```

## Get meter info
```
  const cert = fs.readFileSync('cert.pem', 'utf8');
  const key = fs.readFileSync('key.pem', 'utf8');

  const session = createSession(ipAddress, port, { cert, key });
  const response = await getDeviceInformation(session);
```
## Get realtime usage
```
  const cert = fs.readFileSync('cert.pem', 'utf8');
  const key = fs.readFileSync('key.pem', 'utf8');

  const session = createSession(ipAddress, port, { cert, key });
  const response = await getInstantaneousDemand(session);
```

> More to come.




# Todo

- more endpoints
- helper functions for loading/autoloading certs
- potentially export an abstraction in additional to all the utility methods
- write tests for new discovery code
- script to generate cert ([this](https://github.com/zaknye/xcel_itron2mqtt/blob/main/scripts/generate_keys.sh), in js)
- write a CLI(?)

# Credits

This library would not have been possible without @zaknye's excellent [xcel_itron2mqtt](https://github.com/zaknye/xcel_itron2mqtt) to reference. Major props to him for doing the hard work.

Also want to shout out @bitjson's [typescript-starter](https://github.com/bitjson/typescript-starter) that served as a great jumping off point
