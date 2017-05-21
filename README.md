# The Bigfoot project

A toolbet for IoT software tools that work together.

## Why?

Developing is hard. Being disruptive is harder. Industry won't stop trying to impose new protocols and standards. Indies won't stop creating open source projects that everyone should adopt --[we also did](https://github.com/netbeast/dashboard)--. **So the Bigfoot project is a collection of already existing tools that work together out of the box** and will help you develop your next connected _thing_ as soon as possible.

Imagine you just want to implement a doorbell that sends you a push notification. Simple right? Well, not so much. You will easily find yourself trying to write wires towards 3rd party middleware or worse, server code or mobile apps. When you first start your prototype, you did not want all this fuzz. In an ideal world your doorbell would just declare that it is _there_ and it can be _pressed_.

Well, you can. Now.

```javascript
const Bigfoot = require('@netbeast/bigfoot')
const server = Bigfoot.alive()
Bigfoot.announce('pressed')
```

This is a sample in javascript. Check for \[python\] and \[other programming languages\].

> Best of all? You don't even need the bigfoot library. It is just a wrapper of the tools you are already using.  So you do not need to learn a new framework. Take a look on each section of the docs depending on which network / protocol / topic of the device you are planning to build

### Contents

Inside each chapter a set of techniques, packages and code samples will be there for you to kickoff your project.

* Discovery. _How to tell other devices that you are there._
  * Scan announce and ping
  * Discovery mechanisms
  * Adapt to the medium
* Skills. _How to tell the other devices in the network about your capabilities._
  * Sensors and actuators
  * Dimensions and topics
  * Interacting with devices
  * Events
* User experince. _How to communicate with humans._
  * Notifications

  * Automatically created UI
  * Webviews
* Avanced. _How to do the most interesting stuff._
  * Authorisation
  * Histograms and data visualisation
  * Data fusion, sources of truth

## Roadmap

* [x] Define the scope of the project
* [ ] Write all strategies and language agnostic documentation
* [ ] Write node wrapper
* [ ] Write python wrappers
* [ ] Write C, Go or community chosen wrapper
* [ ] Define translators for different platforms
* [ ] Write node and python translators

## But you are still offering a protocol?

Yep. Well. Not exactly. Bigfoot _topics_ is a suggested data structure that works out of the box with other tools in the belt. Because, you know, we need things working together. Anyway those _topics_ are borrowed from many other smart home devices, IoT services and other stablished protocols. We are going to build _translators_ so you can use this schema as a middleware utility. But it is **not opinionated** and completely optional. As a fact they will have a `raw` method alternative to access all the params obscured by any tools, in case you want access to the internals of the things you are working with.



