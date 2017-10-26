import ssdp


class Server(object):
    def __init__(self, port=1900, udn='unique:identifier'):
        self.port = port
        self.udn = udn

    def add_usn(self, service):
        self.udn = service

    def start(self):
        ssdp.discover(self.udn)
