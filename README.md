# The Bigfoot project

A toolbet for IoT software tools that work together.

## Why?

Developing is hard. Being disruptive is harder. Industry won't stop trying to impose new protocols and standards. Indies won't stop creating open source projects that everyone should adopt --[we also did](https://github.com/netbeast/dashboard)--. **So the Bigfoot project is a collection of already existing tools that work together out of the box** and will help you develop your next connected _thing_ as soon as possible.

Imagine you just want to implement a doorbell that sends you a push notification. Simple right? Well, not so much. You will easily find yourself trying to write wires towards 3rd party middleware or worse, server code or mobile apps. When you first start your prototype, you did not want all this fuzz. In an ideal world your doorbell would just declare that it is _there_ and it can be _pressed_.

**Well, you can. Now.**

```javascript
// Your connected service / device code
// thing.js
const Bigfoot = require('@netbeast/bigfoot')
const server = Bigfoot.alive()
Bigfoot.announce('pressed')
```

```javascript
// Your application / interface code
// client.js
const Bigfoot = require('@netbeast/bigfoot')
Bigfoot.scan(function (devices) {
  if (devices.length === 0) {
    return console.log('No devices available')
  }
  
  const firstDevice = devices[0]
  console.log('Found a first device')
  console.log(firstDevice)
  Bigfoot.setState(firstDevice, {
    hue: 200, // deg
    brightness: 0.9, // percentage over a unit
  })
})
```

This is a sample in javascript. Check for \[python\] and \[other programming languages\].

> Best of all? You don't even need the bigfoot library. It is just a wrapper of the tools you are already using.  So you do not need to learn a new framework. Take a look on each section of the docs depending on which network / protocol / topic of the device you are planning to build

### Contents

Inside each chapter a set of techniques, packages and code samples will be there for you to kickoff your project.

* Get started
* API Primitives
* Discovery
* State and Props
* ~~Signals and events~~ *Coming soon*
* ~~Advanced~~ *Coming soon*

# Get started

This guide will allow you to mock up your first connected device in less than a minute.

1. **Download [Yeti Smart Home](https://getyeti.co/)**

Any Bigfoot-compatible software would work. By the moment Bigfoot is fairly young, so this is the first end user software tool that supports it. You can also help open source software as [Netbeast Dashboard](https://github.com/netbeast/dashboard) implement it.

2. **Choose a sample scaffold from the Bigfoot Project**

```
git clone https://github.com/netbeast/bigfoot-js
cd bigfoot/samples/node/mock-device
npm install
npm run sample
```

This is a sample in node.js. There also exist [bigfoot-golang](https://github.com/netbeast/). We are looking for collaborators to create samples in other languages such as lua or python. Please send us a pull request!

3. **Explore devices in Yeti**

Done 👏🏽

# API Primitives
A primitive is a definition of something, that after can be implemented in a programming language in an API. This section will describe the API of Bigfoot in JS using [Flow type](https://flow.org/), but aims to describe all the possibilities regardless of the programming language or architecture used to implement those. The following chapters will describe how do they work.

It is not directly available yet, in exchange, it is available through examples implemented in RAW node.js.

## Device model
A device has the following JSON structure:
```
  {
    id: 'Unique string to identify a device',
    name: 'UX for the user',
    model: 'in case you have several APIs for different hardware',
    brand: 'Your alias as maker if you will',
    topic: 'Bulb | Switch | Music | Camera | Thermostat', // A string that identifies the dimensions and capabilities of a device
    props: {
      [dimension: string]: any,    
    },
    state: {
      [dimension: string]: any,
    }
```

A list of common topics, props and state is available in `Skills`

## Device primitives
### `Bigfoot.alive: (snapshotRequest: (params?: Object) => Promise) => Promise`
Will alert the existance of a Bigfoot device in the network, using any discovery methods available. Check the `Discovery` section below to see what protocols are implemented.

It also accepts a _Snapshop_ request. This is the function that is going to be run when the device is discovered in the network or it's definition is required (as in a ping, a getProps or a getState)

```
const server = Bigfoot.alive(function onSnapshotRequest (params) {
  // Params is a plain object with information from the requester, can be used as a wildcard or ignored
  const device = {
    id: 'Unique string to identify a device',
    name: 'UX for the user',
    model: 'in case you have several APIs for different hardware',
    brand: 'Your alias as maker if you will',
    topic: 'Bulb | Switch | Music | Camera | Thermostat' // A string that identifies the dimensions and capabilities of a device
    props: { ip: '192.168.0.33' },
    state: { power: true },
  }
  return Promise.resolve()
})
```

### `Bigfoot.didReceiveState: (nextState: Object) => Promise`
Following a React-style API, Bigfoot will trigger such event for us to handle the state changes requests in a device. Check the `Skills` section below to see what network protocols and strategies are available. You can reject the Promise to notify the user that an error has ocurred.

```
Bigfoot.didReceiveState(function (nextProps: Object) {
  // Here you can do whatever is necessary to store props
  return Promise.resolve()
})
```

> Props are not supposed to be changeable from the client, therefore immutable.

## Client primitives

### `Bigfoot.scan: (onFoundListener: () => void) => Promise`
Will use all the available discovery methods to find bigfoot devices in all available networks. Check the `Discovery` section below to see what protocols are implemented.

> By the moment the list of compatible protocols to implement the primitives is limited. We want you to submit PR, creating API-compatible agents for the protocols you need.
> The protocols so far include: SSDP and HTTP
> Following discovery protocols: Bluetooth (for other radio channels), mDNS (WiFi) and an open registry for cloud devices.
> Following skills protocols: MQTT, COAP

## `Bigfoot.setState(device: Device, nextState: Object)`
Change the `state` field of a device object over the network, with any result on the physical remote state that the device would implement.

```
Bigfoot.setState(firstDevice, {
  hue: 200, // deg
  brightness: 0.9, // percentage over a unit
})
```

> Props are not supposed to be changeable from the client, therefore immutable.

# Discovery

## Scan, announce and ping

Regardless of network or technology, there are 3 main discovery primitives to keep an IoT system coherent:

* **Scan.** When you ask the network about a kind of device you are not familiar with.
* **Announce. **Unsolicited promotion of the device, in case some device needs your skills.
* **Ping. **Check the availability of a device at a network level, to keep considering it as alive.

Well that was brief. But we now must know that each primitive will be implemented in a different way for each medium and network we are trying to communicate over. For example, scanning over a WiFi network may be implemented with SSDP, broadcast UDP requests or a custom multicast implementation. For devices connected over the cloud you will need a register to scan upon, or previous knowledge of the device so you can ping it.

# Discovery primitives

### Scan

For each **scan** mechanism there must be an **active scan request** \(some devices that asks the network on a scan\) and a device that is patiently waiting a scan request. The easiest method to make your device discoverable is to subscribe to the SSDP multicast address:

```js
var Server = require('node-ssdp').Server

server = new Server({
  sourcePort: 1900,
})

server.addUSN('bigfoot:all')

server.start()

process.on('exit', function() {
  server.stop() // advertise shutting down and stop listening
})
```

Check out the repo for examples in [golang](https://github.com/netbeast/bigfoot/tree/master/samples/golang) or other languages.

Congratulations, your device is alive!

![](/assets/Screenshot_20170603-192308.png)

### Ping

This is intended to be the most lightweight method to check that connectivity to your device works. If you implement an interface through HTTP \(as described in [skills](/skills.md)\) we'd only need to specify the port where the service is running as the **location** parameter:

```js
const Ssdp = require('node-ssdp')
const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾  Bigfoor ping sample started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    location: `${addr}:${port}`,
    sourcePort: 1900,
  })
  ssdpServer.addUSN('bigfoot:all')
  ssdpServer.start()
})

process.on('exit', function() {
  ssdpServer.stop() // advertise shutting down and stop listening
  app.stop() // close express server
})
```

As you'd notice already, our device is still pretty dumb. We can only see it appear in our Yeti \(Bigfoot compatible\) device. This is because we had not specify any skill or topic that it can work as. So let's move on now.

# Skills

After discovery or a request for your skills descriptor you must be able to communicate the things you are able to do, and let the other parties understand. Skills are grouped in _topics_, so when you declare a topic every other Bigfoot compatible machine understands how to communicate with it immediately.

There are only a few topics available by the moment:

* `Bulb`: to control lightning systems
* `Music` : things that can consume 
* `Thermostat`: a heat / cold system
* `Switch`: a plug or system with two states \(on/off\)
* `App`: exposes an app through a webserver, so the developer can implement its own interface.

To declare an interface you'd only need to specify the topic on the USN:

```js
ssdpServer.addUSN('bigfoot:bulb')
// or 
ssdpServer.addUSN('bigfoot:app')
```

And Bigfoot compatible devices are going to interpret it as different devices.

We can now already expose a webview for our connected device to a Bigfoot compatible software:

```js
const Ssdp = require('node-ssdp')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  // Here you can handle all the requests that will be shown as a webview
  res.send()
})

const httpServer = app.listen(3000, function () {
  const addr = httpServer.address().address
  const port = httpServer.address().port
  console.log('👾  Bigfoot ping sample started on %s:%s', addr, port)

  ssdpServer = new Ssdp.Server({
    location: `${addr}:${port}`,
    sourcePort: 1900,
  })

  /*
  * Notice the `app` is declared under USN
  */
  ssdpServer.addUSN('bigfoot:app')
  ssdpServer.start()
})

process.on('exit', function() {
  /* Handle exit */
})
```

## Implementing a topic

To understand Bigfoot messages you only must implement a protocol to listen for the primites and then specify it under location. The switch topic is the simplest because you only have to understand ON / OFF set requests and to return the state. This will be done by HTTP POST and GET methods respectively.

```js
let state = { power: 0 }

app.get('/', function (req, res) {
  // Here you can return the switch state
  res.send(state)
})

app.post('/', function (req, res) {
  // Maybe perform some validation, change any device internal handling and then
  // return back the state
  state = req.state
  res.send(state)
})
```

Topics stand for a _kind_ of device and groups a set of variables or dimensions to be used. It is a shortcut for the skills of a Device. For example if the topic of your thing is _light_ or _bulb_ the rest of the parties will immediately know that you must support a certain state:

```js
/* @flow */
export type BulbState = {
  power: 0 | 1,
  brightness: number, // percentage 0-100
  hue?: number, // degrees 0-360
  saturation?: number, // percentage 0-100
}
```

\*\_ [Flow](https://flow.org/) is used to describe data types and interfaces throughout the codebase

These are the topics supported by Netbeast Dashboard so far:

```js
/* @flow */
export type BulbState = {
  power: 0 | 1,
  brightness: number, // percentage 0-100
  hue?: number, // degrees 0-360
  saturation?: number, // percentage 0-100
}

export type SwitchState = { power: PowerState }

export type MusicState = {
  status: 'playing' | 'paused',
  volume: number, // Not sure still that this is a percentage
  track: Url,
  position?: number,
  playlist?: Array<Object>,
  // rest to be defined
}

export type ThermostatState = {
  power: 0 | 1,
  temperature: number,
  units: 'celsius', 'farenheit',
  mode?: string,
}
```

## Roadmap

* [x] Define the scope of the project
* [x] Website
* [x] Canny
* [ ] Open channels for collaborators \(chats, forums or emails\)
* [ ] Write strategies and language agnostic documentation
  * [x] Get Started
  * [x] Discovery
  * [x] Ping
  * [x] setState
  * [ ] Reactive events
  * [ ] Authentication
  * [ ] Notifications
  * [ ] Network
* [ ] Write node wrapper
  * [x] Code samples
  * [ ] Working samples with virtual devices
  * [x] Working samples with real devices
* [ ] Write go wrappers
  * [x] Code samples
  * [ ] Working samples with virtual devices
  * [] Working samples with real devices
* [ ] Write C, Go or community chosen wrapper

## But you are still offering a protocol?

Not at all. Bigfoot project aims to gather a set of strategies over existing protocols and industry standards to make it easier for developers and makers to create IoT experiences together. As React brought us that to representation interfaces, Bigfoot wants you to be able to create React-like hardware responses in a network environment with a set of simple and functional APIs.

Bigfoot _topics_ is a suggested data structure that works out of the box with other tools in the belt. Because, you know, we need things working together. Anyway those _topics_ are borrowed from many other smart home devices, IoT services and other stablished protocols. We are going to build _translators_ so you can use this schema as a middleware utility. But it is **not opinionated** and completely optional. As a fact they will have a `raw` method alternative to access all the params obscured by any tools, in case you want access to the internals of the things you are working with.

# Contributing

Bigfoot is an Open Source Project. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

# Sponsors

This project is a reality today thanks to its contributors and sponsors. 
We are proud to be part of the Toptal Open Source grant program, and compatible with Yeti

<a href="https://getyeti.co" target="_blank">
   <img alt="works with yeti" src="works-with-yeti.png" height="80px" />
</a>

<a href="https://www.toptal.com/" target="_blank">
  <img
    alt="Toptal OSS"
    height="80px"
    src="https://bs-uploads.toptal.io/blackfish-uploads/branding_page/content/logo_example_file/logo_example/412/logo-ef4e3458c482141a5c668b5b0ef49a21.png" />
</a>

