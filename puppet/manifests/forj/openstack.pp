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
#
node /^review.*/ inherits default {

  ::sysadmin_config::swap { '512':}
}

#
# we need a utilities server until we fix puppet master bug that prevents server restart, so we can consolidate
node /^util.*/ inherits default {

  ::sysadmin_config::swap { '512':}
}

#
# this is the jenkins/zuul server
node /^ci.*/ inherits default {

  ::sysadmin_config::swap { '512':}
}

node /^wiki.*/ inherits default {

#
# all nodes should meet these requirements.
#
  class{'cdk_project::pip':} ->
  class { 'openstack_project::wiki':
    mysql_root_password     => hiera('wiki_db_password'),
    sysadmins               => hiera('sysadmins'),
    ssl_cert_file_contents  => hiera('wiki_ssl_cert_file_contents'),
    ssl_key_file_contents   => hiera('wiki_ssl_key_file_contents'),
    ssl_chain_file_contents => hiera('wiki_ssl_chain_file_contents'),
  }
}
