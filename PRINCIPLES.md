# Design Principles

The following is a list of principles that drive the software design decisions to be made along the project.
These are made to justify pull requests criteria, but also to serve as a guide to choose between different
solutions / implementations through the design process.

## 1. API Simplicity

> Minimum time to working prototypes

The number of primitives in Smart Home automation is rather low. The number of use cases is rather not –
but can build upon a very clear and simple interface. Normally an Accessory will only have to offer the
following interfaces:
 
- **Discovery;** The user must be able to find their _trusted_ accessories within the network using a software client.
- **Read;** The user must be able to retrieve both properties and state from an accessory using a software client.
  - **State:** said of accessory values that change without necessary user input or that reflect their nature of
    _actuators_ or _sensors_. (1) A smart outlet that is either `on` or `off`. (2) The readings of a temperature sensor.
    Those are samples of state.
  - **Props:** said of accessory values that require user input through a software client to change. This can be true for the
    accessory name, icon, label, room they belong, etc.
- **Write;** The user must be able to mutate the state or properties of an accessory of theirs, as they can be read above.
  Naturally, a sensor can't mutate its state from user input (A presence sensor should not offer an API to change its value).
  This is thought for actuators: bulbs, outlets, fans, thermostats, entertainment systems.
- **Pairing;** The user must be able to attatch an accessory to the network, either sharing the WiFi network APK,
either via bluetooh, zigbee or other operations. This primitive will be out of the scope of the first iterations
of Bigfoot protocol. From simplicity we will trust a WiFi device since the user has already shared the keys via
other configuration methods.

## 2. High definition

> Since the requirements should be simple, those should not be ambiguous.

We should not make an extra effort to offer _several ways_ of achieving the same thing. A good example is that we should not offer an `RGB` color interface for bulbs
because there we can't guess the saturation, hue and brightness as different entities. We should offer then only ONE interface
that is clear, and teach the user how to change from one scheme to the other. _This might not be true as of now, but is a goal,
as of design principle_.

## 3. Backwards compatible

> Easy maintenance, don't harm the existing community

Firstly, we are on an early stage of this specification, so additions should not erase or work against current contributors
codebases. Once we have kind of a _stablished way_ of doing things with clear problems to solve, then a working 1.x.x should
be prepared with a stablished _breaking changes_ agenda. Clients then can learn how to differentiate pre and post 1.x.x versions
and adapt to different accessories.

This is also general to software development: you should avoid too much abstraction and reuse of code because you create
unintentional dependencies. APIs should be always stable and not change often. And when they do, they should respect existing
codebases and previous design to avoid breaking existing apps.

## 4. Ecosystem compliance

> Adoption is a goal

There is already an ecosystem that exist, with many manufacturers working and selling things, that other developers adapt
and use. There is no point in reinventing the wheel (discovery protocols, data encoding, pairing practices etc) when we are
not solving a specific problem; Only then reinventing the wheel can be justified.

That is why the aim of Bigfoot is offering a clear API to enable your products to work with future software clients,
using existing protocols and libraries.
