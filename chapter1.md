# Discovery

## Scan, announce and ping

Regardless of network or technology, there are 3 main discovery primitives to keep an IoT system coherent:

* **Scan**. When you ask the network about a kind of device you are not familiar with.
* **Announce. **Unsolicited promotion of the device, in case some device needs your skills.
* **Ping. **Check the availability of a device at a network level, to keep considering it as alive.

Well that was brief. But we now must know that each primitive will be implemented in a different way for each medium and network we are trying to communicate over. For example, scanning over a WiFi network may be implemented with SSDP, broadcast UDP requests or a custom multicast implementation. For devices connected over the cloud you will need a register to scan upon, or previous knowledge of the device so you can ping it.

# Discovery implementations

### SCAN

#### SSDP

#### Broadcast query

Send a message to all devices in the Wireless Area Network with the same message and wait for those that you want to discover to reply.



#### Multicast query

Basically the same as in broadcast, but only communicating with those devices subscribed to the multicast IP.







