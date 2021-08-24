# TAK-WEB-MAP
**Web-based map display for TAK servers, intended for containerized deployment**

**VERY VERY EARLY DEVELOPMENT STATE - BUGS VERY POSSIBLE**

## Features
- Connects via TCP and SSL
- Configuration entirely through environment variables
- Displays altitude (ft) and squawk code for CoTs from ADS-B feeds (s. notes)

## Configuration
TAK-WEB-MAP is configured through environment variables:
 Variable | example | explanation
---
 REMOTE_TCP_SERVER | tcp://127.0.0.1:8087 | TAK server and port to connect through tcp
 REMOTE_SSL_SERVER | ssl://127.0.0.1:8089 | TAK server and port to connect through ssl
 REMOTE_SSL_SERVER_CERTIFICATE | /data/cert.pem | TAK user certificate in PEM format
 REMOTE_SSL_SERVER_KEY | /data/key.pem | TAK user certificate secret key in PEM format

If using ssl, the certificates need to be mounted to the container.

## Notes
#### ADS-B feeds
TAK-WEB-MAP will display the `hae` attribute as altitude next to the icon on the map and will search in the `remarks` attribute for a squawk code if the `uid` attribute of a CoT object starts with "ICAO-". One great ADS-B feed program which sends CoT's this way is https://github.com/ampledata/adsbcot

## License
TAK-WEB-MAP is licensed under the [**GNU Affero General Public License**](https://www.gnu.org/licenses/agpl-3.0.en.html) Version 3 or later.

## Contribute
Please feel free to report bugs, make suggestions or submit pull requests! However, the project maintainer (me) is a family dad with a relatively busy schedule and doing this project entirely in his free time, so development might stall every once in a while.

## Copyright
(C) 2021 Stefan Gofferje

## Thanks
- https://github.com/dbussert for the initial bouncing back and forth of ideas and giving helpful hints for the and a bunch of great snippets of code! Check out his TAK server implementation at https://github.com/vidterra/multitak.

- https://github.com/ampledata for https://github.com/ampledata/adsbcot and the first web map implementation in NodeRED.
