from ssdp import SSDPServer
from upnp_http_server import UPNPHTTPServer
import uuid
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


device_uuid = uuid.uuid4()

http_server = UPNPHTTPServer(8088,
                             friendly_name="Bigfoot device",
                             manufacturer="Yeti SL",
                             manufacturer_url='https://getyeti.co/',
                             model_description='Yeti Python appliance V1',
                             model_name="Python",
                             model_number="1",
                             model_url="https://github.com/netbeast/bigfoot/python",
                             serial_number="v1",
                             uuid=device_uuid,
                             presentation_url="http://localhost:5000/")
http_server.start()

ssdp = SSDPServer()
ssdp.register('local',
              'uuid:{}::upnp:rootdevice'.format(device_uuid),
              'upnp:rootdevice',
              'http://localhost:8088/python-v1.xml')
ssdp.run()