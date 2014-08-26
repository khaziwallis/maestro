# == Class: ::maestro
# (c) Copyright 2014 Hewlett-Packard Development Company, L.P.
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
# This class will be run on the maestro box as a part of the ui
# and agent setup
#
# creates certs just for maestro node

class maestro::cert
(
  $instance_id      = hiera('maestro::instance_id', $::maestro_id),
)
{

  $instance_serial_start = inline_template('<% i = @instance_id.to_i(36) + 10000  %><%= i.to_s.hex.to_s.length.even? ? i.to_s.hex.to_s : \'0\' + i.to_s.hex.to_s %>')

  maestro::orchestrator::gencerts { 'maestro':
            instance_id => $instance_id,
            domain      => $maestro::instance_domain,
            serial_init => $instance_serial_start,
            require     => Class['gardener::params'],
  }

}